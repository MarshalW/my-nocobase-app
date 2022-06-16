import { InstallOptions, Plugin } from '@nocobase/server';

import { collectionHooksConfig as config } from './config';
import collectionHooks from './collectionHooks';

function queryColumnName(db, collectionName, targetName) {
  let value;
  db.getCollection(collectionName).forEachField((field) => {
    if (field.options.target == targetName) {
      value = field.options.name;
    }
  });
  return value;
}

export class OrderPluginPlugin extends Plugin {
  getName(): string {
    return this.getPackageName(__dirname);
  }

  beforeLoad() {
    this.app.on('beforeStart', async () => {
      collectionHooks(config, this.app.db);
      console.log(`>>> before start <order plugin> .. OK `);
    });
  }

  async load() {
    // TODO
    // Visit: http://localhost:13000/api/testOrderPlugin:getInfo
    this.app.resource({
      name: 'testOrderPlugin',
      actions: {
        async getInfo(ctx, next) {
          ctx.body = `Hello order-plugin!`;
          next();
        },
      },
    });
    this.app.acl.allow('testOrderPlugin', 'getInfo');
  }

  async install(options: InstallOptions) {
    // TODO
  }
}

export default OrderPluginPlugin;
