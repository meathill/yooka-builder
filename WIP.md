# 开发计划

## 状态: 编辑器增强 (DnD & Resizing)

用户认证已集成完成。目前正在开发网格编辑器的核心交互功能：拖拽 (DnD) 和缩放 (Resizing)。

## 待办事项 (Todo List)

- [x] **编辑器增强**
    - [x] 安装 `dnd-kit`
    - [x] 实现 Grid Item 的拖拽布局 (DnD)
        - [x] 封装 Draggable Grid Item
        - [x] 实现 Droppable Grid Canvas
        - [x] 处理拖拽坐标计算与吸附 (Snap to Grid)
    - [x] 实现 Grid Item 的缩放 (Resizing)
        - [x] 添加 Resize Handle
        - [x] 实现 Resizing 交互逻辑 (Pointer Events)
        - [x] 处理缩放冲突检测
    - [ ] **添加属性编辑面板**
        - [ ] 创建 `PropertyPanel` 组件
        - [ ] 实现点击选中 (Selection State)
        - [ ] 实现属性修改与实时预览
- [ ] **用户体验优化**
    - [ ] 拖拽时的视觉反馈 (Placeholder/Shadow)
    - [ ] 碰撞检测与避免重叠 (可选: 自动重排)
