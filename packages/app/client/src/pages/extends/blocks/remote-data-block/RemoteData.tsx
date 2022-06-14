import { useField, ISchema, useFieldSchema } from '@formily/react';
import { useTranslation } from 'react-i18next';
import {
  GeneralSchemaDesigner,
  SchemaSettings,
  APIClient,
  APIClientProvider,
  useRequest,
  useDesignable,
} from '@nocobase/client';
import { Spin, Button } from 'antd';
import { useState } from 'react';

export const RemoteData = () => {
  const apiClient = new APIClient({
    baseURL: 'https://catfact.ninja',
  });

  const [count, setCount] = useState(false);
  const [title, setTitile] = useState('获取远程数据');

  const DataControl = () => {
    const refreshAction = () => {
      setCount(!count);
    };

    return (
      <div>
        <div>
          <Button type="primary" onClick={refreshAction}>
            刷新
          </Button>
        </div>
        <DataItem />
      </div>
    );
  };

  const DataItem = () => {
    const { data, loading } = useRequest({ url: '/fact' });

    if (loading) {
      return <Spin />;
    }

    return (
      <div>
        <div>{data?.fact}</div>
      </div>
    );
  };

  return (
    <APIClientProvider apiClient={apiClient}>
      <h3>{title}</h3>
      <DataControl />
    </APIClientProvider>
  );
};

RemoteData.Designer = () => {
  const { dn } = useDesignable();
  const fieldSchema = useFieldSchema();
  const field = useField();

  return (
    <GeneralSchemaDesigner>
      <SchemaSettings.ModalItem
        title={'设置参数'}
        schema={
          {
            type: 'object',
            title: '设置数据范围',
            properties: {
              title: {
                type: 'string',
                title: '标题',
                'x-decorator': 'FormItem',
                'x-component': 'Input',
                default: 'title',
              },
            },
          } as ISchema
        }
        // @ts-ignore
        onSubmit={({ title }) => {
          dn.emit('patch', {
            schema: {
              ['x-uid']: fieldSchema['x-uid'],
              'x-decorator-props': field.decoratorProps,
            },
          });
        }}
      />
      {/* @ts-ignore */}
      <SchemaSettings.Divider />
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
