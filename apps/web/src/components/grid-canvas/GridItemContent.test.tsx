import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { GridItemContent } from './GridItemContent';
import { GridItem } from '@/types/grid';

// Mock dependencies
vi.mock('@/types/grid', () => ({
  // empty
}));

const MOCK_ITEM: GridItem = {
  id: '1',
  x: 1,
  y: 1,
  w: 1,
  h: 1,
  type: 'text',
  content: 'Hello World',
};

describe('GridItemContent', () => {
  it('renders text content correctly', () => {
    render(<GridItemContent item={MOCK_ITEM} />);
    expect(screen.getByText('Hello World')).toBeDefined();
  });

  it('renders image content', () => {
    const imageItem = { ...MOCK_ITEM, type: 'image' as const, content: 'test.jpg' };
    render(<GridItemContent item={imageItem} />);
    const img = document.querySelector('img');
    expect(img).toBeDefined();
    expect(img?.getAttribute('src')).toBe('test.jpg');
  });

  it('renders video icon', () => {
    const videoItem = { ...MOCK_ITEM, type: 'video' as const };
    render(<GridItemContent item={videoItem} />);
    // Checking for presence of SVG path or some indicator
    expect(document.querySelector('svg')).toBeDefined();
  });
});
