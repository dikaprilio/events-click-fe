'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEquipments, useEquipmentCategories } from '@/hooks/use-equipments';
import { useDeleteEquipment } from '@/hooks/use-admin-equipments';
import { getImageUrl } from '@/lib/utils';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Equipment, EquipmentCategory } from '@/types/equipment';
import {
  createEquipmentCategory,
  deleteEquipmentCategory,
  updateEquipmentCategory,
} from '@/lib/api/equipments';

export default function AdminEquipmentsPage() {
  const { data: equipments, isLoading, error } = useEquipments({ limit: 100 });
  const { data: categories, refetch: refetchCategories } = useEquipmentCategories();
  const deleteEquipment = useDeleteEquipment();
  const [equipmentToDelete, setEquipmentToDelete] = useState<Equipment | null>(null);
  const [typeDraft, setTypeDraft] = useState({ categoryName: '', redirect_url: '' });

  const handleDelete = async () => {
    if (!equipmentToDelete) return;
    
    try {
      await deleteEquipment.mutateAsync(equipmentToDelete.id);
      toast.success('Equipment deleted successfully');
      setEquipmentToDelete(null);
    } catch {
      toast.error('Failed to delete equipment');
    }
  };

  const handleAddType = async () => {
    if (!typeDraft.categoryName.trim()) {
      toast.error('Type name is required');
      return;
    }

    try {
      await createEquipmentCategory({
        categoryName: typeDraft.categoryName.trim(),
        redirect_url: typeDraft.redirect_url.trim() || null,
      });
      toast.success('Equipment type added');
      setTypeDraft({ categoryName: '', redirect_url: '' });
      await refetchCategories();
    } catch {
      toast.error('Failed to add equipment type');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Equipment</h1>
        </div>
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-200 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Equipment</h1>
        <div className="p-6 border border-red-200 bg-red-50 rounded-lg text-center">
          <p className="text-red-600 font-medium">Failed to load equipment</p>
          <p className="text-gray-500 text-sm mt-1">Please check your connection and try again</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Equipment</h1>
        <Link
          href="/admin/equipments/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <PlusIcon className="w-4 h-4" />
          Add Equipment
        </Link>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm space-y-5">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Equipment Types</h2>
          <p className="text-sm text-gray-500 mt-1">
            Add more equipment type filters and optional redirect links. If a redirect URL is filled, clicking the type chip on the public page will open that URL instead of filtering.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_auto] gap-3">
          <input
            className="admin-input"
            placeholder="Type name, e.g. Rigging"
            value={typeDraft.categoryName}
            onChange={(event) => setTypeDraft((prev) => ({ ...prev, categoryName: event.target.value }))}
          />
          <input
            className="admin-input"
            placeholder="Optional redirect URL"
            value={typeDraft.redirect_url}
            onChange={(event) => setTypeDraft((prev) => ({ ...prev, redirect_url: event.target.value }))}
          />
          <button className="admin-btn" type="button" onClick={handleAddType}>
            Add Type
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {categories?.map((category) => (
            <EquipmentTypeEditor
              key={category.id}
              category={category}
              onReload={refetchCategories}
            />
          ))}
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Image</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Name</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 hidden md:table-cell">Description</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {equipments?.map((equipment) => (
              <tr key={equipment.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="relative w-12 h-12 rounded overflow-hidden bg-gray-100">
                    {equipment.image ? (
                      <Image
                        src={getImageUrl(equipment.image)}
                        alt={equipment.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="w-4 h-4 text-gray-400" />
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <p className="font-medium text-gray-900">{equipment.name}</p>
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <p className="text-gray-600 truncate max-w-[200px]">{equipment.description || '-'}</p>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/equipments/${equipment.id}/edit`}
                      className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                      title="Edit"
                    >
                      <EditIcon className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => setEquipmentToDelete(equipment)}
                      className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                      title="Delete"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {equipments?.length === 0 && (
        <div className="text-center py-12 border border-gray-200 rounded-lg bg-white">
          <p className="text-gray-500">No equipment found</p>
          <Link
            href="/admin/equipments/new"
            className="text-blue-600 hover:underline mt-2 inline-block"
          >
            Add your first equipment
          </Link>
        </div>
      )}

      <Dialog open={!!equipmentToDelete} onOpenChange={() => setEquipmentToDelete(null)}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle className="text-gray-900">Delete Equipment</DialogTitle>
            <DialogDescription className="text-gray-600">
              Are you sure you want to delete &quot;{equipmentToDelete?.name}&quot;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setEquipmentToDelete(null)} className="border-gray-300 text-gray-700">
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete}
              disabled={deleteEquipment.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteEquipment.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function EquipmentTypeEditor({
  category,
  onReload,
}: {
  category: EquipmentCategory;
  onReload: () => Promise<unknown>;
}) {
  const [draft, setDraft] = useState({
    categoryName: category.category_name,
    redirect_url: category.redirect_url || '',
  });

  const saveType = async () => {
    if (!draft.categoryName.trim()) {
      toast.error('Type name is required');
      return;
    }

    try {
      await updateEquipmentCategory(category.id, {
        categoryName: draft.categoryName.trim(),
        redirect_url: draft.redirect_url.trim() || null,
      });
      toast.success('Equipment type updated');
      await onReload();
    } catch {
      toast.error('Failed to update equipment type');
    }
  };

  const removeType = async () => {
    if (!window.confirm(`Delete "${category.category_name}"? Equipment using this type may lose its category.`)) {
      return;
    }

    try {
      await deleteEquipmentCategory(category.id);
      toast.success('Equipment type deleted');
      await onReload();
    } catch {
      toast.error('Failed to delete equipment type');
    }
  };

  return (
    <div className="rounded-lg border border-gray-200 p-4 space-y-3">
      <input
        className="admin-input"
        value={draft.categoryName}
        onChange={(event) => setDraft((prev) => ({ ...prev, categoryName: event.target.value }))}
      />
      <input
        className="admin-input"
        placeholder="Optional redirect URL"
        value={draft.redirect_url}
        onChange={(event) => setDraft((prev) => ({ ...prev, redirect_url: event.target.value }))}
      />
      <div className="flex flex-wrap gap-2">
        <button className="admin-btn" type="button" onClick={saveType}>
          Save Type
        </button>
        <button className="admin-btn-danger" type="button" onClick={removeType}>
          Delete
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

function ImageIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}
