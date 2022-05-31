import { useField } from '@formily/react';
import { useTranslation } from 'react-i18next';
import { GeneralSchemaDesigner, SchemaSettings, APIClient, APIClientProvider, useRequest } from '@nocobase/client';
import { Spin,Button } from 'antd';
import { useState } from 'react';

export const RemoteData = () => {
  const apiClient = new APIClient({
    baseURL: 'https://catfact.ninja',
  });

  const [count, setCount] = useState(false);

  const DataControl = () => {
    const refreshAction = () => {
      setCount(!count);
    };

    return (
      <div>
        <div><Button type="primary" onClick={refreshAction}>刷新</Button></div>
        <DataItem />
      </div>
    );
  };

  // @ts-ignore
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
      <h3>获取远程数据</h3>
      <DataControl />
    </APIClientProvider>
  );
};

RemoteData.Designer = () => {
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
