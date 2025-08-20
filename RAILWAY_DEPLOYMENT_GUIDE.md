# Railway 部署指南

本指南将帮助你将 FAQ AI 系统部署到 Railway 平台。

## 前置要求

1. 注册 [Railway](https://railway.app/) 账户
2. 安装 Railway CLI（可选）
3. 准备 PostgreSQL 数据库（Railway 提供）

## 部署步骤

### 1. 准备项目

确保你的项目包含以下文件：
- `railway.json` - Railway 部署配置
- `Procfile` - 进程管理文件
- `faq-backend/requirements.txt` - Python 依赖

### 2. 在 Railway 上创建项目

1. 登录 Railway 控制台
2. 点击 "New Project"
3. 选择 "Deploy from GitHub repo"
4. 连接你的 GitHub 仓库

### 3. 配置环境变量

在 Railway 项目设置中添加以下环境变量：

#### 必需的环境变量：
```
DATABASE_URL=postgresql://username:password@host:port/database
OPENAI_API_KEY=your_openai_api_key_here
SECRET_KEY=your_secret_key_here
FLASK_ENV=production
FLASK_DEBUG=False
```

#### 可选的环境变量：
```
RAILWAY_DEPLOYMENT=True
RAILWAY_APP_SERVICE=True
DB_POOL_SIZE=5
DB_MAX_OVERFLOW=10
DB_POOL_TIMEOUT=30
AI_SIMILARITY_THRESHOLD=0.3
AI_MAX_TOKENS=500
AI_TEMPERATURE=0.7
```

### 4. 配置数据库

1. 在 Railway 项目中添加 PostgreSQL 服务
2. Railway 会自动设置 `DATABASE_URL` 环境变量
3. 数据库会自动连接到你的应用

### 5. 部署应用

1. Railway 会自动检测到你的 Python 应用
2. 构建过程会自动安装依赖
3. 应用会使用 `Procfile` 中的命令启动

### 6. 配置域名

1. 在 Railway 项目设置中配置自定义域名
2. 或者使用 Railway 提供的 `.up.railway.app` 域名

## 部署后配置

### 1. 更新前端配置

确保前端配置中的后端 URL 指向你的 Railway 应用：

```javascript
// 在 faq-frontend/src/config.js 中
production: {
  BACKEND_URL: 'https://your-app-name.up.railway.app',
  API_BASE: 'https://your-app-name.up.railway.app/api'
}
```

### 2. 部署前端

前端可以部署到：
- Vercel
- Netlify
- GitHub Pages
- 或其他静态托管服务

## 监控和维护

### 1. 健康检查

应用提供了健康检查端点：`/api/health`

### 2. 日志查看

在 Railway 控制台中查看应用日志

### 3. 性能监控

Railway 提供基本的性能监控和指标

## 故障排除

### 常见问题

1. **数据库连接失败**
   - 检查 `DATABASE_URL` 环境变量
   - 确保数据库服务正在运行

2. **应用启动失败**
   - 检查 `requirements.txt` 中的依赖
   - 查看 Railway 构建日志

3. **CORS 错误**
   - 确保前端域名在 CORS 配置中
   - 检查环境变量设置

### 获取帮助

- 查看 Railway 官方文档
- 检查应用日志
- 验证环境变量配置

## 成本优化

1. 使用 Railway 的免费套餐进行测试
2. 根据需求选择合适的付费计划
3. 监控资源使用情况

## 安全注意事项

1. 不要在代码中硬编码敏感信息
2. 使用强密码和安全的 SECRET_KEY
3. 定期更新依赖包
4. 启用 HTTPS（Railway 自动提供）
