# Yooka Builder Web App

基于 Next.js + Tailwind CSS 的个人首页构建器。部署于 Cloudflare Workers，使用 D1 和 KV 存储数据。

## 功能

- **网格布局**:
  - 12x8 精细网格系统。
  - 支持拖拽 (Drag & Drop) 调整位置，自动吸附。
  - 支持全向缩放 (Resizing)，调整区块大小。
  - 智能碰撞检测，防止布局重叠。
- **可视化编辑**:
  - 侧边栏属性面板：编辑文本、图片链接、应用名称。
  - 实时预览编辑效果。
- **用户系统**:
  - 集成 Better-Auth (GitHub OAuth, Email)。
  - 用户资料管理：设置个性化用户名 (Profile/Username)。
- **发布与展示**:
  - 一键发布到高性能 KV 存储。
  - 公开展示页：`/u/[username]`，支持他人访问。
- **数据存储**:
  - D1: 存储草稿、历史版本和用户数据。
  - KV: 存储已发布版本，优化读取速度。

## 开发指南

### 前置要求

- Node.js & pnpm
- Wrangler CLI (Cloudflare)

### 环境变量

复制 `.dev.vars.example` 到 `.dev.vars` 并填入密钥：

```bash
cp .dev.vars.example .dev.vars
```

- `GITHUB_CLIENT_ID` & `GITHUB_CLIENT_SECRET`: 从 GitHub Developer Settings 获取 OAuth App 凭证。
- `BETTER_AUTH_SECRET`: 任意随机字符串，用于加密 session。

### 数据库初始化

本地开发需要初始化 D1 数据库（使用 Drizzle 生成的标准迁移）：

```bash
cd apps/web
npx wrangler d1 execute yooka-db --local --file=migrations/0000_init_full.sql
```

### 启动开发服务器

```bash
pnpm dev
```

### 运行测试

```bash
pnpm test
```

## 部署

```bash
pnpm run deploy
```

注意：首次部署前需要在 Cloudflare Dashboard 创建对应的 D1 数据库和 KV Namespace，并更新 `wrangler.jsonc` 中的 ID。
