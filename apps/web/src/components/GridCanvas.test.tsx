import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { GridCanvas } from './GridCanvas';
import { GridLayoutData } from '../types/grid';

// Reuse the DnD mock setup because GridCanvas uses DnD heavily
vi.mock('@dnd-kit/core', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@dnd-kit/core')>();
  return {
    ...actual,
    useDraggable: () => ({
      attributes: {},
      listeners: {},
      setNodeRef: vi.fn(),
      transform: null,
      isDragging: false,
    }),
    DndContext: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    useSensor: vi.fn(),
    useSensors: vi.fn(),
    PointerSensor: 'PointerSensor',
  };
});

const MOCK_DATA: GridLayoutData = {
  rows: 4,
  cols: 4,
  items: [
    {
      id: '1',
      x: 1,
      y: 1,
      w: 2,
      h: 2,
      type: 'text',
      content: 'Test Content',
    },
    {
      id: '2',
      x: 3,
      y: 1,
      w: 1,
      h: 1,
      type: 'video',
      content: 'https://youtube.com/watch?v=test',
    },
    {
      id: '3',
      x: 3,
      y: 2,
      w: 1,
      h: 1,
      type: 'social',
      content: '@testuser',
    },
  ],
};

describe('GridCanvas', () => {
  it('renders grid items correctly', () => {
    render(
      <GridCanvas
        data={MOCK_DATA}
        onSelect={vi.fn()}
      />,
    );
    expect(screen.getByText('Test Content')).toBeDefined();
    expect(screen.getByText('https://youtube.com/watch?v=test')).toBeDefined();
    expect(screen.getByText('@testuser')).toBeDefined();
  });

  it('renders correct number of items', () => {
    render(
      <GridCanvas
        data={MOCK_DATA}
        onSelect={vi.fn()}
      />,
    );
    // We expect 3 items
    const items = screen.getAllByText(/Test Content|youtube|@testuser/);
    expect(items).toHaveLength(3);
  });
});
