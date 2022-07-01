import Database from '@nocobase/database';
import { getEnumLabel, getEnumValue } from '../utils';

export default function initOnChainingHook(db: Database) {
  db.on('nft.afterUpdate', async (model, options) => {
    console.log({ model, options });
    const { _changed, chain_status, id } = model;
    if (_changed.has('chain_status')) {
      let currentLabel = getEnumLabel('上链状态', chain_status);
      if (currentLabel == '上链中') {
        setTimeout(() => {
          onChaining(db, id);
        }, 1000 * 10);
      }
    }
  });
}

function onChaining(db: Database, id) {
  let chain_status = getEnumValue('上链状态', '已上链');
  db.getRepository('nft').update({
    values: { chain_status },
    filter: {
      id,
    },
    hooks: false,
  });
  console.log(`>>> on chaining .. OK, ${id}`);
}
