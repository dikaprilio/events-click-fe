'use client';

interface PostCardSkeletonProps {
  count?: number;
  className?: string;
}

export function PostCardSkeleton({ count = 6, className = '' }: PostCardSkeletonProps) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="glass-card overflow-hidden animate-pulse"
          style={{ animationDelay: `${0.1 * (i % 3)}s` }}
        >
          {/* Image Skeleton */}
          <div className="relative h-60 bg-secondary">
            <div className="absolute inset-0 bg-gray-800/50" />
          </div>

          {/* Content Skeleton */}
          <div className="p-6 space-y-4">
            {/* Tag and Date */}
            <div className="flex justify-between items-center">
              <div className="h-4 w-16 bg-gray-800/50 rounded" />
              <div className="h-4 w-20 bg-gray-800/50 rounded" />
            </div>

            {/* Title */}
            <div className="h-6 w-3/4 bg-gray-800/50 rounded" />

            {/* Description */}
            <div className="space-y-2">
              <div className="h-4 w-full bg-gray-800/50 rounded" />
              <div className="h-4 w-2/3 bg-gray-800/50 rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Compact skeleton for related posts
 */
export function PostCardCompactSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="glass-card overflow-hidden animate-pulse">
          <div className="h-48 bg-gray-800/50" />
          <div className="p-6">
            <div className="h-5 w-3/4 bg-gray-800/50 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
