import { useField } from '@formily/react';
import { useTranslation } from 'react-i18next';
import { GeneralSchemaDesigner, SchemaSettings } from '@nocobase/client';

// @ts-ignore
export const DialogBlock = ({ title }) => {
  return <div>带对话框的区块 {title}</div>;
};

DialogBlock.Designer = () => {
  return (
    <GeneralSchemaDesigner>
      {/* @ts-ignore */}
      <SchemaSettings.Remove
        removeParentsIfNoChildren
        breakRemoveOn={{
          'x-component': 'Grid',
        }}
      />
    </GeneralSchemaDesigner>
  );
};
