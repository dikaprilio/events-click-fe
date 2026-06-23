'use client';

import { useState, useMemo } from 'react';
import { Equipment } from '@/types/equipment';
import { EquipmentGrid } from './EquipmentGrid';
import { EquipmentCardSkeleton } from './EquipmentCardSkeleton';

interface Category {
  id: string;
  label: string;
  categoryId?: number; // Optional: untuk mapping ke category_id dari API
}

interface EquipmentFilterProps {
  equipments: Equipment[];
  categories: Category[];
  isLoading?: boolean;
}

export function EquipmentFilter({ equipments, categories, isLoading }: EquipmentFilterProps) {
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredEquipments = useMemo(() => {
    if (activeCategory === 'all') return equipments;
    
    // Cari category yang aktif
    const activeCat = categories.find(cat => cat.id === activeCategory);
    
    // Filter berdasarkan category_id jika tersedia, atau slug
    return equipments.filter(equipment => {
      if (activeCat?.categoryId) {
        // Filter by category_id dari API
        return equipment.category_id === activeCat.categoryId;
      }
      // Fallback: filter by category_name atau slug comparison
      const equipmentSlug = equipment.category_name?.toLowerCase().replace(/\s+/g, '-');
      return equipmentSlug === activeCategory;
    });
  }, [equipments, activeCategory, categories]);

  if (isLoading) {
    return (
      <>
        {/* Filter Buttons Skeleton */}
        <div className="flex justify-center flex-wrap gap-3 mb-16">
          {Array.from({ length: 5 }).map((_, i) => (
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
            onClick={() => setActiveCategory(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <EquipmentGrid equipments={filteredEquipments} />
    </>
  );
}
