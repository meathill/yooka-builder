'use client';

import React, { useEffect, useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { GridItem } from '../types/grid';

interface DraggableGridItemProps {
  item: GridItem;
  children: React.ReactNode;
  gridCols: number;
  gridRows: number;
  cellWidth: number;
  rowHeight: number;
  onResizeStart: (id: string) => void;
  onResizeMove: (id: string, w: number, h: number, x: number, y: number) => void;
  onResizeEnd: (id: string, w: number, h: number, x: number, y: number) => void;
  onSelect?: (id: string) => void;
  isSelected?: boolean;
  readOnly?: boolean;
  hidden?: boolean;
}

export const DraggableGridItem: React.FC<DraggableGridItemProps> = ({
  item,
  children,
  cellWidth,
  rowHeight,
  onResizeStart,
  onResizeMove,
  onResizeEnd,
  onSelect,
  isSelected,
  readOnly,
  hidden,
}) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: item.id,
    data: { ...item },
    disabled: readOnly,
  });

  const style: React.CSSProperties = {
    gridColumnStart: item.x,
    gridColumnEnd: item.x + item.w,
    gridRowStart: item.y,
    gridRowEnd: item.y + item.h,
    transform: CSS.Translate.toString(transform),
    zIndex: isDragging ? 100 : isSelected ? 50 : 'auto',
    opacity: hidden ? 0 : isDragging ? 0.5 : 1,
    cursor: readOnly ? 'default' : isDragging ? 'grabbing' : 'grab',
    touchAction: 'none',
    visibility: hidden ? 'hidden' : 'visible',
  };

  const handleResizeStart = (e: React.PointerEvent, corner: 'se' | 'sw' | 'ne' | 'nw') => {
    e.stopPropagation();
    e.preventDefault();

    onResizeStart(item.id);

    const startX = e.clientX;
    const startY = e.clientY;
    const startW = item.w;
    const startH = item.h;
    const startXGrid = item.x;
    const startYGrid = item.y;

    let currentW = startW;
    let currentH = startH;
    let currentX = startXGrid;
    let currentY = startYGrid;

    const handlePointerMove = (moveEvent: PointerEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;

      const gap = 16;
      const effectiveStepX = cellWidth + gap;
      const effectiveStepY = rowHeight + gap;

      const gridDeltaX = Math.round(deltaX / effectiveStepX);
      const gridDeltaY = Math.round(deltaY / effectiveStepY);

      let newW = startW;
      let newH = startH;
      let newX = startXGrid;
      let newY = startYGrid;

      if (corner === 'se') {
        newW = Math.max(1, startW + gridDeltaX);
        newH = Math.max(1, startH + gridDeltaY);
      } else if (corner === 'sw') {
        const potentialW = startW - gridDeltaX;
        if (potentialW >= 1) {
          newW = potentialW;
          newX = startXGrid + gridDeltaX;
        }
        newH = Math.max(1, startH + gridDeltaY);
      } else if (corner === 'ne') {
        newW = Math.max(1, startW + gridDeltaX);
        const potentialH = startH - gridDeltaY;
        if (potentialH >= 1) {
          newH = potentialH;
          newY = startYGrid + gridDeltaY;
        }
      } else if (corner === 'nw') {
        const potentialW = startW - gridDeltaX;
        const potentialH = startH - gridDeltaY;
        if (potentialW >= 1) {
          newW = potentialW;
          newX = startXGrid + gridDeltaX;
        }
        if (potentialH >= 1) {
          newH = potentialH;
          newY = startYGrid + gridDeltaY;
        }
      }

      if (newW !== currentW || newH !== currentH || newX !== currentX || newY !== currentY) {
        currentW = newW;
        currentH = newH;
        currentX = newX;
        currentY = newY;
        onResizeMove(item.id, newW, newH, newX, newY);
      }
    };

    const handlePointerUp = () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      onResizeEnd(item.id, currentW, currentH, currentX, currentY);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={() => !isDragging && onSelect && onSelect(item.id)}
      className={`relative group ${isDragging ? 'ring-2 ring-indigo-500 shadow-xl' : ''} ${isSelected && !isDragging ? 'ring-2 ring-blue-500 z-50' : ''}`}>
      {children}

      {!readOnly && (
        <>
          <div
            className="absolute bottom-1 right-1 w-4 h-4 cursor-se-resize opacity-0 group-hover:opacity-100 transition-opacity bg-white dark:bg-zinc-700 border border-zinc-400 rounded-sm z-20 flex items-center justify-center"
            onPointerDown={(e) => handleResizeStart(e, 'se')}>
            <svg
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M8 2L2 8"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M8 6L6 8"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div
            className="absolute bottom-1 left-1 w-4 h-4 cursor-sw-resize opacity-0 group-hover:opacity-100 transition-opacity bg-white dark:bg-zinc-700 border border-zinc-400 rounded-sm z-20"
            onPointerDown={(e) => handleResizeStart(e, 'sw')}
          />
          <div
            className="absolute top-1 right-1 w-4 h-4 cursor-ne-resize opacity-0 group-hover:opacity-100 transition-opacity bg-white dark:bg-zinc-700 border border-zinc-400 rounded-sm z-20"
            onPointerDown={(e) => handleResizeStart(e, 'ne')}
          />
          <div
            className="absolute top-1 left-1 w-4 h-4 cursor-nw-resize opacity-0 group-hover:opacity-100 transition-opacity bg-white dark:bg-zinc-700 border border-zinc-400 rounded-sm z-20"
            onPointerDown={(e) => handleResizeStart(e, 'nw')}
          />
        </>
      )}
    </div>
  );
};
