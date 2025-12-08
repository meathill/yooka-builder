# 开发计划 - 初始化项目

## 目标
构建基于矩阵的个人首页产品 `yooka-builder`。采用 Monorepo 结构，Next.js + Tailwind CSS 技术栈，部署于 Cloudflare Workers，使用 D1 和 KV 存储。

## 待办事项 (Todo List)

- [ ] **项目结构配置**
    - [ ] 更新 `pnpm-workspace.yaml` 支持 `apps/*` 目录
    - [ ] 创建 `apps` 目录
- [ ] **Next.js 应用初始化**
    - [ ] 在 `apps/web` 中初始化 Next.js 项目 (TypeScript, Tailwind CSS, ESLint)
    - [ ] 清理默认页面，建立基础布局
- [ ] **基础测试**
    - [ ] 确保 Next.js 应用可以成功构建和运行测试
