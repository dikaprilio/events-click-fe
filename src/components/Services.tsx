'use client';

import Image from 'next/image';
import { ChevronRight } from 'lucide-react';
import { useCustomElementsBySection } from '@/hooks/use-custom-elements';
import { getImageUrl } from '@/lib/utils';

const services = [
  {
    title: 'Event Organizer',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80',
    items: [
      'Concept & Creative Development',
      'Production Plan',
      'Event Management',
      'Man Power',
    ],
  },
  {
    title: 'Technical Event Production',
    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=800&q=80',
    items: [
      'Audio, Visual and Lighting Equipments',
      'Stage Construction and Equipment',
      'Exhibition Construction and Equipment',
      'Multimedia Broadcasting System',
      'Projection Mapping & Interactive Installation',
    ],
  },
  {
    title: 'Event Promotion Support',
    image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=800&q=80',
    items: [
      'Photo and Video Documentation',
      'Animation & Motion Graphics',
      'Poster, Flyer and Banner Production',
      'Event Permits',
      'Media Handling',
    ],
  },
];

export default function Services() {
  const { data: cmsServices } = useCustomElementsBySection('signature_services');
  const dynamicServices = cmsServices
    ?.map((element) => {
      try {
        const parsed = JSON.parse(element.content || '{}') as { title?: string; items?: string[] };
        return {
          title: parsed.title || element.element_name,
          image: element.link_url ? getImageUrl(element.link_url) : services[0].image,
          items: Array.isArray(parsed.items) ? parsed.items : [],
        };
      } catch {
        return null;
      }
    })
    .filter((service): service is { title: string; image: string; items: string[] } => !!service && !!service.title && service.items.length > 0);
  const displayServices = dynamicServices && dynamicServices.length > 0 ? dynamicServices : services;

  return (
    <section className="py-24 bg-background">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold font-display text-foreground mb-6 animate-fade-in-up">
            Signature Services
          </h2>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto animate-fade-in-up [animation-delay:0.1s]">
            Discover a suite of services tailored to bring your event&apos;s vision to life. With{' '}
            <span className="text-primary">Eventsclick</span>, experience the synergy of creativity,
            state-of-the-art technology, and meticulous planning that ensures your occasion shines.
          </p>
        </div>

        {/* Service Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {displayServices.map((service, index) => (
            <div
              key={service.title}
              className="group relative h-[500px] rounded-2xl overflow-hidden animate-fade-in-up"
              style={{ animationDelay: `${0.15 * (index + 1)}s` }}
            >
              {/* Background Image */}
              <Image
                src={service.image}
                alt={service.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

              {/* Content */}
              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                {/* Title */}
                <h3 className="text-2xl font-bold text-white mb-3">
                  {service.title}
                </h3>

                {/* Accent Line */}
                <div className="w-16 h-0.5 bg-accent mb-6" />

                {/* Service Items */}
                <ul className="space-y-3">
                  {service.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-white/90">
                      <ChevronRight className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                      <span className="text-sm leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Hover Overlay Effect */}
              <div className="absolute inset-0 bg-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
