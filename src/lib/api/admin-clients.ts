/**
 * Admin Clients API
 * CRUD operations for clients (requires admin auth)
 */

import { clientFetch } from './client';
import { Client } from '@/types/client';

export interface CreateClientData {
  clientName: string;
  urlPortofolio?: string;
  image: File;
}

export interface UpdateClientData {
  clientName?: string;
  urlPortofolio?: string;
  image?: File;
}

/**
 * Create new client
 */
export async function createClient(data: CreateClientData): Promise<Client> {
  const formData = new FormData();
  formData.append('clientName', data.clientName);
  if (data.urlPortofolio) formData.append('urlPortofolio', data.urlPortofolio);
  formData.append('image', data.image);

  return clientFetch<Client>('/clients/add', {
    method: 'POST',
    body: formData,
  });
}

/**
 * Update client
 */
export async function updateClient(id: number | string, data: UpdateClientData): Promise<Client> {
  const formData = new FormData();
  if (data.clientName) formData.append('clientName', data.clientName);
  if (data.urlPortofolio !== undefined) formData.append('urlPortofolio', data.urlPortofolio);
  if (data.image) formData.append('image', data.image);

  return clientFetch<Client>(`/clients/edit/${id}`, {
    method: 'PUT',
    body: formData,
  });
}

/**
 * Delete client
 */
export async function deleteClient(id: number | string): Promise<void> {
  return clientFetch<void>(`/clients/delete/${id}`, {
    method: 'DELETE',
  });
}
