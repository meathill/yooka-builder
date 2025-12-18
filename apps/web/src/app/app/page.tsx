'use client';

import { useState, useEffect } from 'react';
import { ProfileHeaderModal } from '@/components/profile';
import { GridCanvas } from '@/components/GridCanvas';
import { ProfileModal } from '@/components/ProfileModal';
import { AddWidgetModal } from '@/components/AddWidgetModal';
import { PropertyPanel } from '@/components/PropertyPanel';
import { ToastAlert, AlertDialog } from '@/components/ui/AlertDialog';
import { GridLayoutData, GridItem, UserProfile } from '@/types/grid';
import { getGrid, saveGrid, publishGrid, updateUserProfile } from '../actions';
import { authClient } from '@/lib/auth-client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// 默认模拟数据 - 更好地展示新设计
const DEFAULT_DATA: GridLayoutData = {
  rows: 6,
  cols: 8,
  items: [
    {
      id: 'item-1',
      x: 1,
      y: 1,
      w: 2,
      h: 2,
      type: 'social',
      content: 'meathill',
      platform: 'xiaohongshu',
      title: '小红书',
      subtitle: '@meathill',
    },
    {
      id: 'item-2',
      x: 3,
      y: 1,
      w: 2,
      h: 2,
      type: 'social',
      content: 'meathill',
      platform: 'bilibili',
      title: '哔哩哔哩',
      subtitle: '@meathill',
    },
    {
      id: 'item-3',
      x: 1,
      y: 3,
      w: 4,
      h: 3,
      type: 'image',
      content: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=800',
      title: 'photo',
    },
    {
      id: 'item-4',
      x: 5,
      y: 1,
      w: 2,
      h: 2,
      type: 'social',
      content: '',
      platform: 'default',
    },
    {
      id: 'item-5',
      x: 7,
      y: 1,
      w: 2,
      h: 2,
      type: 'social',
      content: '',
      platform: 'default',
    },
    {
      id: 'item-6',
      x: 5,
      y: 3,
      w: 4,
      h: 3,
      type: 'video',
      content: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      platform: 'youtube',
      title: 'youtube',
    },
  ],
};

// 默认用户资料模拟数据
const DEFAULT_PROFILE: UserProfile = {
  name: '肉山Meathill',
  username: 'meathill',
  avatar: 'https://avatars.githubusercontent.com/u/1032389?v=4',
  bio: '我是一名游走于设计与代码之间的全栈创造者。我不只交付代码，我交付的是那种让人眼前一亮、丝般顺滑的数字体验。',
  tags: ['全栈开发工程师', 'youtuber', 'B站Up'],
  domain: 'yooka.me/meathill',
};

export default function EditorPage() {
  const [data, setData] = useState<GridLayoutData>(DEFAULT_DATA);
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isProfileHeaderOpen, setIsProfileHeaderOpen] = useState(false);
  const [username, setUsername] = useState<string | undefined>(undefined);

  // Add Widget State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addPosition, setAddPosition] = useState<{ x: number; y: number } | null>(null);

  // Item Edit Modal State
  const [editingItem, setEditingItem] = useState<GridItem | null>(null);

  // Alert Dialog State
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);
  const [isPublished, setIsPublished] = useState(false);

  const { data: session, isPending: isSessionPending } = authClient.useSession();
  const router = useRouter();

  const userId = session?.user?.id;

  const selectedItem = selectedId ? data.items.find((i) => i.id === selectedId) || null : null;

  useEffect(() => {
    if (isSessionPending) return;

    if (!userId) {
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
          if (savedGrid.profile) {
            setProfile({
              ...DEFAULT_PROFILE,
              ...savedGrid.profile,
            });
          }
        }
      } catch (e) {
        console.error('Error loading data', e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [userId, isSessionPending, router]);

  const showAlert = (message: string) => {
    setAlertMessage(message);
    setAlertOpen(true);
  };

  const handleSave = async () => {
    if (!userId) return;
    const result = await saveGrid(userId, data);
    if (result.success) {
      showAlert('保存成功！');
    } else {
      showAlert('保存失败，请重试。');
    }
  };

  const handlePublish = async () => {
    if (!userId) return;

    if (!username) {
      setIsProfileOpen(true);
      showAlert('请先设置用户名再发布。');
      return;
    }

    const result = await publishGrid(userId, data);
    if (result.success) {
      setIsPublished(true);
      const url = `${window.location.origin}/u/${username}`;
      window.open(url, '_blank');
      showAlert('发布成功！');
    } else {
      showAlert('发布失败：' + result.error);
    }
  };

  const handleUpdateItem = (id: string, updates: Partial<GridItem>) => {
    const newItems = data.items.map((item) => (item.id === id ? { ...item, ...updates } : item));
    setData({ ...data, items: newItems });
  };

  const handleDeleteItem = (id: string) => {
    setDeleteItemId(id);
    setConfirmOpen(true);
  };

  const confirmDeleteItem = () => {
    if (deleteItemId) {
      const newItems = data.items.filter((item) => item.id !== deleteItemId);
      setData({ ...data, items: newItems });
      setSelectedId(null);
      setEditingItem(null);
      setDeleteItemId(null);
    }
    setConfirmOpen(false);
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
      w: 2,
      h: 2,
      type: type,
      content: type === 'text' ? 'New Text Widget' : '',
    };

    if (type === 'image') {
      newItem.content = 'https://picsum.photos/400/400/?blur';
    }

    if (type === 'social') {
      newItem.platform = 'default';
    }

    if (newItem.x + newItem.w - 1 > data.cols) newItem.w = data.cols - newItem.x + 1;
    if (newItem.y + newItem.h - 1 > data.rows) newItem.h = data.rows - newItem.y + 1;

    setData({
      ...data,
      items: [...data.items, newItem],
    });

    setIsAddModalOpen(false);
    setEditingItem(newItem);
  };

  const handleEditItem = (item: GridItem) => {
    setSelectedId(item.id);
    setEditingItem(item);
  };

  const handleSaveProfile = async (updates: Partial<UserProfile>) => {
    if (!userId) return;

    // 更新本地状态
    setProfile((prev) => ({ ...prev, ...updates }));

    // 保存到服务器
    await updateUserProfile(userId, updates);
  };

  if (isSessionPending || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-zinc-800 dark:text-white bg-white dark:bg-zinc-900">
        Loading editor...
      </div>
    );
  }

  if (!userId) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#e3e8f0]">
      {/* 顶部工具栏 */}
      <header className="p-4 border-b border-zinc-200/50 flex justify-between items-center bg-white/80 backdrop-blur-sm z-20 relative shadow-sm">
        <Link
          href="/"
          className="text-xl font-bold text-zinc-800 hover:opacity-80">
          Yooka Builder
        </Link>
        <div className="flex gap-2 items-center">
          {username && (
            <a
              href={`/u/${username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-indigo-600 hover:text-indigo-800 mr-2 flex items-center gap-1">
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
            className="text-sm text-zinc-600 hover:text-zinc-900 mr-2 flex items-center gap-1">
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
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 font-medium shadow-sm"
            disabled={loading}>
            {isPublished ? 'Save' : 'Publish'}
          </button>
          <button
            onClick={handleSave}
            className="bg-zinc-800 text-white px-4 py-2 rounded-lg hover:bg-zinc-700 disabled:opacity-50 transition-colors font-medium shadow-sm"
            disabled={loading}>
            Save Draft
          </button>
        </div>
      </header>

      {/* 主内容区 - 使用 GridCanvas 组件，恢复拖拽和新增功能 */}
      <main className="flex-1 overflow-auto">
        <GridCanvas
          data={data}
          onUpdate={setData}
          selectedId={selectedId}
          onSelect={(id) => {
            setSelectedId(id);
            const item = data.items.find((i) => i.id === id);
            if (item) setEditingItem(item);
          }}
          onAdd={handleAddClick}
          profile={profile}
          onEditHeader={() => setIsProfileHeaderOpen(true)}
        />
      </main>

      {/* 右侧属性面板 - 编辑选中的卡片 */}
      {editingItem && (
        <div className="fixed right-4 top-20 w-80 bg-white rounded-2xl shadow-2xl z-30 overflow-hidden">
          <div className="flex justify-between items-center p-4 border-b border-zinc-100">
            <h3 className="font-bold text-zinc-800">编辑卡片</h3>
            <button
              onClick={() => setEditingItem(null)}
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
            item={editingItem}
            onUpdate={handleUpdateItem}
            onDelete={handleDeleteItem}
          />
        </div>
      )}

      {/* Profile Username Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        currentUsername={username}
        onSuccess={(newUsername) => {
          setUsername(newUsername);
        }}
      />

      {/* Profile Header Edit Modal */}
      <ProfileHeaderModal
        isOpen={isProfileHeaderOpen}
        onClose={() => setIsProfileHeaderOpen(false)}
        profile={profile}
        onSave={handleSaveProfile}
      />

      {/* Add Widget Modal */}
      <AddWidgetModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSelectType={handleAddItem}
      />

      {/* Toast Alert */}
      <ToastAlert
        open={alertOpen}
        onOpenChange={setAlertOpen}
        title={alertMessage}
      />

      {/* Confirm Delete Dialog */}
      <AlertDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="确认删除"
        description="确定要删除这个卡片吗？此操作无法撤销。"
        confirmText="删除"
        cancelText="取消"
        onConfirm={confirmDeleteItem}
        variant="destructive"
      />
    </div>
  );
}
