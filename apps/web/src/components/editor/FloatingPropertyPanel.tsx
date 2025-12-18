'use client';

import React from 'react';
import { GridItem } from '@/types/grid';
import { PropertyPanel } from '@/components/PropertyPanel';

interface FloatingPropertyPanelProps {
  item: GridItem;
  onUpdate: (id: string, updates: Partial<GridItem>) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

export const FloatingPropertyPanel: React.FC<FloatingPropertyPanelProps> = ({ item, onUpdate, onDelete, onClose }) => {
  return (
    <div className="fixed right-4 top-20 w-80 bg-white rounded-2xl shadow-2xl z-30 overflow-hidden">
      <div className="flex justify-between items-center p-4 border-b border-zinc-100">
        <h3 className="font-bold text-zinc-800">编辑卡片</h3>
        <button
          onClick={onClose}
          className="text-zinc-400 hover:text-zinc-600">
          <svg
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      <PropertyPanel
        item={item}
        onUpdate={onUpdate}
        onDelete={onDelete}
      />
    </div>
  );
};
