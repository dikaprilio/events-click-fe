/**
 * React Query Keys
 * Centralized cache key management for consistent invalidation
 * 
 * Pattern: [entity, 'list' | 'detail', ...identifiers]
 */

export const queryKeys = {
  posts: {
    all: ['posts'] as const,
    lists: () => [...queryKeys.posts.all, 'list'] as const,
    list: (filters: Record<string, unknown> = {}) => 
      [...queryKeys.posts.lists(), filters] as const,
    details: () => [...queryKeys.posts.all, 'detail'] as const,
    detail: (id: string | number) => [...queryKeys.posts.details(), id] as const,
    byName: (name: string) => [...queryKeys.posts.details(), 'name', name] as const,
    random: (count: number) => [...queryKeys.posts.all, 'random', count] as const,
  },
  
  equipments: {
    all: ['equipments'] as const,
    lists: () => [...queryKeys.equipments.all, 'list'] as const,
    list: (params: { limit?: number; offset?: number } = {}) => 
      [...queryKeys.equipments.lists(), params] as const,
    categories: () => [...queryKeys.equipments.all, 'categories'] as const,
  },
  
  clients: {
    all: ['clients'] as const,
    lists: () => [...queryKeys.clients.all, 'list'] as const,
    list: (params: { limit?: number; offset?: number } = {}) => 
      [...queryKeys.clients.lists(), params] as const,
  },
  
  users: {
    all: ['users'] as const,
    lists: () => [...queryKeys.users.all, 'list'] as const,
    details: () => [...queryKeys.users.all, 'detail'] as const,
    detail: (id: string | number) => [...queryKeys.users.details(), id] as const,
  },
  
  customElements: {
    all: ['customElements'] as const,
    lists: () => [...queryKeys.customElements.all, 'list'] as const,
    bySection: (section: string) => 
      [...queryKeys.customElements.all, 'section', section] as const,
    byType: (type: string) => 
      [...queryKeys.customElements.all, 'type', type] as const,
    detail: (id: string | number) => 
      [...queryKeys.customElements.all, 'detail', id] as const,
  },
} as const;

/**
 * Helper to invalidate all lists of an entity
 */
export function getEntityListKeys(entity: keyof typeof queryKeys) {
  return [queryKeys[entity].all];
}
