/**
 * Equipment Types
 * Maps to backend equipment and category_equipment tables
 */

export interface Equipment {
  id: number;
  name: string;
  description: string;
  image: string;
  category_id: number;
  category_name: string;
}

export interface EquipmentCategory {
  id: number;
  category_name: string;
}

/**
 * Frontend category mapping
 * Maps backend category IDs to frontend category slugs
 */
export const CATEGORY_SLUG_MAP: Record<number, string> = {
  1: 'sound',
  2: 'lighting', 
  3: 'truss',
  4: 'multimedia',
};

export const SLUG_CATEGORY_LABELS: Record<string, string> = {
  all: 'All Equipment',
  sound: 'Sound System',
  lighting: 'Lighting',
  truss: 'Truss & Construction',
  multimedia: 'Multimedia',
};

export function getCategorySlug(categoryId: number): string {
  return CATEGORY_SLUG_MAP[categoryId] || 'other';
}

export function getCategoryLabel(slug: string): string {
  return SLUG_CATEGORY_LABELS[slug] || 'Other';
}
