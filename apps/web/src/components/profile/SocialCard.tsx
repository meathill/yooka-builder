'use client';

import React from 'react';
import { GridItem } from '@/types/grid';

// 平台配置：图标、颜色、名称
const PLATFORM_CONFIG = {
    xiaohongshu: {
        name: '小红书',
        bgColor: 'bg-gradient-to-br from-red-50 to-red-100',
        iconBg: 'bg-red-500',
        textColor: 'text-red-600',
        icon: (
            <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
        ),
    },
    bilibili: {
        name: '哔哩哔哩',
        bgColor: 'bg-gradient-to-br from-pink-50 to-pink-100',
        iconBg: 'bg-gradient-to-r from-pink-400 to-pink-500',
        textColor: 'text-pink-600',
        icon: (
            <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="currentColor">
                <path d="M17.813 4.653h.854c1.51.054 2.769.578 3.773 1.574 1.004.995 1.524 2.249 1.56 3.76v7.36c-.036 1.51-.556 2.769-1.56 3.773s-2.262 1.524-3.773 1.56H5.333c-1.51-.036-2.769-.556-3.773-1.56S.036 18.858 0 17.347v-7.36c.036-1.511.556-2.765 1.56-3.76 1.004-.996 2.262-1.52 3.773-1.574h.774l-1.174-1.12a1.234 1.234 0 0 1-.373-.906c0-.356.124-.658.373-.907l.027-.027c.267-.249.573-.373.92-.373.347 0 .653.124.92.373L9.653 4.44c.071.071.134.142.187.213h4.267a.836.836 0 0 1 .16-.213l2.853-2.747c.267-.249.573-.373.92-.373.347 0 .662.151.929.4.267.249.391.551.391.907 0 .355-.124.657-.373.906L17.813 4.653zM5.333 7.24c-.746.018-1.373.276-1.88.773-.506.498-.769 1.13-.786 1.894v7.52c.017.764.28 1.395.786 1.893.507.498 1.134.756 1.88.773h13.334c.746-.017 1.373-.275 1.88-.773.506-.498.769-1.129.786-1.893v-7.52c-.017-.765-.28-1.396-.786-1.894-.507-.497-1.134-.755-1.88-.773H5.333zm4 4.053c.355 0 .658.124.907.373.249.249.373.551.373.907v1.827c0 .355-.124.657-.373.906a1.233 1.233 0 0 1-.907.374 1.233 1.233 0 0 1-.906-.374 1.233 1.233 0 0 1-.374-.906v-1.827c0-.356.125-.658.374-.907.249-.249.55-.373.906-.373zm5.334 0c.355 0 .657.124.906.373.25.249.374.551.374.907v1.827c0 .355-.125.657-.374.906a1.233 1.233 0 0 1-.906.374 1.233 1.233 0 0 1-.907-.374 1.233 1.233 0 0 1-.373-.906v-1.827c0-.356.124-.658.373-.907.25-.249.552-.373.907-.373z" />
            </svg>
        ),
    },
    youtube: {
        name: 'YouTube',
        bgColor: 'bg-gradient-to-br from-red-50 to-orange-50',
        iconBg: 'bg-red-600',
        textColor: 'text-red-700',
        icon: (
            <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
        ),
    },
    twitter: {
        name: 'X / Twitter',
        bgColor: 'bg-gradient-to-br from-zinc-50 to-zinc-100',
        iconBg: 'bg-zinc-900',
        textColor: 'text-zinc-800',
        icon: (
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
        ),
    },
    github: {
        name: 'GitHub',
        bgColor: 'bg-gradient-to-br from-zinc-50 to-zinc-100',
        iconBg: 'bg-zinc-800',
        textColor: 'text-zinc-700',
        icon: (
            <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="currentColor">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
            </svg>
        ),
    },
    wechat: {
        name: '微信',
        bgColor: 'bg-gradient-to-br from-green-50 to-emerald-100',
        iconBg: 'bg-green-500',
        textColor: 'text-green-700',
        icon: (
            <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="currentColor">
                <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 0 1 .598.082l1.584.926a.272.272 0 0 0 .14.047c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 0 1-.023-.156.49.49 0 0 1 .201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-6.656-6.088V8.89c-.135-.01-.27-.027-.406-.032zm-2.183 3.166c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.969-.982z" />
            </svg>
        ),
    },
    default: {
        name: '链接',
        bgColor: 'bg-gradient-to-br from-zinc-50 to-zinc-100',
        iconBg: 'bg-zinc-400',
        textColor: 'text-zinc-600',
        icon: (
            <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
        ),
    },
};

interface SocialCardProps {
    item: GridItem;
    onClick?: () => void;
    editable?: boolean;
}

export const SocialCard: React.FC<SocialCardProps> = ({
    item,
    onClick,
    editable = false,
}) => {
    const platform = item.platform || 'default';
    const config = PLATFORM_CONFIG[platform] || PLATFORM_CONFIG.default;
    const title = item.title || config.name;
    const subtitle = item.subtitle || (item.content ? `@${item.content.replace('@', '')}` : '');

    const handleClick = (e: React.MouseEvent) => {
        if (editable && onClick) {
            e.preventDefault();
            onClick();
        }
    };

    const CardContent = () => (
        <div className={`h-full w-full ${config.bgColor} rounded-xl p-4 flex flex-col items-center justify-center gap-3 shadow-sm hover:shadow-md transition-all duration-200 ${editable ? 'cursor-pointer' : ''}`}>
            {/* 图标 */}
            <div className={`w-14 h-14 ${config.iconBg} rounded-2xl flex items-center justify-center shadow-md`}>
                {config.icon}
            </div>

            {/* 标题 */}
            <div className="text-center">
                <div className={`font-semibold ${config.textColor}`}>{title}</div>
                {subtitle && (
                    <div className="text-sm text-zinc-400 mt-0.5">{subtitle}</div>
                )}
            </div>
        </div>
    );

    if (editable) {
        return (
            <div onClick={handleClick} className="h-full w-full">
                <CardContent />
            </div>
        );
    }

    // 非编辑模式，作为链接
    const href = item.content?.startsWith('http')
        ? item.content
        : platform === 'twitter'
            ? `https://twitter.com/${item.content?.replace('@', '')}`
            : platform === 'github'
                ? `https://github.com/${item.content?.replace('@', '')}`
                : item.content || '#';

    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="block h-full w-full"
        >
            <CardContent />
        </a>
    );
};

export { PLATFORM_CONFIG };
