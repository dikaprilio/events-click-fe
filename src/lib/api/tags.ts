/**
 * Blog Tags API
 */

import { serverFetch, clientFetch } from './client';

export interface BlogTag {
  id: number;
  name: string;
  slug: string;
  redirect_url?: string | null;
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

export function createTag(data: Pick<BlogTag, 'name' | 'slug'> & { redirect_url?: string | null }): Promise<BlogTag> {
  return clientFetch<BlogTag>('/blog-tags/add', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateTag(id: number, data: Pick<BlogTag, 'name' | 'slug'> & { redirect_url?: string | null }): Promise<boolean> {
  return clientFetch<boolean>(`/blog-tags/update/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function deleteTag(id: number): Promise<boolean> {
  return clientFetch<boolean>(`/blog-tags/delete/${id}`, {
    method: 'DELETE',
  });
}
