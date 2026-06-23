'use client';

interface EquipmentCardSkeletonProps {
  count?: number;
}

export function EquipmentCardSkeleton({ count = 8 }: EquipmentCardSkeletonProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="glass-card overflow-hidden animate-pulse"
          style={{ animationDelay: `${0.1 * (i % 4)}s` }}
        >
          {/* Image Skeleton */}
          <div className="relative h-60 bg-secondary">
            <div className="absolute inset-0 bg-gray-800/50" />
            {/* Category Badge Skeleton */}
            <div className="absolute top-4 left-4">
              <div className="h-6 w-20 bg-gray-700/50 rounded-full" />
            </div>
          </div>

          {/* Content Skeleton */}
          <div className="p-6 space-y-3">
            <div className="h-5 w-3/4 bg-gray-800/50 rounded" />
            <div className="h-4 w-full bg-gray-800/50 rounded" />
            <div className="h-4 w-2/3 bg-gray-800/50 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
