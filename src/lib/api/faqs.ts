import { clientFetch, serverFetch } from './client';

export interface FaqItem {
  id: number;
  question: string;
  answer: string;
  display_order: number;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface FaqInput {
  question: string;
  answer: string;
  display_order?: number;
  is_active?: boolean;
}

export async function getFaqs(options?: RequestInit): Promise<FaqItem[]> {
  const response = await serverFetch<FaqItem[]>('/faqs/get-all', {
    ...options,
    next: options?.next ?? { revalidate: 300 },
  });
  return response.data;
}

export function fetchFaqs(): Promise<FaqItem[]> {
  return clientFetch<FaqItem[]>('/faqs/get-all');
}

export function fetchAdminFaqs(): Promise<FaqItem[]> {
  return clientFetch<FaqItem[]>('/faqs/admin/get-all');
}

export function createFaq(input: FaqInput): Promise<FaqItem> {
  return clientFetch<FaqItem>('/faqs/add', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function updateFaq(id: number, input: Partial<FaqInput>): Promise<FaqItem> {
  return clientFetch<FaqItem>(`/faqs/update/${id}`, {
    method: 'PUT',
    body: JSON.stringify(input),
  });
}

export function deleteFaq(id: number): Promise<{ id: number }> {
  return clientFetch<{ id: number }>(`/faqs/delete/${id}`, {
    method: 'DELETE',
  });
}
