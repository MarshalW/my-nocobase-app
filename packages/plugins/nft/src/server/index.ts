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
      console.log(`>>>init nft plugin .. OK`);
    });
  }

  async load() {
    // TODO
    // Visit: http://localhost:13000/api/testNft:getInfo
    this.app.resource({
      name: 'testNft',
      actions: {
        async getInfo(ctx, next) {
          ctx.body = `Hello nft!`;
          next();
        },
      },
    });
    this.app.acl.allow('testNft', 'getInfo');
  }

  async install(options: InstallOptions) {
    // TODO
  }
}

export default NftPlugin;
