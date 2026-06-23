#!/bin/bash

# 阿里云 ECS 部署脚本 for iflytek.me

APP_DIR="/opt/app/iflytek-me"
REPO_URL="https://github.com/shuaiwang-snail/iflytek.me.git"
LOG_FILE="/var/log/iflytek-deploy.log"

# 日志函数
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a $LOG_FILE
}

log "=== 开始部署 iflytek.me ==="

# 1. 检查并安装依赖
if ! command -v node &> /dev/null; then
    log "安装 Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y nodejs
fi

if ! command -v pm2 &> /dev/null; then
    log "安装 PM2..."
    npm install -g pm2
fi

if ! command -v git &> /dev/null; then
    log "安装 Git..."
    apt-get install -y git
fi

# 2. 克隆或更新代码
if [ -d "$APP_DIR" ]; then
    log "更新代码..."
    cd $APP_DIR
    git pull origin main
else
    log "克隆代码..."
    mkdir -p /opt/app
    cd /opt/app
    git clone $REPO_URL iflytek-me
    cd iflytek-me
fi

# 3. 安装依赖
log "安装依赖..."
npm ci

# 4. 构建
log "构建应用..."
npm run build

# 5. 配置环境变量（如果 .env.production 不存在）
if [ ! -f ".env.production" ]; then
    log "创建环境变量配置..."
    cat > .env.production << 'EOF'
DATABASE_URL="file:./prisma/prod.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="change-this-secret-key-$(date +%s)"
ADMIN_EMAIL="admin@iflytek.me"
ADMIN_PASSWORD="admin123"
EOF
fi

# 6. 初始化数据库
log "初始化数据库..."
export DATABASE_URL="file:./prisma/prod.db"
npx prisma migrate deploy 2>/dev/null || true
NODE_ENV=production npx tsx scripts/init-db.ts 2>/dev/null || true

# 7. 使用 PM2 启动/重启
log "启动应用..."
pm2 delete iflytek-me 2>/dev/null || true
pm2 start npm --name "iflytek-me" -- start

# 8. 保存配置
pm2 save
pm2 startup

log "=== 部署完成 ==="
log "应用运行在: http://$(curl -s ifconfig.me 2>/dev/null || echo 'localhost'):3000"
pm2 status
