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

export interface CustomElementInput {
  element_name: string;
  section: string;
  element_type: string;
  content?: string | null;
  link_url?: string | null;
  element_file?: File | null;
}

function toCustomElementFormData(input: CustomElementInput): FormData {
  const formData = new FormData();
  formData.append('element_name', input.element_name);
  formData.append('section', input.section);
  formData.append('element_type', input.element_type);
  if (input.content !== undefined && input.content !== null) {
    formData.append('content', input.content);
  }
  if (input.link_url !== undefined && input.link_url !== null) {
    formData.append('link_url', input.link_url);
  }
  if (input.element_file) {
    formData.append('element_file', input.element_file);
  }
  return formData;
}

export function createCustomElement(input: CustomElementInput): Promise<CustomElement> {
  return clientFetch<CustomElement>('/custom-elements/add', {
    method: 'POST',
    body: toCustomElementFormData(input),
  });
}

export function updateCustomElement(id: number, input: Partial<CustomElementInput>): Promise<CustomElement> {
  const formData = new FormData();
  Object.entries(input).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    if (key === 'element_file' && value instanceof File) {
      formData.append('element_file', value);
      return;
    }
    if (key !== 'element_file') {
      formData.append(key, String(value));
    }
  });

  return clientFetch<CustomElement>(`/custom-elements/update/${id}`, {
    method: 'PUT',
    body: formData,
  });
}

export function deleteCustomElement(id: number): Promise<{ id: number }> {
  return clientFetch<{ id: number }>(`/custom-elements/delete/${id}`, {
    method: 'DELETE',
  });
}
