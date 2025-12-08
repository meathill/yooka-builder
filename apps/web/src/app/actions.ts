'use server';

import { getCloudflareContext } from "@opennextjs/cloudflare";
import { GridLayoutData } from "@/types/grid";

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
  
  try {
    await env.KV.put(`grid:${userId}`, JSON.stringify(data));
    return { success: true };
  } catch (error) {
    console.error('Failed to publish grid:', error);
    return { success: false, error: 'Failed to publish grid' };
  }
}

export async function getGrid(userId: string) {
  const { env } = await getCloudflareContext();
  
  try {
    const stmt = env.DB.prepare(
        `SELECT * FROM grids WHERE user_id = ? ORDER BY updated_at DESC LIMIT 1`
    ).bind(userId);
    
    const result = await stmt.first();
    
    if (!result) return null;
    
    return {
        ...result,
        data: JSON.parse(result.data as string) as GridLayoutData
    };
  } catch (error) {
    console.error('Failed to get grid:', error);
    return null;
  }
}
