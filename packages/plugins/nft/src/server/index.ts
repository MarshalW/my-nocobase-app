import { InstallOptions, Plugin } from '@nocobase/server';
import addNftHooks from './nft';

import initNftsActions from './actions/nfts';
import initOrdersActions from './actions/orders';

export class NftPlugin extends Plugin {
  getName(): string {
    return this.getPackageName(__dirname);
  }

  beforeLoad() {
    this.app.on('beforeStart', async () => {
      await addNftHooks(this.db);
      initNftsActions(this.app);
      initOrdersActions(this.app);
      console.log(`>>>>>init nft plugin .. OK`);
    });
  }

  async load() {
    // Visit: http://localhost:12000/api/nft:showSales
    // this.app.resource({
    //   name: 'nft',
    //   actions: {
    //     async showSales(ctx, next) {
    //       const Nft = ctx.db.getCollection('nft');
    //       const nfts = await ctx.db.getRepository('nft').find({
    //         where: {
    //           // 在售
    //           page_status: 'ps61ebagaua',
    //         },
    //       });
    //       ctx.body = { nfts };
    //       next();
    //     },
    //   },
    // });
    // this.app.acl.allow('nft', 'showSales');
    // setTimeout(async () => {
    //   const Order = this.db.getRepository('orders');
    //   const order = await Order.create({
    //     values: {
    //       order_number: '1234',
    //       nft_name: 'n1',
    //       payment_terminal: 'i7zvp6cn1ti',
    //       payment_method: 'd04ztd79alg',
    //       actual_name: '张三',
    //       account_name: 'zhangsan1992',
    //       phone: '13290993343',
    //       nft_sale_date: new Date(),
    //     },
    //   });
    // }, 1000 * 10);
  }

  async install(options: InstallOptions) {
    // TODO
  }
}

export default NftPlugin;
