# AI FAQ Client - Capstone Project 8.14

## 项目简介

这是一个基于人工智能的FAQ客户端系统，作为Capstone项目开发。系统包含前端React应用和后端Python Flask API，提供智能问答服务。

## 功能特性

- 🤖 AI驱动的智能问答系统
- 💬 实时聊天界面
- 🔍 关键词提取和分析
- 📊 数据可视化仪表板
- 👤 用户认证和权限管理
- 📱 响应式Web界面
- 🚀 Azure云部署支持

## 技术架构

### 后端 (faq-backend/)
- **框架**: Python Flask
- **AI服务**: OpenAI GPT集成
- **数据库**: PostgreSQL (支持SQLite迁移)
- **认证**: JWT Token
- **部署**: Azure App Service

### 前端 (faq-frontend/)
- **框架**: React.js
- **UI库**: 原生CSS + 组件化设计
- **状态管理**: React Hooks
- **部署**: Azure Static Web Apps

## 快速开始

### 后端设置
```bash
cd faq-backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

### 前端设置
```bash
cd faq-frontend
npm install
npm start
```

## 部署指南

详细的部署说明请参考：
- [Azure部署指南](AZURE_DEPLOYMENT_GUIDE.md)
- [前端部署说明](faq-frontend/AZURE_DEPLOYMENT.md)
- [PostgreSQL设置](faq-backend/POSTGRESQL_SETUP.md)

## 项目结构

```
AI-faq-client/
├── faq-backend/          # Python Flask后端
├── faq-frontend/         # React前端应用
├── docs/                 # 项目文档
├── scripts/              # 部署和启动脚本
└── README.md            # 项目说明
```

## 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 联系方式

如有问题或建议，请通过以下方式联系：
- 项目Issues: [GitHub Issues](https://github.com/yourusername/ai-faq-client/issues)
- 邮箱: your.email@example.com

---

**开发团队**: Capstone Project Team 8.14  
**最后更新**: 2024年12月
