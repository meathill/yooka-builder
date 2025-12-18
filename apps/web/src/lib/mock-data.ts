import { GridLayoutData, UserProfile } from '@/types/grid';

// 默认网格布局模拟数据 - 用于展示新设计效果
export const DEFAULT_GRID_DATA: GridLayoutData = {
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
export const DEFAULT_PROFILE: UserProfile = {
  name: '肉山Meathill',
  username: 'meathill',
  avatar: 'https://avatars.githubusercontent.com/u/1032389?v=4',
  bio: '我是一名游走于设计与代码之间的全栈创造者。我不只交付代码，我交付的是那种让人眼前一亮、丝般顺滑的数字体验。',
  tags: ['全栈开发工程师', 'youtuber', 'B站Up'],
  domain: 'yooka.me/meathill',
};
