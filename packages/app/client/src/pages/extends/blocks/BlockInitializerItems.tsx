import { FormOutlined, TableOutlined } from '@ant-design/icons';
import { SchemaInitializer, useSchemaSettings, SchemaComponent, SchemaComponentOptions } from '@nocobase/client';
import { useTranslation } from 'react-i18next';
import { FormDialog, FormLayout } from '@formily/antd';
import { ISchema, SchemaOptionsContext } from '@formily/react';
import React, { useContext } from 'react';

export const SimpleBlockInitializer = (props: any) => {
  const { insert } = props;
  const { t } = useTranslation();
  return (
    <SchemaInitializer.Item
      {...props}
      icon={<FormOutlined />}
      onClick={() => {
        insert({
          type: 'void',
          'x-designer': 'Simple.Designer',
          'x-decorator': 'CardItem',
          'x-component': 'Simple',
          'x-editable': false,
        });
      }}
    />
  );
};

export const PieChartBlockInitializer = (props: any) => {
  const { insert } = props;
  const { t } = useTranslation();
  return (
    <SchemaInitializer.Item
      {...props}
      icon={<FormOutlined />}
      onClick={() => {
        insert({
          type: 'void',
          'x-designer': 'PieChart.Designer',
          'x-decorator': 'CardItem',
          'x-component': 'PieChart',
          'x-editable': false,
          'x-component-props': {
            title: '示意性饼图',
          },
        });
      }}
    />
  );
};

export const BarChartBlockInitializer = (props: any) => {
  const { insert } = props;
  const { t } = useTranslation();

  return (
    <SchemaInitializer.Item
      {...props}
      icon={<FormOutlined />}
      onClick={() => {
        insert({
          type: 'void',
          'x-designer': 'BarChart.Designer',
          'x-decorator': 'CardItem',
          'x-component': 'BarChart',
          'x-editable': false,
        });
      }}
    />
  );
};

export const BasicBlockInitializer = (props: any) => {
  const { insert } = props;
  const { t } = useTranslation();

  return (
    <SchemaInitializer.Item
      {...props}
      icon={<FormOutlined />}
      onClick={() => {
        let retVal = prompt('内容 : ', '从前有座山');

        if (retVal == null) {
          return;
        }

        insert({
          type: 'void',
          'x-designer': 'Basic.Designer',
          'x-decorator': 'CardItem',
          'x-component': 'Basic',
          'x-editable': false,
          'x-component-props': {
            content: retVal,
          },
        });
      }}
    />
  );
};

export const DialogBlockInitializer = (props: any) => {
  const { insert } = props;
  const { t } = useTranslation();
  const options = useContext(SchemaOptionsContext);
  return (
    <SchemaInitializer.Item
      {...props}
      icon={<FormOutlined />}
      onClick={async () => {
        const values = await FormDialog(t('Create calendar block'), () => {
          return (
            <SchemaComponentOptions scope={options.scope} components={{ ...options.components }}>
              <FormLayout layout={'vertical'}>
                <SchemaComponent
                  schema={{
                    properties: {
                      title: {
                        title: t('Title field'),
                        'x-component': 'input',
                        'x-decorator': 'FormItem',
                      },
                    },
                  }}
                />
              </FormLayout>
            </SchemaComponentOptions>
          );
        }).open({
          initialValues: {},
        });

        insert({
          type: 'void',
          'x-designer': 'DialogBlock.Designer',
          'x-decorator': 'CardItem',
          'x-component': 'DialogBlock',
          'x-editable': false,
          'x-component-props': {
            ...values,
          },
        });
      }}
    />
  );
};

// 
export const RemoteDataBlockInitializer = (props: any) => {
  const { insert } = props;
  const { t } = useTranslation();
  return (
    <SchemaInitializer.Item
      {...props}
      icon={<FormOutlined />}
      onClick={() => {
        insert({
          type: 'void',
          'x-designer': 'RemoteData.Designer',
          'x-decorator': 'CardItem',
          'x-component': 'RemoteData',
          'x-editable': false,
        });
      }}
    />
  );
};