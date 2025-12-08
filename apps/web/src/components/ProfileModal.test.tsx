import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ProfileModal } from './ProfileModal';
import * as actions from '@/app/actions';

// Mock auth-client
vi.mock('@/lib/auth-client', () => ({
  authClient: {
    useSession: vi.fn(() => ({
      data: { user: { id: 'test-user-id' } },
      isPending: false,
    })),
  },
}));

// Mock actions
vi.mock('@/app/actions', () => ({
  updateUsername: vi.fn(),
}));

describe('ProfileModal', () => {
  it('should not render if not open', () => {
    render(<ProfileModal isOpen={false} onClose={vi.fn()} />);
    expect(screen.queryByText('Profile Settings')).toBeNull();
  });

  it('should render when open', () => {
    render(<ProfileModal isOpen={true} onClose={vi.fn()} currentUsername="" />);
    expect(screen.getByText('Profile Settings')).toBeInTheDocument();
  });

  it('should call updateUsername on submit', async () => {
    const mockUpdate = vi.mocked(actions.updateUsername).mockResolvedValue({ success: true });
    const onSuccess = vi.fn();

    render(<ProfileModal isOpen={true} onClose={vi.fn()} onSuccess={onSuccess} />);

    const input = screen.getByLabelText('Username');
    fireEvent.change(input, { target: { value: 'new-username' } });

    const button = screen.getByText('Save Changes');
    fireEvent.click(button);

    expect(mockUpdate).toHaveBeenCalledWith('test-user-id', 'new-username');
    
    await waitFor(() => {
        expect(screen.getByText('Username updated successfully!')).toBeInTheDocument();
        expect(onSuccess).toHaveBeenCalledWith('new-username');
    });
  });

  it('should display error on failure', async () => {
    vi.mocked(actions.updateUsername).mockResolvedValue({ success: false, error: 'Error updating' });

    render(<ProfileModal isOpen={true} onClose={vi.fn()} />);

    const input = screen.getByLabelText('Username');
    fireEvent.change(input, { target: { value: 'new-username' } });

    const button = screen.getByText('Save Changes');
    fireEvent.click(button);

    await waitFor(() => {
        expect(screen.getByText('Error updating')).toBeInTheDocument();
    });
  });
});
