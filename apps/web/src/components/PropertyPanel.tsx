import React from 'react';
import { GridItem } from '../types/grid';

interface PropertyPanelProps {
  item: GridItem | null;
  onUpdate: (id: string, updates: Partial<GridItem>) => void;
  onDelete: (id: string) => void;
}

export const PropertyPanel: React.FC<PropertyPanelProps> = ({ item, onUpdate, onDelete }) => {
  if (!item) {
    return (
      <div className="w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 p-4 flex items-center justify-center text-gray-500">
        Select an item to edit
      </div>
    );
  }

  return (
    <div className="w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 p-4 flex flex-col gap-6 overflow-y-auto">
      <div>
        <h2 className="text-lg font-bold mb-1">Properties</h2>
        <p className="text-xs text-gray-500">ID: {item.id}</p>
      </div>

      {/* Layout Props (Read-only or Editable) */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
            X
            <input 
                type="number" 
                value={item.x} 
                disabled 
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 dark:bg-gray-900 text-gray-500"
            />
          </label>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
            Y
            <input 
                type="number" 
                value={item.y} 
                disabled 
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 dark:bg-gray-900 text-gray-500"
            />
          </label>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
            Width
            <input 
                type="number" 
                value={item.w} 
                disabled 
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 dark:bg-gray-900 text-gray-500"
            />
          </label>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
            Height
            <input 
                type="number" 
                value={item.h} 
                disabled 
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 dark:bg-gray-900 text-gray-500"
            />
          </label>
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700"></div>

      {/* Content Props */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Type
            <select
            value={item.type}
            onChange={(e) => onUpdate(item.id, { type: e.target.value as any })}
            className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
            >
            <option value="text">Text</option>
            <option value="image">Image</option>
            <option value="app">App</option>
            </select>
        </label>
      </div>

      {item.type === 'text' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Content
            <textarea
                value={item.content}
                onChange={(e) => onUpdate(item.id, { content: e.target.value })}
                rows={4}
                className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 resize-none"
            />
          </label>
        </div>
      )}

      {item.type === 'image' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Image URL
            <input
                type="text"
                value={item.content}
                onChange={(e) => onUpdate(item.id, { content: e.target.value })}
                className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 mb-2"
            />
          </label>
          {item.content && (
             <div className="rounded-md overflow-hidden border border-gray-200 dark:border-gray-700 h-32 relative">
                 <img src={item.content} alt="Preview" className="w-full h-full object-cover" />
             </div>
          )}
        </div>
      )}

      {item.type === 'app' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            App Name
            <input
                type="text"
                value={item.content}
                onChange={(e) => onUpdate(item.id, { content: e.target.value })}
                className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
            />
          </label>
        </div>
      )}

      <div className="mt-auto pt-6">
        <button
          onClick={() => onDelete(item.id)}
          className="w-full py-2 px-4 border border-red-300 text-red-600 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 dark:border-red-800 dark:text-red-400 transition-colors"
        >
          Delete Item
        </button>
      </div>
    </div>
  );
};
