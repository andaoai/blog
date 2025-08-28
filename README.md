# My VuePress Blog

这是一个使用 VuePress 2 构建的博客项目，支持部署到 GitHub Pages。

## 🚀 快速开始

### 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

### 访问地址

- 开发环境: http://localhost:8080
- 生产环境: https://your-username.github.io/blog/

## 📁 项目结构

```
blog/
├── docs/                    # 文档源文件
│   ├── .vuepress/          # VuePress 配置
│   │   ├── config.js       # 主配置文件
│   │   ├── components/     # 自定义组件
│   │   └── styles/         # 自定义样式
│   ├── ai/                 # AI 相关文章
│   ├── life/               # 生活随笔
│   ├── config/             # 配置页面
│   └── index.md            # 首页
├── .github/workflows/      # GitHub Actions 配置
├── package.json            # 项目配置
└── README.md               # 项目说明
```

## 🛠️ 技术栈

- **VuePress 2**: 静态站点生成器
- **Vue 3**: 前端框架
- **Vite**: 构建工具
- **GitHub Pages**: 部署平台

## 📝 写作指南

1. 在 `docs/` 目录下创建 Markdown 文件
2. 使用 Front Matter 配置页面元信息
3. 支持 Vue 组件和自定义样式
4. 自动生成导航和侧边栏

## 🚀 部署

项目配置了 GitLab CI/CD，推送到 `main` 分支后会自动部署到 GitLab Pages。

### 手动部署

```bash
# 构建
npm run build

# 部署文件位于 docs/.vuepress/dist/
```

## 📄 许可证

MIT License
