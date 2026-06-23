'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-keys';
import {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  type CreateUserData,
  type UpdateUserData
} from '@/lib/api/admin-users';
import { User } from '@/types/user';

/**
 * Hook to fetch all users
 */
export function useUsers() {
  return useQuery<User[]>({
    queryKey: queryKeys.users.lists(),
    queryFn: getUsers,
  });
}

/**
 * Hook to fetch a single user
 */
export function useUser(id: number | string) {
  return useQuery<User>({
    queryKey: queryKeys.users.detail(id),
    queryFn: () => getUser(id),
    enabled: !!id,
  });
}

/**
 * Hook to create new user
 */
export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation<User, Error, CreateUserData>({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() });
    },
  });
}

/**
 * Hook to update user
 */
export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation<User, Error, { id: number | string; data: UpdateUserData }>({
    mutationFn: ({ id, data }) => updateUser(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.detail(id) });
    },
  });
}

/**
 * Hook to delete user
 */
export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number | string>({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() });
    },
  });
}
