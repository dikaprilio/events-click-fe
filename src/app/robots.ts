import type { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/seo/site';
import { absoluteUrl } from '@/lib/seo/url';

export default function robots(): MetadataRoute.Robots {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction && process.env.NEXT_PUBLIC_ALLOW_NON_PROD_INDEXING !== 'true') {
    return {
      rules: {
        userAgent: '*',
        disallow: '/',
      },
      sitemap: absoluteUrl('/sitemap.xml'),
    };
  }

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/admin/'],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
