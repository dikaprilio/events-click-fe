/**
 * Custom Elements API (CMS)
 * Site content management endpoints
 */

import { serverFetch, clientFetch } from './client';
import { CustomElement } from '@/types/custom-element';

/**
 * Get all custom elements
 * @param options - Fetch options
 */
export async function getAllCustomElements(options?: RequestInit): Promise<CustomElement[]> {
  const response = await serverFetch<CustomElement[]>('/custom-elements/get-all', {
    ...options,
    next: options?.next ?? { revalidate: 60 },
  });
  return response.data;
}

/**
 * Get custom element by ID
 * @param id - Element ID
 * @param options - Fetch options
 */
export async function getCustomElementById(
  id: string | number,
  options?: RequestInit
): Promise<CustomElement> {
  const response = await serverFetch<CustomElement>(`/custom-elements/id/${id}`, {
    ...options,
    cache: options?.cache ?? 'no-store',
  });
  return response.data;
}

/**
 * Get custom elements by section
 * @param section - Section name (hero, services, cta, footer, etc.)
 * @param options - Fetch options
 */
export async function getCustomElementsBySection(
  section: string,
  options?: RequestInit
): Promise<CustomElement[]> {
  const response = await serverFetch<CustomElement[]>(
    `/custom-elements/section/${encodeURIComponent(section)}`,
    {
      ...options,
      next: options?.next ?? { revalidate: 60 },
    }
  );
  return response.data;
}

/**
 * Get custom elements by type
 * @param type - Element type (button, text, image, etc.)
 * @param options - Fetch options
 */
export async function getCustomElementsByType(
  type: string,
  options?: RequestInit
): Promise<CustomElement[]> {
  const response = await serverFetch<CustomElement[]>(
    `/custom-elements/type/${encodeURIComponent(type)}`,
    {
      ...options,
      next: options?.next ?? { revalidate: 60 },
    }
  );
  return response.data;
}

// ==================== Client-side hooks helpers ====================

/**
 * Client-side: Get all custom elements
 */
export function fetchCustomElements(): Promise<CustomElement[]> {
  return clientFetch<CustomElement[]>('/custom-elements/get-all');
}

/**
 * Client-side: Get custom elements by section
 */
export function fetchCustomElementsBySection(section: string): Promise<CustomElement[]> {
  return clientFetch<CustomElement[]>(`/custom-elements/section/${encodeURIComponent(section)}`);
}
