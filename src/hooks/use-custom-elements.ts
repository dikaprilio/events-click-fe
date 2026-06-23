'use client';

import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-keys';
import { 
  fetchCustomElements, 
  fetchCustomElementsBySection 
} from '@/lib/api/custom-elements';
import { CustomElement } from '@/types/custom-element';

/**
 * Hook to fetch all custom elements
 */
export function useCustomElements() {
  return useQuery<CustomElement[]>({
    queryKey: queryKeys.customElements.lists(),
    queryFn: fetchCustomElements,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook to fetch custom elements by section
 * @param section - Section name (hero, services, cta, footer, etc.)
 */
export function useCustomElementsBySection(section: string) {
  return useQuery<CustomElement[]>({
    queryKey: queryKeys.customElements.bySection(section),
    queryFn: () => fetchCustomElementsBySection(section),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!section,
  });
}
