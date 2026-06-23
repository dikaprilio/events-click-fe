/**
 * Posts API
 * Blog/Event endpoints
 */

import { serverFetch, clientFetch, buildQueryString } from './client';
import { Post } from '@/types/post';

/**
 * Get all posts
 * @param options - Fetch options for caching
 */
export async function getAllPosts(options?: RequestInit): Promise<Post[]> {
  const response = await serverFetch<Post[]>('/posts/get-all', {
    ...options,
    cache: options?.cache ?? 'no-store',
  });
  return response.data;
}

/**
 * Get post by ID
 * @param id - Post ID
 * @param options - Fetch options
 */
export async function getPostById(id: string | number, options?: RequestInit): Promise<Post> {
  const response = await serverFetch<Post>(`/posts/id/${id}`, {
    ...options,
    cache: options?.cache ?? 'no-store',
  });
  return response.data;
}

/**
 * Get post by name/slug
 * @param name - Post slug/event name
 * @param options - Fetch options
 */
export async function getPostByName(name: string, options?: RequestInit): Promise<Post> {
  const response = await serverFetch<Post>(`/posts/name/${encodeURIComponent(name)}`, {
    ...options,
    cache: options?.cache ?? 'no-store',
  });
  return response.data;
}

/**
 * Get random posts (for homepage)
 * @param count - Number of posts to fetch
 * @param options - Fetch options
 */
export async function getRandomPosts(count: number = 5, options?: RequestInit): Promise<Post[]> {
  const query = buildQueryString({ count });
  const response = await serverFetch<Post[]>(`/posts/random${query}`, {
    ...options,
    next: options?.next ?? { revalidate: 60 },
  });
  return response.data;
}

// ==================== Client-side hooks helpers ====================

/**
 * Client-side: Get all posts
 */
export function fetchPosts(): Promise<Post[]> {
  return clientFetch<Post[]>('/posts/get-all');
}

/**
 * Client-side: Get post by ID
 */
export function fetchPostById(id: string | number): Promise<Post> {
  return clientFetch<Post>(`/posts/id/${id}`);
}

/**
 * Client-side: Get post by name
 */
export function fetchPostByName(name: string): Promise<Post> {
  return clientFetch<Post>(`/posts/name/${encodeURIComponent(name)}`);
}

/**
 * Client-side: Get random posts
 */
export function fetchRandomPosts(count: number = 5): Promise<Post[]> {
  const query = buildQueryString({ count });
  return clientFetch<Post[]>(`/posts/random${query}`);
}
