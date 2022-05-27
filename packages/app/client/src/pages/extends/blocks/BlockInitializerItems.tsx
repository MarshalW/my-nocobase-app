import { FormOutlined, TableOutlined } from '@ant-design/icons';
import { SchemaInitializer } from '@nocobase/client';
import { useTranslation } from 'react-i18next';

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
