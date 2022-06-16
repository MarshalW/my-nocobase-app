import { v4 as uuidv4 } from 'uuid';
import { Decimal } from 'decimal.js';

export const collectionHooksConfig = {
  items: [
    {
      collectionName: 'orders',
      event: 'beforeCreate',
      callback: function (model: any) {
        // 订单号
        model.order_number = uuidv4();
      },
    },
    {
      collectionName: 'orders',
      event: 'afterCreateWithAssociations',
      associatedCollections: [{ columnName: 'customer' }, { columnName: 'orderItems', collectionName: 'order_items' }],
      updateCallback: function (modelWithAssociated) {
        // 地址
        const address = modelWithAssociated.customer[0]?.address;

        // 总计金额
        const orderItems = modelWithAssociated.orderItems;
        let total = orderItems.reduce(function (acc, item) {
          return new Decimal(acc).plus(new Decimal(item.amount)).toFixed(2);
        }, 0);

        return { address, total };
      },
    },
    {
      collectionName: 'order_items',
      event: 'afterUpdate',
      associatedCollections: [{ columnName: 'product', collectionName: 'products' }],
      updateCallback: function (modelWithAssociated) {
        const { name, price } = modelWithAssociated.product;
        const quantity = modelWithAssociated.quantity;
        const amount = new Decimal(price).times(new Decimal(quantity)).toFixed(2);

        // 订单条目的名称、单价和金额
        return { name, price, amount };
      },
    },
  ],
};
