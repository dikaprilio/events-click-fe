import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllPosts, getPostByName } from '@/lib/api/posts';
import { Post } from '@/types/post';
import { getImageUrl, formatDate } from '@/lib/utils';
import { EventGallery } from './EventGallery';
import { Calendar, Tag, Sparkles, ArrowRight } from 'lucide-react';
import JsonLd from '@/components/JsonLd';
import { breadcrumbSchema, eventPortfolioSchema, webPageSchema } from '@/lib/seo/schema';
import { absoluteUrl, getPostHeaderImageUrl, getPostSlug, stripHtml, trimText } from '@/lib/seo/url';

export const dynamicParams = true;

interface EventDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: EventDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const post = await getPostByName(slug);
    const postSlug = getPostSlug(post);
    const description = trimText(stripHtml(post.description), 155) || `Portfolio event ${post.title} by eventsclick.`;
    const imageUrl = getPostHeaderImageUrl(post);

    return {
      title: post.title,
      description,
      alternates: {
        canonical: absoluteUrl(`/events/${postSlug}`),
      },
      openGraph: {
        title: `${post.title} | eventsclick`,
        description,
        url: absoluteUrl(`/events/${postSlug}`),
        type: 'article',
        publishedTime: post.created_at,
        modifiedTime: post.updated_at || post.created_at,
        images: imageUrl
          ? [
            {
              url: imageUrl,
              alt: `${post.title} event by eventsclick`,
            },
          ]
          : undefined,
      },
      twitter: {
        card: 'summary_large_image',
        title: `${post.title} | eventsclick`,
        description,
        images: imageUrl ? [imageUrl] : undefined,
      },
    };
  } catch {
    return {
      title: 'Event Not Found',
      description: 'The requested event could not be found.',
      robots: {
        index: false,
        follow: false,
      },
    };
  }
}

async function getRelatedPosts(currentPost: Post, limit: number = 3): Promise<Post[]> {
  try {
    const allPosts = await getAllPosts({ next: { revalidate: 300 } });
    return allPosts
      .filter((p) => p.tag_id === currentPost.tag_id && p.id !== currentPost.id)
      .slice(0, limit);
  } catch {
    return [];
  }
}

export default async function EventDetail({ params }: EventDetailPageProps) {
  const { slug } = await params;

  let post: Post;
  try {
    post = await getPostByName(slug);
  } catch {
    notFound();
  }

  const relatedPosts = await getRelatedPosts(post, 3);
  const postSlug = getPostSlug(post);
  const schemas = [
    webPageSchema({
      name: post.title,
      description: trimText(stripHtml(post.description), 220) || `Portfolio event ${post.title} by eventsclick.`,
      path: `/events/${postSlug}`,
      image: getPostHeaderImageUrl(post),
    }),
    eventPortfolioSchema(post),
    breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Events', path: '/events' },
      { name: post.title, path: `/events/${postSlug}` },
    ]),
  ];

  // Explicit header image, fallback to first image
  const headerImage =
    post.images?.find((img) => img.is_header) || post.images?.[0];
  const headerImagePath = headerImage?.url || headerImage?.image_url;
  const headerImageUrl = headerImagePath ? getImageUrl(headerImagePath) : null;

  // Gallery images exclude the header for variety, or include all if only a few
  const galleryImages =
    post.images && post.images.length > 1
      ? post.images.filter((img) => img.id !== headerImage?.id)
      : post.images || [];

  return (
    <article className="min-h-screen bg-background transition-colors duration-300">
      <JsonLd data={schemas} />
      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[500px] w-full flex items-end overflow-hidden">
        {headerImageUrl ? (
          <Image
            src={headerImageUrl}
            alt={post.title}
            fill
            className="object-cover z-0"
            priority
            sizes="100vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 z-0" />
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10 z-10" />

        {/* Decorative blue glow */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-primary/20 to-transparent z-10 pointer-events-none" />

        <div className="relative z-20 w-full max-w-6xl mx-auto px-6 pb-16 md:pb-24">
          <div className="flex flex-wrap items-center gap-3 mb-5 animate-fade-in-up">
            <span className="inline-flex items-center gap-1.5 bg-primary text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-primary">
              <Sparkles className="w-3.5 h-3.5" />
              {post.tag?.name || post.tag_name || 'Event'}
            </span>
            <span className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md text-white text-xs font-semibold px-4 py-1.5 rounded-full border border-white/20">
              <Calendar className="w-3.5 h-3.5" />
              {formatDate(post.created_at)}
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-5 drop-shadow-lg max-w-4xl leading-[1.1] animate-fade-in-up [animation-delay:0.1s]">
            {post.title}
          </h1>

          {post.description && (
            <p className="text-lg md:text-xl text-white/85 max-w-2xl leading-relaxed drop-shadow-md animate-fade-in-up [animation-delay:0.2s]">
              {post.description}
            </p>
          )}
        </div>
      </section>

      {/* Details Bar */}
      <section className="relative z-30 -mt-8 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="glass-card rounded-2xl px-6 py-5 md:px-10 md:py-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-6 md:gap-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Tag className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
                    Category
                  </p>
                  <p className="text-sm md:text-base font-semibold text-foreground">
                    {post.tag?.name || post.tag_name || 'Uncategorized'}
                  </p>
                </div>
              </div>

              <div className="hidden md:block w-px h-10 bg-border/50" />

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
                    Date
                  </p>
                  <p className="text-sm md:text-base font-semibold text-foreground">
                    {formatDate(post.created_at)}
                  </p>
                </div>
              </div>

              <div className="hidden md:block w-px h-10 bg-border/50" />

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
                    Event
                  </p>
                  <p className="text-sm md:text-base font-semibold text-foreground">
                    {post.event_name}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Editorial Content */}
      <section className="py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-6">
          <div className="animate-fade-in-up [animation-delay:0.1s]">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
              About the Project
            </h2>
            <div className="prose prose-lg max-w-none text-muted-foreground leading-relaxed">
              {post.description ? (
                <p className="text-lg md:text-xl leading-[1.8]">{post.description}</p>
              ) : (
                <p className="italic text-muted-foreground/70">
                  No detailed description available for this event.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      {galleryImages.length > 0 && (
        <EventGallery images={galleryImages} title={post.title} />
      )}

      {/* Related Projects */}
      {relatedPosts.length > 0 && (
        <section className="py-20 md:py-28 bg-secondary transition-colors duration-300">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex items-end justify-between mb-10 md:mb-14">
              <div>
                <span className="text-primary text-sm font-bold uppercase tracking-wider mb-2 block">
                  Explore More
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                  Related Projects
                </h2>
              </div>
              <Link
                href="/events"
                className="hidden md:inline-flex items-center gap-2 text-primary font-semibold hover:underline"
              >
                View all events
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {relatedPosts.map((relatedPost) => {
                const relatedSlug = relatedPost.event_name
                  .toLowerCase()
                  .replace(/\s+/g, '-');
                const relatedImage = relatedPost.images?.find((img) => img.is_header) || relatedPost.images?.[0];
                const relatedImagePath = relatedImage?.url || relatedImage?.image_url;
                const relatedImageUrl = relatedImagePath
                  ? getImageUrl(relatedImagePath)
                  : null;

                return (
                  <Link
                    href={`/events/${relatedSlug}`}
                    key={relatedPost.id}
                    className="group block rounded-2xl overflow-hidden bg-card border border-border/50 shadow-sm hover:shadow-glow transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="relative h-56 md:h-64 overflow-hidden">
                      {relatedImageUrl ? (
                        <Image
                          src={relatedImageUrl}
                          alt={relatedPost.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-900" />
                      )}
                      <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <div className="p-5 md:p-6">
                      <span className="text-xs font-bold text-primary uppercase tracking-wider">
                        {relatedPost.tag?.name || relatedPost.tag_name || 'Event'}
                      </span>
                      <h4 className="text-lg font-bold text-foreground mt-2 group-hover:text-primary transition-colors line-clamp-2">
                        {relatedPost.title}
                      </h4>
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                        {relatedPost.description || ''}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>

            <div className="mt-10 md:hidden text-center">
              <Link
                href="/events"
                className="inline-flex items-center gap-2 text-primary font-semibold hover:underline"
              >
                View all events
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}
    </article>
  );
}
