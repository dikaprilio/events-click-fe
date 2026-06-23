'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchTags } from '@/lib/api/tags';
import { BlogTag } from '@/lib/api/tags';

const TAGS_QUERY_KEY = 'blogTags';

/**
 * Hook to fetch all blog tags
 */
export function useTags() {
  return useQuery<BlogTag[]>({
    queryKey: [TAGS_QUERY_KEY, 'list'],
    queryFn: fetchTags,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}
