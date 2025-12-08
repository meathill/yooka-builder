export interface GridItem {
  id: string;
  x: number; // Column start (1-based)
  y: number; // Row start (1-based)
  w: number; // Width (column span)
  h: number; // Height (row span)
  type: 'text' | 'image' | 'app' | 'video' | 'social';
  content: string; // URL for image/video, text content, etc.
}

export interface GridLayoutData {
  rows: number;
  cols: number;
  items: GridItem[];
}
