import { InstallOptions, Plugin } from '@nocobase/server';

import { v4 as uuidv4 } from 'uuid';
import { Decimal } from 'decimal.js';

export class OrderPluginPlugin extends Plugin {
  getName(): string {
    return this.getPackageName(__dirname);
  }

  beforeLoad() {
    console.log(`>>> before load <order plugin> .. add before start listener`);

    this.app.on('beforeStart', async () => {
      console.log(`>>> before start <order plugin> .. `);

      // 创建前字段更新
      this.app.db.on(`orders.beforeCreate`, async (model, options) => {
        console.log(`>>> orders before create @<order plugin> .. `);

        // 订单号
        model.order_number = uuidv4();

        console.log(`<<< orders before create @<order plugin> OK. `);
      });

      // 创建后字段更新
      const queryColumnName = function (db, collectionName, targetName) {
        let value;
        db.getCollection(collectionName).forEachField((field) => {
          if (field.options.target == targetName) {
            value = field.options.name;
          }
        });
        return value;
      };

      //  创建后字段更新 - 更新订单地址和总金额
      this.app.db.on(`orders.afterCreateWithAssociations`, async (model, options) => {
        console.log(`>>> orders after create <order plugin> .. `);
        const collectionName = 'orders';
        const { transaction } = options;
        // console.log({ model, options });

        const id = model.get('id');
        const orderItemsColumnName = queryColumnName(this.db, 'orders', 'order_items');

        let queryData = await this.app.db.getRepository(collectionName).findOne({
          filter: {
            id,
          },
          transaction,
          appends: ['customer', orderItemsColumnName],
        });

        // @ts-ignore
        const address = queryData.customer[0]?.address;
        const orderItems = queryData[orderItemsColumnName];
        let total = orderItems.reduce(function (acc, item) {
          return new Decimal(acc).plus(new Decimal(item.amount)).toFixed(2);
        }, 0);

        await this.app.db.getRepository(collectionName).update({
          values: { address, total },
          filter: {
            id,
          },
          hooks: false,
          transaction,
        });

        // console.log(queryData);
        console.log(`<<< orders after create @<order plugin> OK. `);
      });

      this.app.db.on(`order_items.afterUpdate`, async (model, options) => {
        console.log(`>>> order_items after update <order plugin> .. `);
        console.log({ model, options });
        const collectionName = 'order_items';
        const { transaction } = options;
        const id = model.get('id');
        const quantity = model.get('quantity');
        const productColumnName = queryColumnName(this.db, collectionName, 'products');

        let queryData = await this.app.db.getRepository(collectionName).findOne({
          filter: {
            id,
          },
          transaction,
          appends: [productColumnName],
        });

        const { name, price } = queryData[productColumnName];
        const amount = new Decimal(price).times(new Decimal(quantity)).toFixed(2);
        await this.app.db.getRepository(collectionName).update({
          values: { name, price, amount },
          filter: {
            id,
          },
          hooks: false,
          transaction,
        });

        console.log(`<<< order_items after update @<order plugin> OK. `);
      });
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
