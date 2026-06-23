/**
 * Dynamic Pages API
 */

import { clientFetch, serverFetch } from './client';

export type TemplateType = 'promo' | 'gallery' | 'simple';

export interface DynamicPage {
  id: number;
  slug: string;
  title: string;
  template_type: TemplateType;
  content: Record<string, any>;
  meta_description?: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreatePageData {
  slug: string;
  title: string;
  template_type: TemplateType;
  content: Record<string, any>;
  meta_description?: string;
  is_published?: boolean;
}

export interface UpdatePageData {
  slug?: string;
  title?: string;
  template_type?: TemplateType;
  content?: Record<string, any>;
  meta_description?: string;
  is_published?: boolean;
}

/**
 * Get all pages (admin)
 */
export async function getAllPages(): Promise<DynamicPage[]> {
  return clientFetch<DynamicPage[]>('/pages/get-all');
}

/**
 * Get valid template types (admin)
 */
export async function getTemplateTypes(): Promise<TemplateType[]> {
  return clientFetch<TemplateType[]>('/pages/templates');
}

/**
 * Get page by ID (admin)
 */
export async function getPageById(id: number): Promise<DynamicPage> {
  return clientFetch<DynamicPage>(`/pages/${id}`);
}

/**
 * Get page by slug (public - only published)
 * Uses serverFetch for server-side compatibility
 */
export async function getPageBySlug(slug: string): Promise<DynamicPage> {
  const response = await serverFetch<DynamicPage>(`/pages/slug/${slug}`);
  return response.data;
}

/**
 * Create new page (admin)
 */
export async function createPage(data: CreatePageData): Promise<DynamicPage> {
  return clientFetch<DynamicPage>('/pages/create', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Update page (admin)
 */
export async function updatePage(id: number, data: UpdatePageData): Promise<DynamicPage> {
  return clientFetch<DynamicPage>(`/pages/update/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/**
 * Delete page (admin)
 */
export async function deletePage(id: number): Promise<void> {
  return clientFetch<void>(`/pages/delete/${id}`, {
    method: 'DELETE',
  });
}

/**
 * Toggle page publish status (admin)
 */
export async function togglePagePublish(id: number, isPublished: boolean): Promise<void> {
  return clientFetch<void>(`/pages/publish/${id}`, {
    method: 'POST',
    body: JSON.stringify({ is_published: isPublished }),
  });
}

/**
 * Publish/unpublish page (admin) - alias for togglePagePublish
 */
export async function publishPage(id: number, published: boolean): Promise<void> {
  return togglePagePublish(id, published);
}

/**
 * Upload images for a page (admin)
 */
export async function uploadPageImages(id: number, files: File[]): Promise<string[]> {
  const formData = new FormData();
  files.forEach(file => formData.append('page_images', file));
  return clientFetch<string[]>(`/pages/${id}/upload-images`, {
    method: 'POST',
    body: formData,
  });
}

/**
 * Delete a page image (admin)
 */
export async function deletePageImage(id: number, filename: string): Promise<void> {
  return clientFetch<void>(`/pages/${id}/images`, {
    method: 'DELETE',
    body: JSON.stringify({ filename }),
  });
}
