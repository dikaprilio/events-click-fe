import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getPageBySlug } from '@/lib/api/dynamic-pages';
import { PageTemplateRenderer } from '@/components/templates';
import JsonLd from '@/components/JsonLd';
import { breadcrumbSchema, dynamicPageSchema } from '@/lib/seo/schema';
import { absoluteUrl, stripHtml, trimText } from '@/lib/seo/url';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  
  try {
    const page = await getPageBySlug(slug);
    const description = trimText(page.meta_description || stripHtml(String(page.content?.description || page.title)), 155);

    return {
      title: page.title,
      description,
      alternates: {
        canonical: absoluteUrl(`/${page.slug}`),
      },
      openGraph: {
        title: `${page.title} | eventsclick`,
        description,
        url: absoluteUrl(`/${page.slug}`),
      },
    };
  } catch {
    return {
      title: 'Page Not Found',
      robots: {
        index: false,
        follow: false,
      },
    };
  }
}

export default async function DynamicPage({ params }: PageProps) {
  const { slug } = await params;
  let page;

  try {
    page = await getPageBySlug(slug);
  } catch (error) {
    // Log error for debugging
    console.error(`Error fetching page ${slug}:`, error);
    notFound();
  }

  // Page is not published - return 404
  if (!page.is_published) {
    notFound();
  }

  const schemas = [
    dynamicPageSchema(page),
    breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: page.title, path: `/${page.slug}` },
    ]),
  ];

  return (
    <main className="min-h-screen pt-20">
      <JsonLd data={schemas} />
      <PageTemplateRenderer
        templateType={page.template_type}
        content={page.content}
      />
    </main>
  );
}
