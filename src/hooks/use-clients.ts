'use client';

import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-keys';
import { fetchClients } from '@/lib/api/clients';
import { Client } from '@/types/client';

interface UseClientsOptions {
  limit?: number;
}

/**
 * Hook to fetch all clients
 * Uses staleTime of 10 minutes since client list rarely changes
 */
export function useClients(options: UseClientsOptions = {}) {
  const { limit = 100 } = options;
  
  return useQuery<Client[]>({
    queryKey: queryKeys.clients.list({ limit }),
    queryFn: () => fetchClients(limit),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}
