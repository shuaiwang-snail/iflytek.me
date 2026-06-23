# 云电脑部署指南

## 方案概述

在云电脑上部署 iflytek.me 项目，支持以下场景：
- ✅ 有公网IP的云服务器
- ✅ 无公网IP的内网云电脑（配合内网穿透）
- ✅ Windows/Linux 系统

---

## 方案 A：有公网IP的云服务器（最简单）

### 适用场景
- 阿里云/腾讯云/华为云 ECS
- 天翼云/联通云等云主机
- 任何有公网IP的服务器

### 部署步骤

#### 1. 连接服务器
```bash
# Linux/Mac SSH 连接
ssh root@你的云电脑IP

# Windows 使用 PowerShell 或 PuTTY
ssh root@你的云电脑IP
```

#### 2. 一键部署
```bash
# 下载并执行部署脚本
curl -fsSL https://raw.githubusercontent.com/shuaiwang-snail/iflytek.me/main/deploy.sh | bash
```

#### 3. 访问网站
```
http://你的云电脑IP:3000
```

---

## 方案 B：无公网IP的云电脑（内网穿透）

### 适用场景
- 天翼云电脑（无公网IP）
- 移动云电脑
- 公司内部云桌面

### 解决方案：使用内网穿透工具

#### 方案 B1：使用 Cloudflare Tunnel（推荐，免费）

**在云电脑上执行：**

```bash
# 1. 安装 cloudflared
# Linux
curl -L --output cloudflared.deb https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
sudo dpkg -i cloudflared.deb

# 2. 登录 Cloudflare
cloudflared tunnel login
# 会显示一个链接，用浏览器打开授权

# 3. 创建隧道
cloudflared tunnel create iflytek-me

# 4. 配置隧道
cat > ~/.cloudflared/config.yml << 'EOF'
tunnel: 你的隧道ID
credentials-file: /root/.cloudflared/你的隧道ID.json

ingress:
  - hostname: iflytek.yourdomain.com
    service: http://localhost:3000
  - service: http_status:404
EOF

# 5. 启动隧道
cloudflared tunnel run iflytek-me
```

#### 方案 B2：使用花生壳/神卓互联（国产工具）

1. 在云电脑安装花生壳客户端
2. 添加内网映射：
   - 内网主机：`127.0.0.1`
   - 内网端口：`3000`
3. 获得外网访问地址

#### 方案 B3：使用 FRP 自建穿透

如果你有一台有公网IP的服务器，可以用 FRP 搭建内网穿透。

---

## 方案 C：Windows 云电脑

### 部署步骤

#### 1. 安装必要软件
- **Git**: https://git-scm.com/download/win
- **Node.js 20**: https://nodejs.org/dist/v20.11.0/node-v20.11.0-x64.msi
- **PM2** (可选): `npm install -g pm2`

#### 2. 打开 PowerShell 或 CMD
```powershell
# 创建目录
mkdir C:\apps
cd C:\apps

# 克隆代码
git clone https://github.com/shuaiwang-snail/iflytek.me.git
cd iflytek.me

# 安装依赖
npm install

# 构建
npm run build

# 创建环境变量文件
$envContent = @"
DATABASE_URL=file:./prisma/prod.db
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here
ADMIN_EMAIL=admin@iflytek.me
ADMIN_PASSWORD=admin123
"@
$envContent | Out-File -FilePath .env.production -Encoding utf8

# 初始化数据库
npx prisma migrate deploy
npx tsx scripts/init-db.ts

# 启动应用
npm start
```

#### 3. 配置内网穿透（如果需要外网访问）
参考方案 B 的内网穿透方法。

---

## 快速诊断清单

### 检查云电脑环境
```bash
# 检查操作系统
cat /etc/os-release  # Linux
ver  # Windows CMD

# 检查是否有公网IP
curl ifconfig.me

# 检查端口是否开放
netstat -tlnp | grep 3000  # Linux
netstat -ano | findstr 3000  # Windows
```

### 常见问题

| 问题 | 解决方案 |
|-----|---------|
| 端口被占用 | 修改应用端口或关闭占用程序 |
| 防火墙阻止 | 开放 3000 端口 |
| 无法访问 | 检查是否有公网IP或配置内网穿透 |

---

## 需要帮助？

告诉我你的云电脑信息：
1. **云服务商**（阿里云/腾讯云/天翼云/移动云/其他）
2. **操作系统**（Windows/Linux，具体版本）
3. **是否有公网IP**
4. **连接方式**（SSH/远程桌面/VNC）

我可以给你更精确的部署指导！
