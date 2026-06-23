/**
 * Blog Tags API
 */

import { serverFetch, clientFetch } from './client';

export interface BlogTag {
  id: number;
  name: string;
  slug: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Get all blog tags
 */
export async function getAllTags(): Promise<BlogTag[]> {
  return serverFetch<BlogTag[]>('/blog-tags/get-all').then(r => r.data);
}

/**
 * Client-side: Get all blog tags
 */
export function fetchTags(): Promise<BlogTag[]> {
  return clientFetch<BlogTag[]>('/blog-tags/get-all');
}
