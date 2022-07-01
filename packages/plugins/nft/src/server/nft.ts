import Database from '@nocobase/database';
// import { initEnumMaps } from './utils';
// import initNftSeriesResetHooks from './hooks/nftSeriesReset';
// import initOnChainingHook from './hooks/ntfChangedHooks';
import initNtfSeriesHooks from './hooks/ntfSeriesHooks';

async function addNftHooks(db: Database) {
  initNtfSeriesHooks(db);
  console.log(`>>>Add nft hooks .. OK.`);
  // await initEnumMaps(db);
  // initNftSeriesResetHooks(db);
  // initOnChainingHook(db);
}

export default addNftHooks;
