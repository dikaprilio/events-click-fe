'use client';

import { useState, useMemo } from 'react';
import { Post } from '@/types/post';
import { PostGrid } from './PostGrid';
import { PostCardSkeleton } from './PostCardSkeleton';

interface Category {
  id: string;
  label: string;
  redirectUrl?: string | null;
}

interface PostFilterProps {
  posts: Post[];
  categories: Category[];
  isLoading?: boolean;
}

export function PostFilter({ posts, categories, isLoading }: PostFilterProps) {
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredPosts = useMemo(() => {
    if (activeCategory === 'all') return posts;
    // Map category slug to tag_id (this depends on your data structure)
    // For now, we'll filter by tag_name or tag.name matching the category
    return posts.filter(post => {
      const tagName = post.tag?.name || post.tag_name || '';
      const tagSlug = post.tag?.slug || post.tag_slug || '';
      return tagSlug === activeCategory || tagName.toLowerCase() === activeCategory.toLowerCase();
    });
  }, [posts, activeCategory]);

  if (isLoading) {
    return (
      <>
        {/* Filter Buttons Skeleton */}
        <div className="flex justify-center flex-wrap gap-3 mb-16">
          {Array.from({ length: 5 }).map((_, i) => (
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
    );
  }

  return (
    <>
      {/* Filter Buttons */}
      <div className="flex justify-center flex-wrap gap-3 mb-16 animate-fade-in-up [animation-delay:0.2s]">
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`px-6 py-2 rounded-full border text-sm font-medium transition-all duration-300 ${
              activeCategory === cat.id
                ? 'bg-primary border-primary text-white'
                : 'bg-transparent border-primary/20 text-muted-foreground hover:border-primary hover:text-primary'
            }`}
            onClick={() => {
              if (cat.redirectUrl) {
                window.location.href = cat.redirectUrl;
                return;
              }
              setActiveCategory(cat.id);
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <PostGrid posts={filteredPosts} />
    </>
  );
}
