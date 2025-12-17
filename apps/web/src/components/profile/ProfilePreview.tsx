'use client';

import React from 'react';
import { GridLayoutData, GridItem, UserProfile } from '@/types/grid';
import { ProfileHeader } from './ProfileHeader';
import { SocialCard } from './SocialCard';

interface ProfilePreviewProps {
    profile: UserProfile;
    gridData: GridLayoutData;
    editable?: boolean;
    onEditHeader?: () => void;
    onEditItem?: (item: GridItem) => void;
}

// 图片卡片组件
const ImageCard: React.FC<{ item: GridItem; editable?: boolean; onClick?: () => void }> = ({
    item,
    editable,
    onClick,
}) => (
    <div
        className={`h-full w-full rounded-xl overflow-hidden bg-zinc-100 shadow-sm hover:shadow-md transition-all duration-200 ${editable ? 'cursor-pointer' : ''}`}
        onClick={editable ? onClick : undefined}
    >
        {item.content ? (
            <img
                src={item.content}
                alt={item.title || 'photo'}
                className="w-full h-full object-cover"
            />
        ) : (
            <div className="w-full h-full flex items-center justify-center text-zinc-400">
                <span>photo</span>
            </div>
        )}
    </div>
);

// 文本卡片组件
const TextCard: React.FC<{ item: GridItem; editable?: boolean; onClick?: () => void }> = ({
    item,
    editable,
    onClick,
}) => (
    <div
        className={`h-full w-full rounded-xl bg-white p-4 shadow-sm hover:shadow-md transition-all duration-200 overflow-auto ${editable ? 'cursor-pointer' : ''}`}
        onClick={editable ? onClick : undefined}
    >
        <p className="text-zinc-700 whitespace-pre-wrap">{item.content}</p>
    </div>
);

// 视频卡片组件
const VideoCard: React.FC<{ item: GridItem; editable?: boolean; onClick?: () => void }> = ({
    item,
    editable,
    onClick,
}) => {
    // 简单处理 YouTube 嵌入
    let embedUrl = item.content;
    if (item.content?.includes('youtube.com') || item.content?.includes('youtu.be')) {
        const videoId = item.content.split('v=')[1] || item.content.split('/').pop();
        embedUrl = `https://www.youtube.com/embed/${videoId}`;
    }

    if (editable) {
        return (
            <div
                className="h-full w-full rounded-xl bg-zinc-100 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer flex items-center justify-center"
                onClick={onClick}
            >
                <div className="text-center text-zinc-400">
                    <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm">youtube</span>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full w-full rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200">
            <iframe
                src={embedUrl}
                className="w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
            />
        </div>
    );
};

// 个人简介卡片
const ProfileCard: React.FC<{ item: GridItem; profile: UserProfile; editable?: boolean; onClick?: () => void }> = ({
    item,
    profile,
    editable,
    onClick,
}) => (
    <div
        className={`h-full w-full rounded-xl bg-white p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col ${editable ? 'cursor-pointer' : ''}`}
        onClick={editable ? onClick : undefined}
    >
        <h3 className="font-bold text-zinc-800 mb-2">@{profile.username}</h3>
        <p className="text-zinc-600 text-sm leading-relaxed flex-1">
            {profile.bio || item.content || '暂无简介'}
        </p>
    </div>
);

export const ProfilePreview: React.FC<ProfilePreviewProps> = ({
    profile,
    gridData,
    editable = false,
    onEditHeader,
    onEditItem,
}) => {
    const { rows, cols, items } = gridData;

    const renderItem = (item: GridItem) => {
        const handleClick = () => {
            if (editable && onEditItem) {
                onEditItem(item);
            }
        };

        switch (item.type) {
            case 'social':
                return (
                    <SocialCard
                        item={item}
                        editable={editable}
                        onClick={handleClick}
                    />
                );
            case 'image':
                return (
                    <ImageCard
                        item={item}
                        editable={editable}
                        onClick={handleClick}
                    />
                );
            case 'video':
                return (
                    <VideoCard
                        item={item}
                        editable={editable}
                        onClick={handleClick}
                    />
                );
            case 'profile':
                return (
                    <ProfileCard
                        item={item}
                        profile={profile}
                        editable={editable}
                        onClick={handleClick}
                    />
                );
            case 'text':
            default:
                return (
                    <TextCard
                        item={item}
                        editable={editable}
                        onClick={handleClick}
                    />
                );
        }
    };

    return (
        <div className="min-h-screen bg-[#e3e8f0]">
            <div className="max-w-5xl mx-auto py-8 px-4">
                {/* 头部 */}
                <ProfileHeader
                    profile={profile}
                    editable={editable}
                    onEdit={onEditHeader}
                />

                {/* 网格 */}
                <div
                    className="grid gap-4 mt-6"
                    style={{
                        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
                        gridTemplateRows: `repeat(${rows}, 80px)`,
                    }}
                >
                    {items.map((item) => (
                        <div
                            key={item.id}
                            style={{
                                gridColumnStart: item.x,
                                gridColumnEnd: item.x + item.w,
                                gridRowStart: item.y,
                                gridRowEnd: item.y + item.h,
                            }}
                        >
                            {renderItem(item)}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
