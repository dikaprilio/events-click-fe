'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useClients } from '@/hooks/use-clients';
import { useDeleteClient } from '@/hooks/use-admin-clients';
import { getImageUrl } from '@/lib/utils';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Client } from '@/types/client';

export default function AdminClientsPage() {
  const { data: clients, isLoading, error } = useClients({ limit: 100 });
  const deleteClient = useDeleteClient();
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);

  const handleDelete = async () => {
    if (!clientToDelete) return;
    
    try {
      await deleteClient.mutateAsync(clientToDelete.id);
      toast.success('Client deleted successfully');
      setClientToDelete(null);
    } catch {
      toast.error('Failed to delete client');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-blue-600 font-semibold mb-1">Trusted Network</p>
            <h1 className="text-2xl font-bold text-gray-900">Powering Industry Leaders</h1>
          </div>
          <div className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="aspect-[4/3] bg-gray-200 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Clients</h1>
        <div className="p-6 border border-red-200 bg-red-50 rounded-lg text-center">
          <p className="text-red-600 font-medium">Failed to load clients</p>
          <p className="text-gray-500 text-sm mt-1">Please check your connection and try again</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header - Matching the public site style */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-blue-600 font-semibold mb-1">Trusted Network</p>
          <h1 className="text-2xl font-bold text-gray-900">Powering Industry Leaders</h1>
        </div>
        <Link
          href="/admin/clients/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          <PlusIcon className="w-4 h-4" />
          Add Client
        </Link>
      </div>

      {/* Visual Grid - Matching the public site style, 4x4 with tighter gap */}
      {clients && clients.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {clients.map((client) => (
            <ClientAdminCard 
              key={client.id} 
              client={client} 
              onDelete={() => setClientToDelete(client)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border border-dashed border-gray-300 rounded-xl bg-gray-50/50">
          <p className="text-gray-500 mb-4">No clients found</p>
          <Link
            href="/admin/clients/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            <PlusIcon className="w-4 h-4" />
            Add your first client
          </Link>
        </div>
      )}

      {/* Delete Dialog */}
      <Dialog open={!!clientToDelete} onOpenChange={() => setClientToDelete(null)}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle className="text-gray-900">Delete Client</DialogTitle>
            <DialogDescription className="text-gray-600">
              Are you sure you want to delete &quot;{clientToDelete?.clientName}&quot;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setClientToDelete(null)} className="border-gray-300 text-gray-700">
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete}
              disabled={deleteClient.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteClient.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Visual Client Card - Matching the public site glass card style
function ClientAdminCard({ client, onDelete }: { client: Client; onDelete: () => void }) {
  const imageUrl = client.ImagePath ? getImageUrl(client.ImagePath) : null;
  
  return (
    <div className="group relative bg-white rounded-xl border border-gray-200 p-4 hover:border-blue-300 hover:shadow-md transition-all duration-300">
      {/* Logo Container */}
      <div className="relative aspect-[4/3] flex items-center justify-center mb-3">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={client.clientName}
            fill
            className="object-contain p-2 opacity-80 group-hover:opacity-100 transition-opacity duration-300"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            unoptimized
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
            <span className="text-lg font-semibold text-gray-400">
              {client.clientName.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </div>

      {/* Client Name */}
      <h3 className="text-sm font-medium text-gray-900 text-center truncate mb-3">
        {client.clientName}
      </h3>

      {/* Action Buttons */}
      <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <Link
          href={`/admin/clients/${client.id}/edit`}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
        >
          <EditIcon className="w-3 h-3" />
          Edit
        </Link>
        <button
          onClick={onDelete}
          className="flex items-center justify-center p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
          title="Delete"
        >
          <TrashIcon className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Always visible action bar (mobile friendly) */}
      <div className="flex items-center justify-center gap-1 mt-2 sm:hidden">
        <Link
          href={`/admin/clients/${client.id}/edit`}
          className="flex-1 flex items-center justify-center gap-1 px-2 py-1 text-xs text-blue-600 bg-blue-50 rounded"
        >
          <EditIcon className="w-3 h-3" />
          Edit
        </Link>
        <button
          onClick={onDelete}
          className="p-1 text-gray-400 hover:text-red-600"
        >
          <TrashIcon className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  );
}

function EditIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  );
}

function TrashIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  );
}
