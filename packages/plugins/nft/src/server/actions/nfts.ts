import { Application } from '@nocobase/server';
import { Context, Next } from '@nocobase/actions';

import { Op } from 'sequelize';

export default function initActions(app: Application) {
  console.log(`>>>nfts actions init .. OK.`);

  app.resourcer.registerActionHandler(`nfts:browse`, browse);
  app.acl.allow('nfts', ['browse'], (ctx) => {
    return ctx.state.currentRole == 'customer';
  });
}

async function browse(ctx: Context, next: Next) {
  // TODO 设置分页 packages/core/actions/src/actions/list.ts
  const Nft = ctx.db.getCollection('nfts');
  const nfts = await Nft.model.findAll<any>({
    where: {
      [Op.and]: [
        {
          [Op.or]: [
            { sale_status: 'onsale' },
            { sale_status: 'presale' },
            { sale_status: 'soldout' },
            { sale_status: 'stopselling' },
          ],
        },
        { hidden: 'show' },
      ],
    },
  });

  ctx.body = { nfts };
  await next();
}
