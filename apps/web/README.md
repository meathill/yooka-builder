# Yooka Builder Web App

基于 Next.js + Tailwind CSS 的个人首页构建器。部署于 Cloudflare Workers，使用 D1 和 KV 存储数据。

## 功能

- **网格布局**: 支持自定义 grid items (x, y, w, h)。
- **多类型支持**: 目前支持 Text, Image, App 图标。
- **数据存储**:
  - D1: 存储用户的草稿和历史版本。
  - KV: 存储发布的版本，提供高性能访问。
- **用户认证**: 集成 Better-Auth (GitHub, Email)。
- **Server Actions**: 安全的后端逻辑调用。

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

本地开发需要初始化 D1 数据库：

```bash
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
