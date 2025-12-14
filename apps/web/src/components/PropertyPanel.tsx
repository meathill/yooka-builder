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
      <div className="w-80 bg-white dark:bg-zinc-800 border-l border-zinc-200 dark:border-zinc-700 p-4 flex items-center justify-center text-zinc-500">
        Select an item to edit
      </div>
    );
  }

  return (
    <div className="w-80 bg-white dark:bg-zinc-800 border-l border-zinc-200 dark:border-zinc-700 p-4 flex flex-col gap-6 overflow-y-auto">
      <div>
        <h2 className="text-lg font-bold mb-1">Properties</h2>
        <p className="text-xs text-zinc-500">ID: {item.id}</p>
      </div>

      {/* Layout Props (Read-only or Editable) */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
            X
            <input
              type="number"
              value={item.x}
              disabled
              className="mt-1 w-full px-3 py-2 border border-zinc-300 rounded-md bg-zinc-100 dark:bg-zinc-900 text-zinc-500"
            />
          </label>
        </div>
        <div>
          <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
            Y
            <input
              type="number"
              value={item.y}
              disabled
              className="mt-1 w-full px-3 py-2 border border-zinc-300 rounded-md bg-zinc-100 dark:bg-zinc-900 text-zinc-500"
            />
          </label>
        </div>
        <div>
          <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
            Width
            <input
              type="number"
              value={item.w}
              disabled
              className="mt-1 w-full px-3 py-2 border border-zinc-300 rounded-md bg-zinc-100 dark:bg-zinc-900 text-zinc-500"
            />
          </label>
        </div>
        <div>
          <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
            Height
            <input
              type="number"
              value={item.h}
              disabled
              className="mt-1 w-full px-3 py-2 border border-zinc-300 rounded-md bg-zinc-100 dark:bg-zinc-900 text-zinc-500"
            />
          </label>
        </div>
      </div>

      <div className="border-t border-zinc-200 dark:border-zinc-700"></div>

      {/* Content Props */}
      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
          Type
          <select
            value={item.type}
            onChange={(e) => onUpdate(item.id, { type: e.target.value as any })}
            className="mt-1 w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">
            <option value="text">Text</option>
            <option value="image">Image</option>
            <option value="app">App</option>
            <option value="video">Video</option>
            <option value="social">Social</option>
          </select>
        </label>
      </div>

      {item.type === 'text' && (
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
            Content
            <textarea
              value={item.content}
              onChange={(e) => onUpdate(item.id, { content: e.target.value })}
              rows={4}
              className="mt-1 w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 resize-none"
            />
          </label>
        </div>
      )}

            {item.type === 'image' && (

              <div>

                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">

                  Image URL

                  <div className="flex flex-col gap-2 mt-1">

                      <input

                          type="text"

                          value={item.content}

                          onChange={(e) => onUpdate(item.id, { content: e.target.value })}

                          className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"

                          placeholder="https://..."

                      />

                      <div className="relative">

                          <input

                              type="file"

                              accept="image/*"

                              onChange={async (e) => {

                                  const file = e.target.files?.[0];

                                  if (!file) return;

                                  

                                  // Simple upload handling

                                  const formData = new FormData();

                                  formData.append('file', file);

                                  

                                                              try {

                                  

                                                                  const res = await fetch('/api/upload', {

                                  

                                                                      method: 'POST',

                                  

                                                                      body: formData

                                  

                                                                  });

                                  

                                                                  const data = await res.json() as { url?: string };

                                  

                                                                  if (data.url) {

                                  

                                                                      onUpdate(item.id, { content: data.url });

                                  

                                                                  } else {

                                  

                                                                      alert('Upload failed');

                                  

                                                                  }

                                  

                                                              } catch (err) {

                                      console.error(err);

                                      alert('Upload error');

                                  }

                              }}

                              className="block w-full text-sm text-zinc-500

                              file:mr-4 file:py-2 file:px-4

                              file:rounded-md file:border-0

                              file:text-sm file:font-semibold

                              file:bg-indigo-50 file:text-indigo-700

                              hover:file:bg-indigo-100 dark:file:bg-indigo-900/30 dark:file:text-indigo-300

                              "

                          />

                      </div>

                  </div>

                </label>

                {item.content && (

                   <div className="rounded-md overflow-hidden border border-zinc-200 dark:border-zinc-700 h-32 relative mt-2">

                       <img src={item.content} alt="Preview" className="w-full h-full object-cover" />

                   </div>

                )}

              </div>

            )}

      

            {item.type === 'video' && (

              <div>

                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">

                  Video URL (YouTube/Vimeo or Upload)

                  <div className="flex flex-col gap-2 mt-1">

                      <input

                          type="text"

                          value={item.content}

                          onChange={(e) => onUpdate(item.id, { content: e.target.value })}

                          className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"

                          placeholder="https://..."

                      />

                      <input

                          type="file"

                          accept="video/*"

                          onChange={async (e) => {

                              const file = e.target.files?.[0];

                              if (!file) return;

                              

                              const formData = new FormData();

                              formData.append('file', file);

                              

                                                      try {

                              

                                                          const res = await fetch('/api/upload', {

                              

                                                              method: 'POST',

                              

                                                              body: formData

                              

                                                          });

                              

                                                          const data = await res.json() as { url?: string };

                              

                                                          if (data.url) {

                              

                                                              onUpdate(item.id, { content: data.url });

                              

                                                          } else {

                              

                                                              alert('Upload failed');

                              

                                                          }

                              

                                                      } catch (err) {

                                  console.error(err);

                                  alert('Upload error');

                              }

                          }}

                          className="block w-full text-sm text-zinc-500

                          file:mr-4 file:py-2 file:px-4

                          file:rounded-md file:border-0

                          file:text-sm file:font-semibold

                          file:bg-indigo-50 file:text-indigo-700

                          hover:file:bg-indigo-100 dark:file:bg-indigo-900/30 dark:file:text-indigo-300

                          "

                      />

                  </div>

                </label>

              </div>

            )}

      {item.type === 'social' && (
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
            Social Profile / Post URL
            <input
              type="text"
              value={item.content}
              onChange={(e) => onUpdate(item.id, { content: e.target.value })}
              className="mt-1 w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
              placeholder="@username or link"
            />
          </label>
        </div>
      )}

      {item.type === 'app' && (
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
            App Name
            <input
              type="text"
              value={item.content}
              onChange={(e) => onUpdate(item.id, { content: e.target.value })}
              className="mt-1 w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
            />
          </label>
        </div>
      )}

      <div className="mt-auto pt-6">
        <button
          onClick={() => onDelete(item.id)}
          className="w-full py-2 px-4 border border-red-300 text-red-600 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 dark:border-red-800 dark:text-red-400 transition-colors">
          Delete Item
        </button>
      </div>
    </div>
  );
};
