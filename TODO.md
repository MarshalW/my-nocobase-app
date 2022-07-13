# todo

## 业务逻辑

### 功能

- 插件
  - 实现一个动态的统计图，见: https://github.com/nocobase/nocobase/discussions/602
    
### 其他

- 账号管理加入自定义属性，账号权限bug？无法编辑自己的记录（提issue bug）
- 可销售藏品列表 api，编写mock购买功能
- 服务器端必须做好一个中间适配层api，方便后续分工，应包括测试代码

## 部署

- proto-nft 安装 docker 
- my-nocobase-app@nft 构建 docker image
- 在 nft_proto 运行 docker/my-nocobase-app@nft （数据库和文件都打在镜像里）
- frp, 可以通过 https://nft.feawin.com 访问