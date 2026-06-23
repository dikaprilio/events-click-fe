import type { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/api/posts';
import { getPublishedPages } from '@/lib/api/dynamic-pages';
import { indexedStaticRoutes } from '@/lib/seo/site';
import { absoluteUrl, getPostSlug } from '@/lib/seo/url';

export const dynamic = 'force-dynamic';

function staticEntries(): MetadataRoute.Sitemap {
  const now = new Date();

  return indexedStaticRoutes.map((route) => ({
    url: absoluteUrl(route),
    lastModified: now,
    changeFrequency: route === '/' ? 'weekly' : 'monthly',
    priority: route === '/' ? 1 : 0.7,
  }));
}

async function withTimeout<T>(
  fetcher: (signal: AbortSignal) => Promise<T>,
  timeoutMs = 4000
): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetcher(controller.signal);
  } finally {
    clearTimeout(timeout);
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries = staticEntries();

  const [postsResult, pagesResult] = await Promise.allSettled([
    withTimeout((signal) => getAllPosts({ next: { revalidate: 300 }, signal })),
    withTimeout((signal) => getPublishedPages({ next: { revalidate: 300 }, signal })),
  ]);

  if (postsResult.status === 'fulfilled') {
    entries.push(
      ...postsResult.value.map((post) => ({
        url: absoluteUrl(`/events/${getPostSlug(post)}`),
        lastModified: post.updated_at || post.created_at,
        changeFrequency: 'monthly' as const,
        priority: 0.8,
      }))
    );
  }

  if (pagesResult.status === 'fulfilled') {
    entries.push(
      ...pagesResult.value
        .filter((page) => page.is_published)
        .map((page) => ({
          url: absoluteUrl(`/${page.slug}`),
          lastModified: page.updated_at || page.created_at,
          changeFrequency: 'monthly' as const,
          priority: 0.6,
        }))
    );
  }

  return entries;
}
