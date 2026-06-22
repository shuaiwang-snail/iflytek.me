# iFlytek.me 交付检查清单

## 启动前检查

- [ ] 环境变量配置正确 (.env.local)
- [ ] 数据库连接正常
- [ ] 依赖安装完整 (node_modules)

## 服务端检查

- [ ] 开发服务器启动无错误
- [ ] 所有 API 路由可访问
  - [ ] GET /api/news
  - [ ] GET /api/news?category=xxx
  - [ ] GET /api/news/daily
  - [ ] GET /api/auth/session
- [ ] 数据库查询正常
- [ ] 控制台无服务端错误

## 客户端检查

- [ ] 首页渲染正常
  - [ ] 侧边栏显示
  - [ ] 热点列表显示
  - [ ] 资讯列表加载（非"加载中..."）
  - [ ] 分类筛选可点击
  - [ ] 无 JavaScript 错误
- [ ] 登录页渲染正常
- [ ] 注册页渲染正常
- [ ] 管理后台渲染正常
- [ ] 其他页面渲染正常
  - [ ] /about
  - [ ] /feedback
  - [ ] /daily
  - [ ] /all

## 功能检查

- [ ] 深色/浅色模式切换
- [ ] 响应式布局（移动端适配）
- [ ] 页面标题正确
- [ ] 路由跳转正常

## 控制台检查

- [ ] 无 TypeError
- [ ] 无 ReferenceError
- [ ] 无 API 404/500 错误
- [ ] 无 React Warning

## 交付标准

全部检查项通过后才能交付。
