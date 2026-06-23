'use client';

import { Equipment } from '@/types/equipment';
import { EquipmentCard } from './EquipmentCard';

interface EquipmentGridProps {
  equipments: Equipment[];
}

export function EquipmentGrid({ equipments }: EquipmentGridProps) {
  if (equipments.length === 0) {
    return (
      <div className="text-center py-20 text-muted-foreground text-lg">
        <p>No equipment found in this category.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {equipments.map((equipment, index) => (
        <EquipmentCard key={equipment.id} equipment={equipment} index={index} />
      ))}
    </div>
  );
}
