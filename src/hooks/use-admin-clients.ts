'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-keys';
import {
  createClient,
  updateClient,
  deleteClient,
  type CreateClientData,
  type UpdateClientData
} from '@/lib/api/admin-clients';
import { Client } from '@/types/client';

/**
 * Hook to create new client
 */
export function useCreateClient() {
  const queryClient = useQueryClient();

  return useMutation<Client, Error, CreateClientData>({
    mutationFn: createClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.clients.lists() });
    },
  });
}

/**
 * Hook to update client
 */
export function useUpdateClient() {
  const queryClient = useQueryClient();

  return useMutation<Client, Error, { id: number | string; data: UpdateClientData }>({
    mutationFn: ({ id, data }) => updateClient(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.clients.lists() });
    },
  });
}

/**
 * Hook to delete client
 */
export function useDeleteClient() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number | string>({
    mutationFn: deleteClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.clients.lists() });
    },
  });
}
