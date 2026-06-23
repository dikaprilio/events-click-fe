'use client';

interface ClientCardSkeletonProps {
  count?: number;
}

export function ClientCardSkeleton({ count = 12 }: ClientCardSkeletonProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1.5">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="p-4 animate-pulse aspect-[4/3] flex items-center justify-center"
          style={{ animationDelay: `${0.05 * i}s` }}
        >
          <div className="w-full h-16 bg-gray-800/30 rounded" />
        </div>
      ))}
    </div>
  );
}
