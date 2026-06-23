'use client';

import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-keys';
import { fetchEquipments, fetchEquipmentCategories } from '@/lib/api/equipments';
import { Equipment, EquipmentCategory } from '@/types/equipment';

interface UseEquipmentsOptions {
  limit?: number;
}

/**
 * Hook to fetch all equipments
 * Uses staleTime of 10 minutes since equipment inventory rarely changes
 */
export function useEquipments(options: UseEquipmentsOptions = {}) {
  const { limit = 100 } = options;
  
  return useQuery<Equipment[]>({
    queryKey: queryKeys.equipments.list({ limit }),
    queryFn: () => fetchEquipments(limit),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

/**
 * Hook to fetch equipment categories
 * Uses very long staleTime (1 hour) since categories rarely change
 */
export function useEquipmentCategories() {
  return useQuery<EquipmentCategory[]>({
    queryKey: queryKeys.equipments.categories(),
    queryFn: fetchEquipmentCategories,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}
