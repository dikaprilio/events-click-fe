'use client';

import { useClients } from '@/hooks/use-clients';
import { ClientsGrid } from '@/components/clients/ClientsGrid';
import { ClientCardSkeleton } from '@/components/clients/ClientCardSkeleton';

export default function TrustedBy() {
  const { data: clients, isLoading, error } = useClients({ limit: 12 });

  if (error) {
    console.error('Clients fetch error:', error);
    // Silent fail - tidak tampilkan error di UI
    return null;
  }

  return (
    <section className="py-24 bg-background border-t border-foreground/5">
      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h3 className="font-sans text-sm uppercase tracking-[0.2em] text-primary mb-4 font-bold">
            Trusted Network
          </h3>
          <h2 className="text-4xl md:text-5xl font-bold font-display text-foreground">
            Powering Industry Leaders
          </h2>
        </div>

        {/* Clients Grid */}
        {isLoading ? (
          <ClientCardSkeleton count={12} />
        ) : (
          <ClientsGrid clients={clients || []} />
        )}
      </div>
    </section>
  );
}
