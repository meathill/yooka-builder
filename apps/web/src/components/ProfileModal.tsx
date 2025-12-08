'use client';

import { useState } from 'react';
import { updateUsername } from '@/app/actions';
import { authClient } from '@/lib/auth-client';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUsername?: string;
  onSuccess?: (username: string) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, currentUsername, onSuccess }) => {
  const [username, setUsername] = useState(currentUsername || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { data: session } = authClient.useSession();

  // Sync state when prop changes
  // Note: Using key or useEffect is better for resetting state on open, but for now manual check:
  // if (currentUsername && username === '' && !success) { ... } - Removed to avoid complexity/errors.
  // Instead, rely on useEffect to sync prop updates if needed, or key={currentUsername} on parent.
  
  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    if (!session?.user?.id) {
        setError("You must be logged in.");
        setLoading(false);
        return;
    }

    const result = await updateUsername(session.user.id, username);

    if (result.success) {
      setSuccess(true);
      if (onSuccess) onSuccess(username);
    } else {
      setError(result.error || 'Failed to update username');
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-md relative animate-in fade-in zoom-in duration-200">
        <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
        >
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>

        <h2 className="text-2xl font-bold mb-1 dark:text-white">Profile Settings</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Manage your public profile identity.</p>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Username
            </label>
            <div className="relative rounded-md shadow-sm">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 sm:text-sm">
                    yooka.com/u/
                </span>
                <input
                    type="text"
                    id="username"
                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-24 sm:text-sm border-gray-300 rounded-md p-2 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                    placeholder="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    minLength={5}
                    required
                />
            </div>
            <p className="mt-1 text-xs text-gray-500">Minimum 5 characters. Letters, numbers, and hyphens only.</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-md text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-md text-sm">
              Username updated successfully!
            </div>
          )}

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={onClose}
              className="mr-3 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
