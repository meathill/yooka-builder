# Yooka Builder

Yooka Builder 是一个基于 Next.js、Tailwind CSS 和 Cloudflare 生态（D1, KV, R2）构建的个人主页生成器。用户可以通过拖拽网格布局，自由组合文本、图片、视频、社交媒体卡片等组件，打造独一无二的个人展示页。

## 核心特性

- **自由网格布局**: 基于 12x8 的高精度网格，支持组件自由拖拽 (DnD) 和全向缩放 (Resizing)。
- **多媒体支持**: 内置文本、图片、视频（支持上传及 YouTube/Vimeo 嵌入）、社交媒体卡片、App 图标等组件。
- **所见即所得**: 强大的编辑器，支持实时预览、属性编辑、深色模式。
- **高性能发布**:
  - **D1 数据库**: 存储用户数据和草稿。
  - **KV 存储**: 用于发布页面的高性能读取，确保极快的访问速度。
  - **R2 存储**: 支持用户上传图片和视频资源。
- **用户系统**: 集成 Better-Auth，支持 GitHub 快捷登录和邮箱注册。
- **个性化**: 支持自定义用户名和公开主页链接 (`/u/[username]`)。

## 技术栈

- **框架**: [Next.js](https://nextjs.org/) (App Router)
- **样式**: [Tailwind CSS](https://tailwindcss.com/)
- **数据库**: [Cloudflare D1](https://developers.cloudflare.com/d1/) (SQLite)
- **缓存/键值对**: [Cloudflare KV](https://developers.cloudflare.com/kv/)
- **对象存储**: [Cloudflare R2](https://developers.cloudflare.com/r2/)
- **部署**: [OpenNext](https://opennext.js.org/) on Cloudflare Workers
- **认证**: [Better-Auth](https://better-auth.com/)
- **交互**: [dnd-kit](https://dndkit.com/)

## 项目结构

本项目采用 Monorepo 结构（基于 pnpm workspace）：

```
.
├── apps/
│   └── web/            # 主应用 (Next.js)
│       ├── migrations/ # 数据库迁移文件
│       ├── src/
│       │   ├── app/    # Next.js 路由
│       │   ├── components/ # React 组件
│       │   ├── db/     # Drizzle Schema 定义
│       │   └── lib/    # 工具库 (Auth 等)
│       └── ...
├── .github/            # GitHub 配置
└── ...
```

## 快速开始

### 前置要求

- Node.js >= 20
- pnpm
- Wrangler CLI (Cloudflare)

### 1. 安装依赖

```bash
pnpm install
```

### 2. 配置环境变量

复制 `apps/web/.dev.vars.example` 到 `apps/web/.dev.vars` 并填入必要的密钥：

```bash
cp apps/web/.dev.vars.example apps/web/.dev.vars
```

你需要获取：
- **GitHub OAuth Credentials**: 在 GitHub Developer Settings 中创建应用。
- **BETTER_AUTH_SECRET**: 生成一个随机字符串。
- **R2 Bucket URL**: 你的 R2 存储桶公开访问域名。

### 3. 初始化数据库

在 `apps/web` 目录下执行：

```bash
cd apps/web
# 应用数据库迁移
npx wrangler d1 execute yooka-db --local --file=migrations/0000_init_full.sql
npx wrangler d1 execute yooka-db --local --file=migrations/0001_parched_victor_mancha.sql
```

### 4. 启动开发服务器

```bash
pnpm dev
```

访问 `http://localhost:3000` (或 3030)。

## 测试

本项目使用 Vitest 进行单元测试。

```bash
pnpm test
```

## 部署

项目配置为部署到 Cloudflare Workers。请确保你已登录 Cloudflare 并配置好 `wrangler.jsonc` 中的资源 ID（D1, KV, R2）。

```bash
pnpm run deploy
```

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT
