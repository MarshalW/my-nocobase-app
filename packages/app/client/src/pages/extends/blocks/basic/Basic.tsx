import { useField } from '@formily/react';
import { useTranslation } from 'react-i18next';
import { GeneralSchemaDesigner, SchemaSettings } from '@nocobase/client';

// @ts-ignore
export const Basic = ({content}) => {
  return <div><h3>基本区块</h3>{content}</div>;
};

Basic.Designer = () => {
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
