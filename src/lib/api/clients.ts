/**
 * Clients API
 * Client portfolio endpoints
 */

import { serverFetch, clientFetch, buildQueryString } from './client';
import { Client } from '@/types/client';

interface GetAllClientsParams {
  limit?: number;
  offset?: number;
}

/**
 * Get all clients with pagination
 * @param params - Pagination params
 * @param options - Fetch options
 */
export async function getAllClients(
  params: GetAllClientsParams = {},
  options?: RequestInit
): Promise<Client[]> {
  const query = buildQueryString({
    limit: params.limit ?? 100,
    offset: params.offset ?? 0,
  });
  
  const response = await serverFetch<Client[]>(`/clients/get-all${query}`, {
    ...options,
    next: options?.next ?? { revalidate: 300 },
  });
  return response.data;
}

// ==================== Client-side hooks helpers ====================

/**
 * Client-side: Get all clients
 */
export function fetchClients(limit: number = 100): Promise<Client[]> {
  const query = buildQueryString({ limit, offset: 0 });
  return clientFetch<Client[]>(`/clients/get-all${query}`);
}
