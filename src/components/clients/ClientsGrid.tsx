'use client';

import { Client } from '@/types/client';
import { ClientCard } from './ClientCard';

interface ClientsGridProps {
  clients: Client[];
}

export function ClientsGrid({ clients }: ClientsGridProps) {
  if (clients.length === 0) {
    return (
      <div className="text-center py-20 text-muted-foreground text-lg">
        <p>No clients found.</p>
      </div>
    );
  }

  // Display max 12 clients (4x3 grid)
  const displayClients = clients.slice(0, 12);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1.5">
      {displayClients.map((client) => (
        <ClientCard key={client.id} client={client} />
      ))}
    </div>
  );
}
