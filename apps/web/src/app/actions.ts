'use server';

import { getCloudflareContext } from '@opennextjs/cloudflare';
import { GridLayoutData, UserProfile, PublicPageData } from '@/types/grid';

import { drizzle } from 'drizzle-orm/d1';
import { user } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function saveGrid(userId: string, data: GridLayoutData) {
  const { env } = await getCloudflareContext();
  const id = crypto.randomUUID();
  const now = Date.now();

  try {
    const stmt = env.DB.prepare(
      `INSERT INTO grids (id, user_id, data, created_at, updated_at) VALUES (?, ?, ?, ?, ?)`,
    ).bind(id, userId, JSON.stringify(data), now, now);

    await stmt.run();
    return { success: true, id };
  } catch (error) {
    console.error('Failed to save grid:', error);
    return { success: false, error: 'Failed to save grid' };
  }
}

export async function publishGrid(userId: string, data: GridLayoutData) {
  const { env } = await getCloudflareContext();
  const db = drizzle(env.DB);

  try {
    // Get user profile
    const userData = await db.select().from(user).where(eq(user.id, userId)).get();
    const username = userData?.username;

    if (!username) {
      return { success: false, error: 'Username not set' };
    }

    // Build complete public page data
    const publicData: PublicPageData = {
      profile: {
        name: userData.name,
        username: username,
        avatar: userData.image || undefined,
        bio: userData.bio || undefined,
        tags: userData.tags ? JSON.parse(userData.tags) : undefined,
      },
      grid: data,
    };

    const key = `profile:${username}`;
    await env.KV.put(key, JSON.stringify(publicData));

    return { success: true, username };
  } catch (error) {
    console.error('Failed to publish grid:', error);
    return { success: false, error: 'Failed to publish grid' };
  }
}

export async function getGrid(userId: string) {
  const { env } = await getCloudflareContext();
  const db = drizzle(env.DB);

  try {
    const stmt = env.DB.prepare(`SELECT * FROM grids WHERE user_id = ? ORDER BY updated_at DESC LIMIT 1`).bind(userId);

    const result = await stmt.first();

    // Fetch complete user profile
    const userData = await db.select({
      username: user.username,
      name: user.name,
      image: user.image,
      bio: user.bio,
      tags: user.tags,
    }).from(user).where(eq(user.id, userId)).get();

    const profile: UserProfile | null = userData ? {
      name: userData.name,
      username: userData.username || '',
      avatar: userData.image || undefined,
      bio: userData.bio || undefined,
      tags: userData.tags ? JSON.parse(userData.tags) : undefined,
    } : null;

    if (!result) return { data: null, username: userData?.username, profile };

    return {
      ...result,
      data: JSON.parse(result.data as string) as GridLayoutData,
      username: userData?.username,
      profile,
    };
  } catch (error) {
    console.error('Failed to get grid:', error);
    return null;
  }
}

export async function updateUsername(userId: string, username: string) {
  if (username.length < 5) {
    return { success: false, error: 'Username must be at least 5 characters long.' };
  }

  const { env } = await getCloudflareContext();
  const db = drizzle(env.DB);

  try {
    await db.update(user).set({ username }).where(eq(user.id, userId)).run();
    return { success: true };
  } catch (error: any) {
    if (error.message?.includes('UNIQUE constraint failed')) {
      return { success: false, error: 'Username already taken.' };
    }
    console.error('Failed to update username:', error);
    return { success: false, error: 'Failed to update username.' };
  }
}

export async function getPublicGrid(username: string): Promise<PublicPageData | null> {
  const { env } = await getCloudflareContext();
  try {
    const key = `profile:${username}`;
    const data = await env.KV.get(key);
    if (!data) return null;
    return JSON.parse(data) as PublicPageData;
  } catch (error) {
    console.error('Failed to get public grid:', error);
    return null;
  }
}

export async function updateUserProfile(
  userId: string,
  profile: Partial<Pick<UserProfile, 'bio' | 'tags'>>
) {
  const { env } = await getCloudflareContext();
  const db = drizzle(env.DB);

  try {
    const updates: { bio?: string; tags?: string } = {};
    if (profile.bio !== undefined) updates.bio = profile.bio;
    if (profile.tags !== undefined) updates.tags = JSON.stringify(profile.tags);

    await db.update(user).set(updates).where(eq(user.id, userId)).run();
    return { success: true };
  } catch (error) {
    console.error('Failed to update user profile:', error);
    return { success: false, error: 'Failed to update profile.' };
  }
}
