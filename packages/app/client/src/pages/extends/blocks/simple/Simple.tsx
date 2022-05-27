import { useField } from '@formily/react';
import { useTranslation } from 'react-i18next';
import { GeneralSchemaDesigner, SchemaSettings } from '@nocobase/client';

export const Simple = () => {
  return <div>最简单的区块</div>;
};

Simple.Designer = () => {
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
