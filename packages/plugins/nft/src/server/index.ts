import { InstallOptions, Plugin } from '@nocobase/server';
import addNftHooks from './nft';

// 目前只完成了示意性的计算出series的total，这个在nft create和delete都要做一遍
// TODO 新增nft时将ntf_series.nft_count+1(目前没有)
// TODO 删除nft时检查如已经审核通过||已上链不可删除
// TODO 抽象并通过配置文件

export class NftPlugin extends Plugin {
  getName(): string {
    return this.getPackageName(__dirname);
  }

  beforeLoad() {
    this.app.on('beforeStart', async () => {
      await addNftHooks(this.db);
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
