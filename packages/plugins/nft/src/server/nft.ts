import Database from '@nocobase/database';
import initNftSeriesHooks from './hooks/ntfSeriesHooks';
import initNftHooks from './hooks/nftHooks';
import initOrderHooks from './hooks/orderHooks';
import initUserHooks from './hooks/userHooks';

async function addNftHooks(db: Database) {
  if (db.getCollection('nfts') != null && db.getCollection('nft_series') != null) {
    initNftSeriesHooks(db);
    await initNftHooks(db);

    if (db.getCollection('orders') != null) {
      await initOrderHooks(db);
    }

    // await initUserHooks(db);
  }

  console.log(`>>>Add nft hooks .. OK.`);
}

export default addNftHooks;
