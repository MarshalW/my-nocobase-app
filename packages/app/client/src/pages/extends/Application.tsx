import {
  Application as _Application,
  ApplicationOptions,
  RemoteRouteSwitchProvider,
  // AuthLayout,
  // AdminLayout,
  RouteSchemaComponent,
  SigninPage,
  SignupPage,
  BlockTemplatePage,
  BlockTemplateDetails,
} from '@nocobase/client';

import { AuthLayout } from './AuthLayout';
import { AdminLayout } from './AdminLayout';


export class Application extends _Application {
  constructor(options: ApplicationOptions) {
    super(options);

    this.use(RemoteRouteSwitchProvider, {
      components: {
        AuthLayout,
        AdminLayout,
        RouteSchemaComponent,
        SigninPage,
        SignupPage,
        BlockTemplatePage,
        BlockTemplateDetails,
      },
    });
  }
}
