# todo

## 计划

- 本周，验证功能的版本
- 下周，使用新发布的nocobase出完整版本，并制作发布功能展示视频

## 业务逻辑

### 功能

- 藏品，增加字段，nft平台
- 怎么体现至信链的设置？
- 怎样体现nft平台的设置？
- 插件
    - 藏品超过上限的校验和交互处理
    - ~~根据所辖藏品数量生成藏品总数~~
    - 藏品系列为空的编辑
    - 藏品上链
    - 藏品定时发售
    - mock订单

### 其他

- 修改布局，写入系统名称等
- 可销售藏品列表 api，编写mock购买功能
- 首页仪表板和统计图表
- 服务器端必须做好一个中间适配层api，才能交给兼职去后续完成，应包括测试代码

## 部署

- proto-nft 安装 docker 
- my-nocobase-app@nft 构建 docker image
- 在 nft_proto 运行 docker/my-nocobase-app@nft （数据库和文件都打在镜像里）
- frp, 可以通过 https://nft.feawin.com 访问
