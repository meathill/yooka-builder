import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { PropertyPanel } from './PropertyPanel';
import { GridItem } from '../types/grid';

const MOCK_ITEM: GridItem = {
  id: 'item-1',
  x: 1,
  y: 1,
  w: 2,
  h: 2,
  type: 'text',
  content: 'Hello',
};

describe('PropertyPanel', () => {
  it('renders empty state when no item is selected', () => {
    render(<PropertyPanel item={null} onUpdate={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText('Select an item to edit')).toBeDefined();
  });

  it('renders item properties when an item is selected', () => {
    render(<PropertyPanel item={MOCK_ITEM} onUpdate={vi.fn()} onDelete={vi.fn()} />);
    
    // Check ID
    expect(screen.getByText(/ID: item-1/)).toBeDefined();
    
    // Check Layout Inputs
    expect(screen.getByLabelText('X')).toHaveValue(1);
    expect(screen.getByLabelText('Width')).toHaveValue(2);
    
    // Check Content Input (for text type)
    expect(screen.getByText('Hello')).toBeDefined();
  });
});
