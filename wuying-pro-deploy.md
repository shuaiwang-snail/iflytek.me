# 无影云电脑 + iflytek.me 域名 专业部署方案

## 推荐配置

- **系统**: Ubuntu 22.04 LTS（服务器版，资源占用低）
- **方案**: 无影云电脑 + Cloudflare Tunnel（免费+稳定）
- **域名**: iflytek.me（已准备）

---

## 方案对比

| 方案 | 成本 | 复杂度 | 推荐度 | 说明 |
|-----|------|--------|--------|------|
| **Cloudflare Tunnel** | 免费 | 中 | ⭐⭐⭐⭐⭐ | 有域名首选，自动 HTTPS |
| **阿里云 EIP** | 23元/月 | 低 | ⭐⭐⭐⭐ | 简单直接，固定 IP |
| **ECS 服务器** | 80元/月起 | 低 | ⭐⭐⭐⭐⭐ | 最专业，推荐正式运营 |

**推荐**：先用 **Cloudflare Tunnel**（免费），后期迁移到 **ECS**（更稳定）

---

## 方案一：Cloudflare Tunnel（推荐，免费）

### 前置准备

1. **注册 Cloudflare 账号**: https://dash.cloudflare.com/sign-up
2. **添加域名**: 将 `iflytek.me` 添加到 Cloudflare
3. **修改 DNS**: 在域名注册商处将 NS 记录改为 Cloudflare 提供的地址

### 步骤 1：将无影云电脑系统改为 Ubuntu

1. 登录阿里云控制台
2. 进入 **无影云电脑** → **桌面管理**
3. 找到你的云桌面，点击 **更多** → **更换镜像**
4. 选择 **Ubuntu 22.04 LTS 64位**
5. 等待重启完成

### 步骤 2：连接无影云电脑

使用 SSH 客户端连接：
```bash
ssh root@无影云电脑内网IP
# 或使用无影客户端连接后打开终端
```

### 步骤 3：一键部署

```bash
# 1. 更新系统
sudo apt update && sudo apt upgrade -y

# 2. 安装基础依赖
sudo apt install -y git curl wget

# 3. 安装 Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 4. 安装 PM2
sudo npm install -g pm2

# 5. 克隆代码
sudo mkdir -p /opt/app
sudo chown $USER:$USER /opt/app
cd /opt/app
git clone https://github.com/shuaiwang-snail/iflytek.me.git
cd iflytek.me

# 6. 安装依赖
npm ci

# 7. 构建
npm run build

# 8. 创建环境变量
cat > .env.production << 'EOF'
DATABASE_URL="file:./prisma/prod.db"
NEXTAUTH_URL="https://iflytek.me"
NEXTAUTH_SECRET="$(openssl rand -base64 32)"
ADMIN_EMAIL="admin@iflytek.me"
ADMIN_PASSWORD="***"
EOF

# 9. 初始化数据库
export DATABASE_URL="file:./prisma/prod.db"
npx prisma migrate deploy
npx tsx scripts/init-db.ts

# 10. 使用 PM2 启动
pm2 start npm --name "iflytek-me" -- start
pm2 save
pm2 startup
```

### 步骤 4：安装 Cloudflare Tunnel

```bash
# 下载并安装 cloudflared
curl -L --output cloudflared.deb https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
sudo dpkg -i cloudflared.deb

# 登录 Cloudflare
cloudflared tunnel login
# 会显示一个链接，复制到浏览器授权
```

### 步骤 5：创建并配置隧道

```bash
# 创建隧道
cloudflared tunnel create iflytek-me
# 记住输出的 Tunnel ID: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx

# 创建配置文件
mkdir -p ~/.cloudflared
TUNNEL_ID=$(cloudflared tunnel list | grep iflytek-me | awk '{print $1}')

cat > ~/.cloudflared/config.yml << EOF
tunnel: ${TUNNEL_ID}
credentials-file: /root/.cloudflared/${TUNNEL_ID}.json

ingress:
  - hostname: iflytek.me
    service: http://localhost:3000
  - hostname: www.iflytek.me
    service: http://localhost:3000
  - service: http_status:404
EOF

# 添加 DNS 记录
cloudflared tunnel route dns ${TUNNEL_ID} iflytek.me
cloudflared tunnel route dns ${TUNNEL_ID} www.iflytek.me
```

### 步骤 6：设置开机自启动

```bash
# 创建 systemd 服务
cat > /etc/systemd/system/cloudflared.service << 'EOF'
[Unit]
Description=Cloudflare Tunnel
After=network.target

[Service]
Type=simple
User=root
ExecStart=/usr/bin/cloudflared tunnel run iflytek-me
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF

# 启用服务
systemctl enable cloudflared
systemctl start cloudflared

# 查看状态
systemctl status cloudflared
```

### 步骤 7：验证部署

```bash
# 检查应用状态
pm2 status

# 检查隧道状态
cloudflared tunnel info iflytek-me

# 测试访问
curl https://iflytek.me
```

---

## 方案二：阿里云 EIP（简单直接）

如果不想用 Cloudflare，可以直接购买 EIP：

### 步骤：

1. **阿里云控制台** → **无影云电脑** → **桌面管理**
2. 找到云桌面 → **更多** → **绑定弹性公网IP**
3. 购买 EIP（按流量计费约 23元/月）
4. **安全组配置**：
   - 入方向：开放 3000 端口（0.0.0.0/0）
   - 入方向：开放 80 端口（HTTP）
   - 入方向：开放 443 端口（HTTPS）

5. 然后执行上面的一键部署脚本
6. 访问：`http://你的EIP:3000`

### 配置域名解析（EIP 方案）

在域名注册商处添加 A 记录：
```
主机记录: @
记录类型: A
记录值: 你的EIP地址
```

---

## 方案三：迁移到阿里云 ECS（最终推荐）

如果网站正式运营，建议迁移到 ECS：

### 购买 ECS
- **配置**: 1核2G 或 2核4G
- **系统**: Ubuntu 22.04
- **带宽**: 1-5Mbps
- **费用**: 约 80-200元/月

### 迁移步骤

```bash
# 在 ECS 上执行相同的部署脚本
curl -fsSL https://raw.githubusercontent.com/shuaiwang-snail/iflytek.me/main/deploy.sh | bash

# 然后配置 Nginx 反向代理
sudo apt install nginx -y

cat > /etc/nginx/sites-available/iflytek.me << 'EOF'
server {
    listen 80;
    server_name iflytek.me www.iflytek.me;
    
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

sudo ln -s /etc/nginx/sites-available/iflytek.me /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## 域名配置检查清单

无论用哪个方案，都需要配置域名：

- [ ] 域名 `iflytek.me` 已注册
- [ ] DNS 记录指向正确（Cloudflare 或 EIP）
- [ ] 等待 DNS 生效（通常 5-30 分钟）

---

## 下一步

请告诉我：

1. **想用哪个方案**？
   - A: Cloudflare Tunnel（免费，推荐）
   - B: 阿里云 EIP（简单，23元/月）
   - C: 直接上 ECS（最稳定，80元/月起）

2. **域名 iflytek.me 在哪里注册的**？（阿里云/腾讯云/GoDaddy/其他）

3. **是否已有 Cloudflare 账号**？

我可以给你更具体的操作命令！