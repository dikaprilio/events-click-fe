'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { motion, useMotionValue } from 'framer-motion';
import { useRandomPosts } from '@/hooks/use-posts';
import { getImageUrl } from '@/lib/utils';
import { Post } from '@/types/post';

const CARD_WIDTH_VW = 70;
const GAP_VW = 2.5;
const TOTAL_WIDTH_VW = CARD_WIDTH_VW + GAP_VW;

export default function LatestWorks() {
  const { data: posts, isLoading, error } = useRandomPosts(5);

  if (error) {
    return (
      <section className="py-24 bg-background overflow-hidden">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">Latest Works</h2>
          <p className="text-muted-foreground">Unable to load latest works.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-background overflow-hidden">
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">Latest Works</h2>
            <p className="text-muted-foreground text-lg max-w-xl">
              Highlights from our recent events and productions.
            </p>
          </div>
          <Link href="/events" className="hidden md:flex btn btn-outline animate-fade-in-up [animation-delay:0.1s]">
            View All Projects
          </Link>
        </div>

        {isLoading ? (
          <LatestWorksSkeleton />
        ) : (
          <>
            {/* Desktop View: Uniform Grid */}
            <div className="hidden md:grid md:grid-cols-3 gap-12">
              {posts?.slice(0, 3).map((post, index) => (
                <WorkCard key={post.id} post={post} index={index} />
              ))}
            </div>

            {/* Mobile View: Motion Infinite Carousel */}
            {posts && posts.length > 0 && (
              <MobileCarousel posts={posts} />
            )}
          </>
        )}
      </div>
    </section>
  );
}

/**
 * Mobile Carousel Component
 */
function MobileCarousel({ posts }: { posts: Post[] }) {
  // Tripling the list for infinite scroll effect
  const extendedPosts = [...posts, ...posts, ...posts, ...posts, ...posts];
  const postsLength = posts.length;

  // Start in the middle set
  const [index, setIndex] = useState(postsLength * 2);
  const dragX = useMotionValue(0);

  const onDragEnd = () => {
    const x = dragX.get();
    const DRAG_THRESHOLD = 50;

    if (x <= -DRAG_THRESHOLD) {
      setIndex((pv) => pv + 1);
    } else if (x >= DRAG_THRESHOLD) {
      setIndex((pv) => pv - 1);
    }
  };

  // Infinite Loop Reset Logic
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (index < postsLength) {
        setIndex(index + postsLength * 2);
      } else if (index >= postsLength * 4) {
        setIndex(index - postsLength * 2);
      }
    }, 500);
    return () => clearTimeout(timeout);
  }, [index, postsLength]);

  return (
    <div className="md:hidden relative h-[500px] flex items-center justify-center overflow-visible">
      <div className="relative w-full h-[400px] max-w-[100vw] mx-auto overflow-visible">
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          style={{ x: dragX }}
          animate={{ translateX: `calc(15vw - ${index * TOTAL_WIDTH_VW}vw)` }}
          transition={{ type: 'spring', mass: 1, stiffness: 200, damping: 25 }}
          onDragEnd={onDragEnd}
          className="flex cursor-grab active:cursor-grabbing items-center gap-[2.5vw]"
        >
          {extendedPosts.map((post, i) => {
            const isActive = index === i;
            return (
              <motion.div
                key={`${post.id}-${i}`}
                className="w-[70vw] shrink-0 rounded-[2.5rem] bg-secondary shadow-lg overflow-hidden"
                animate={{
                  scale: isActive ? 1 : 0.9,
                  opacity: isActive ? 1 : 0.4,
                  y: isActive ? 0 : 20,
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              >
                <WorkCard post={post} index={i % postsLength} isMobile />
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Indicators */}
      <div className="absolute -bottom-12 flex gap-2 justify-center w-full">
        {posts.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(postsLength * 2 + i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              (index % postsLength) === i ? 'bg-primary w-8' : 'bg-foreground/20 w-2'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * Work Card Component
 */
function WorkCard({ post, index, isMobile = false }: { 
  post: Post; 
  index: number; 
  isMobile?: boolean;
}) {
  const slug = post.event_name.toLowerCase().replace(/\s+/g, '-');
  const firstImage = post.images?.[0];
  const imagePath = firstImage?.url || firstImage?.image_path;
  const imageUrl = imagePath ? getImageUrl(imagePath) : null;

  return (
    <Link
      href={`/events/${slug}`}
      className="group relative block w-full outline-none"
      style={{
        animationDelay: !isMobile ? `${0.1 + (0.1 * index)}s` : '0s',
      }}
      draggable={false}
    >
      {/* Main Image Container */}
      <div className={`relative aspect-[4/5] overflow-hidden ${isMobile ? '' : 'rounded-[2.5rem] bg-secondary shadow-lg'}`}>
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
            sizes="(max-width: 768px) 70vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-900" />
        )}
        
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500" />
        
        <div className="absolute top-6 left-6 z-20">
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[10px] font-bold uppercase tracking-[0.2em] text-white">
            {post.tag?.name || post.tag_name || 'Event'}
          </span>
        </div>

        {/* Floating Info Card */}
        <div className="absolute -bottom-4 -right-2 left-6 z-20 transition-all duration-500 group-hover:-translate-y-2">
          <div className="bg-background border border-foreground/5 shadow-xl rounded-2xl p-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-primary font-bold mb-1">
                  {post.tag?.name || post.tag_name || 'Event'}
                </p>
                <h3 className="text-lg md:text-xl font-display font-bold text-foreground leading-tight group-hover:text-primary transition-colors">
                  {post.title}
                </h3>
              </div>
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-foreground/10 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:border-primary group-hover:text-white transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 md:w-5 md:h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

/**
 * Loading Skeleton
 */
function LatestWorksSkeleton() {
  return (
    <>
      {/* Desktop Skeleton */}
      <div className="hidden md:grid md:grid-cols-3 gap-12">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="relative aspect-[4/5] rounded-[2.5rem] bg-secondary overflow-hidden animate-pulse">
            <div className="absolute inset-0 bg-gray-800/50" />
            <div className="absolute -bottom-4 -right-2 left-6 z-20">
              <div className="bg-background border border-foreground/5 shadow-xl rounded-2xl p-5 space-y-3">
                <div className="h-3 w-16 bg-gray-800/50 rounded" />
                <div className="h-6 w-3/4 bg-gray-800/50 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile Skeleton */}
      <div className="md:hidden flex justify-center">
        <div className="w-[70vw] aspect-[4/5] rounded-[2.5rem] bg-secondary overflow-hidden animate-pulse">
          <div className="w-full h-full bg-gray-800/50" />
        </div>
      </div>
    </>
  );
}
