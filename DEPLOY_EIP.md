# 方案 B：阿里云 EIP 部署指南

## 方案特点

- ✅ **无需转移域名** - 保持阿里云 DNS 管理
- ✅ **简单直接** - 固定公网 IP
- ✅ **阿里云生态** - 统一控制台管理
- 💰 **成本** - 约 23 元/月（按流量计费更低）

---

## 部署流程

```
1. 购买并绑定 EIP (5分钟)
2. 配置安全组 (3分钟)
3. 准备无影云电脑 (5分钟)
4. 部署应用 (10分钟)
5. 配置 Nginx + HTTPS (10分钟)
6. 配置阿里云 DNS (5分钟)
```

**总时间：约 40 分钟**

---

## 第一步：购买并绑定 EIP

### 1.1 购买弹性公网IP

1. 登录阿里云控制台：https://vpc.console.aliyun.com
2. 左侧菜单 → **"弹性公网IP"**
3. 点击 **"创建弹性公网IP"**
4. 配置：
   - **地域**：选择和云电脑相同的地域
   - **带宽**：1Mbps（足够）
   - **计费方式**：
     - 按固定带宽：约 23 元/月
     - 按使用流量：约 0.8 元/GB（流量少更划算）
5. 点击 **"立即购买"**

### 1.2 绑定到无影云电脑

1. 在弹性公网IP列表，找到刚创建的 EIP
2. 点击 **"绑定资源"**
3. 选择：
   - **实例类型**：无影云电脑
   - **实例**：你的云桌面
4. 点击 **"确定"**

### 1.3 记录 EIP 地址

绑定成功后，记录这个 **IP 地址**（例如：`47.123.45.67`）

---

## 第二步：配置安全组

### 2.1 找到无影云电脑的安全组

1. 进入 **无影云电脑控制台**：https://wuying.console.aliyun.com
2. 点击 **"桌面管理"**
3. 找到你的云桌面，点击 **"管理"**
4. 查看 **"安全组"** 信息

### 2.2 添加安全组规则

1. 点击安全组名称，进入详情
2. 点击 **"入方向"** → **"手动添加"**
3. 添加以下规则：

| 授权策略 | 协议类型 | 端口范围 | 授权对象 | 描述 |
|---------|---------|---------|---------|------|
| 允许 | 自定义TCP | 3000 | 0.0.0.0/0 | 应用端口 |
| 允许 | HTTP(80) | 80 | 0.0.0.0/0 | HTTP |
| 允许 | HTTPS(443) | 443 | 0.0.0.0/0 | HTTPS |
| 允许 | SSH(22) | 22 | 你的本地IP | SSH管理 |

---

## 第三步：准备无影云电脑

### 3.1 更换系统为 Ubuntu

1. 登录阿里云控制台：https://wuying.console.aliyun.com
2. 进入 **"桌面管理"**
3. 找到你的云桌面，点击 **"更多"** → **"更换镜像"**
4. 选择：**Ubuntu 22.04 LTS 64位**
5. 点击 **"确定"**，等待重启（约 5 分钟）

### 3.2 连接云电脑

**方式一：使用无影客户端**
1. 下载无影客户端：https://www.aliyun.com/product/ecs/wuying
2. 登录后连接云桌面
3. 打开终端（Terminal）

**方式二：SSH 连接（推荐）**
```bash
ssh root@你的EIP地址
# 密码在无影控制台查看或重置
```

---

## 第四步：部署应用

在无影云电脑终端中执行：

```bash
# 1. 更新系统
sudo apt update && sudo apt upgrade -y

# 2. 安装基础依赖
sudo apt install -y git curl wget vim nginx

# 3. 安装 Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 验证安装
node -v  # 应显示 v20.x.x
npm -v   # 应显示 10.x.x

# 4. 安装 PM2
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
NEXTAUTH_SECRET="$(openssl rand -base64 32)"
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

---

## 第五步：配置 Nginx + HTTPS

### 5.1 配置 Nginx 反向代理

```bash
# 创建 Nginx 配置文件
sudo tee /etc/nginx/sites-available/iflytek.me << 'EOF'
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
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

# 启用配置
sudo ln -sf /etc/nginx/sites-available/iflytek.me /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# 测试配置
sudo nginx -t

# 重启 Nginx
sudo systemctl restart nginx
sudo systemctl enable nginx
```

### 5.2 申请 HTTPS 证书（Let's Encrypt）

```bash
# 安装 Certbot
sudo apt install -y certbot python3-certbot-nginx

# 申请证书
sudo certbot --nginx -d iflytek.me -d www.iflytek.me

# 按提示操作：
# 1. 输入邮箱
# 2. 同意协议
# 3. 选择是否接收邮件
# 4. 选择是否重定向 HTTP 到 HTTPS（推荐选择 2：Redirect）
```

### 5.3 验证 HTTPS

```bash
# 检查证书
sudo certbot certificates

# 测试自动续期
sudo certbot renew --dry-run
```

---

## 第六步：配置阿里云 DNS

### 6.1 添加 A 记录

1. 登录阿里云 DNS 控制台：https://dns.console.aliyun.com
2. 找到 `iflytek.me` 域名，点击 **"解析设置"**
3. 添加以下记录：

| 主机记录 | 记录类型 | 解析线路 | 记录值 | TTL |
|---------|---------|---------|--------|-----|
| @ | A | 默认 | 你的EIP地址 | 10分钟 |
| www | A | 默认 | 你的EIP地址 | 10分钟 |

**示例：**
- 主机记录：`@` → 对应 `iflytek.me`
- 主机记录：`www` → 对应 `www.iflytek.me`
- 记录值：`47.123.45.67`（你的EIP）

### 6.2 等待生效

DNS 生效时间：通常 **5-30 分钟**

**验证 DNS：**
```bash
# 在本地电脑执行
nslookup iflytek.me
# 应显示你的 EIP 地址
```

---

## 第七步：验证部署

### 7.1 检查所有服务

```bash
# 检查应用
echo "=== PM2 状态 ==="
pm2 status

# 检查 Nginx
echo "=== Nginx 状态 ==="
sudo systemctl status nginx

# 检查证书
echo "=== HTTPS 证书 ==="
sudo certbot certificates
```

### 7.2 测试访问

打开浏览器，访问：
- http://iflytek.me（应自动跳转到 HTTPS）
- https://iflytek.me
- https://www.iflytek.me

**应该能看到网站首页，且显示 🔒 安全锁！**

---

## 后续维护

### 查看日志
```bash
# 应用日志
pm2 logs iflytek-me

# Nginx 日志
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### 重启服务
```bash
# 重启应用
pm2 restart iflytek-me

# 重启 Nginx
sudo systemctl restart nginx
```

### 更新代码
```bash
cd /opt/app/iflytek-me
git pull
npm ci
npm run build
pm2 restart iflytek-me
```

### 证书续期
Let's Encrypt 证书有效期 90 天，Certbot 会自动续期。

**手动续期：**
```bash
sudo certbot renew
```

---

## 费用明细

| 项目 | 费用 | 说明 |
|-----|------|------|
| 弹性公网IP | 23元/月 | 按固定带宽 1Mbps |
| 或按流量 | ~0.8元/GB | 流量少更划算 |
| 无影云电脑 | 原有费用 | 不计入新增 |
| HTTPS 证书 | 免费 | Let's Encrypt |
| **总计** | **约 23元/月** | 最低成本方案 |

---

## 常见问题

### Q1: 无法访问 http://EIP:3000？
```bash
# 检查安全组是否开放 3000 端口
# 检查应用是否运行
curl http://localhost:3000
pm2 status
```

### Q2: 无法访问 https://iflytek.me？
```bash
# 检查 DNS 是否生效
nslookup iflytek.me

# 检查 Nginx 配置
sudo nginx -t
sudo systemctl status nginx

# 检查证书
sudo certbot certificates
```

### Q3: 证书申请失败？
```bash
# 确保域名已解析到 EIP
# 确保 80 端口可访问
# 重新申请
sudo certbot --nginx -d iflytek.me --force-renewal
```

### Q4: 如何更换 EIP？
1. 解绑旧 EIP
2. 购买新 EIP 并绑定
3. 更新阿里云 DNS 记录
4. 重新申请 HTTPS 证书

---

## 完成！🎉

你的网站现在应该可以通过以下地址访问：

- **HTTP**: http://iflytek.me（自动跳转 HTTPS）
- **HTTPS**: https://iflytek.me ✅
- **WWW**: https://www.iflytek.me

**管理员后台：** https://iflytek.me/admin
- 邮箱：admin@iflytek.me
- 密码：***（你在 .env.production 中设置的）

---

## 与 Cloudflare 方案对比

| 对比项 | 方案 B（EIP） | 方案 A（Cloudflare） |
|-------|-------------|-------------------|
| 域名转移 | ❌ 不需要 | ✅ 需要 |
| 月成本 | 23元 | 免费 |
| HTTPS | 需手动配置 | 自动 |
| CDN 加速 | ❌ 无 | ✅ 全球加速 |
| 隐藏 IP | ❌ 暴露 | ✅ 隐藏 |
| 复杂度 | 中 | 中 |
| 阿里云生态 | ✅ 统一 | ❌ 分散 |

**结论**：
- 追求 **免费+全球加速** → 选 Cloudflare
- 追求 **阿里云生态+简单管理** → 选 EIP
