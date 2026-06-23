'use client';

import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-keys';
import { 
  fetchPosts, 
  fetchPostById, 
  fetchPostByName, 
  fetchRandomPosts 
} from '@/lib/api/posts';
import { Post } from '@/types/post';

/**
 * Hook to fetch all posts
 * Uses staleTime of 5 minutes since posts don't change frequently
 */
export function usePosts() {
  return useQuery<Post[]>({
    queryKey: queryKeys.posts.lists(),
    queryFn: fetchPosts,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook to fetch a single post by ID
 */
export function usePost(id: string | number | null) {
  return useQuery<Post>({
    queryKey: queryKeys.posts.detail(id ?? ''),
    queryFn: () => fetchPostById(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Hook to fetch a single post by name/slug
 */
export function usePostByName(name: string | null) {
  return useQuery<Post>({
    queryKey: queryKeys.posts.byName(name ?? ''),
    queryFn: () => fetchPostByName(name!),
    enabled: !!name,
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Hook to fetch random posts for homepage
 * Uses longer staleTime since these are for display only
 */
export function useRandomPosts(count: number = 5) {
  return useQuery<Post[]>({
    queryKey: queryKeys.posts.random(count),
    queryFn: () => fetchRandomPosts(count),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}
