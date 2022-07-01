import Database from '@nocobase/database';
import { queryForeignKey, queryColumnName } from '../utils';

// 根据[ntf_series id]重新计算ntf_series的藏品数(nft_count)和发售总数(total)
async function updateNftSeries({ db, seriesIds, transaction }) {
  let nftColumnName = queryColumnName(db, 'nft_series', 'nfts');

  for (let id of seriesIds) {
    //   从 nft_series 查询出 nfts 数组
    let queryData = await db.getRepository('nft_series').findOne({
      filter: {
        id,
      },
      transaction,
      appends: [nftColumnName],
    });

    let nfts: [] = queryData[nftColumnName];
    let { quantity_limit: quantityLimit, name } = queryData;

    // 计算出发售总数
    let total = nfts.reduce(function (acc, item) {
      // @ts-ignore
      return acc + item.quantity;
    }, 0);

    // 校验 total 不能大于数量上限
    if (quantityLimit < total) {
      throw new Error(`藏品系列：${name} 藏品总数 ${total} 超过上限 ${quantityLimit}`);
    }

    // 更新 ntf_series 发售总数和藏品数
    await db.getRepository('nft_series').update({
      values: { total, nft_count: nfts.length },
      filter: {
        id,
      },
      hooks: false,
      transaction,
    });
  }
}

export default function initEvents(db: Database) {
  const nftSeriesForeignKey = queryForeignKey(db, 'nfts', 'nft_series');

  db.on(`updateNftSeriesValues`, async ({ seriesIds, transaction }) => {
    await updateNftSeries({ db, seriesIds, transaction });
    console.log(`>>>>>update nft series values`);
  });

  db.on('nfts.afterUpdate', async (model, options) => {
    // 排除是更新表数据而非关联关系的情况
    if (options.values != null) return;

    const { transaction } = options;
    const currentNftSeriesId = model[nftSeriesForeignKey];
    const previewsNftSeriesId = model._previousDataValues[nftSeriesForeignKey];

    // nft series id 未改变
    // if (currentNftSeriesId == previewsNftSeriesId) return;

    const seriesIds = new Set();
    seriesIds.add(currentNftSeriesId);

    if (previewsNftSeriesId != null) {
      seriesIds.add(previewsNftSeriesId);
    }

    await db.emitAsync(`updateNftSeriesValues`, {
      db,
      seriesIds: [...seriesIds],
      transaction,
    });
  });

  // 当nft删除后，更新相关ntf_series
  db.on('nfts.afterDestroy', async (model, options) => {
    const { transaction } = options;
    const currentNftSeriesId = model[nftSeriesForeignKey];

    await db.emitAsync(`updateNftSeriesValues`, {
      db,
      seriesIds: [currentNftSeriesId],
      transaction,
    });
  });

  // 更新 nft_series 前的校验
  db.on('nft_series.beforeUpdate', async ({ total, quantity_limit, name }, options) => {
    // const { total, quantity_limit, name } = model;
    const quantityLimit = parseInt(quantity_limit);

    if (quantityLimit < total) {
      throw `藏品系列 ${name} 藏品总数 ${total} 不应超过上限 ${quantityLimit}`;
    }
  });
}
