import { describe, it, expect, vi, beforeEach } from 'vitest';
import { updateUsername } from './actions';

// Mock dependencies inside the test file instead of referencing external vars
vi.mock('@opennextjs/cloudflare', () => ({
  getCloudflareContext: async () => ({
    env: {
      DB: {},
    },
  }),
}));

const mockUpdate = vi.fn();
const mockSet = vi.fn().mockReturnValue({
  where: vi.fn().mockReturnValue({
    run: mockUpdate,
  }),
});

vi.mock('drizzle-orm/d1', () => ({
  drizzle: () => ({
    update: vi.fn(() => ({
      set: mockSet,
    })),
  }),
}));

vi.mock('@/db/schema', () => ({
  user: {},
}));

vi.mock('drizzle-orm', () => ({
  eq: vi.fn(),
}));

describe('User Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fail if username is too short', async () => {
    const result = await updateUsername('user1', 'abcd');
    expect(result.success).toBe(false);
    expect(result.error).toContain('5 characters');
  });

  it('should update username if valid', async () => {
    mockUpdate.mockResolvedValue({ success: true });

    const result = await updateUsername('user1', 'validUser');

    expect(result.success).toBe(true);
    expect(mockSet).toHaveBeenCalledWith({ username: 'validUser' });
  });
});
