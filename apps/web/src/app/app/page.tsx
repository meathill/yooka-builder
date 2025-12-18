'use client';

import { useState, useEffect } from 'react';
import { ProfileHeaderModal } from '@/components/profile';
import { GridCanvas } from '@/components/GridCanvas';
import { ProfileModal } from '@/components/ProfileModal';
import { AddWidgetModal } from '@/components/AddWidgetModal';
import { EditorHeader, FloatingPropertyPanel } from '@/components/editor';
import { ToastAlert, AlertDialog } from '@/components/ui/AlertDialog';
import { GridLayoutData, GridItem, UserProfile } from '@/types/grid';
import { getGrid, saveGrid, publishGrid, updateUserProfile } from '../actions';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { DEFAULT_GRID_DATA, DEFAULT_PROFILE } from '@/lib/mock-data';

export default function EditorPage() {
  const [data, setData] = useState<GridLayoutData>(DEFAULT_GRID_DATA);
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

  function showAlert(message: string) {
    setAlertMessage(message);
    setAlertOpen(true);
  }

  async function handleSave() {
    if (!userId) return;
    const result = await saveGrid(userId, data);
    if (result.success) {
      showAlert('保存成功！');
    } else {
      showAlert('保存失败，请重试。');
    }
  }

  async function handlePublish() {
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
  }

  function handleUpdateItem(id: string, updates: Partial<GridItem>) {
    const newItems = data.items.map((item) => (item.id === id ? { ...item, ...updates } : item));
    setData({ ...data, items: newItems });
  }

  function handleDeleteItem(id: string) {
    setDeleteItemId(id);
    setConfirmOpen(true);
  }

  function confirmDeleteItem() {
    if (deleteItemId) {
      const newItems = data.items.filter((item) => item.id !== deleteItemId);
      setData({ ...data, items: newItems });
      setSelectedId(null);
      setEditingItem(null);
      setDeleteItemId(null);
    }
    setConfirmOpen(false);
  }

  function handleAddClick(x: number, y: number) {
    setAddPosition({ x, y });
    setIsAddModalOpen(true);
  }

  function handleAddItem(type: 'text' | 'image' | 'video' | 'social' | 'app') {
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
  }

  async function handleSaveProfile(updates: Partial<UserProfile>) {
    if (!userId) return;
    setProfile((prev) => ({ ...prev, ...updates }));
    await updateUserProfile(userId, updates);
  }

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
      <EditorHeader
        username={username}
        userImage={session?.user?.image}
        userName={session?.user?.name ?? undefined}
        loading={loading}
        isPublished={isPublished}
        onOpenProfile={() => setIsProfileOpen(true)}
        onPublish={handlePublish}
        onSave={handleSave}
      />

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

      {editingItem && (
        <FloatingPropertyPanel
          item={editingItem}
          onUpdate={handleUpdateItem}
          onDelete={handleDeleteItem}
          onClose={() => setEditingItem(null)}
        />
      )}

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        currentUsername={username}
        onSuccess={(newUsername) => {
          setUsername(newUsername);
        }}
      />

      <ProfileHeaderModal
        isOpen={isProfileHeaderOpen}
        onClose={() => setIsProfileHeaderOpen(false)}
        profile={profile}
        onSave={handleSaveProfile}
      />

      <AddWidgetModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSelectType={handleAddItem}
      />

      <ToastAlert
        open={alertOpen}
        onOpenChange={setAlertOpen}
        title={alertMessage}
      />

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
