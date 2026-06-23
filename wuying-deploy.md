# 阿里云无影云电脑部署指南

## 无影云电脑特点

- ✅ 基于 Windows/Linux 的云端桌面
- ⚠️ 默认无公网IP（内网环境）
- ✅ 可通过内网穿透实现外网访问
- ✅ 性能稳定，适合长期运行

---

## 部署方案

### 方案一：无影云电脑 + 内网穿透（推荐，成本最低）

在无影云电脑上运行网站，通过内网穿透工具暴露到公网。

#### 步骤 1：连接无影云电脑

1. 下载无影云电脑客户端：https://www.aliyun.com/product/ecs/wuying
2. 登录并连接你的云桌面

#### 步骤 2：在无影云电脑内部署

**如果是 Windows 无影云电脑：**

```powershell
# 以管理员身份打开 PowerShell

# 1. 安装 Chocolatey（包管理器）
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# 2. 安装 Git 和 Node.js
choco install git nodejs -y

# 3. 重启 PowerShell，然后克隆代码
cd C:\
git clone https://github.com/shuaiwang-snail/iflytek.me.git
cd iflytek.me

# 4. 安装依赖并构建
npm install
npm run build

# 5. 创建环境变量
@"
DATABASE_URL=file:./prisma/prod.db
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-$(Get-Random)
ADMIN_EMAIL=admin@iflytek.me
ADMIN_PASSWORD=admin123
"@ | Out-File -FilePath .env.production -Encoding utf8

# 6. 初始化数据库
npx prisma migrate deploy
npx tsx scripts/init-db.ts

# 7. 启动应用
npm start
```

**如果是 Linux 无影云电脑：**

```bash
# 1. 安装依赖
sudo apt update
sudo apt install -y git curl

# 2. 安装 Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 3. 一键部署
curl -fsSL https://raw.githubusercontent.com/shuaiwang-snail/iflytek.me/main/deploy.sh | bash
```

#### 步骤 3：配置内网穿透

**方案 A：使用 Cloudflare Tunnel（免费，推荐）**

```powershell
# Windows PowerShell
# 下载 cloudflared
Invoke-WebRequest -Uri "https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.exe" -OutFile "cloudflared.exe"

# 登录 Cloudflare
.\cloudflared.exe tunnel login
# 按提示在浏览器中授权

# 创建隧道
.\cloudflared.exe tunnel create iflytek-me

# 创建配置文件
$config = @"
tunnel: TUNNEL_ID
credentials-file: C:\Users\$env:USERNAME\.cloudflared\TUNNEL_ID.json

ingress:
  - hostname: iflytek.yourdomain.com
    service: http://localhost:3000
  - service: http_status:404
"@
$config | Out-File -FilePath "$env:USERPROFILE\.cloudflared\config.yml" -Encoding utf8

# 运行隧道
.\cloudflared.exe tunnel run iflytek-me
```

**方案 B：使用花生壳（国产，有免费版）**

1. 访问 https://hsk.oray.com 注册账号
2. 下载 Windows 客户端安装
3. 添加映射：
   - 应用名称：iflytek-me
   - 内网主机：127.0.0.1
   - 内网端口：3000
   - 外网域名：系统分配或自定义

**方案 C：使用 ngrok（简单快速）**

```powershell
# 下载 ngrok
Invoke-WebRequest -Uri "https://bin.equinox.io/c/bNyj1mQVY4c/ngrok-v3-stable-windows-amd64.zip" -OutFile "ngrok.zip"
Expand-Archive -Path "ngrok.zip" -DestinationPath "."

# 注册 ngrok 账号，获取 authtoken
# https://dashboard.ngrok.com/get-started/your-authtoken
.\ngrok.exe config add-authtoken YOUR_AUTHTOKEN

# 启动隧道（会分配临时域名）
.\ngrok.exe http 3000
```

---

### 方案二：购买弹性公网IP（最简单）

阿里云无影云电脑可以绑定弹性公网IP（EIP）。

#### 步骤：

1. 登录阿里云控制台
2. 进入 **无影云电脑** → **桌面管理**
3. 找到你的云桌面，点击 **更多** → **绑定弹性公网IP**
4. 购买并绑定 EIP（约 23 元/月）
5. 然后在安全组中开放 3000 端口
6. 直接访问 `http://EIP地址:3000`

---

### 方案三：搭配阿里云 ECS（推荐，长期稳定）

如果无影云电脑主要用于开发，建议：

1. **无影云电脑**：开发、测试
2. **阿里云 ECS**（最低配 1核1G，约 80元/月）：生产部署

部署脚本：
```bash
# 在 ECS 上执行
curl -fsSL https://raw.githubusercontent.com/shuaiwang-snail/iflytek.me/main/deploy.sh | bash
```

---

## 推荐配置对比

| 方案 | 成本 | 复杂度 | 稳定性 | 适用场景 |
|-----|------|--------|--------|---------|
| Cloudflare Tunnel | 免费 | 中 | 高 | 个人使用，有域名 |
| 花生壳 | 免费/付费 | 低 | 中 | 快速上手，国内访问 |
| ngrok | 免费/付费 | 低 | 中 | 临时测试 |
| 弹性公网IP | ~23元/月 | 低 | 高 | 长期使用 |
| ECS 服务器 | ~80元/月起 | 低 | 高 | 正式生产环境 |

---

## 无影云电脑优化建议

### 1. 设置开机自启动

**Windows：**
创建任务计划程序，登录时自动启动应用。

**或使用 PM2：**
```powershell
npm install -g pm2
pm2 start npm --name "iflytek-me" -- start
pm2 save
pm2 startup
```

### 2. 保持无影云电脑在线

- 设置无影云电脑不自动休眠
- 或者使用定时任务保持活跃

### 3. 数据备份

```powershell
# 备份数据库
Copy-Item "prisma\prod.db" "prisma\prod.db.backup.$(Get-Date -Format 'yyyyMMdd')"
```

---

## 快速开始（推荐路径）

### 如果你追求免费 + 简单：
1. 在无影云电脑上部署应用（Windows/Linux 都可以）
2. 使用 **花生壳** 做内网穿透
3. 获得免费的外网访问地址

### 如果你追求稳定 + 长期使用：
1. 购买阿里云 ECS（1核1G 即可）
2. 执行一键部署脚本
3. 绑定域名

---

## 需要帮助？

告诉我：
1. 你的无影云电脑是 **Windows** 还是 **Linux**？
2. 是否有 **阿里云域名**？
3. 预算考虑（免费 / 低成本 / 不在乎成本）？

我可以给你更具体的操作步骤！