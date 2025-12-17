export interface GridItem {
  id: string;
  x: number; // Column start (1-based)
  y: number; // Row start (1-based)
  w: number; // Width (column span)
  h: number; // Height (row span)
  type: 'text' | 'image' | 'app' | 'video' | 'social' | 'profile';
  content: string; // URL for image/video, text content, etc.
  platform?: 'xiaohongshu' | 'bilibili' | 'youtube' | 'twitter' | 'github' | 'wechat' | 'default';
  title?: string;      // 卡片标题
  subtitle?: string;   // 卡片副标题
}

export interface GridLayoutData {
  rows: number;
  cols: number;
  items: GridItem[];
}

export interface UserProfile {
  name: string;
  username: string;
  avatar?: string;
  bio?: string;
  tags?: string[];
  domain?: string;  // 自定义域名显示
}

export interface PublicPageData {
  profile: UserProfile;
  grid: GridLayoutData;
}
