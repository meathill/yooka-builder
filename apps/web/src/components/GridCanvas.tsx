'use client';

import React, { useState, useRef } from 'react';
import { GridLayoutData, GridItem } from '../types/grid';
import {
  DndContext,
  DragEndEvent,
  useSensor,
  useSensors,
  PointerSensor,
  DragStartEvent,
  DragOverlay,
} from '@dnd-kit/core';
import { DraggableGridItem } from './DraggableGridItem';

interface GridCanvasProps {
  data: GridLayoutData;
  onUpdate?: (newData: GridLayoutData) => void;
  selectedId?: string | null;
  onSelect?: (id: string) => void;
  onAdd?: (x: number, y: number) => void;
  readOnly?: boolean;
}

const GridItemContent: React.FC<{ item: GridItem }> = ({ item }) => {
  return (
    <div className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-sm p-4 overflow-hidden relative h-full w-full select-none flex flex-col">
      {item.type === 'text' && <p className="text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap">{item.content}</p>}
      {item.type === 'image' && (
        <img
          src={item.content}
          alt="Grid Item"
          className="w-full h-full object-cover absolute inset-0 pointer-events-none"
        />
      )}
      {item.type === 'app' && (
        <div className="flex flex-col items-center justify-center h-full w-full">
          <div className="w-12 h-12 bg-blue-500 rounded-xl mb-2 flex items-center justify-center text-white">
            {/* Simple icon placeholder */}
            <svg
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5"
              />
            </svg>
          </div>
          <span className="text-xs font-bold text-center line-clamp-2">{item.content}</span>
        </div>
      )}
      {item.type === 'video' && (
        <div className="w-full h-full bg-black flex items-center justify-center absolute inset-0">
          {/* In editor, we show a preview/thumbnail to avoid iframe capturing mouse events during drag */}
          <div className="text-white flex flex-col items-center gap-2">
            <svg
              width="32"
              height="32"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-xs opacity-70 truncate max-w-[90%] px-2">{item.content}</span>
          </div>
        </div>
      )}
      {item.type === 'social' && (
        <div className="w-full h-full flex items-center justify-center bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
          <div className="text-center p-2">
            <svg
              width="32"
              height="32"
              className="mx-auto mb-2"
              fill="currentColor"
              viewBox="0 0 24 24">
              <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.942-2.178-1.524-3.591-1.524-2.719 0-4.92 2.201-4.92 4.917 0 .39.045.765.127 1.124C7.691 8.094 4.066 6.13 1.64 3.161c-.427.722-.666 1.561-.666 2.475 0 1.71.85 3.213 2.144 4.083-.79-.026-1.535-.242-2.188-.603v.062c0 2.385 1.704 4.374 3.946 4.828-.413.111-.849.171-1.296.171-.314 0-.615-.03-.916-.086.631 1.953 2.445 3.377 4.604 3.417-1.68 1.319-3.809 2.105-6.102 2.105-.39 0-.779-.023-1.17-.067 2.189 1.394 4.768 2.209 7.557 2.209 9.054 0 13.999-7.496 13.999-13.986 0-.209 0-.42-.015-.63.961-.689 1.8-1.56 2.46-2.548l-.047-.02z" />
            </svg>
            <span className="text-sm font-medium truncate block max-w-full">{item.content}</span>
          </div>
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
  onAdd,
  readOnly = false,
}) => {
  const [data, setData] = useState(initialData);
  const containerRef = useRef<HTMLDivElement>(null);
  const [rowHeight, setRowHeight] = useState(50);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [placeholder, setPlaceholder] = useState<GridItem | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Increased tolerance to distinguish scroll vs drag
      },
    }),
  );

  React.useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const { rows, cols, items } = data;

  // Calculate row height to make cells square
  React.useEffect(() => {
    const updateHeight = () => {
      if (containerRef.current) {
        const parentWidth = containerRef.current.parentElement?.offsetWidth || containerRef.current.offsetWidth;
        const gap = 16;

        // Minimum cell width to ensure usability on mobile
        const minCellWidth = 40;

        let cellWidth = (parentWidth - (cols - 1) * gap) / cols;

        if (cellWidth < minCellWidth) {
          cellWidth = minCellWidth;
          // We will set the width of the container explicitly to trigger overflow on parent
          containerRef.current.style.width = `${cols * cellWidth + (cols - 1) * gap}px`;
        } else {
          containerRef.current.style.width = '100%';
        }

        setRowHeight(cellWidth);
      }
    };

    updateHeight();
    const observer = new ResizeObserver(updateHeight);
    if (containerRef.current?.parentElement) {
      observer.observe(containerRef.current.parentElement);
    }

    return () => observer.disconnect();
  }, [cols]);

  const checkCollision = (id: string, x: number, y: number, w: number, h: number, allItems: GridItem[]) => {
    for (const item of allItems) {
      if (item.id === id) continue;
      if (x < item.x + item.w && x + w > item.x && y < item.y + item.h && y + h > item.y) {
        return true;
      }
    }
    return false;
  };

  // --- Resize Logic ---

  const handleResizeStart = (id: string) => {
    setActiveId(id);
    const item = items.find((i) => i.id === id);
    if (item) setPlaceholder({ ...item });
  };

  const handleResizeMove = (id: string, newW: number, newH: number, newX: number, newY: number) => {
    const item = items.find((i) => i.id === id);
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

    const item = items.find((i) => i.id === id);
    if (!item) return;

    // Re-validate boundary/collision
    if (x < 1) {
      w = w - (1 - x);
      x = 1;
    }
    if (y < 1) {
      h = h - (1 - y);
      y = 1;
    }
    if (x + w - 1 > cols) w = cols - x + 1;
    if (y + h - 1 > rows) h = rows - y + 1;

    if (w < 1) w = 1;
    if (h < 1) h = 1;

    if (checkCollision(id, x, y, w, h, items)) return;

    if (w === item.w && h === item.h && x === item.x && y === item.y) return;

    const newItems = items.map((i) => (i.id === id ? { ...i, w, h, x, y } : i));
    const newData = { ...data, items: newItems };
    setData(newData);
    if (onUpdate) onUpdate(newData);
  };

  // --- Drag Logic ---

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
    const item = items.find((i) => i.id === event.active.id);
    if (item) setPlaceholder({ ...item });
  };

  const handleDragMove = (event: DragEndEvent) => {
    // DragMoveEvent has same shape
    const { active, delta } = event;
    const activeItem = items.find((i) => i.id === active.id);
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
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    setPlaceholder(null);

    const { active } = event;
    const activeItem = items.find((i) => i.id === active.id);
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
    gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
    gridTemplateRows: `repeat(${rows}, ${rowHeight}px)`,
    minHeight: rows * (rowHeight || 10) + (rows - 1) * 16, // Fallback calc
  };

  // Helper to check if a specific cell coordinate is occupied
  const isCellOccupied = (x: number, y: number) => {
    return items.some((item) => x >= item.x && x < item.x + item.w && y >= item.y && y < item.y + item.h);
  };

  // Generate background grid cells
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
        className={`border bg-red-500 border-zinc-200 hover:border-sky-200 dark:border-zinc-700/50 dark:hover:borrder-sky-700/50 rounded-lg border-dashed h-full w-full transition-colors ${
          !readOnly && !occupied
            ? 'bg-white/30 dark:bg-zinc-800/30 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20 cursor-pointer'
            : 'bg-transparent'
        }`}
      />
    );
  });

  return (
    <div className="w-full h-full p-4 bg-zinc-50 dark:bg-zinc-900 overflow-auto flex flex-col">
      <DndContext
        sensors={sensors}
        onDragStart={readOnly ? undefined : handleDragStart}
        onDragMove={readOnly ? undefined : handleDragMove}
        onDragEnd={readOnly ? undefined : handleDragEnd}>
        <div className="w-full max-w-4xl mx-auto relative rounded-xl p-4 box-border border-2 border-transparent flex-1 min-h-0">
          {/* Background Grid Layer */}
          <div
            className="absolute inset-4 z-0 grid gap-4 h-full"
            style={gridStyle}>
            {backgroundCells}
          </div>

          {/* Foreground Content Layer */}
          <div
            className="pointer-events-none relative z-10 grid gap-4 h-full"
            ref={containerRef}
            style={gridStyle}>
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

            {items.map((item) =>
              readOnly ? (
                <div
                  key={item.id}
                  style={{
                    gridColumnStart: item.x,
                    gridColumnEnd: item.x + item.w,
                    gridRowStart: item.y,
                    gridRowEnd: item.y + item.h,
                  }}>
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
              ),
            )}
          </div>
          {/* Drag Overlay for smooth following */}
          <DragOverlay>
            {activeId ? (
              <div className="w-full h-full opacity-80 scale-105 cursor-grabbing">
                <GridItemContent item={items.find((i) => i.id === activeId)!} />
              </div>
            ) : null}
          </DragOverlay>
        </div>
      </DndContext>
    </div>
  );
};
