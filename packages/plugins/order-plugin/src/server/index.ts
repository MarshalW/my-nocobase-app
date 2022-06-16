import { InstallOptions, Plugin } from '@nocobase/server';

import { collectionHooksConfig as config } from './config';

function queryColumnName(db, collectionName, targetName) {
  let value;
  db.getCollection(collectionName).forEachField((field) => {
    if (field.options.target == targetName) {
      value = field.options.name;
    }
  });
  return value;
}

export class OrderPluginPlugin extends Plugin {
  getName(): string {
    return this.getPackageName(__dirname);
  }

  beforeLoad() {
    this.app.on('beforeStart', async () => {
      config.items.forEach((item) => {
        const { event, collectionName } = item;

        if (event == 'beforeCreate') {
          const { callback } = item;
          this.app.db.on(`${collectionName}.beforeCreate`, async (model) => {
            callback(model);
          });
        }

        if (event == 'afterCreateWithAssociations' || event == 'afterUpdate') {
          this.app.db.on(`${collectionName}.${event}`, async (model, options) => {
            const { transaction } = options;
            const { associatedCollections, updateCallback } = item;
            const id = model.get('id');
            const appends = [];

            associatedCollections.forEach((item) => {
              // @ts-ignore
              let { columnName, collectionName: associatedCollectionName } = item;

              if (associatedCollectionName != null) {
                appends.push(queryColumnName(this.db, collectionName, associatedCollectionName));
              } else {
                appends.push(columnName);
              }
            });

            let queryData = await this.app.db.getRepository(collectionName).findOne({
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
                queryData[columnName] = queryData[queryColumnName(this.db, collectionName, associatedCollectionName)];
              }
            });

            await this.app.db.getRepository(collectionName).update({
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
      console.log(`>>> before start <order plugin> .. OK `);
    });
  }

  async load() {
    // TODO
    // Visit: http://localhost:13000/api/testOrderPlugin:getInfo
    this.app.resource({
      name: 'testOrderPlugin',
      actions: {
        async getInfo(ctx, next) {
          ctx.body = `Hello order-plugin!`;
          next();
        },
      },
    });
    this.app.acl.allow('testOrderPlugin', 'getInfo');
  }

  async install(options: InstallOptions) {
    // TODO
  }
}

export default OrderPluginPlugin;
