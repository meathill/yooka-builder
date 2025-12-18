'use client';

import React from 'react';
import { UserProfile } from '@/types/grid';

// 标签颜色配置
const TAG_COLORS = [
  { bg: 'bg-gradient-to-r from-rose-400 to-pink-500', text: 'text-white' },
  { bg: 'bg-gradient-to-r from-violet-500 to-purple-600', text: 'text-white' },
  { bg: 'bg-gradient-to-r from-blue-400 to-indigo-500', text: 'text-white' },
  { bg: 'bg-gradient-to-r from-emerald-400 to-teal-500', text: 'text-white' },
  { bg: 'bg-gradient-to-r from-amber-400 to-orange-500', text: 'text-white' },
];

interface ProfileHeaderProps {
  profile: UserProfile;
  editable?: boolean;
  onEdit?: () => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ profile, editable = false, onEdit }) => {
  const { name, username, avatar, bio, tags, domain } = profile;

  const handleClick = () => {
    if (editable && onEdit) {
      onEdit();
    }
  };

  return (
    <header
      className={`flex items-start gap-6 p-6 ${editable ? 'cursor-pointer hover:bg-white/50 rounded-2xl transition-colors' : ''}`}
      onClick={handleClick}>
      {/* 头像 */}
      <div className="flex-shrink-0">
        <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden bg-gradient-to-br from-pink-200 to-purple-200 shadow-lg ring-4 ring-white">
          {avatar ? (
            <img
              src={avatar}
              alt={name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-purple-400">
              {name?.charAt(0) || '?'}
            </div>
          )}
        </div>
      </div>

      {/* 信息区 */}
      <div className="flex-1 min-w-0">
        {/* 用户名和域名 */}
        <div className="flex items-baseline gap-3 flex-wrap">
          <h1 className="text-2xl md:text-3xl font-bold text-zinc-800">{name}</h1>
          {(domain || username) && (
            <a
              href={domain ? `https://${domain}` : `/u/${username}`}
              className="text-sm text-zinc-400 hover:text-zinc-600 transition-colors"
              onClick={(e) => e.stopPropagation()}>
              {domain || `yooka.me/${username}`}
            </a>
          )}
        </div>

        {/* 标签 */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {tags.map((tag, index) => {
              const colorIndex = index % TAG_COLORS.length;
              const color = TAG_COLORS[colorIndex];
              return (
                <span
                  key={index}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${color.bg} ${color.text} shadow-sm`}>
                  {tag}
                </span>
              );
            })}
          </div>
        )}

        {/* 简介 */}
        {bio && <p className="mt-4 text-zinc-600 leading-relaxed max-w-2xl">{bio}</p>}

        {/* 编辑提示 */}
        {editable && !bio && !tags?.length && <p className="mt-4 text-zinc-400 italic">点击编辑个人资料...</p>}
      </div>
    </header>
  );
};
