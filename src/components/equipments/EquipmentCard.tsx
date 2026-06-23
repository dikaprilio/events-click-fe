'use client';

import Image from 'next/image';
import { Equipment, getCategorySlug } from '@/types/equipment';
import { getImageUrl } from '@/lib/utils';

interface EquipmentCardProps {
  equipment: Equipment;
  index?: number;
}

export function EquipmentCard({ equipment, index = 0 }: EquipmentCardProps) {
  const imageUrl = equipment.image ? getImageUrl(equipment.image) : null;
  const categorySlug = getCategorySlug(equipment.category_id);

  return (
    <div
      className="glass-card group overflow-hidden animate-fade-in-up hover:-translate-y-2 hover:border-primary/50 transition-all duration-300"
      style={{ animationDelay: `${0.1 * (index % 4)}s` }}
    >
      {/* Image Section */}
      <div className="relative h-60 bg-secondary border-b border-primary/10 overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={equipment.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-900" />
        )}

        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <span className="bg-background/80 backdrop-blur text-foreground text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full border border-primary/20">
            {equipment.category_name || categorySlug}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6">
        <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
          {equipment.name}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {equipment.description}
        </p>
      </div>
    </div>
  );
}
