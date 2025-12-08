import React, { useState, useRef } from 'react';
import { GridLayoutData, GridItem } from '../types/grid';
import { DndContext, DragEndEvent, useSensor, useSensors, PointerSensor, DragStartEvent, DragOverlay } from '@dnd-kit/core';
import { DraggableGridItem } from './DraggableGridItem';

interface GridCanvasProps {
  data: GridLayoutData;
  onUpdate?: (newData: GridLayoutData) => void;
  selectedId?: string | null;
  onSelect?: (id: string) => void;
  readOnly?: boolean;
}

const GridItemContent: React.FC<{ item: GridItem }> = ({ item }) => {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-4 overflow-hidden relative h-full w-full select-none">
      {item.type === 'text' && (
        <p className="text-gray-800 dark:text-gray-200">{item.content}</p>
      )}
      {item.type === 'image' && (
        <img
          src={item.content}
          alt="Grid Item"
          className="w-full h-full object-cover absolute inset-0 pointer-events-none"
        />
      )}
      {item.type === 'app' && (
        <div className="flex flex-col items-center justify-center h-full">
          <div className="w-12 h-12 bg-blue-500 rounded-xl mb-2"></div>
          <span className="text-xs font-bold">{item.content}</span>
        </div>
      )}
      <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {/* Controls placeholder */}
      </div>
    </div>
  );
};

export const GridCanvas: React.FC<GridCanvasProps> = ({ 
    data: initialData, 
    onUpdate, 
    selectedId, 
    onSelect, 
    readOnly = false 
}) => {
  const [data, setData] = useState(initialData);
  const containerRef = useRef<HTMLDivElement>(null);
  const [rowHeight, setRowHeight] = useState(50); 
  const [activeId, setActiveId] = useState<string | null>(null);
  const [placeholder, setPlaceholder] = useState<GridItem | null>(null);
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, 
      },
    })
  );

  React.useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const { rows, cols, items } = data;

  React.useEffect(() => {
      const updateHeight = () => {
          if (containerRef.current) {
              const width = containerRef.current.offsetWidth;
              const gap = 16; 
              const cellWidth = (width - (cols - 1) * gap) / cols;
              setRowHeight(cellWidth);
          }
      };

      updateHeight();
      const observer = new ResizeObserver(updateHeight);
      if (containerRef.current) {
          observer.observe(containerRef.current);
      }

      return () => observer.disconnect();
  }, [cols]);

  const checkCollision = (id: string, x: number, y: number, w: number, h: number, allItems: GridItem[]) => {
      for (const item of allItems) {
          if (item.id === id) continue;
          if (
              x < item.x + item.w &&
              x + w > item.x &&
              y < item.y + item.h &&
              y + h > item.y
          ) {
              return true;
          }
      }
      return false;
  };

  // --- Resize Logic ---

  const handleResizeStart = (id: string) => {
      setActiveId(id);
      const item = items.find(i => i.id === id);
      if (item) setPlaceholder({ ...item });
  };

  const handleResizeMove = (id: string, newW: number, newH: number, newX: number, newY: number) => {
      const item = items.find(i => i.id === id);
      if (!item) return;

      // Boundary checks
      // Left/Top boundary
      if (newX < 1) {
          newW = newW - (1 - newX);
          newX = 1;
      }
      if (newY < 1) {
           newH = newH - (1 - newY);
           newY = 1;
      }

      // Right/Bottom boundary
      if (newX + newW - 1 > cols) newW = cols - newX + 1;
      if (newY + newH - 1 > rows) newH = rows - newY + 1;

      // Min size check again just in case
      if (newW < 1) newW = 1;
      if (newH < 1) newH = 1;

      // Collision Check
      if (checkCollision(id, newX, newY, newW, newH, items)) {
         return; 
      }

      setPlaceholder({ ...item, x: newX, y: newY, w: newW, h: newH });
  };

  const handleResizeEnd = (id: string, w: number, h: number, x: number, y: number) => {
      setActiveId(null);
      setPlaceholder(null);
      
      const item = items.find(i => i.id === id);
      if (!item) return;

      // Re-validate boundary/collision
      if (x < 1) { w = w - (1 - x); x = 1; }
      if (y < 1) { h = h - (1 - y); y = 1; }
      if (x + w - 1 > cols) w = cols - x + 1;
      if (y + h - 1 > rows) h = rows - y + 1;
      
      if (w < 1) w = 1;
      if (h < 1) h = 1;

      if (checkCollision(id, x, y, w, h, items)) return;

      if (w === item.w && h === item.h && x === item.x && y === item.y) return;

      const newItems = items.map(i => i.id === id ? { ...i, w, h, x, y } : i);
      const newData = { ...data, items: newItems };
      setData(newData);
      if (onUpdate) onUpdate(newData);
  };

  // --- Drag Logic ---

  const handleDragStart = (event: DragStartEvent) => {
      setActiveId(event.active.id as string);
      const item = items.find(i => i.id === event.active.id);
      if (item) setPlaceholder({ ...item });
  }

  const handleDragMove = (event: DragEndEvent) => { // DragMoveEvent has same shape
      const { active, delta } = event;
      const activeItem = items.find(i => i.id === active.id);
      if (!activeItem) return;

      const gap = 16;
      const effectiveStep = rowHeight + gap; // Assuming square cells

      const dX = Math.round(delta.x / effectiveStep);
      const dY = Math.round(delta.y / effectiveStep);

      let newX = activeItem.x + dX;
      let newY = activeItem.y + dY;

      // Boundary checks
      newX = Math.max(1, Math.min(newX, cols - activeItem.w + 1));
      newY = Math.max(1, Math.min(newY, rows - activeItem.h + 1));

      if (newX === placeholder?.x && newY === placeholder?.y) return;

      // Collision Check
      if (!checkCollision(activeItem.id, newX, newY, activeItem.w, activeItem.h, items)) {
          setPlaceholder({ ...activeItem, x: newX, y: newY });
      }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    setPlaceholder(null);

    const { active } = event;
    const activeItem = items.find(i => i.id === active.id);
    // If we have a valid placeholder position (calculated in DragMove), commit it.
    // However, dnd-kit DragEnd gives us the final delta.
    // Since we updated placeholder in DragMove, we can just use the last placeholder state? 
    // React state might be async.
    // It's safer to re-calculate logic or use the placeholder if we are sure it matches.
    
    // Let's re-calculate to be safe and stateless-ish
    if (!containerRef.current || !activeItem) return;
    
    const gap = 16;
    const effectiveStep = rowHeight + gap;
    const dX = Math.round(event.delta.x / effectiveStep);
    const dY = Math.round(event.delta.y / effectiveStep);
    
    if (dX === 0 && dY === 0) return;

    let newX = activeItem.x + dX;
    let newY = activeItem.y + dY;
    
    newX = Math.max(1, Math.min(newX, cols - activeItem.w + 1));
    newY = Math.max(1, Math.min(newY, rows - activeItem.h + 1));

    if (checkCollision(activeItem.id, newX, newY, activeItem.w, activeItem.h, items)) return;

    const newItems = items.map((item) => {
      if (item.id === active.id) {
        return { ...item, x: newX, y: newY };
      }
      return item;
    });

    const newData = { ...data, items: newItems };
    setData(newData);
    if (onUpdate) onUpdate(newData);
  };

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
    gridTemplateRows: `repeat(${rows}, ${rowHeight}px)`,
    gap: '1rem',
  };

  const totalCells = rows * cols;
  const backgroundCells = Array.from({ length: totalCells }, (_, i) => (
      <div 
        key={i} 
        className="border border-gray-200 dark:border-gray-700/50 rounded-lg bg-white/30 dark:bg-gray-800/30 border-dashed"
      />
  ));

  return (
    <div className="w-full h-full p-4 bg-gray-50 dark:bg-gray-900 overflow-auto">
      <DndContext 
        sensors={sensors} 
        onDragStart={readOnly ? undefined : handleDragStart}
        onDragMove={readOnly ? undefined : handleDragMove}
        onDragEnd={readOnly ? undefined : handleDragEnd}
      >
        <div className="w-full max-w-4xl mx-auto relative rounded-xl p-4 box-border border-2 border-transparent">
            {/* Background Grid Layer */}
            <div style={{ ...gridStyle, position: 'absolute', inset: '1rem', zIndex: 0 }}>
                {backgroundCells}
            </div>

            {/* Foreground Content Layer */}
            <div 
                ref={containerRef}
                style={{ ...gridStyle, position: 'relative', zIndex: 10 }} 
            >
                {/* Placeholder */}
                {placeholder && (
                    <div
                        style={{
                            gridColumnStart: placeholder.x,
                            gridColumnEnd: placeholder.x + placeholder.w,
                            gridRowStart: placeholder.y,
                            gridRowEnd: placeholder.y + placeholder.h,
                        }}
                        className="bg-indigo-500/20 border-2 border-indigo-500 border-dashed rounded-lg z-0"
                    />
                )}

                {items.map((item) => (
                readOnly ? (
                    <div
                        key={item.id}
                        style={{
                            gridColumnStart: item.x,
                            gridColumnEnd: item.x + item.w,
                            gridRowStart: item.y,
                            gridRowEnd: item.y + item.h,
                        }}
                    >
                        <GridItemContent item={item} />
                    </div>
                ) : (
                    <DraggableGridItem 
                        key={item.id} 
                        item={item} 
                        gridCols={cols} 
                        gridRows={rows}
                        cellWidth={rowHeight}
                        rowHeight={rowHeight}
                        onResizeStart={handleResizeStart}
                        onResizeMove={handleResizeMove}
                        onResizeEnd={handleResizeEnd}
                        onSelect={onSelect}
                        isSelected={item.id === selectedId}
                        readOnly={readOnly}
                        hidden={item.id === activeId} // Hide original while active/dragging
                    >
                        <GridItemContent item={item} />
                    </DraggableGridItem>
                )
                ))}
            </div>
             {/* Drag Overlay for smooth following */}
             <DragOverlay>
                {activeId ? (
                    <div className="w-full h-full opacity-80 scale-105 cursor-grabbing">
                         <GridItemContent item={items.find(i => i.id === activeId)!} />
                    </div>
                ) : null}
             </DragOverlay>
        </div>
      </DndContext>
    </div>
  );
};

