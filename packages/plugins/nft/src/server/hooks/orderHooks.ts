import Database from '@nocobase/database';
import randomstring from 'randomstring';

import { queryColumnName, queryForeignKey, queryForeignKeyByName } from '../utils';

async function updateNft(db, transaction, order) {
  // 得到 nft id
  const nftId = order[queryForeignKeyByName(db, 'orders', 'nft')];

  // 得到该藏品的已支付总数
  const count = await db.getCollection('orders').repository.count({
    filter: {
      pay_status: 'paid',
      [queryForeignKeyByName(db, 'orders', 'nft')]: nftId,
    },
    transaction,
  });

  // 更新藏品已售数量
  const result = await db
    .getCollection('nfts')
    .repository.update({ filterByTk: nftId, values: { quantity_sold: count }, transaction });
}

export default async function initEvents(db: Database) {
  db.on('orders.beforeCreate', async (model, options) => {
    model.order_number = randomstring.generate({
      length: 15,
      charset: 'numeric',
    });
    model.pay_status = 'unpaid';
  });

  // 监控创建订单是否可创建（在售）
  db.on('orders.afterCreate', async (model, options) => {
    const { transaction, values } = options;
    const { nft: nftId } = values;

    // 查当前 nft 是否在售
    // @ts-ignore
    const { sale_status: saleStatus, name: nftName } = await db.getCollection('nfts').repository.findById(nftId);
    if (saleStatus != 'onsale') {
      throw `藏品 "${nftName}" ${saleStatus == 'soldout' ? '已售罄' : '不在售'}。`;
    }
  });

  db.on('orders.afterDestroy', async (model, options) => {
    const { transaction } = options;
    await updateNft(db, transaction, model);
  });

  // 监控支付状态改变
  db.on('orders.afterUpdate', async (model, options) => {
    const { transaction } = options;
    const { _changed } = model;

    if (!_changed.has('pay_status')) return;

    await updateNft(db, transaction, model);
  });
}
