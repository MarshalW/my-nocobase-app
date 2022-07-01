import Database from '@nocobase/database';
import { queryColumnName } from '../utils';

async function updateNftSeries({ db, seriesIds, transaction }) {
  let nftColumnName = queryColumnName(db, 'nft_series', 'nft');

  if (seriesIds == null) return;

  for (let id of seriesIds) {
    let queryData = await db.getRepository('nft_series').findOne({
      filter: {
        id,
      },
      transaction,
      appends: [nftColumnName],
    });

    let nfts: [] = queryData[nftColumnName];
    let { quantity_limit: quantityLimit, name } = queryData;

    let total = nfts.reduce(function (acc, item) {
      // @ts-ignore
      return acc + item.quantity;
    }, 0);

    // 校验 total 不能大于数量上限
    // console.log({ quantityLimit, total });
    if (quantityLimit < total) {
      throw new Error(`藏品系列：${name} 藏品总数 ${total} 超过上限 ${quantityLimit}`);
    }

    await db.getRepository('nft_series').update({
      values: { total, nft_count: nfts.length },
      filter: {
        id,
      },
      hooks: false,
      transaction,
    });

    // console.log('>>>end.');
  }
}

export default function initEvents(db: Database) {
  db.on('nft.afterCreateWithAssociations', async (model, options) => {
    const { nft_series: seriesId } = options.values;
    const { transaction } = options;

    await updateNftSeries({ db, seriesIds: [seriesId], transaction });
  });

  let seriesIds;

  db.on('nft.afterUpdate', async (model, options) => {
    if (options.values == null) return;
    const { nft_series } = options.values;
    if (nft_series == null) return;

    const { transaction } = options;
    const nftSeriesColumnName = queryColumnName(db, 'nft', 'nft_series');

    let queryData = await db.getRepository('nft').findOne({
      filter: {
        id: model.id,
      },
      transaction,
      appends: [nftSeriesColumnName],
    });

    console.log({queryData})
    // @ts-ignore
    seriesIds = new Set([nft_series, queryData.nft_series[0].id].flat());
  });

  db.on('nft.afterUpdateWithAssociations', async (model, options) => {
    const { transaction } = options;
    // eventEmitter.emit('ntfSeriesResetValues', { db, seriesIds, transaction }); // 报错
    await updateNftSeries({ db, seriesIds, transaction }); // 正常使用
  });

  let nftSeriesId;

  db.on('nft.beforeDestroy', async (model, options) => {
    // console.log({ event: 'nft.beforeDestroy', model, options });
    const { transaction } = options;
    let nftSeriesColumnName = queryColumnName(db, 'nft', 'nft_series');

    let queryData = await db.getRepository('nft').findOne({
      filter: {
        id: model.id,
      },
      transaction,
      appends: [nftSeriesColumnName],
    });

    // @ts-ignore
    if (queryData.nft_series[0]==null) return
    // @ts-ignore
    nftSeriesId = queryData.nft_series[0].id;
    console.log({ nftSeriesId });
  });

  db.on('nft.afterDestroy', async (model, options) => {
    if (nftSeriesId == null) return;

    const { transaction } = options;
    await updateNftSeries({ db, seriesIds: [nftSeriesId], transaction }); // 正常使用
  });

  db.on('nft_series.beforeUpdate', async (model, options) => {
    const { total, quantity_limit, name } = model;
    const quantityLimit = parseInt(quantity_limit);

    console.log({ total, quantityLimit });
    if (quantityLimit < total) {
      throw `藏品系列 ${name} 修改上限不应小于当前藏品总数 ${total}`;
    }
  });
}
