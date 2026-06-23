export default function EventDetailLoading() {
  return (
    <div className="pt-20">
      {/* Hero Section Skeleton */}
      <section className="relative h-[60vh] min-h-[400px] w-full">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 animate-pulse" />
        
        <div className="absolute inset-0 bg-black/40" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 pb-20 w-full h-full flex items-end">
          <div className="w-full">
            {/* Tags Skeleton */}
            <div className="flex flex-wrap gap-4 mb-4">
              <div className="h-8 w-24 bg-white/20 rounded-full animate-pulse" />
              <div className="h-8 w-32 bg-white/10 rounded-full animate-pulse" />
            </div>
            
            {/* Title Skeleton */}
            <div className="h-16 w-3/4 bg-white/20 rounded mb-6 animate-pulse" />
            
            {/* Description Skeleton */}
            <div className="h-6 w-1/2 bg-white/10 rounded animate-pulse" />
          </div>
        </div>
      </section>

      {/* Content Section Skeleton */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            {/* Main Content Skeleton */}
            <div className="lg:col-span-2 space-y-8">
              <div className="glass-card p-8 space-y-4">
                <div className="h-8 w-48 bg-gray-800/50 rounded animate-pulse" />
                <div className="space-y-3">
                  <div className="h-4 w-full bg-gray-800/50 rounded animate-pulse" />
                  <div className="h-4 w-full bg-gray-800/50 rounded animate-pulse" />
                  <div className="h-4 w-2/3 bg-gray-800/50 rounded animate-pulse" />
                </div>
                
                {/* Images Grid Skeleton */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="h-64 bg-gray-800/50 rounded-xl animate-pulse" />
                  <div className="h-64 bg-gray-800/50 rounded-xl animate-pulse" />
                </div>
              </div>
            </div>

            {/* Sidebar Skeleton */}
            <div className="space-y-8">
              <div className="glass-card p-8 space-y-6">
                <div className="h-6 w-32 bg-gray-800/50 rounded animate-pulse" />
                <div className="space-y-4">
                  <div>
                    <div className="h-4 w-24 bg-gray-800/30 rounded mb-1 animate-pulse" />
                    <div className="h-6 w-40 bg-gray-800/50 rounded animate-pulse" />
                  </div>
                  <div>
                    <div className="h-4 w-20 bg-gray-800/30 rounded mb-1 animate-pulse" />
                    <div className="h-6 w-32 bg-gray-800/50 rounded animate-pulse" />
                  </div>
                  <div>
                    <div className="h-4 w-16 bg-gray-800/30 rounded mb-1 animate-pulse" />
                    <div className="h-6 w-28 bg-gray-800/50 rounded animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
