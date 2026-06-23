/**
 * Admin Users API
 * CRUD operations for users (requires admin auth)
 */

import { clientFetch } from './client';
import { User } from '@/types/user';

export interface CreateUserData {
  username: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
}

export interface UpdateUserData {
  username?: string;
  email?: string;
  password?: string;
  role?: 'admin' | 'user';
}

/**
 * Get all users
 */
export async function getUsers(): Promise<User[]> {
  return clientFetch<User[]>('/users/get-all');
}

/**
 * Get single user
 */
export async function getUser(id: number | string): Promise<User> {
  return clientFetch<User>(`/users/${id}`);
}

/**
 * Create new user
 */
export async function createUser(data: CreateUserData): Promise<User> {
  return clientFetch<User>('/users/create', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Update user
 */
export async function updateUser(id: number | string, data: UpdateUserData): Promise<User> {
  return clientFetch<User>(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/**
 * Delete user
 */
export async function deleteUser(id: number | string): Promise<void> {
  return clientFetch<void>(`/users/delete/${id}`, {
    method: 'DELETE',
  });
}
