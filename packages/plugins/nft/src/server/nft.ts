import Database from '@nocobase/database';
import initNftSeriesHooks from './hooks/ntfSeriesHooks';
import initNftHooks from './hooks/nftHooks';
import initOrderHooks from './hooks/orderHooks';
import initUserHooks from './hooks/userHooks';

async function addNftHooks(db: Database) {
  initNftSeriesHooks(db);
  await initNftHooks(db);
  await initOrderHooks(db);
  await initUserHooks(db);

  console.log(`>>>Add nft hooks .. OK.`);
}

export default addNftHooks;
