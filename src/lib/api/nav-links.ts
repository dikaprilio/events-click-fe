/**
 * Navigation Links API
 */

import { clientFetch } from './client';

export interface NavLink {
  id: number;
  label: string;
  path: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

export interface CreateNavLinkData {
  label: string;
  path: string;
  display_order?: number;
  is_active?: boolean;
}

export interface UpdateNavLinkData {
  label?: string;
  path?: string;
  display_order?: number;
  is_active?: boolean;
}

/**
 * Get all navigation links (public)
 */
export async function getAllNavLinks(): Promise<NavLink[]> {
  return clientFetch<NavLink[]>('/nav-links/get-all');
}

/**
 * Create new nav link (admin)
 */
export async function createNavLink(data: CreateNavLinkData): Promise<NavLink> {
  return clientFetch<NavLink>('/nav-links/add', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Update nav link (admin)
 */
export async function updateNavLink(id: number, data: UpdateNavLinkData): Promise<NavLink> {
  return clientFetch<NavLink>(`/nav-links/update/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/**
 * Delete nav link (admin)
 */
export async function deleteNavLink(id: number): Promise<void> {
  return clientFetch<void>(`/nav-links/delete/${id}`, {
    method: 'DELETE',
  });
}

/**
 * Reorder nav links (admin)
 */
export async function reorderNavLinks(orders: { id: number; display_order: number }[]): Promise<void> {
  return clientFetch<void>('/nav-links/reorder', {
    method: 'POST',
    body: JSON.stringify({ orders }),
  });
}
