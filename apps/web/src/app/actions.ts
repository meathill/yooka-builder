'use server';

import { getCloudflareContext } from "@opennextjs/cloudflare";
import { GridLayoutData } from "@/types/grid";

import { drizzle } from "drizzle-orm/d1";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function saveGrid(userId: string, data: GridLayoutData) {
  const { env } = await getCloudflareContext();
  const id = crypto.randomUUID();
  const now = Date.now();

  try {
    const stmt = env.DB.prepare(
      `INSERT INTO grids (id, user_id, data, created_at, updated_at) VALUES (?, ?, ?, ?, ?)`
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
    // Get username
    const userData = await db.select().from(user).where(eq(user.id, userId)).get();
    const username = userData?.username;

    console.log(`[publishGrid] Publishing for userId: ${userId}, found username: ${username}`);

    if (!username) {
        return { success: false, error: 'Username not set' };
    }

    const key = `profile:${username}`;
    console.log(`[publishGrid] Writing to KV key: ${key}`);
    await env.KV.put(key, JSON.stringify(data));
    console.log(`[publishGrid] Write successful`);

    return { success: true, username };
  } catch (error) {
    console.error('Failed to publish grid:', error);
    return { success: false, error: 'Failed to publish grid' };
  }
}

import { user as userTable } from "@/db/schema";

export async function getGrid(userId: string) {
  const { env } = await getCloudflareContext();
  const db = drizzle(env.DB);

  try {
    const stmt = env.DB.prepare(
        `SELECT * FROM grids WHERE user_id = ? ORDER BY updated_at DESC LIMIT 1`
    ).bind(userId);

    const result = await stmt.first();

    // Also fetch user profile for username
    const userData = await db.select({ username: userTable.username }).from(userTable).where(eq(userTable.id, userId)).get();

    if (!result) return { data: null, username: userData?.username };

    return {
        ...result,
        data: JSON.parse(result.data as string) as GridLayoutData,
        username: userData?.username
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
        await db.update(user)
            .set({ username })
            .where(eq(user.id, userId))
            .run();
        return { success: true };
    } catch (error: any) {
        if (error.message?.includes('UNIQUE constraint failed')) {
            return { success: false, error: 'Username already taken.' };
        }
        console.error('Failed to update username:', error);
        return { success: false, error: 'Failed to update username.' };
    }
}

export async function getPublicGrid(username: string) {
    const { env } = await getCloudflareContext({ async: true });
    try {
        const key = `profile:${username}`;
        console.log(`[getPublicGrid] Fetching key: ${key}`);
        const data = await env.KV.get(key);
        console.log(`[getPublicGrid] Result for ${key}:`, data ? 'Found' : 'Null');
        if (!data) return null;
        return JSON.parse(data) as GridLayoutData;
    } catch (error) {
        console.error('Failed to get public grid:', error);
        return null;
    }
}
