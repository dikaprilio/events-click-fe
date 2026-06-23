import { EquipmentCardSkeleton } from '@/components/equipments/EquipmentCardSkeleton';

export default function EquipmentsLoading() {
  const categories = [
    'All Equipment',
    'Sound System',
    'Lighting',
    'Truss & Construction',
    'Multimedia',
  ];

  return (
    <div className="pt-20">
      {/* Hero Section Skeleton */}
      <section className="py-20 text-center bg-[radial-gradient(circle_at_center,rgba(0,168,235,0.1)_0%,transparent_70%)]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="h-12 w-80 bg-gray-800/50 rounded mx-auto mb-4 animate-pulse" />
          <div className="h-8 w-96 bg-gray-800/50 rounded mx-auto animate-pulse" />
        </div>
      </section>

      {/* Equipment Grid Skeleton */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-6">
          {/* Filter Buttons Skeleton */}
          <div className="flex justify-center flex-wrap gap-3 mb-16">
            {categories.map((_, i) => (
              <div
                key={i}
                className="h-10 w-32 bg-gray-800/50 rounded-full animate-pulse"
                style={{ animationDelay: `${0.1 * i}s` }}
              />
            ))}
          </div>
          {/* Grid Skeleton */}
          <EquipmentCardSkeleton count={8} />
        </div>
      </section>
    </div>
  );
}
