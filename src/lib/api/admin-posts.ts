/**
 * Admin Posts API
 * CRUD operations for posts (requires admin auth)
 */

import { clientFetch } from './client';
import { Post } from '@/types/post';

export interface CreatePostData {
  title: string;
  event_name: string;
  description?: string;
  tag_id?: number | string;
  post_images: File[];
}

export interface UpdatePostData {
  title?: string;
  event_name?: string;
  description?: string;
  tag_id?: number | string;
  new_images?: File[];
  delete_image_id?: number[];
  edited_image_id?: number[];
  updated_image_file?: File[]; // For replacing existing images
  header_image_id?: number;
}

/**
 * Create new post
 */
export async function createPost(data: CreatePostData): Promise<Post> {
  const formData = new FormData();
  formData.append('title', data.title);
  formData.append('event_name', data.event_name);
  if (data.description) formData.append('description', data.description);
  if (data.tag_id) formData.append('tag_id', data.tag_id.toString());

  data.post_images.forEach((file) => {
    formData.append('post_images', file);
  });

  return clientFetch<Post>('/posts/add', {
    method: 'POST',
    body: formData,
  });
}

/**
 * Update post
 */
export async function updatePost(id: number | string, data: UpdatePostData): Promise<Post> {
  const formData = new FormData();

  if (data.title) formData.append('title', data.title);
  if (data.event_name) formData.append('event_name', data.event_name);
  if (data.description !== undefined) formData.append('description', data.description);
  if (data.tag_id) formData.append('tag_id', data.tag_id.toString());

  if (data.delete_image_id) {
    data.delete_image_id.forEach(id => formData.append('delete_image_id', id.toString()));
  }

  if (data.edited_image_id) {
    data.edited_image_id.forEach(id => formData.append('edited_image_id', id.toString()));
  }

  if (data.new_images) {
    data.new_images.forEach(file => formData.append('new_images', file));
  }

  if (data.updated_image_file) {
    data.updated_image_file.forEach(file => formData.append('updated_image_file', file));
  }

  if (data.header_image_id !== undefined) {
    formData.append('header_image_id', data.header_image_id.toString());
  }

  return clientFetch<Post>(`/posts/update/${id}`, {
    method: 'PUT',
    body: formData,
  });
}

/**
 * Delete post
 */
export async function deletePost(id: number | string): Promise<void> {
  return clientFetch<void>(`/posts/delete/${id}`, {
    method: 'DELETE',
  });
}
