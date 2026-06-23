'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Client } from '@/types/client';
import { getImageUrl } from '@/lib/utils';

interface ClientCardProps {
  client: Client;
}

export function ClientCard({ client }: ClientCardProps) {
  const imageUrl = client.ImagePath ? getImageUrl(client.ImagePath) : null;
  const slug = client.clientName.toLowerCase().replace(/\s+/g, '-');

  return (
    <Link
      href={`/events/${slug}`}
      className="group relative flex items-center justify-center p-4 transition-all duration-300"
    >
      {/* Logo Container */}
      <div className="relative w-full h-24 flex items-center justify-center">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={client.clientName}
            fill
            className="object-contain opacity-70 group-hover:opacity-100 transition-opacity duration-300"
            sizes="(max-width: 768px) 50vw, 33vw"
          />
        ) : (
          <span className="text-2xl font-bold text-foreground/50 group-hover:text-foreground transition-colors">
            {client.clientName}
          </span>
        )}
      </div>
    </Link>
  );
}
