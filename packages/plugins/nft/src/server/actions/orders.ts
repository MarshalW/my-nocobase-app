import { Application } from '@nocobase/server';
import { Context, Next } from '@nocobase/actions';

import { Op } from 'sequelize';
import { queryColumnName, queryForeignKey, queryForeignKeyByName } from '../utils';

export default function initActions(app: Application) {
  console.log(`>>>orders actions init .. OK.`);

  app.resourcer.registerActionHandler(`orders:submit`, submit);
  app.resourcer.registerActionHandler(`orders:confirm`, confirm);
  app.resourcer.registerActionHandler(`orders:my`, my);

  app.acl.allow('orders', ['confirm', 'submit', 'my'], (ctx) => {
    return ctx.state.currentRole == 'customer';
  });
}

// 提交订单
async function submit(ctx: Context, next: Next) {
  const data = ctx.action.params;
  const { nft, pay_method, pay_terminal } = data.values;
  // console.log({ data });
  const Order = ctx.db.getCollection('orders');
  const result = await Order.repository.create({
    values: {
      nft,
      pay_method,
      pay_terminal,
      customer: ctx.state.currentUser.id,
    },
  });
  ctx.body = { result };

  await next();
}

// 确认支付
async function confirm(ctx: Context, next: Next) {
  const data = ctx.action.params;
  const { id } = data.values;
  const Order = ctx.db.getCollection('orders');
  const order = await Order.repository.findById(id);
  // @ts-ignore
  const { pay_status: payStatus } = order;

  const ids = {
    customerId: order[queryForeignKeyByName(ctx.db, 'orders', 'customer')],
    currentId: ctx.state.currentUser.id,
  };

  if (ids.currentId == ids.customerId) {
    if (payStatus == null || payStatus == 'unpaid') {
      const order = await Order.repository.update({ filterByTk: id, values: { pay_status: 'paid' } });
      ctx.body = { order };
    }
  }

  await next();
}

// 我的订单列表
async function my(ctx: Context, next: Next) {
  // TODO 设置分页 packages/core/actions/src/actions/list.ts

  const data = ctx.action.params;

  const Order = ctx.db.getCollection('orders');

  const results = await Order.repository.find({
    filter: { [queryForeignKeyByName(ctx.db, 'orders', 'customer')]: ctx.state.currentUser.id },
    // @ts-ignore
    pageSize: 2,
  });
  ctx.body = { results };

  await next();
}
