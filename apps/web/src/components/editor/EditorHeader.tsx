'use client';

import React from 'react';
import Link from 'next/link';
import { authClient } from '@/lib/auth-client';

interface EditorHeaderProps {
  username?: string;
  userImage?: string | null;
  userName?: string;
  loading?: boolean;
  isPublished?: boolean;
  onOpenProfile: () => void;
  onPublish: () => void;
  onSave: () => void;
}

export const EditorHeader: React.FC<EditorHeaderProps> = ({
  username,
  userImage,
  userName,
  loading = false,
  isPublished = false,
  onOpenProfile,
  onPublish,
  onSave,
}) => {
  return (
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
          onClick={onOpenProfile}
          className="text-sm text-zinc-600 hover:text-zinc-900 mr-2 flex items-center gap-1">
          <div className="w-6 h-6 bg-zinc-200 rounded-full flex items-center justify-center text-xs overflow-hidden">
            {userImage ? (
              <img
                src={userImage}
                alt="avatar"
              />
            ) : (
              userName?.charAt(0)
            )}
          </div>
          {username || 'Set Username'}
        </button>
        <span className="h-4 w-px bg-zinc-300 mx-2" />
        <button
          onClick={async () => {
            await authClient.signOut();
            window.location.href = '/';
          }}
          className="text-sm text-red-600 hover:underline mr-4">
          Sign Out
        </button>
        <button
          onClick={onPublish}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 font-medium shadow-sm"
          disabled={loading}>
          {isPublished ? 'Save' : 'Publish'}
        </button>
        <button
          onClick={onSave}
          className="bg-zinc-800 text-white px-4 py-2 rounded-lg hover:bg-zinc-700 disabled:opacity-50 transition-colors font-medium shadow-sm"
          disabled={loading}>
          Save Draft
        </button>
      </div>
    </header>
  );
};
