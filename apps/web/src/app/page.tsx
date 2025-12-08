'use client';

import { useState, useEffect } from 'react';
import { GridCanvas } from '@/components/GridCanvas';
import { PropertyPanel } from '@/components/PropertyPanel';
import { ProfileModal } from '@/components/ProfileModal';
import { GridLayoutData, GridItem } from '@/types/grid';
import { getGrid, saveGrid, publishGrid } from './actions';
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

export default function Home() {
  const [data, setData] = useState<GridLayoutData>(DEFAULT_DATA);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [username, setUsername] = useState<string | undefined>(undefined);
  
  const { data: session, isPending: isSessionPending } = authClient.useSession();
  const router = useRouter();
  
  // Use session.user.id if available, otherwise null
  const userId = session?.user?.id;

  const selectedItem = selectedId ? data.items.find(i => i.id === selectedId) || null : null;

  // Debug logging
  useEffect(() => {
      console.log('State Update:', { 
          userId, 
          isSessionPending, 
          loading, 
          dataItemCount: data.items.length,
          rows: data.rows,
          cols: data.cols
      });
  }, [userId, isSessionPending, loading, data]);

  useEffect(() => {
    if (isSessionPending) return;
    
    if (!userId) {
        setLoading(false);
        return;
    }

    async function loadData() {
      try {
        console.log('Loading data for user:', userId);
        if (!userId) return;
        const savedGrid = await getGrid(userId);
        console.log('Loaded grid result:', savedGrid ? 'Found' : 'Null', savedGrid?.data ? 'Has Data' : 'No Data');
        
        if (savedGrid) {
            if (savedGrid.data) {
                console.log('Setting saved data:', savedGrid.data.items.length, 'items');
                setData(savedGrid.data);
            } else {
                console.log('No saved data, keeping default');
            }
            if (savedGrid.username) setUsername(savedGrid.username);
        }
      } catch (e) {
          console.error("Error loading data", e);
      } finally {
          setLoading(false);
      }
    }
    loadData();
  }, [userId, isSessionPending, router]);

  const handleSave = async () => {
    if (!userId) {
        alert('Please sign in to save.');
        return;
    }
    const result = await saveGrid(userId, data);
    if (result.success) {
      alert('Saved successfully!');
    } else {
      alert('Failed to save.');
    }
  };

  const handlePublish = async () => {
    if (!userId) return;
    
    // Check if username is set before publishing
    if (!username) {
        setIsProfileOpen(true);
        alert("Please set a username before publishing.");
        return;
    }

    const result = await publishGrid(userId, data);
     if (result.success) {
      const url = `${window.location.origin}/u/${username}`;
      // Open in new tab
      window.open(url, '_blank');
      alert(`Published successfully!`);
    } else {
      alert('Failed to publish: ' + result.error);
    }
  }

  const handleUpdateItem = (id: string, updates: Partial<GridItem>) => {
      const newItems = data.items.map(item => item.id === id ? { ...item, ...updates } : item);
      setData({ ...data, items: newItems });
  };

  const handleDeleteItem = (id: string) => {
      if (confirm('Are you sure you want to delete this item?')) {
          const newItems = data.items.filter(item => item.id !== id);
          setData({ ...data, items: newItems });
          setSelectedId(null);
      }
  };

  if (isSessionPending) {
      return <div className="min-h-screen flex items-center justify-center text-gray-800 dark:text-white bg-white dark:bg-gray-900">Loading session...</div>;
  }

  if (!userId) {
      return (
          <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
              <h1 className="text-2xl font-bold">Welcome to Yooka Builder</h1>
              <p>Please sign in to start building your page.</p>
              <div className="flex gap-4">
                  <Link href="/sign-in" className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700">
                      Sign In
                  </Link>
                   <Link href="/sign-up" className="bg-white border border-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-50">
                      Sign Up
                  </Link>
              </div>
          </div>
      )
  }

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <header className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center bg-white dark:bg-gray-900 z-20 relative">
        <h1 className="text-xl font-bold">Yooka Builder</h1>
        <div className="flex gap-2 items-center">
            {username && (
                <a 
                    href={`/u/${username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-200 mr-2 flex items-center gap-1"
                >
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    View Page
                </a>
            )}
            <button 
                onClick={() => setIsProfileOpen(true)}
                className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mr-2 flex items-center gap-1"
            >
                <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs overflow-hidden">
                    {session?.user?.image ? <img src={session.user.image} alt="avatar" /> : session?.user?.name?.charAt(0)}
                </div>
                {username || "Set Username"}
            </button>
            <span className="h-4 w-px bg-gray-300 mx-2"></span>
            <button 
                onClick={async () => {
                    await authClient.signOut();
                    window.location.href = '/'; // Force reload to clear state
                }}
                className="text-sm text-red-600 hover:underline mr-4"
            >
                Sign Out
            </button>
             <button 
                onClick={handlePublish}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
                disabled={loading}
            >
            Publish
            </button>
            <button 
                onClick={handleSave}
                className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 disabled:opacity-50"
                disabled={loading}
            >
            Save Draft
            </button>
        </div>
      </header>
      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 relative overflow-hidden flex flex-col">
            {loading ? (
                <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10">
                    Loading data...
                </div>
            ) : (
                <GridCanvas 
                    data={data} 
                    onUpdate={(newData) => setData(newData)}
                    selectedId={selectedId}
                    onSelect={setSelectedId}
                />
            )}
        </main>
        <aside className="w-80 border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 z-10 flex flex-col">
            <PropertyPanel 
                item={selectedItem} 
                onUpdate={handleUpdateItem} 
                onDelete={handleDeleteItem}
            />
        </aside>
      </div>
      
      <ProfileModal 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)} 
        currentUsername={username}
        onSuccess={(newUsername) => {
            setUsername(newUsername);
            // setIsProfileOpen(false); // Optional: close immediately or let user close
        }}
      />
    </div>
  );
}
