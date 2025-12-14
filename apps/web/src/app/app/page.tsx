'use client';

import { useState, useEffect } from 'react';
import { GridCanvas } from '@/components/GridCanvas';
import { PropertyPanel } from '@/components/PropertyPanel';
import { ProfileModal } from '@/components/ProfileModal';
import { AddWidgetModal } from '@/components/AddWidgetModal';
import { GridLayoutData, GridItem } from '@/types/grid';
import { getGrid, saveGrid, publishGrid } from '../actions';
import { authClient } from '@/lib/auth-client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const DEFAULT_DATA: GridLayoutData = {
  rows: 12,
  cols: 8,
  items: [
    {
      id: 'item-1',
      x: 1,
      y: 1,
      w: 4,
      h: 4,
      type: 'image',
      content: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba',
    },
    {
      id: 'item-2',
      x: 5,
      y: 1,
      w: 4,
      h: 2,
      type: 'text',
      content: 'Welcome to Yooka!',
    },
    {
      id: 'item-3',
      x: 5,
      y: 3,
      w: 2,
      h: 2,
      type: 'app',
      content: 'Instagram',
    },
    {
      id: 'item-4',
      x: 7,
      y: 3,
      w: 2,
      h: 2,
      type: 'app',
      content: 'Twitter',
    },
    {
      id: 'item-5',
      x: 1,
      y: 5,
      w: 8,
      h: 4,
      type: 'text',
      content: 'Drag me around! This is a flexible grid system.',
    },
  ],
};

export default function EditorPage() {
  const [data, setData] = useState<GridLayoutData>(DEFAULT_DATA);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [username, setUsername] = useState<string | undefined>(undefined);

  // Add Widget State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addPosition, setAddPosition] = useState<{ x: number; y: number } | null>(null);

  const { data: session, isPending: isSessionPending } = authClient.useSession();
  const router = useRouter();

  const userId = session?.user?.id;

  const selectedItem = selectedId ? data.items.find((i) => i.id === selectedId) || null : null;

  useEffect(() => {
    if (isSessionPending) return;

    if (!userId) {
      // Redirect to sign-in if not logged in, since this is a protected app route
      router.push('/sign-in');
      return;
    }

    async function loadData() {
      try {
        if (!userId) return;
        const savedGrid = await getGrid(userId);

        if (savedGrid) {
          if (savedGrid.data) {
            setData(savedGrid.data);
          }
          if (savedGrid.username) setUsername(savedGrid.username);
        }
      } catch (e) {
        console.error('Error loading data', e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [userId, isSessionPending, router]);

  const handleSave = async () => {
    if (!userId) return;
    const result = await saveGrid(userId, data);
    if (result.success) {
      alert('Saved successfully!');
    } else {
      alert('Failed to save.');
    }
  };

  const handlePublish = async () => {
    if (!userId) return;

    if (!username) {
      setIsProfileOpen(true);
      alert('Please set a username before publishing.');
      return;
    }

    const result = await publishGrid(userId, data);
    if (result.success) {
      const url = `${window.location.origin}/u/${username}`;
      window.open(url, '_blank');
      alert(`Published successfully!`);
    } else {
      alert('Failed to publish: ' + result.error);
    }
  };

  const handleUpdateItem = (id: string, updates: Partial<GridItem>) => {
    const newItems = data.items.map((item) => (item.id === id ? { ...item, ...updates } : item));
    setData({ ...data, items: newItems });
  };

  const handleDeleteItem = (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      const newItems = data.items.filter((item) => item.id !== id);
      setData({ ...data, items: newItems });
      setSelectedId(null);
    }
  };

  const handleAddClick = (x: number, y: number) => {
    setAddPosition({ x, y });
    setIsAddModalOpen(true);
  };

  const handleAddItem = (type: 'text' | 'image' | 'video' | 'social' | 'app') => {
    if (!addPosition) return;

    const newItem: GridItem = {
      id: crypto.randomUUID(),
      x: addPosition.x,
      y: addPosition.y,
      w: 1, // Default size
      h: 1,
      type: type,
      content: type === 'text' ? 'New Text Widget' : '', // Placeholder
    };

    if (type === 'image') {
      newItem.content = 'https://picsum.photos/400/400/?blur';
    }

    // Check collision/fit?
    // Simplified: just add it. If it overlaps, the user can move it.
    // Ideally we check boundaries.
    // Let's constrain to grid:
    if (newItem.x + newItem.w - 1 > data.cols) newItem.w = data.cols - newItem.x + 1;
    if (newItem.y + newItem.h - 1 > data.rows) newItem.h = data.rows - newItem.y + 1;

    setData({
      ...data,
      items: [...data.items, newItem],
    });

    setIsAddModalOpen(false);
    setSelectedId(newItem.id); // Auto select new item
  };

  if (isSessionPending || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-zinc-800 dark:text-white bg-white dark:bg-zinc-900">
        Loading editor...
      </div>
    );
  }

  if (!userId) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white">
      <header className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center bg-white dark:bg-zinc-900 z-20 relative">
        <Link
          href="/"
          className="text-xl font-bold hover:opacity-80">
          Yooka Builder
        </Link>
        <div className="flex gap-2 items-center">
          {username && (
            <a
              href={`/u/${username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-200 mr-2 flex items-center gap-1">
              <svg
                width="16"
                height="16"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
              View Page
            </a>
          )}
          <button
            onClick={() => setIsProfileOpen(true)}
            className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white mr-2 flex items-center gap-1">
            <div className="w-6 h-6 bg-zinc-200 rounded-full flex items-center justify-center text-xs overflow-hidden">
              {session?.user?.image ? (
                <img
                  src={session.user.image}
                  alt="avatar"
                />
              ) : (
                session?.user?.name?.charAt(0)
              )}
            </div>
            {username || 'Set Username'}
          </button>
          <span className="h-4 w-px bg-zinc-300 mx-2"></span>
          <button
            onClick={async () => {
              await authClient.signOut();
              window.location.href = '/';
            }}
            className="text-sm text-red-600 hover:underline mr-4">
            Sign Out
          </button>
          <button
            onClick={handlePublish}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
            disabled={loading}>
            Publish
          </button>
          <button
            onClick={handleSave}
            className="bg-zinc-900 text-white px-4 py-2 rounded-md hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300 disabled:opacity-50 transition-colors"
            disabled={loading}>
            Save Draft
          </button>
        </div>
      </header>
      <div className="flex flex-1 overflow-hidden relative">
        <main className="flex-1 relative overflow-hidden flex flex-col">
          <GridCanvas
            data={data}
            onUpdate={(newData) => setData(newData)}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onAdd={handleAddClick}
          />
        </main>

        {/* Desktop Sidebar */}
        <aside className="hidden md:flex w-80 border-l border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 z-10 flex-col">
          <PropertyPanel
            item={selectedItem}
            onUpdate={handleUpdateItem}
            onDelete={handleDeleteItem}
          />
        </aside>

        {/* Mobile Bottom Sheet */}
        {selectedItem && (
          <div className="md:hidden fixed inset-x-0 bottom-0 z-50 bg-white dark:bg-zinc-800 border-t border-zinc-200 dark:border-zinc-700 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] rounded-t-xl max-h-[50vh] overflow-y-auto flex flex-col animate-in slide-in-from-bottom duration-200">
            <div className="sticky top-0 bg-inherit z-10 flex justify-between items-center p-4 border-b border-zinc-100 dark:border-zinc-700">
              <h3 className="font-bold">Edit Item</h3>
              <button
                onClick={() => setSelectedId(null)}
                className="text-zinc-500">
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
              item={selectedItem}
              onUpdate={handleUpdateItem}
              onDelete={handleDeleteItem}
            />
          </div>
        )}
      </div>

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        currentUsername={username}
        onSuccess={(newUsername) => {
          setUsername(newUsername);
        }}
      />

      <AddWidgetModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSelectType={handleAddItem}
      />
    </div>
  );
}
