/*
 * @Author: pangff
 * @Date: 2022-05-25 19:37:32
 * @LastEditTime: 2022-05-31 17:39:32
 * @LastEditors: pangff
 * @Description: 
 * @FilePath: /my-nocobase-app/packages/app/server/src/index.ts
 * stay hungry,stay foolish
 */
import { Application } from '@nocobase/server';
import config from './config';
const app = new Application(config);



if (require.main === module) {
  app.parse();
}

export default app;
