function queryColumnName(db, collectionName, targetName) {
  let value;
  db.getCollection(collectionName).forEachField((field) => {
    if (field.options.target == targetName) {
      value = field.options.name;
    }
  });
  return value;
}

export default function (config, db) {
  config.items.forEach((item) => {
    const { event, collectionName } = item;

    if (event == 'beforeCreate') {
      const { callback } = item;
      db.on(`${collectionName}.beforeCreate`, async (model) => {
        callback(model);
      });
    }

    if (event == 'afterCreateWithAssociations' || event == 'afterUpdate') {
      db.on(`${collectionName}.${event}`, async (model, options) => {
        const { transaction } = options;
        const { associatedCollections, updateCallback } = item;
        const id = model.get('id');
        const appends = [];

        // 得到正确的 appends
        associatedCollections.forEach((item) => {
          // @ts-ignore
          let { columnName, collectionName: associatedCollectionName } = item;

          if (associatedCollectionName != null) {
            // 使用关联 collection name 查找 column name
            let _columnName = queryColumnName(db, collectionName, associatedCollectionName);
            if (_columnName != null) {
              appends.push(_columnName);
            }
          } else if (db.getCollection(collectionName).hasField(columnName)) {
            // 直接使用 column name 的情况
            appends.push(columnName);
          }
        });

        // 查询带指定关联对象的结果
        let queryData = await db.getRepository(collectionName).findOne({
          filter: {
            id,
          },
          transaction,
          appends,
        });

        // 增加默认数据，当相关数据还不存在的情况下
        associatedCollections.forEach((item) => {
          // @ts-ignore
          let { columnName, default: defautValue = {} } = item;
          queryData[columnName] = queryData[columnName] || defautValue;
        });

        // 简化 associatedCollectionName 的结果处理，order.orderItems 代替 order.f_xxxx
        associatedCollections.forEach((item) => {
          // @ts-ignore
          let { columnName, collectionName: associatedCollectionName } = item;

          if (associatedCollectionName != null) {
            let _columnName = queryColumnName(db, collectionName, associatedCollectionName);
            if (_columnName != null) {
              queryData[columnName] = queryData[_columnName];
            }
          }
        });

        await db.getRepository(collectionName).update({
          values: updateCallback(queryData),
          filter: {
            id,
          },
          hooks: false,
          transaction,
        });
      });
    }
  });
}
