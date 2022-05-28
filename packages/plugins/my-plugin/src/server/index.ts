/*
 * @Author: pangff
 * @Date: 2022-05-26 13:58:04
 * @LastEditTime: 2022-05-28 10:45:08
 * @LastEditors: pangff
 * @Description: 
 * @FilePath: /my-nocobase-app/packages/plugins/my-plugin/src/server/index.ts
 * stay hungry,stay foolish
 */
import { InstallOptions, Plugin } from '@nocobase/server';
import { v4 as uuidv4 } from 'uuid';
import BigNumber from "bignumber.js";

export class MyPluginPlugin extends Plugin {
  getName(): string {
    return this.getPackageName(__dirname);
  }

  async beforeLoad() {

    this.app.on('beforeStart', async () => {

      this.db.getCollection("orders").model.beforeCreate((model) => {
        model.set('order_number', uuidv4())
      });

      this.app.db.on('orders.afterCreateWithAssociations', async (model, options) => {
        await this.hookAndUpdateOrders(model, options)
      });

      this.app.db.on('orders.afterUpdateWithAssociations', async (model, options) => {
        await this.hookAndUpdateOrders(model, options)
      });

    });

  }

  async hookAndUpdateOrders(model: any, options: any) {
    const { transaction } = options;

    // 获取order_items中和products关联的字段名称
    let orderItemProductKey = this.getRelationFieldKey('order_items', 'belongsTo', 'products');
    // 获取orders中和order_items关联的字段名称
    let orderItemKey = this.getRelationFieldKey('orders', 'hasMany', 'order_items');
    // 查询当前orders信息
    let orderItems = await this.app.db.getRepository('orders').findOne({
      filter: {
        'id': model.get('id'),
      },
      transaction,
      appends: [orderItemKey, `${orderItemKey}.${orderItemProductKey}`]
    });

    let total = new BigNumber(0);
    // 遍历当前order的order_items
    for (let orderItem of orderItems[orderItemKey]) {
      let price = new BigNumber(orderItem.get(orderItemProductKey)['price'])
      let quantity = new BigNumber(orderItem.getDataValue('quantity')).toNumber()
      let amount = price.times(quantity).toNumber()
      await this.app.db.getRepository('order_items').update({
        values: {
          name: orderItem.get(orderItemProductKey)['name'],
          price: price.toNumber(),
          amount: amount,
        },
        filter: {
          'id': orderItem.getDataValue('id'),
        },
        hooks: false,
        transaction
      });
      total = total.plus(amount);
    }

    const customer = await model.getCustomer({ transaction })

    await this.app.db.getRepository('orders').update({
      values: {
        address: customer[0].address,
        total: total.toNumber()
      },
      filter: {
        'id': model.get('id'),
      },
      hooks: false,
      transaction,
    });
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

export default MyPluginPlugin;
