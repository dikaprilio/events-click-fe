import { siteConfig } from './site';
import { Post, PostImage } from '@/types/post';
import { getImageUrl } from '@/lib/utils';

export function absoluteUrl(path = '/'): string {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${siteConfig.url.replace(/\/$/, '')}${normalizedPath}`;
}

export function trimText(value: string | undefined | null, maxLength: number): string {
  if (!value) return '';
  const clean = value.replace(/\s+/g, ' ').trim();
  if (clean.length <= maxLength) return clean;
  return `${clean.slice(0, maxLength - 3).trim()}...`;
}

export function stripHtml(value: string | undefined | null): string {
  if (!value) return '';
  return value
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function getPostSlug(post: Pick<Post, 'slug' | 'event_name' | 'title'>): string {
  return post.slug || slugify(post.event_name || post.title);
}

export function getPostHeaderImage(post: Pick<Post, 'images'>): PostImage | undefined {
  return post.images?.find((image) => image.is_header) || post.images?.[0];
}

export function getPostHeaderImageUrl(post: Pick<Post, 'images'>): string | undefined {
  const image = getPostHeaderImage(post);
  const imagePath = image?.url || image?.image_url || image?.image_path;
  return imagePath ? getImageUrl(imagePath) : undefined;
}

export function getDefaultOgImageUrl(): string {
  return absoluteUrl(siteConfig.ogImage);
}
