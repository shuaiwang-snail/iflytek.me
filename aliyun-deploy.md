# 阿里云部署指南

## 方案选择

阿里云提供多种部署方案，推荐以下两种：

### 方案 A：阿里云 ECS 服务器（推荐，最灵活）
- 购买一台 ECS 实例
- 自行部署 Node.js 应用
- 适合长期运行，完全可控

### 方案 B：阿里云 Serverless（函数计算 FC）
- 按调用次数计费
- 自动扩缩容
- 适合流量波动大的场景

---

## 方案 A：ECS 服务器部署

### 步骤 1：购买 ECS 实例

1. 访问 https://ecs.console.aliyun.com
2. 点击 "创建实例"
3. 配置选择：
   - **地域**：选择离你最近的（如华东1杭州）
   - **实例规格**：2核4G（推荐）或 1核2G（最低）
   - **镜像**：CentOS 8 / Ubuntu 22.04 / Alibaba Cloud Linux
   - **带宽**：1-5Mbps
   - **安全组**：开放 22(SSH)、80(HTTP)、443(HTTPS)、3000(应用) 端口

### 步骤 2：连接服务器

```bash
ssh root@你的服务器IP
```

### 步骤 3：安装环境

```bash
# 更新系统
yum update -y  # CentOS
apt update && apt upgrade -y  # Ubuntu

# 安装 Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

# 安装 PM2（进程管理器）
npm install -g pm2

# 安装 Git
yum install git -y  # CentOS
apt install git -y  # Ubuntu
```

### 步骤 4：部署应用

```bash
# 创建应用目录
mkdir -p /opt/app
cd /opt/app

# 克隆代码
git clone https://github.com/shuaiwang-snail/iflytek.me.git
cd iflytek.me

# 安装依赖
npm install

# 构建应用
npm run build

# 配置环境变量
cat > .env.production << 'EOF'
DATABASE_URL="file:./prisma/prod.db"
NEXTAUTH_URL="http://你的服务器IP:3000"
NEXTAUTH_SECRET="your-secret-key-change-this"
ADMIN_EMAIL="admin@iflytek.me"
ADMIN_PASSWORD="admin123"
EOF

# 初始化数据库
npx prisma migrate deploy
npx tsx scripts/init-db.ts

# 使用 PM2 启动
pm2 start npm --name "iflytek-me" -- start

# 保存 PM2 配置
pm2 save
pm2 startup
```

### 步骤 5：配置 Nginx 反向代理（可选但推荐）

```bash
# 安装 Nginx
yum install nginx -y  # CentOS
apt install nginx -y  # Ubuntu

# 配置 Nginx
cat > /etc/nginx/conf.d/iflytek-me.conf << 'EOF'
server {
    listen 80;
    server_name _;  # 或你的域名

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

# 启动 Nginx
systemctl start nginx
systemctl enable nginx
```

### 步骤 6：配置域名（可选）

1. 在阿里云购买/解析域名
2. 添加 A 记录指向服务器 IP
3. 修改 Nginx 配置中的 `server_name`

---

## 方案 B：函数计算 FC（Serverless）

### 步骤 1：创建函数计算服务

1. 访问 https://fc.console.aliyun.com
2. 点击 "创建服务"
3. 服务名称：`iflytek-me`

### 步骤 2：创建函数

1. 选择 "使用自定义运行时"
2. 函数名称：`web`
3. 运行环境：`Custom Runtime`
4. 上传代码包（需要打包整个项目）

### 步骤 3：配置触发器

1. 添加 "HTTP 触发器"
2. 认证方式：匿名访问
3. 请求方法：ANY

### 步骤 4：配置环境变量

在函数配置中添加：
- `DATABASE_URL`：使用阿里云 RDS 或 SQLite
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`

---

## 快速部署脚本

已为你准备好自动化部署脚本，保存为 `deploy.sh`：

```bash
#!/bin/bash

# 阿里云 ECS 部署脚本

APP_DIR="/opt/app/iflytek-me"
REPO_URL="https://github.com/shuaiwang-snail/iflytek.me.git"

echo "=== 开始部署 iflytek.me ==="

# 1. 检查并安装依赖
if ! command -v node &> /dev/null; then
    echo "安装 Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y nodejs
fi

if ! command -v pm2 &> /dev/null; then
    echo "安装 PM2..."
    npm install -g pm2
fi

# 2. 克隆或更新代码
if [ -d "$APP_DIR" ]; then
    echo "更新代码..."
    cd $APP_DIR
    git pull
else
    echo "克隆代码..."
    mkdir -p /opt/app
    cd /opt/app
    git clone $REPO_URL
    cd iflytek.me
fi

# 3. 安装依赖
echo "安装依赖..."
npm install

# 4. 构建
echo "构建应用..."
npm run build

# 5. 配置环境变量（如果 .env.production 不存在）
if [ ! -f ".env.production" ]; then
    echo "创建环境变量配置..."
    cat > .env.production << 'EOF'
DATABASE_URL="file:./prisma/prod.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="change-this-secret-key"
ADMIN_EMAIL="admin@iflytek.me"
ADMIN_PASSWORD="admin123"
EOF
fi

# 6. 初始化数据库
echo "初始化数据库..."
npx prisma migrate deploy 2>/dev/null || true
NODE_ENV=production npx tsx scripts/init-db.ts 2>/dev/null || true

# 7. 使用 PM2 启动/重启
echo "启动应用..."
pm2 delete iflytek-me 2>/dev/null || true
pm2 start npm --name "iflytek-me" -- start

# 8. 保存配置
pm2 save

echo "=== 部署完成 ==="
echo "应用运行在: http://$(curl -s ifconfig.me):3000"
pm2 status
```

---

## 费用预估

### ECS 方案（推荐）
- **2核4G + 1Mbps**：约 200-300 元/月
- **1核2G + 1Mbps**：约 100-150 元/月

### 函数计算 FC
- **按调用次数**：前 100 万次免费，之后约 0.02 元/万次
- **按执行时间**：根据实际使用量计费

---

## 下一步

1. 登录阿里云控制台：https://ecs.console.aliyun.com
2. 创建 ECS 实例
3. 把服务器 IP 告诉我，我帮你执行部署脚本
