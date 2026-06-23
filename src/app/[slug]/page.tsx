import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getPageBySlug } from '@/lib/api/dynamic-pages';
import { PageTemplateRenderer } from '@/components/templates';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  
  try {
    const page = await getPageBySlug(slug);
    return {
      title: `${page.title} | EventsClick`,
      description: page.meta_description || page.title,
    };
  } catch {
    return {
      title: 'Page Not Found | EventsClick',
    };
  }
}

export default async function DynamicPage({ params }: PageProps) {
  const { slug } = await params;

  try {
    const page = await getPageBySlug(slug);

    // Page is not published - return 404
    if (!page.is_published) {
      notFound();
    }

    return (
      <main className="min-h-screen pt-20">
        <PageTemplateRenderer 
          templateType={page.template_type} 
          content={page.content} 
        />
      </main>
    );
  } catch (error) {
    // Log error for debugging
    console.error(`Error fetching page ${slug}:`, error);
    notFound();
  }
}
