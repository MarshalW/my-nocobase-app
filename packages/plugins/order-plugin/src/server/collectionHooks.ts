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

        associatedCollections.forEach((item) => {
          // @ts-ignore
          let { columnName, collectionName: associatedCollectionName } = item;

          if (associatedCollectionName != null) {
            appends.push(queryColumnName(db, collectionName, associatedCollectionName));
          } else {
            appends.push(columnName);
          }
        });

        let queryData = await db.getRepository(collectionName).findOne({
          filter: {
            id,
          },
          transaction,
          appends,
        });

        // 简化 associatedCollectionName 的结果处理，order.orderItems 代替 order.f_xxxx
        associatedCollections.forEach((item) => {
          // @ts-ignore
          let { columnName, collectionName: associatedCollectionName } = item;

          if (associatedCollectionName != null) {
            queryData[columnName] = queryData[queryColumnName(db, collectionName, associatedCollectionName)];
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
