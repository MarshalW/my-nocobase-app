/*
 * @Author: pangff
 * @Date: 2022-05-26 09:48:32
 * @LastEditTime: 2022-05-26 10:26:46
 * @LastEditors: pangff
 * @Description: 
 * @FilePath: /my-nocobase-app/packages/app/server/src/plugins/collection-hook/server.ts
 * stay hungry,stay foolish
 */
import { Plugin } from "@nocobase/server";
import { resolve } from "path";

export default class PluginCollectionHook extends Plugin {
  getName(): string {
    return this.constructor.name;
  }

  async load() {
    console.log("PluginCollectionHook load")
  }

  async install() {
    
    this.app.on("afterInstall", async () => {
        console.log("PluginCollectionHook afterInstall")
        const collection = this.db.getCollection("tests");
        await this.db.sync();
        collection.model.beforeCreate((model) => {
            console.log(model)
        });
    });
  }
}
