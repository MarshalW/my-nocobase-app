
// ---> 来源于 packages/core/client/src/schema-initializer/utils.ts
import { ISchema, Schema, useFieldSchema, useForm } from '@formily/react';
import { uid } from '@formily/shared';

const gridRowColWrap = (schema: ISchema) => {
  return {
    type: 'void',
    'x-component': 'Grid.Row',
    properties: {
      [uid()]: {
        type: 'void',
        'x-component': 'Grid.Col',
        properties: {
          [schema.name || uid()]: schema,
        },
      },
    },
  };
};
// <--

// 页面里添加区块
export const BlockInitializers = {
  title: '{{t("Add block")}}',
  icon: 'PlusOutlined',
  wrap: gridRowColWrap,
  items: [
    {
      key: 'dataBlocks',
      type: 'itemGroup',
      title: '{{t("Data blocks")}}',
      children: [
        {
          key: 'table',
          type: 'item',
          title: '{{t("Table")}}',
          component: 'TableBlockInitializer',
        },
        {
          key: 'form',
          type: 'item',
          title: '{{t("Form")}}',
          component: 'FormBlockInitializer',
        },
        {
          key: 'details',
          type: 'item',
          title: '{{t("Details")}}',
          component: 'DetailsBlockInitializer',
        },
        {
          key: 'calendar',
          type: 'item',
          title: '{{t("Calendar")}}',
          component: 'CalendarBlockInitializer',
        },
        {
          key: 'kanban',
          type: 'item',
          title: '{{t("Kanban")}}',
          component: 'KanbanBlockInitializer',
        },
      ],
    },
    {
      key: 'media',
      type: 'itemGroup',
      title: '{{t("Media")}}',
      children: [
        {
          key: 'markdown',
          type: 'item',
          title: '{{t("Markdown")}}',
          component: 'MarkdownBlockInitializer',
        },
      ],
    },
    {
      key: 'media',
      type: 'itemGroup',
      title: '可视化',
      children: [
        {
          key: 'pieChart',
          type: 'item',
          title: '{{t("饼图")}}',
          component: 'PieChartBlockInitializer',
        },
        {
          key: 'barChart',
          type: 'item',
          title: '{{t("条状图")}}',
          component: 'BarChartBlockInitializer',
        },
      ],
    },
    {
      key: 'media',
      type: 'itemGroup',
      title: '其他',
      children: [
        {
          key: 'simple',
          type: 'item',
          title: '{{t("最简区块")}}',
          component: 'SimpleBlockInitializer',
        },
        {
          key: 'basic',
          type: 'item',
          title: '{{t("带系统对话框区块")}}',
          component: 'BasicBlockInitializer',
        },
        {
          key: 'dialog',
          type: 'item',
          title: '{{t("带表单对话框区块")}}',
          component: 'DialogBlockInitializer',
        },
        {
          key: 'remote',
          type: 'item',
          title: '{{t("远程数据区块")}}',
          component: 'RemoteDataBlockInitializer',
        },
      ],
    },
  ],
};
