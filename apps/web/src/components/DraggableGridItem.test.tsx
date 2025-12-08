import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DraggableGridItem } from './DraggableGridItem';

// Mock dnd-kit hooks
vi.mock('@dnd-kit/core', () => ({
  useDraggable: () => ({
    attributes: {},
    listeners: {},
    setNodeRef: vi.fn(),
    transform: null,
    isDragging: false,
  }),
}));

const MOCK_ITEM = {
  id: 'test-item',
  x: 1,
  y: 1,
  w: 2,
  h: 2,
  type: 'text' as const,
  content: 'Content',
};

describe('DraggableGridItem Resizing', () => {
  it('renders resize handle when not readOnly', () => {
    render(
      <DraggableGridItem 
        item={MOCK_ITEM}
        gridCols={4}
        gridRows={4}
        cellWidth={100}
        rowHeight={100}
        onResizeStart={vi.fn()}
        onResizeMove={vi.fn()}
        onResizeEnd={vi.fn()}
        readOnly={false}
      >
        <div>Child</div>
      </DraggableGridItem>
    );
    
    // Look for the SVG icon inside the handle
    const handle = document.querySelector('.cursor-se-resize');
    expect(handle).toBeDefined();
  });

  it('does not render resize handle when readOnly', () => {
    render(
      <DraggableGridItem 
        item={MOCK_ITEM}
        gridCols={4}
        gridRows={4}
        cellWidth={100}
        rowHeight={100}
        onResizeStart={vi.fn()}
        onResizeMove={vi.fn()}
        onResizeEnd={vi.fn()}
        readOnly={true}
      >
        <div>Child</div>
      </DraggableGridItem>
    );
    
    const handle = document.querySelector('.cursor-se-resize');
    expect(handle).toBeNull();
  });
});
