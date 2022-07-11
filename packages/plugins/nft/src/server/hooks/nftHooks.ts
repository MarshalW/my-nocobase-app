import Database from '@nocobase/database';
import schedule from 'node-schedule';

import initChainProviders from '../chains';

export default async function initEvents(db: Database) {
  // 删除 nft 前做检查，状态为已审核则不能删除
  db.on('nfts.afterDestroy', async (model, options) => {
    // TODO
  });

  // 修改 nft 属性和关联关系前，检查如果已审核则不能修改的属性
  db.on('nfts.beforeUpdate', async (model, options) => {
    // TODO
  });

  await initOnChainHooks(db);

  await initSaleHooks(db);
}

const preSaleScheduleMap = new Map();

async function initSaleHooks(db: Database) {
  // 所有预发售藏品
  const queryData = await db.getRepository('nfts').find({
    filter: {
      sale_status: 'presale',
    },
  });

  queryData.forEach(async (nft) => {
    // @ts-ignore
    const { dataValues: nftInfo } = nft;
    await addPresaleSchedule(db, nftInfo);
  });

  db.on(`nfts.beforeUpdate`, async (model, options) => {
    const { _changed, sale_status, dataValues: nftInfo, _previousDataValues } = model;

    if (_changed.has('sale_status')) {
      // 待销售状态
      if (sale_status == 'pending') {
        model.presale_date = null;
        model.sale_start_date = null;
        model.sale_end_date = null;
        model.stop_sale_note = null;
        // console.log(`>>>>set presale date to null when status is pending`);
      }

      // 发售中状态
      if (sale_status == 'onsale') {
        model.sale_start_date = new Date();
        model.sale_end_date = null;
        model.stop_sale_note = null;
      }

      // 停售状态
      if (sale_status == 'stopselling') {
        model.sale_end_date = new Date();
      }
    }

    if (_changed.has('quantity_sold')) {
      const { quantity_sold, quantity } = model;
      // 售罄状态
      if (quantity_sold == quantity) {
        model.sale_status = 'soldout';
        model.sale_end_date = new Date();
      }
      // 防止超售
      if (quantity_sold > quantity) {
        throw `藏品: ${model.name} 已经售罄，发售数量: ${model.quantity}，已售数量: ${_previousDataValues.quantity_sold}`;
      }
    }
  });

  // 当销售状态设置为预销售状态
  db.on('nfts.afterUpdate', async (model, options) => {
    const { _changed, sale_status, dataValues: nftInfo, _previousDataValues } = model;

    if (_changed.has('sale_status')) {
      if (sale_status == 'presale') {
        await addPresaleSchedule(db, nftInfo);
      }

      if (sale_status == 'pending') {
        // 取消预销售定时器
        const { sale_status: previousSaleStatus } = _previousDataValues;
        const { id } = nftInfo;
        if (previousSaleStatus == 'presale') {
          removeRresaleSchedule(id);
        }
      }
    }
  });
}

async function addPresaleSchedule(db: Database, nftInfo) {
  const { id, presale_date: presaleDate } = nftInfo;

  const job = schedule.scheduleJob(presaleDate, async () => {
    await db.getRepository('nfts').update({
      values: { sale_status: 'onsale', sale_start_date: new Date() },
      filter: {
        id,
      },
      hooks: false,
    });
  });

  preSaleScheduleMap.set(id, job);
}

function removeRresaleSchedule(nftId) {
  const job = preSaleScheduleMap.get(nftId);
  job.cancel();
  preSaleScheduleMap.delete(nftId);
  console.log(`===>>> cancel ${nftId} job.`);
}

async function initOnChainHooks(db: Database) {
  // 上链状态变化的处理
  const chainProviders = initChainProviders();
  db.on('nfts.afterUpdate', async (model, options) => {
    const { _changed, chain_status } = model;

    // 上链状态变更为上链中
    if (_changed.has('chain_status') && chain_status == 'processing') {
      const { dataValues: nftInfo } = model;
      const { on_chain_provider: provider } = nftInfo;
      chainProviders.emit('onChain', nftInfo, provider);
    }
  });

  // 上链成功后变更状态
  chainProviders.on(`onSuccess`, (nftInfo) => {
    const { id } = nftInfo;

    // 更新 nft 上链状态为重构
    db.getRepository('nfts').update({
      values: { chain_status: 'success' },
      filter: {
        id,
      },
      hooks: false,
    });
  });

  // 所有上链中的藏品状态检查
  const queryData = await db.getRepository('nfts').find({
    filter: {
      chain_status: 'processing',
    },
  });

  queryData.forEach((nft) => {
    // @ts-ignore
    const { dataValues: nftInfo } = nft;
    const { on_chain_provider: provider } = nftInfo;

    chainProviders.emit('onChain', nftInfo, provider);
  });
}
