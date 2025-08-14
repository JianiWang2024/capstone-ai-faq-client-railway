# Azure Static Web Apps 部署指南

## 概述
本指南将帮助你将FAQ前端应用部署到Azure Static Web Apps，并连接到已部署的后端服务。

## 前置条件
- Azure账号和订阅
- 已部署的后端服务：`faq-ai-system-backend.azurewebsites.net`
- 本地开发环境（Node.js 18+）

## 部署步骤

### 1. 构建生产版本
```bash
cd faq-frontend
npm install
npm run build
```

### 2. 在Azure门户创建Static Web App
1. 登录 [Azure门户](https://portal.azure.com)
2. 搜索并选择 "Static Web Apps"
3. 点击 "创建"
4. 填写基本信息：
   - **订阅**: 选择你的订阅
   - **资源组**: 选择或创建资源组
   - **名称**: 例如 `faq-frontend-app`
   - **区域**: 选择离你最近的区域
   - **构建详情**: 选择 "其他"
   - **应用位置**: `/`
   - **API位置**: 留空
   - **输出位置**: `build`

### 3. 配置环境变量
在Azure Static Web App的配置中添加以下环境变量：
```
REACT_APP_API_URL=https://faq-ai-system-backend.azurewebsites.net/api
REACT_APP_BACKEND_URL=https://faq-ai-system-backend.azurewebsites.net
REACT_APP_ENV=production
```

### 4. 配置自定义域名（可选）
1. 在Static Web App中，选择 "自定义域名"
2. 添加你的域名
3. 配置DNS记录

### 5. 部署代码
选择以下任一方式部署：

#### 方式1: GitHub Actions（推荐）
1. 将代码推送到GitHub
2. 在Azure Static Web App中配置GitHub源
3. 自动部署

#### 方式2: 手动部署
1. 使用Azure CLI：
```bash
az staticwebapp create \
  --name faq-frontend-app \
  --resource-group your-resource-group \
  --source https://github.com/your-username/your-repo \
  --location eastus \
  --branch main \
  --app-location "/" \
  --output-location "build"
```

#### 方式3: 使用Azure Static Web Apps CLI
```bash
npm install -g @azure/static-web-apps-cli
swa deploy ./build
```

## 配置说明

### staticwebapp.config.json
- **API重定向**: 所有`/api/*`请求会重定向到后端
- **SPA路由**: 支持React Router的单页应用路由
- **安全头**: 包含CORS和安全相关的HTTP头

### 环境检测
应用会自动检测运行环境：
- 开发环境：使用本地后端 `http://127.0.0.1:5000`
- 生产环境：使用Azure后端 `https://faq-ai-system-backend.azurewebsites.net`

## 验证部署

### 1. 检查应用状态
- 在Azure门户中查看Static Web App状态
- 确认所有环境变量已设置

### 2. 测试功能
- 访问前端应用
- 测试登录功能
- 测试FAQ查询功能
- 检查控制台是否有错误

### 3. 检查网络请求
- 打开浏览器开发者工具
- 确认API请求指向正确的后端URL
- 检查CORS是否正常工作

## 故障排除

### 常见问题

#### 1. API请求失败
- 检查后端URL是否正确
- 确认CORS配置
- 检查网络连接

#### 2. 路由问题
- 确认`staticwebapp.config.json`配置正确
- 检查`navigationFallback`设置

#### 3. 环境变量未生效
- 重新部署应用
- 检查环境变量名称是否正确
- 确认变量值格式正确

### 调试技巧
1. 查看浏览器控制台日志
2. 检查网络请求状态
3. 使用Azure门户的日志功能
4. 临时启用详细日志记录

## 性能优化

### 1. 启用CDN
- 在Azure Static Web App中启用CDN
- 配置缓存策略

### 2. 压缩和优化
- 启用Gzip压缩
- 优化图片和静态资源

### 3. 监控
- 设置Azure Application Insights
- 监控应用性能指标

## 安全考虑

### 1. HTTPS
- 确保所有请求使用HTTPS
- 配置HSTS头

### 2. CORS
- 限制允许的域名
- 配置适当的请求方法

### 3. 内容安全策略
- 配置CSP头
- 限制资源加载来源

## 维护和更新

### 1. 定期更新
- 更新依赖包
- 应用安全补丁

### 2. 备份
- 备份配置文件
- 保存环境变量

### 3. 监控
- 设置告警
- 监控应用健康状态

## 联系支持
如果遇到问题，请：
1. 检查Azure文档
2. 查看应用日志
3. 联系Azure支持团队

---
*最后更新: 2024年*
