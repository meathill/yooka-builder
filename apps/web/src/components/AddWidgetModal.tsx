import React from 'react';

interface AddWidgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectType: (type: 'text' | 'image' | 'video' | 'social' | 'app') => void;
}

export const AddWidgetModal: React.FC<AddWidgetModalProps> = ({ isOpen, onClose, onSelectType }) => {
  if (!isOpen) return null;

  const options = [
    { type: 'text', label: 'Text', icon: '📝', desc: 'Rich text block' },
    { type: 'image', label: 'Image', icon: '🖼️', desc: 'Photo or GIF' },
    { type: 'video', label: 'Video', icon: '▶️', desc: 'YouTube or Vimeo' },
    { type: 'social', label: 'Social', icon: '🐦', desc: 'Social media post' },
    { type: 'app', label: 'App', icon: '📱', desc: 'App link/icon' },
  ] as const;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-2xl p-6 w-full max-w-sm relative animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200">
          <svg
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <h2 className="text-xl font-bold mb-4 dark:text-white">Add Widget</h2>

        <div className="grid grid-cols-2 gap-3">
          {options.map((opt) => (
            <button
              key={opt.type}
              onClick={() => onSelectType(opt.type)}
              className="flex flex-col items-center justify-center p-4 border border-zinc-200 dark:border-zinc-700 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors bg-zinc-50/50 dark:bg-zinc-800/50">
              <span className="text-2xl mb-2">{opt.icon}</span>
              <span className="font-medium text-sm dark:text-zinc-200">{opt.label}</span>
              <span className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">{opt.desc}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
