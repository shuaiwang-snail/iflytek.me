# 立即部署指南：阿里云域名 + 无影云电脑 + Cloudflare

## 部署流程概览

```
1. 注册 Cloudflare 账号 (5分钟)
2. 将域名转移到 Cloudflare (10分钟)
3. 准备无影云电脑 (5分钟)
4. 部署应用 (10分钟)
5. 配置 Cloudflare Tunnel (10分钟)
```

**总时间：约 40 分钟**

---

## 第一步：注册 Cloudflare 账号

1. 访问 https://dash.cloudflare.com/sign-up
2. 填写邮箱和密码注册
3. 验证邮箱

---

## 第二步：将 iflytek.me 转移到 Cloudflare

### 2.1 添加域名到 Cloudflare

1. 登录 Cloudflare 控制台
2. 点击 **"Add a Site"**
3. 输入域名：`iflytek.me`
4. 选择 **Free** 计划，点击 **Continue**

### 2.2 修改阿里云 DNS

1. 登录阿里云控制台：https://dns.console.aliyun.com
2. 找到 `iflytek.me` 域名
3. 点击 **"管理"** → **"DNS修改"**
4. 将 DNS 服务器改为 Cloudflare 提供的两个地址：
   ```
   xxx.ns.cloudflare.com
   yyy.ns.cloudflare.com
   ```
   （具体地址在 Cloudflare 添加站点后会显示）
5. 保存，等待生效（通常 5-30 分钟）

### 2.3 在 Cloudflare 验证

1. 回到 Cloudflare 控制台
2. 点击 **"Check Nameservers"**
3. 等待显示 **"Active"** 状态

---

## 第三步：准备无影云电脑

### 3.1 更换系统为 Ubuntu

1. 登录阿里云控制台：https://wuying.console.aliyun.com
2. 进入 **"云桌面管理"**
3. 找到你的云桌面，点击 **"更多"** → **"更换镜像"**
4. 选择：**Ubuntu 22.04 LTS 64位**
5. 点击 **"确定"**，等待重启（约 5 分钟）

### 3.2 连接云电脑

**方式一：使用无影客户端**
1. 下载无影客户端：https://www.aliyun.com/product/ecs/wuying
2. 登录后连接云桌面
3. 打开终端（Terminal）

**方式二：使用 SSH（如果开启了 SSH）**
```bash
ssh root@无影云电脑IP
```

---

## 第四步：一键部署应用

在无影云电脑的终端中执行：

```bash
# 1. 更新系统
sudo apt update && sudo apt upgrade -y

# 2. 安装基础依赖
sudo apt install -y git curl wget vim

# 3. 安装 Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 验证安装
node -v  # 应显示 v20.x.x
npm -v   # 应显示 10.x.x

# 4. 安装 PM2 进程管理器
sudo npm install -g pm2

# 5. 创建应用目录
sudo mkdir -p /opt/app
sudo chown $USER:$USER /opt/app
cd /opt/app

# 6. 克隆代码
git clone https://github.com/shuaiwang-snail/iflytek.me.git
cd iflytek.me

# 7. 安装依赖
npm ci

# 8. 构建应用
npm run build

# 9. 创建环境变量文件
cat > .env.production << 'EOF'
DATABASE_URL="file:./prisma/prod.db"
NEXTAUTH_URL="https://iflytek.me"
NEXTAUTH_SECRET="change-this-to-a-random-secret-key-32-chars"
ADMIN_EMAIL="admin@iflytek.me"
ADMIN_PASSWORD="***"
EOF

# 10. 初始化数据库
export DATABASE_URL="file:./prisma/prod.db"
npx prisma migrate deploy
npx tsx scripts/init-db.ts

# 11. 使用 PM2 启动应用
pm2 start npm --name "iflytek-me" -- start

# 12. 保存 PM2 配置
pm2 save
pm2 startup

# 13. 查看运行状态
pm2 status
```

**测试本地访问：**
```bash
curl http://localhost:3000
```

如果显示 HTML 内容，说明应用运行成功！

---

## 第五步：配置 Cloudflare Tunnel

### 5.1 安装 cloudflared

```bash
# 下载并安装
curl -L --output cloudflared.deb https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
sudo dpkg -i cloudflared.deb

# 验证安装
cloudflared --version
```

### 5.2 登录 Cloudflare

```bash
cloudflared tunnel login
```

**执行后会显示一个链接，例如：**
```
Please open the following URL and log in with your Cloudflare account:

https://dash.cloudflare.com/argotunnel?callback=https%3A%2F%2Flocalhost%3A...
```

**操作步骤：**
1. 复制链接到浏览器打开
2. 登录你的 Cloudflare 账号
3. 选择 `iflytek.me` 域名
4. 点击 **"Authorize"**
5. 回到终端，会显示 **"Successfully downloaded certificate"**

### 5.3 创建隧道

```bash
# 创建隧道
cloudflared tunnel create iflytek-me

# 输出示例：
# Tunnel credentials written to /root/.cloudflared/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.json
# Keep this file secret. To revoke these credentials, delete the tunnel.
# Created tunnel iflytek-me with id xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

**记住输出的 Tunnel ID！**

### 5.4 配置隧道

```bash
# 获取 Tunnel ID
TUNNEL_ID=$(cloudflared tunnel list | grep iflytek-me | awk '{print $1}')
echo "Tunnel ID: $TUNNEL_ID"

# 创建配置文件
mkdir -p ~/.cloudflared

cat > ~/.cloudflared/config.yml << EOF
tunnel: ${TUNNEL_ID}
credentials-file: /root/.cloudflared/${TUNNEL_ID}.json

ingress:
  - hostname: iflytek.me
    service: http://localhost:3000
    originRequest:
      noTLSVerify: true
  - hostname: www.iflytek.me
    service: http://localhost:3000
    originRequest:
      noTLSVerify: true
  - service: http_status:404
EOF
```

### 5.5 添加 DNS 记录

```bash
# 添加 iflytek.me 的 DNS 记录
cloudflared tunnel route dns ${TUNNEL_ID} iflytek.me

# 添加 www.iflytek.me 的 DNS 记录
cloudflared tunnel route dns ${TUNNEL_ID} www.iflytek.me
```

### 5.6 启动隧道

**测试运行：**
```bash
cloudflared tunnel run iflytek-me
```

如果显示类似以下内容，说明成功：
```
INF Connection registered connIndex=0 connection=...
INF Updated to new configuration config=...
```

**按 Ctrl+C 停止测试**

### 5.7 设置开机自启动

```bash
# 安装为系统服务
sudo cloudflared service install

# 复制配置文件到系统目录
sudo mkdir -p /etc/cloudflared
sudo cp ~/.cloudflared/config.yml /etc/cloudflared/
sudo cp ~/.cloudflared/${TUNNEL_ID}.json /etc/cloudflared/

# 启动服务
sudo systemctl start cloudflared
sudo systemctl enable cloudflared

# 查看状态
sudo systemctl status cloudflared
```

---

## 第六步：验证部署

### 6.1 检查所有服务状态

```bash
# 检查应用
echo "=== PM2 状态 ==="
pm2 status

# 检查隧道
echo "=== Cloudflare Tunnel 状态 ==="
sudo systemctl status cloudflared

# 检查隧道信息
echo "=== Tunnel 信息 ==="
cloudflared tunnel info iflytek-me
```

### 6.2 测试访问

打开浏览器，访问：
- https://iflytek.me
- https://www.iflytek.me

**应该能看到网站首页！**

---

## 第七步：后续维护

### 查看日志
```bash
# 应用日志
pm2 logs iflytek-me

# 隧道日志
sudo journalctl -u cloudflared -f
```

### 重启服务
```bash
# 重启应用
pm2 restart iflytek-me

# 重启隧道
sudo systemctl restart cloudflared
```

### 更新代码
```bash
cd /opt/app/iflytek-me
git pull
npm ci
npm run build
pm2 restart iflytek-me
```

---

## 常见问题

### Q1: 域名解析不生效？
- 等待 5-30 分钟
- 使用 `nslookup iflytek.me` 检查 DNS

### Q2: 隧道连接失败？
```bash
# 检查日志
sudo journalctl -u cloudflared -n 50

# 重新启动
sudo systemctl restart cloudflared
```

### Q3: 应用无法访问？
```bash
# 检查应用是否运行
curl http://localhost:3000

# 检查端口
netstat -tlnp | grep 3000
```

---

## 完成！🎉

你的网站现在应该可以通过 https://iflytek.me 访问了！

**管理员账号：**
- 邮箱：admin@iflytek.me
- 密码：***（你在 .env.production 中设置的）

**后台地址：** https://iflytek.me/admin
