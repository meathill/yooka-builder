import { describe, it, expect, vi, beforeEach } from 'vitest';
import { saveGrid, getGrid, publishGrid } from './actions';
import { GridLayoutData } from '@/types/grid';

// Mock dependencies
const mockRun = vi.fn();
const mockFirst = vi.fn();
const mockBind = vi.fn().mockReturnValue({
  run: mockRun,
  first: mockFirst,
});
const mockPrepare = vi.fn().mockReturnValue({
  bind: mockBind,
});
const mockPut = vi.fn();

// Mock Drizzle
const mockDrizzleSelect = vi.fn().mockReturnThis();
const mockDrizzleFrom = vi.fn().mockReturnThis();
const mockDrizzleWhere = vi.fn().mockReturnThis();
const mockDrizzleGet = vi.fn();

vi.mock('drizzle-orm/d1', () => ({
  drizzle: () => ({
    select: mockDrizzleSelect,
    from: mockDrizzleFrom,
    where: mockDrizzleWhere,
    get: mockDrizzleGet, // Add get to mock
  }),
}));

// Mock schema and eq
vi.mock('@/db/schema', () => ({
  user: { id: 'id', username: 'username', name: 'name', image: 'image', bio: 'bio', tags: 'tags' },
}));
vi.mock('drizzle-orm', () => ({
  eq: vi.fn(),
}));

vi.mock('@opennextjs/cloudflare', () => ({
  getCloudflareContext: async () => ({
    env: {
      DB: {
        prepare: mockPrepare,
      },
      KV: {
        put: mockPut,
      },
    },
  }),
}));

const MOCK_DATA: GridLayoutData = {
  rows: 1,
  cols: 1,
  items: [],
};

describe('Grid Server Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Setup chain mocks
    mockDrizzleSelect.mockReturnThis();
    mockDrizzleFrom.mockReturnThis();
    mockDrizzleWhere.mockReturnValue({
      get: mockDrizzleGet,
    });
  });

  describe('saveGrid', () => {
    it('should insert grid data into D1', async () => {
      mockRun.mockResolvedValue({ success: true });

      const result = await saveGrid('user1', MOCK_DATA);

      expect(result.success).toBe(true);
      expect(mockPrepare).toHaveBeenCalledWith(expect.stringContaining('INSERT INTO grids'));
      expect(mockBind).toHaveBeenCalledWith(
        expect.any(String), // id
        'user1',
        JSON.stringify(MOCK_DATA),
        expect.any(Number), // created_at
        expect.any(Number), // updated_at
      );
      expect(mockRun).toHaveBeenCalled();
    });

    it('should return error on failure', async () => {
      mockRun.mockRejectedValue(new Error('DB Error'));

      const result = await saveGrid('user1', MOCK_DATA);

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('getGrid', () => {
    it('should retrieve grid data and username from D1', async () => {
      mockFirst.mockResolvedValue({
        id: 'grid1',
        user_id: 'user1',
        data: JSON.stringify(MOCK_DATA),
      });
      mockDrizzleGet.mockResolvedValue({ username: 'testUser', name: 'Test User', image: null, bio: null, tags: null });

      const result = await getGrid('user1');

      expect(result).toMatchObject({
        id: 'grid1',
        user_id: 'user1',
        data: MOCK_DATA,
        username: 'testUser',
      });
      expect(result?.profile).toBeDefined();
      expect(mockPrepare).toHaveBeenCalledWith(expect.stringContaining('SELECT * FROM grids'));
      expect(mockBind).toHaveBeenCalledWith('user1');
    });

    it('should return basic object with null data if no grid found but user exists', async () => {
      mockFirst.mockResolvedValue(null);
      mockDrizzleGet.mockResolvedValue({ username: 'testUser', name: 'Test User', image: null, bio: null, tags: null });

      const result = await getGrid('user1');

      expect(result).toMatchObject({
        data: null,
        username: 'testUser',
      });
      expect(result?.profile).toBeDefined();
    });
  });

  describe('publishGrid', () => {
    it('should put grid data into KV if username exists', async () => {
      mockPut.mockResolvedValue(undefined);
      mockDrizzleGet.mockResolvedValue({
        username: 'validUser',
        name: 'Valid User',
        image: null,
        bio: null,
        tags: null,
      });

      const result = await publishGrid('user1', MOCK_DATA);

      expect(result.success).toBe(true);
      // Now it saves PublicPageData with profile and grid
      expect(mockPut).toHaveBeenCalledWith('profile:validUser', expect.stringContaining('"grid"'));
    });

    it('should fail if username is not set', async () => {
      mockDrizzleGet.mockResolvedValue(null);

      const result = await publishGrid('user1', MOCK_DATA);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Username not set');
    });
  });
});
