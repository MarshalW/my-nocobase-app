import { InstallOptions, Plugin } from '@nocobase/server';

export class CollectionMiddlewarePlugin extends Plugin {
  getName(): string {
    return this.getPackageName(__dirname);
  }

  async beforeLoad() {

    this.app.on('beforeStart', async () => {

      this.hookAndUpdateUnRelatedFieldValues()
      
     
      this.hookAndUpdateRelatedFieldValues()
      
      
      this.app.db.on('collections.afterCreate', async (model, options) => {
        console.log(`create >>>>>>>>>>>>>>>>>>>>>>>>>> ${model.getDataValue('name')}`)
        const { transaction } = options;
        transaction.afterCommit(()=>{
          this.hookAndUpdateUnRelatedFieldValues(model.getDataValue('name'))
          this.hookAndUpdateRelatedFieldValues(model.getDataValue('name'))
        })
      });

      this.app.db.on('collections.afterDestroy', async (model, options) => {
        console.log(`destroy >>>>>>>>>>>>>>>>>>>>>>>>>> ${model.getDataValue('name')}`)
        this.removeListeners(model.getDataValue('name'))
      });

    });
  }

  /**
   * 取消监听
   * @param filterCollectionName 
   */
  removeListeners(filterCollectionName) {
    for (let dynamicSetField of this.options.dynamicSetFieldValues.unrelated) {
      let collectionName = dynamicSetField.collectionName;
      let event = dynamicSetField.event;
      if (filterCollectionName && filterCollectionName == collectionName) {
        console.log(`removeListener >>>>>>>>>>>>>>>>>>>>>>>>>> ${collectionName}.${event}`)
        this.app.db.removeAllListeners(`${collectionName}.${event}`)
      }
    }
    for (let dynamicSetField of this.options.dynamicSetFieldValues.related) {
      let collectionName = dynamicSetField.collectionName;
      let event = dynamicSetField.event;
      if (filterCollectionName && filterCollectionName == collectionName) {
        console.log(`removeListener >>>>>>>>>>>>>>>>>>>>>>>>>> ${collectionName}.${event}`)
        this.app.db.removeAllListeners(`${collectionName}.${event}`)
      }
    }
  }

  /**
   * 非关联
   * @param filterCollectionName 
   */
  hookAndUpdateUnRelatedFieldValues(...filterCollectionNames) {
    // 无需关联表数据的字段动态设置，如uuid等
    for (let dynamicSetField of this.options.dynamicSetFieldValues.unrelated) {
      let collectionName = dynamicSetField.collectionName;
      let event = dynamicSetField.event;
      let fields = dynamicSetField.fields;
     
      if (filterCollectionNames.length > 0 && !filterCollectionNames.includes(collectionName)) {
        continue;
      }
      // 如果当前collection存在了再配置监听
      if (this.app.db.hasCollection(collectionName)) {
        console.log(`addListener >>>>>>>>>>>>>>>>>>>>>>>>>> ${collectionName}.${event}`)
        this.app.db.on(`${collectionName}.${event}`, async (model, options) => {
          // 遍历配置项，如果field存在则进行数值设置
          for (let field of fields) {
            if (this.app.db.getCollection(collectionName).hasField(field.name)) {
              model.set(field.name, field.value(collectionName, model, options))
            }
          }
        });
      }
    }
  }

  /**
   * 关联
   * @param filterCollectionName 
   */
  hookAndUpdateRelatedFieldValues(...filterCollectionNames) {
    // 需要动态管理的数据结构
    for (let dynamicSetField of this.options.dynamicSetFieldValues.related) {
      let collectionName = dynamicSetField.collectionName;
      let event = dynamicSetField.event;
      let relationKeys = dynamicSetField.relationKeys;
      let updateFields = dynamicSetField.updateFields;
      if (filterCollectionNames.length > 0  &&!filterCollectionNames.includes(collectionName)) {
        continue;
      }
      // 如果当前collection存在了再配置监听
      if (this.app.db.hasCollection(collectionName)) {
        console.log(`addListener >>>>>>>>>>>>>>>>>>>>>>>>>> ${collectionName}.${event}`)
        this.app.db.on(`${collectionName}.${event}`, async (model, options) => {
          const { transaction } = options;
          // 遍历relationKeys，获取关联字段key
          let keysMap = new Map();
          this.initRelationFieldKeys(keysMap, collectionName, relationKeys, null)

          let appendArray = Array.from(keysMap.values()).map((item) => {
            return item.key;
          });

          // 查询当前关联实体信息，将关联数据均查出来
          let queryData = await this.app.db.getRepository(collectionName).findOne({
            filter: {
              'id': model.get('id'),
            },
            transaction,
            appends: appendArray
          })

          // 遍历配置项，如果field存在则进行数值设置
          let allResultMap = new Map<string, any>()
          for (let fieldInfo of updateFields) {
            let association = fieldInfo.association
            let collectionName = fieldInfo.collectionName
            let targetFields = fieldInfo.targetFields
            let dataMap = new Map<string, any>()
            for (let targetField of targetFields) {
              let id = targetField.id;
              let targetPropertyKey = targetField.key;
              let dataObjKey = keysMap.get(id).key;
              let relationKeyArray = dataObjKey.split('.')
              if (relationKeyArray.length > 1) {
                let firstKey = relationKeyArray[0];
                let lastKey = relationKeyArray[1];
                let firstData = queryData[firstKey]
                if (firstData instanceof Array) { //是个数组
                  for (let item of firstData) {
                    if (dataMap.has(collectionName + "-" + item.id)) {
                      dataMap.get(collectionName + "-" + item.id)[targetPropertyKey] = item[lastKey][targetPropertyKey]
                    } else {
                      let obj = {};
                      obj[targetPropertyKey] = item[lastKey][targetPropertyKey]
                      dataMap.set(collectionName + "-" + item.id, obj)
                    }
                  }
                } else { //是个对象
                  let obj = {}
                  obj[targetPropertyKey] = firstData[lastKey][targetPropertyKey]
                  dataMap.set(collectionName + "-" + firstData[lastKey].id, obj)
                }
              } else {
                let firstKey = relationKeyArray[0]
                let firstData = queryData[firstKey];
                //是个数组 
                if (firstData instanceof Array) {
                  for (let item of firstData) {

                    //并且是要修改关联表
                    if (collectionName != dynamicSetField.collectionName) {
                      if (dataMap.has(collectionName + "-" + item.id)) {
                        dataMap.get(collectionName + "-" + item.id)[targetPropertyKey] = item[targetPropertyKey];
                      } else {
                        let obj = {};
                        obj[targetPropertyKey] = item[targetPropertyKey]
                        dataMap.set(collectionName + "-" + item.id, obj)
                      }
                    } else {
                      if (dataMap.has(collectionName + "-" + item.id)) {
                        dataMap.get(collectionName + "-" + queryData.get('id'))[targetPropertyKey] = item[targetPropertyKey];
                      } else {
                        let obj = {};
                        obj[targetPropertyKey] = item[targetPropertyKey]
                        dataMap.set(collectionName + "-" + queryData.get('id'), obj)
                      }
                    }
                  }
                } else { //是个对象
                  let obj = {}
                  obj[targetPropertyKey] = firstData[targetPropertyKey];
                  dataMap.set(collectionName + "-" + queryData.get('id'), obj)
                }
              }
            }

            if (association && association.length > 0) {
              for (let as of association) {
                let beforeData = allResultMap.get(as.collectionName)
                if (beforeData) {
                  let items = []
                  for (let item of Array.from(beforeData.values())) {
                    let obj = {}
                    obj[as.field] = item["values"][as.field]
                    items.push(obj)
                  }
                  dataMap.forEach(async (item, key) => {
                    item[as.key] = items;
                  });
                }
              }
            }
            dataMap.forEach(async (item, key) => {
              item["values"] = fieldInfo.values(item);
            });
            allResultMap.set(collectionName, dataMap)
          }

          let collections = Array.from<string>(allResultMap.keys())

          for (let collection of collections) {
            let dataMap = allResultMap.get(collection)
            let ids = Array.from<string>(dataMap.keys())
            for (let id of ids) {
              let item = dataMap.get(id)

              let recordId = id.split("-")[1]

              await this.app.db.getRepository(collection).update({
                values: item.values,
                filter: {
                  id: recordId,
                },
                hooks: false,
                transaction,
              });
            }
          }
        });
      }
    }
  }


  initRelationFieldKeys(resultMap, originCollectionName, relationKeys, parentKey) {

    for (let relationKey of relationKeys) {
      let id = relationKey.id
      let relation = relationKey.relation
      let targetCollectionName = relationKey.targetCollection.name
      let key = this.getRelationFieldKey(originCollectionName, relation, targetCollectionName)

      if (parentKey) {
        resultMap.set(id, { key: `${parentKey}.${key}`, relation: relation })
      } else {
        resultMap.set(id, { key: key, relation: relation })
      }


      if (relationKey.targetCollection.relationKeys
        && relationKey.targetCollection.relationKeys.length > 0) {
        this.initRelationFieldKeys(resultMap, targetCollectionName, relationKey.targetCollection.relationKeys, key)
      }
    }
  }

  getRelationFieldKey(collectionName: string, type: string, target: string): string {
    let orderItemProductKey;
    this.db.getCollection(collectionName).forEachField((field) => {
      if (field.options.target === target && field.options.type === type) {
        orderItemProductKey = field.options.name;
      }
    })
    return orderItemProductKey;
  }

  async load() {
  }

  async install(options: InstallOptions) {
  }
}

export default CollectionMiddlewarePlugin;
