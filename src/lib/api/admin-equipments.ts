/**
 * Admin Equipments API
 * CRUD operations for equipments (requires admin auth)
 */

import { clientFetch } from './client';
import { Equipment } from '@/types/equipment';

export interface CreateEquipmentData {
  name: string;
  description?: string;
  category_id?: number | string;
  image: File;
}

export interface UpdateEquipmentData {
  name?: string;
  description?: string;
  category_id?: number | string;
  image?: File;
}

/**
 * Create new equipment
 */
export async function createEquipment(data: CreateEquipmentData): Promise<Equipment> {
  const formData = new FormData();
  formData.append('name', data.name);
  if (data.description) formData.append('description', data.description);
  if (data.category_id) formData.append('category_id', data.category_id.toString());
  formData.append('image', data.image);

  return clientFetch<Equipment>('/equipments/add', {
    method: 'POST',
    body: formData,
  });
}

/**
 * Update equipment
 */
export async function updateEquipment(id: number | string, data: UpdateEquipmentData): Promise<Equipment> {
  const formData = new FormData();
  if (data.name) formData.append('name', data.name);
  if (data.description !== undefined) formData.append('description', data.description);
  if (data.category_id) formData.append('category_id', data.category_id.toString());
  if (data.image) formData.append('image', data.image);

  return clientFetch<Equipment>(`/equipments/edit/${id}`, {
    method: 'PUT',
    body: formData,
  });
}

/**
 * Delete equipment
 */
export async function deleteEquipment(id: number | string): Promise<void> {
  return clientFetch<void>(`/equipments/delete/${id}`, {
    method: 'DELETE',
  });
}
