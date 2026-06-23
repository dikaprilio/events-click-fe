'use client';

import { useEquipments, useEquipmentCategories } from '@/hooks/use-equipments';
import { EquipmentFilter } from '@/components/equipments/EquipmentFilter';
import { EquipmentCardSkeleton } from '@/components/equipments/EquipmentCardSkeleton';

export default function EquipmentsClient() {
  const { data: equipments, isLoading: isLoadingEquipments, error: equipmentsError } = useEquipments();
  const { data: categories, isLoading: isLoadingCategories } = useEquipmentCategories();

  // Loading state jika salah satu masih loading
  const isLoading = isLoadingEquipments || isLoadingCategories;

  // Build categories list dari API response dengan categoryId mapping
  const displayCategories = categories?.map(cat => ({
    id: cat.category_name.toLowerCase().replace(/\s+/g, '-'),
    label: cat.category_name,
    categoryId: cat.id, // Pass category_id untuk filtering
    redirectUrl: cat.redirect_url,
  })) || [];

  // Tambah 'All Equipment' di awal
  const allCategories = [
    { id: 'all', label: 'All Equipment' },
    ...displayCategories
  ];

  if (equipmentsError) {
    console.error('Equipments fetch error:', equipmentsError);
    return (
      <div className="pt-20">
        <section className="py-20 text-center">
          <div className="max-w-5xl mx-auto px-6">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">Error</h1>
            <p className="text-muted-foreground">
              Failed to load equipment: {equipmentsError instanceof Error ? equipmentsError.message : 'Unknown error'}
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
            Equipment Rental
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground animate-fade-in-up [animation-delay:0.1s]">
            Top-tier audio, visual, and lighting gear for your event production needs.
          </p>
        </div>
      </section>

      {/* Equipment Grid Section */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-6">
          {isLoading ? (
            <>
              {/* Filter Buttons Skeleton */}
              <div className="flex justify-center flex-wrap gap-3 mb-16">
                {allCategories.map((_, i) => (
                  <div
                    key={i}
                    className="h-10 w-32 bg-gray-800/50 rounded-full animate-pulse"
                    style={{ animationDelay: `${0.1 * i}s` }}
                  />
                ))}
              </div>
              {/* Grid Skeleton */}
              <EquipmentCardSkeleton count={8} />
            </>
          ) : (
            <EquipmentFilter 
              equipments={equipments || []} 
              categories={allCategories}
            />
          )}
        </div>
      </section>
    </div>
  );
}
