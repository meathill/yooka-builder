// 网格布局配置常量

export const GRID_CONFIG = {
    // 默认网格尺寸
    DEFAULT_ROWS: 12,
    DEFAULT_COLS: 12,

    // 网格间距 (px)
    GAP: 16,

    // 组件最小尺寸
    MIN_ITEM_WIDTH: 1,
    MIN_ITEM_HEIGHT: 1,

    // 移动端最小单元格宽度 (px)
    MIN_CELL_WIDTH: 40,
} as const;

// 导出类型
export type GridConfig = typeof GRID_CONFIG;
