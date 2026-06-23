/**
 * Equipments API
 * Equipment and category endpoints
 */

import { serverFetch, clientFetch, buildQueryString } from './client';
import { Equipment, EquipmentCategory } from '@/types/equipment';

interface GetAllEquipmentsParams {
  limit?: number;
  offset?: number;
}

/**
 * Get all equipments with pagination
 * @param params - Pagination params
 * @param options - Fetch options
 */
export async function getAllEquipments(
  params: GetAllEquipmentsParams = {},
  options?: RequestInit
): Promise<Equipment[]> {
  const query = buildQueryString({
    limit: params.limit ?? 100,
    offset: params.offset ?? 0,
  });
  
  const response = await serverFetch<Equipment[]>(`/equipments/get-all${query}`, {
    ...options,
    next: options?.next ?? { revalidate: 300 },
  });
  return response.data;
}

/**
 * Get equipment categories
 * @param options - Fetch options
 */
export async function getEquipmentCategories(options?: RequestInit): Promise<EquipmentCategory[]> {
  const response = await serverFetch<EquipmentCategory[]>('/tags/get-all-categories', {
    ...options,
    next: options?.next ?? { revalidate: 3600 },
  });
  return response.data;
}

// ==================== Client-side hooks helpers ====================

/**
 * Client-side: Get all equipments
 */
export function fetchEquipments(limit: number = 100): Promise<Equipment[]> {
  const query = buildQueryString({ limit, offset: 0 });
  return clientFetch<Equipment[]>(`/equipments/get-all${query}`);
}

/**
 * Client-side: Get equipment categories
 */
export function fetchEquipmentCategories(): Promise<EquipmentCategory[]> {
  return clientFetch<EquipmentCategory[]>('/tags/get-all-categories');
}
