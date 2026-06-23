# 部署方案对比：为什么用 Cloudflare

## 问题：为什么要把域名转移到 Cloudflare？

**核心原因**：Cloudflare Tunnel 需要 Cloudflare 管理域名才能自动配置 DNS

但这不是唯一选择！下面列出所有可行方案：

---

## 方案对比

| 方案 | 是否需要转移域名 | 成本 | 复杂度 | 特点 |
|-----|----------------|------|--------|------|
| **A. Cloudflare Tunnel** | ✅ 需要 | 免费 | 中 | 自动 HTTPS，全球加速 |
| **B. 阿里云 EIP** | ❌ 不需要 | 23元/月 | 低 | 简单直接，阿里云生态 |
| **C. 阿里云 SLB + ECS** | ❌ 不需要 | 100元/月起 | 中 | 专业稳定，企业级 |
| **D. 其他内网穿透** | ❌ 不需要 | 免费/付费 | 中 | 花生壳、ngrok 等 |

---

## 方案 A：Cloudflare Tunnel（推荐，但需转移域名）

### 为什么要转移域名？

```
Cloudflare Tunnel 工作原理：

用户访问 https://iflytek.me
        ↓
    Cloudflare CDN（全球加速）
        ↓
    Cloudflare Tunnel（安全隧道）
        ↓
    你的无影云电脑（localhost:3000）
```

**必须转移的原因**：
1. Tunnel 需要 Cloudflare 控制 DNS 解析
2. 自动配置 `iflytek.me` → Tunnel 的映射
3. 自动提供 HTTPS 证书
4. 全球 CDN 加速

### 转移域名的影响

| 方面 | 变化 |
|-----|------|
| 域名所有权 | ❌ 不变，还是你的 |
| DNS 管理 | ✅ 转移到 Cloudflare（功能更强）
| 阿里云解析 | ❌ 不再使用 |
| 其他阿里云服务 | ❌ 不影响（如邮箱、OSS 等）|

### 如果不想转移域名？

**可以用 CNAME 方式**（部分功能受限）：
1. 在 Cloudflare 注册一个子域名，如 `tunnel.yourdomain.com`
2. 在阿里云添加 CNAME 记录指向它
3. 但 HTTPS 证书需要手动配置

---

## 方案 B：阿里云 EIP（推荐，无需转移域名）

### 方案

1. 购买阿里云弹性公网IP（EIP）
2. 绑定到无影云电脑
3. 在阿里云 DNS 添加 A 记录指向 EIP

### 优点

- ✅ **无需转移域名**，保持阿里云生态
- ✅ 简单直接，固定 IP
- ✅ 阿里云内网访问速度快

### 缺点

- ❌ 需要付费（约 23 元/月）
- ❌ 暴露真实 IP
- ❌ 无全球 CDN 加速
- ❌ 需手动配置 HTTPS

### 部署步骤

```bash
# 1. 阿里云控制台购买 EIP 并绑定到无影云电脑
# 2. 安全组开放 3000 端口
# 3. 阿里云 DNS 添加 A 记录：
#    iflytek.me → 你的EIP地址

# 4. 在无影云电脑部署应用
curl -fsSL https://raw.githubusercontent.com/shuaiwang-snail/iflytek.me/main/deploy.sh | bash

# 5. 配置 Nginx 反向代理 + HTTPS（使用 Let's Encrypt）
sudo apt install nginx certbot python3-certbot-nginx -y

# 配置 Nginx
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
    }
}
EOF

sudo ln -s /etc/nginx/sites-available/iflytek.me /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# 6. 申请 HTTPS 证书
sudo certbot --nginx -d iflytek.me -d www.iflytek.me
```

---

## 方案 C：阿里云 SLB + ECS（企业级，无需转移域名）

### 方案

1. 购买阿里云 ECS（最低配 1核1G）
2. 购买 SLB（负载均衡）绑定 EIP
3. 在 SLB 上配置 HTTPS
4. ECS 部署应用

### 优点

- ✅ **无需转移域名**
- ✅ 专业稳定，可扩展
- ✅ SLB 提供 HTTPS 卸载
- ✅ 可添加多台 ECS 负载均衡

### 缺点

- ❌ 成本较高（ECS + SLB 约 150 元/月起）
- ❌ 配置较复杂

---

## 方案 D：其他内网穿透（无需转移域名）

### 花生壳（国产）

```bash
# 1. 注册花生壳账号 https://hsk.oray.com
# 2. 下载 Linux 客户端
wget https://dl.oray.com/hsk/linux/phddns_5.3.0_amd64.deb
sudo dpkg -i phddns_5.3.0_amd64.deb

# 3. 登录并配置
phddns status
# 按提示在网页端配置映射
```

**优点**：国产，无需转移域名，有免费版
**缺点**：免费版有限制，速度一般

### ngrok

```bash
# 1. 注册 https://ngrok.com
# 2. 安装
wget https://bin.equinox.io/c/bNyj1mQVY4c/ngrok-v3-stable-linux-amd64.tgz
tar xvzf ngrok-v3-stable-linux-amd64.tgz

# 3. 配置 authtoken
./ngrok config add-authtoken YOUR_TOKEN

# 4. 启动
./ngrok http 3000
```

**优点**：简单快速，无需转移域名
**缺点**：免费版域名随机，每次重启会变

---

## 推荐选择

### 如果追求免费 + 简单
→ **方案 A：Cloudflare Tunnel**
- 接受转移域名（实际无负面影响）
- 自动 HTTPS，全球加速

### 如果追求阿里云生态 + 不想转移域名
→ **方案 B：阿里云 EIP**
- 23 元/月，简单直接
- 保持阿里云统一管理

### 如果追求专业 + 长期运营
→ **方案 C：阿里云 SLB + ECS**
- 企业级架构
- 可扩展，高可用

---

## 我的建议

**推荐方案 A（Cloudflare Tunnel）的原因**：

1. **完全免费** - 0 成本
2. **自动 HTTPS** - 无需配置证书
3. **全球 CDN** - 访问速度快
4. **隐藏源站 IP** - 更安全
5. **转移域名无风险** - 所有权不变，只是 DNS 管理

**但如果你想保持阿里云生态，选方案 B（EIP）也很合适！**

---

## 你想用哪个方案？

| 你的偏好 | 推荐方案 |
|---------|---------|
| 免费优先，不介意转移域名 | A. Cloudflare Tunnel |
| 保持阿里云，低成本 | B. 阿里云 EIP |
| 专业稳定，长期运营 | C. SLB + ECS |
| 快速测试，临时使用 | D. ngrok/花生壳 |

告诉我你的选择，我立即给你详细步骤！