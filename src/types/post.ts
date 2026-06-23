/**
 * Blog/Post Types
 * Maps to backend blog_posts table and related entities
 */

export interface PostImage {
  id: string | number;
  post_id?: number;
  image_path?: string;
  url?: string;
  image_url?: string;
  display_order: number;
  is_header?: boolean;
  created_at?: string;
}

export interface PostTag {
  id: number;
  name: string;
  slug: string;
}

export interface Post {
  id: number;
  title: string;
  event_name: string;
  description?: string;
  slug?: string;
  tag_id?: number;
  tag_name?: string;
  tag_slug?: string;
  tag?: PostTag;
  images: PostImage[];
  created_at: string;
  updated_at?: string;
}

export interface CreatePostRequest {
  title: string;
  event_name: string;
  tag_id: number;
  desc?: string;
}

export interface UpdatePostRequest {
  title?: string;
  event_name?: string;
  tag_id?: number;
  description?: string;
  delete_image_id?: number[];
  edited_image_id?: number[];
}
