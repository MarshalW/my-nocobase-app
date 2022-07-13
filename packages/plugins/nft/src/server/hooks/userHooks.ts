import Database from '@nocobase/database';

export default async function initEvents(db: Database) {
  // // 删除 nft 前做检查，状态为已审核则不能删除
  // db.on('nfts.afterDestroy', async (model, options) => {
  //   // TODO
  // });
  // // 修改 nft 属性和关联关系前，检查如果已审核则不能修改的属性
  // db.on('nfts.beforeUpdate', async (model, options) => {
  //   // TODO
  // });
  // await initOnChainHooks(db);
  // await initSaleHooks(db);
}
