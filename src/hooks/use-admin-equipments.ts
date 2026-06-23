'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-keys';
import {
  createEquipment,
  updateEquipment,
  deleteEquipment,
  type CreateEquipmentData,
  type UpdateEquipmentData
} from '@/lib/api/admin-equipments';
import { Equipment } from '@/types/equipment';

/**
 * Hook to create new equipment
 */
export function useCreateEquipment() {
  const queryClient = useQueryClient();

  return useMutation<Equipment, Error, CreateEquipmentData>({
    mutationFn: createEquipment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.equipments.lists() });
    },
  });
}

/**
 * Hook to update equipment
 */
export function useUpdateEquipment() {
  const queryClient = useQueryClient();

  return useMutation<Equipment, Error, { id: number | string; data: UpdateEquipmentData }>({
    mutationFn: ({ id, data }) => updateEquipment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.equipments.lists() });
    },
  });
}

/**
 * Hook to delete equipment
 */
export function useDeleteEquipment() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number | string>({
    mutationFn: deleteEquipment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.equipments.lists() });
    },
  });
}
