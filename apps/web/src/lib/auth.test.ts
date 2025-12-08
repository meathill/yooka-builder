import { describe, it, expect, vi } from 'vitest';
import { getAuth } from './auth';

// Mock dependencies
vi.mock("better-auth", () => ({
  betterAuth: vi.fn((config) => ({ config })),
}));

vi.mock("better-auth/adapters/drizzle", () => ({
  drizzleAdapter: vi.fn(() => "mock-adapter"),
}));

vi.mock("drizzle-orm/d1", () => ({
  drizzle: vi.fn(() => "mock-db"),
}));

vi.mock("../db/schema", () => ({
  user: {},
  session: {},
  account: {},
  verification: {},
}));

describe('Auth Configuration', () => {
  it('should initialize better-auth with Drizzle adapter and GitHub provider', () => {
    const mockEnv = {
      DB: {},
      GITHUB_CLIENT_ID: 'mock-id',
      GITHUB_CLIENT_SECRET: 'mock-secret',
    } as any;

    const authInstance = getAuth(mockEnv);

    // Verify configuration passed to betterAuth
    const config = (authInstance as any).config;
    
    expect(config.database).toBe("mock-adapter");
    expect(config.emailAndPassword.enabled).toBe(true);
    expect(config.socialProviders.github).toEqual({
      clientId: 'mock-id',
      clientSecret: 'mock-secret',
    });
  });
});
