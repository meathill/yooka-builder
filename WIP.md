# 开发计划

## 当前状态: 用户资料页重构完成

已完成用户资料页面的全面重构，包括新的 ProfileHeader 设计、社交卡片组件、所见即所得编辑体验。

## 最近完成

- [x] **用户资料页重构**
  - [x] 数据库添加 `bio` 和 `tags` 字段
  - [x] 创建 `ProfileHeader` 组件（头像、标签、简介）
  - [x] 创建 `SocialCard` 组件（支持小红书、B站、YouTube 等平台）
  - [x] 头像上传功能（上传到 R2）
  - [x] 编辑器与公开页使用统一的 `GridCanvas` 组件

- [x] **UI 优化**
  - [x] 替换原生 `alert()` 为 radix-ui AlertDialog
  - [x] 发布后按钮从 "Publish" 变为 "Save"

- [x] **代码重构**
  - [x] 编辑器页面从 448 行减少到 268 行
  - [x] 提取 `EditorHeader` 和 `FloatingPropertyPanel` 组件
  - [x] 提取模拟数据到 `lib/mock-data.ts`

## 待办事项

- [ ] **移动端适配**
  - [ ] `PropertyPanel`: 在移动端改为底部抽屉
  - [ ] 调整 `dnd-kit` 传感器配置，优化触摸交互
  - [ ] 确保 `GridCanvas` 在小屏幕上保持最小可用尺寸