# iflytek.me - 讯飞资讯平台

讯飞AI行业资讯聚合平台，让讯飞人分享最新动态。

## 功能特性

- ✅ 用户注册/登录（需管理员审核）
- ✅ 资讯发布与管理
- ✅ 定时推送（每天 8:00 / 12:00 / 16:00 / 20:00）
- ✅ 资讯分类筛选
- ✅ 分享推广（带个人信息）
- ✅ 响应式设计

## 技术栈

- Next.js 14 + React 19
- TypeScript
- Tailwind CSS
- Prisma + PostgreSQL
- NextAuth.js
- Vercel Blob（图片存储）

## 开发环境配置

1. 克隆项目
```bash
git clone <your-repo>
cd iflytek-me
```

2. 安装依赖
```bash
npm install
```

3. 配置环境变量
```bash
cp .env.local.example .env.local
# 编辑 .env.local 填入你的配置
```

4. 初始化数据库
```bash
# 推送数据库结构
npm run db:push

# 创建管理员账号
npm run db:init
```

5. 启动开发服务器
```bash
npm run dev
```

访问 http://localhost:3000

## 部署到 Vercel

1. 推送代码到 GitHub
2. 在 Vercel 导入项目
3. 配置环境变量：
   - `DATABASE_URL` - PostgreSQL 连接字符串
   - `NEXTAUTH_SECRET` - 随机密钥
   - `NEXTAUTH_URL` - 网站 URL
   - `BLOB_READ_WRITE_TOKEN` - Vercel Blob Token
   - `CRON_SECRET` - Cron 任务密钥
4. 部署

## 管理员账号

默认管理员账号：
- 邮箱：admin@iflytek.me
- 密码：admin123

（请在生产环境修改默认密码）

## 定时任务

定时推送配置在 `vercel.json` 中：
- 每天 8:00 / 12:00 / 16:00 / 20:00
- 自动发布已排期的资讯

## 目录结构

```
iflytek-me/
├── prisma/
│   └── schema.prisma      # 数据库模型
├── scripts/
│   └── init-db.ts         # 初始化脚本
├── src/
│   ├── app/               # Next.js App Router
│   │   ├── api/           # API 路由
│   │   ├── admin/         # 管理后台
│   │   ├── auth/          # 登录/注册
│   │   └── ...
│   ├── components/        # React 组件
│   └── lib/               # 工具函数
└── vercel.json            # Vercel 配置
```

## 许可证

MIT
