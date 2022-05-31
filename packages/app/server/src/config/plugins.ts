/*
 * @Author: pangff
 * @Date: 2022-05-25 19:37:32
 * @LastEditTime: 2022-05-31 18:38:50
 * @LastEditors: pangff
 * @Description: 
 * @FilePath: /my-nocobase-app/packages/app/server/src/config/plugins.ts
 * stay hungry,stay foolish
 */
import { PluginsConfigurations } from '@nocobase/server';

export default [
  '@nocobase/plugin-error-handler',
  '@nocobase/plugin-collection-manager',
  '@nocobase/plugin-ui-schema-storage',
  '@nocobase/plugin-ui-routes-storage',
  '@nocobase/plugin-file-manager',
  '@nocobase/plugin-system-settings',
  '@nocobase/plugin-users',
  '@nocobase/plugin-acl',
  '@nocobase/plugin-china-region',
  '@nocobase/plugin-workflow',
  '@nocobase/plugin-client',
  '@my-nocobase-app/my-plugin'
] as PluginsConfigurations;
