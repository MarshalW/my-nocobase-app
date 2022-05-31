/*
 * @Author: pangff
 * @Date: 2022-05-26 13:58:04
 * @LastEditTime: 2022-05-31 19:14:30
 * @LastEditors: pangff
 * @Description: 订单hook及修改plugin测试
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
    
      let dynamicSetFieldValues = {
        unrelated: [{
          collectionName: "orders",
          event: 'beforeCreate',
          fields: [{
            name: "order_number",
            value: function (collection, model, options) {
              return uuidv4()
            }
          }]
        },{
          collectionName: "tests",
          event: 'beforeCreate',
          fields: [{
            name: "number",
            value: function (collection, model, options) {
              return uuidv4()
            }
          }]
        }],
        related: [{
          collectionName: "orders",
          event: 'afterCreateWithAssociations',
          relationKeys: [{
            id: "1",
            relation: "hasMany",
            targetCollection: {
              name: "order_items",
              relationKeys: [{
                id: "1.1",
                relation: "belongsTo",
                targetCollection: {
                  name: "products"
                }
              }]
            },
          }, {
            id: "2",
            relation: "belongsToMany",
            targetCollection: {
              name: "customers"
            }
          }],
          updateFields: [{
            collectionName: "order_items",
            targetFields: [{ id: "1.1", key: "name" }, { id: "1.1", key: "price" }, { id: "1", key: "quantity" }],
            association:[],
            values: function (obj) {
              let {quantity,price,name} = obj
              quantity = new BigNumber(quantity).toNumber()
              price = new BigNumber(price)
              let amount = price.times(quantity).toNumber()
              return {
                name: name,
                price: price.toNumber(),
                amount: amount
              };
            }
          }, {
            collectionName: "orders",
            targetFields: [{ id: "2", key: "address" }],
            association:[{collectionName:"order_items",field:"amount",type:'array',key:"items"}],
            values: function (valueObj) {
              let {address,items} = valueObj;
              let total = new BigNumber(0);
              for (let orderItem of items) {
                let amount = new BigNumber(orderItem.amount).toNumber()
                total = total.plus(amount);
              }
              return {
                address,
                total: total.toNumber()
              };
            }
          }]
        }]
      };

      const plugins = [
        ["@my-nocobase-app/collection-middleware",{dynamicSetFieldValues}]
      ];
  
      for (const [plugin, options = null] of plugins) {
        this.app.plugin(require(plugin as string).default, options);
      }
  }

  async load() {

  }

  async install(options: InstallOptions) {
  }
}

export default MyPluginPlugin;
