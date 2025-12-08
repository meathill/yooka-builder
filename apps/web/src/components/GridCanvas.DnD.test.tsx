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
  ],
};

describe('GridCanvas DnD', () => {
  it('renders draggable items', () => {
    render(<GridCanvas data={MOCK_DATA} onSelect={vi.fn()} />);
    expect(screen.getByText('Test Content')).toBeDefined();
  });
});
