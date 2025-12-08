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
  });

  describe('saveGrid', () => {
    it('should insert grid data into D1', async () => {
      mockRun.mockResolvedValue({ success: true });
      
      const result = await saveGrid('user1', MOCK_DATA);
      
      expect(result.success).toBe(true);
      expect(mockPrepare).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO grids')
      );
      expect(mockBind).toHaveBeenCalledWith(
        expect.any(String), // id
        'user1',
        JSON.stringify(MOCK_DATA),
        expect.any(Number), // created_at
        expect.any(Number)  // updated_at
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
    it('should retrieve grid data from D1', async () => {
      mockFirst.mockResolvedValue({
        id: 'grid1',
        user_id: 'user1',
        data: JSON.stringify(MOCK_DATA),
      });

      const result = await getGrid('user1');

      expect(result).toEqual({
        id: 'grid1',
        user_id: 'user1',
        data: MOCK_DATA,
      });
      expect(mockPrepare).toHaveBeenCalledWith(
        expect.stringContaining('SELECT * FROM grids')
      );
      expect(mockBind).toHaveBeenCalledWith('user1');
    });

    it('should return null if no grid found', async () => {
      mockFirst.mockResolvedValue(null);

      const result = await getGrid('user1');

      expect(result).toBeNull();
    });
  });

  describe('publishGrid', () => {
    it('should put grid data into KV', async () => {
       mockPut.mockResolvedValue(undefined);

       const result = await publishGrid('user1', MOCK_DATA);

       expect(result.success).toBe(true);
       expect(mockPut).toHaveBeenCalledWith(
         'grid:user1',
         JSON.stringify(MOCK_DATA)
       );
    });
  });
});
