import React from 'react';

interface GridBackgroundLayerProps {
  rows: number;
  cols: number;
  rowHeight: number;
  items: any[];
  readOnly: boolean;
  onAdd?: (x: number, y: number) => void;
}

export const GridBackgroundLayer: React.FC<GridBackgroundLayerProps> = ({
  rows,
  cols,
  rowHeight,
  items,
  readOnly,
  onAdd,
}) => {
  const gridStyle: React.CSSProperties = {
    gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
    gridTemplateRows: `repeat(${rows}, ${rowHeight}px)`,
  };

  const isCellOccupied = (x: number, y: number) => {
    return items.some((item) => x >= item.x && x < item.x + item.w && y >= item.y && y < item.y + item.h);
  };

  const totalCells = rows * cols;
  const backgroundCells = Array.from({ length: totalCells }, (_, i) => {
    const x = (i % cols) + 1;
    const y = Math.floor(i / cols) + 1;
    const occupied = isCellOccupied(x, y);

    return (
      <div
        key={i}
        onClick={() => {
          if (!readOnly && !occupied && onAdd) {
            onAdd(x, y);
          }
        }}
        className={`border border-zinc-200 dark:border-zinc-700/50 rounded-lg border-dashed h-full w-full transition-colors ${
          !readOnly && !occupied
            ? 'bg-white/30 dark:bg-zinc-800/30 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20 cursor-pointer'
            : 'bg-transparent'
        }`}
      />
    );
  });

  return (
    <div
      className="absolute inset-4 z-0 grid gap-4"
      style={gridStyle}>
      {backgroundCells}
    </div>
  );
};
