'use client';

import { usePosts } from '@/hooks/use-posts';
import { PostFilter } from '@/components/posts/PostFilter';
import { PostCardSkeleton } from '@/components/posts/PostCardSkeleton';

const categories = [
  { id: 'all', label: 'All Events' },
  { id: 'activation', label: 'Activation' },
  { id: 'social', label: 'Social' },
  { id: 'conference', label: 'Conference' },
  { id: 'exhibition', label: 'Exhibition' },
];

export default function EventsClient() {
  const { data: posts, isLoading, error } = usePosts();

  // Debug logging
  if (error) {
    console.error('Events fetch error:', error);
  }

  if (error) {
    return (
      <div className="pt-20">
        <section className="py-20 text-center">
          <div className="max-w-5xl mx-auto px-6">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">Error</h1>
            <p className="text-muted-foreground">
              Failed to load events: {error instanceof Error ? error.message : 'Unknown error'}
            </p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-primary text-white rounded"
            >
              Retry
            </button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="py-20 text-center bg-[radial-gradient(circle_at_center,rgba(0,168,235,0.1)_0%,transparent_70%)]">
        <div className="max-w-5xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in-up text-foreground">
            Our Works
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground animate-fade-in-up [animation-delay:0.1s]">
            Discover our portfolio of unforgettable events and activations.
          </p>
        </div>
      </section>

      {/* Events Grid Section */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-6">
          {isLoading ? (
            <>
              {/* Filter Buttons Skeleton */}
              <div className="flex justify-center flex-wrap gap-3 mb-16">
                {categories.map((_, i) => (
                  <div
                    key={i}
                    className="h-10 w-28 bg-gray-800/50 rounded-full animate-pulse"
                    style={{ animationDelay: `${0.1 * i}s` }}
                  />
                ))}
              </div>
              {/* Grid Skeleton */}
              <PostCardSkeleton count={6} />
            </>
          ) : (
            <PostFilter 
              posts={posts || []} 
              categories={categories}
            />
          )}
        </div>
      </section>
    </div>
  );
}
