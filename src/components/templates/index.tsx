'use client';

import { PromoTemplate, type PromoContent } from './PromoTemplate';
import { GalleryTemplate, type GalleryContent } from './GalleryTemplate';
import { SimpleTemplate, type SimpleContent } from './SimpleTemplate';
import { type TemplateType } from '@/lib/api/dynamic-pages';

export { PromoTemplate, type PromoContent } from './PromoTemplate';
export { GalleryTemplate, type GalleryContent } from './GalleryTemplate';
export { SimpleTemplate, type SimpleContent } from './SimpleTemplate';

// Union type for all template content types
export type TemplateContent = PromoContent | GalleryContent | SimpleContent;

// Template type mapping
export const TEMPLATE_COMPONENTS = {
  promo: 'PromoTemplate',
  gallery: 'GalleryTemplate',
  simple: 'SimpleTemplate',
} as const;

// Template labels for UI
export const TEMPLATE_LABELS: Record<TemplateType, string> = {
  promo: 'Promo / Package',
  gallery: 'Gallery Showcase',
  simple: 'Simple Page',
};

// Template descriptions
export const TEMPLATE_DESCRIPTIONS: Record<TemplateType, string> = {
  promo: 'Perfect for special offers and service packages with pricing and features',
  gallery: 'Showcase your past events with an image gallery and lightbox',
  simple: 'Flexible content page with rich text editor',
};

// Template form schemas
export const templateSchemas = {
  promo: {
    fields: [
      { name: 'heroTitle', label: 'Hero Title', type: 'text', required: true },
      { name: 'heroSubtitle', label: 'Hero Subtitle', type: 'textarea' },
      { name: 'price', label: 'Price', type: 'text' },
      { name: 'features', label: 'Features', type: 'array' },
      { name: 'ctaText', label: 'CTA Text', type: 'text' },
      { name: 'ctaLink', label: 'CTA Link', type: 'text' },
    ]
  },
  gallery: {
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'description', label: 'Description', type: 'richtext' },
      { name: 'eventDate', label: 'Event Date', type: 'date' },
      { name: 'venue', label: 'Venue', type: 'text' },
      { name: 'clientName', label: 'Client Name', type: 'text' },
      { name: 'images', label: 'Images', type: 'image-array' },
    ]
  },
  simple: {
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'content', label: 'Content', type: 'richtext', required: true },
    ]
  },
};

// Client-side template renderer component
interface PageTemplateRendererProps {
  templateType: TemplateType;
  content: Record<string, any>;
}

export function PageTemplateRenderer({ templateType, content }: PageTemplateRendererProps) {
  switch (templateType) {
    case 'promo':
      return <PromoTemplate content={content as PromoContent} />;
    case 'gallery':
      return <GalleryTemplate content={content as GalleryContent} />;
    case 'simple':
      return <SimpleTemplate content={content as SimpleContent} />;
    default:
      return (
        <div className="p-8 text-center text-red-500">
          Unknown template type: {templateType}
        </div>
      );
  }
}
