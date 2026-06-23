'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useUpdateEquipment } from '@/hooks/use-admin-equipments';
import { useEquipmentCategories } from '@/hooks/use-equipments';
import { toast } from 'sonner';
import { ImageUpload } from '@/components/admin/image-upload';
import { useState, useCallback, useEffect } from 'react';
import { Equipment } from '@/types/equipment';
import { clientFetch, ApiError } from '@/lib/api/client';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, X } from 'lucide-react';

const updateEquipmentSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters').max(50),
  description: z.string().optional().or(z.literal('')),
  category_id: z.coerce.number().optional(),
});

type UpdateEquipmentForm = z.infer<typeof updateEquipmentSchema>;

export default function EditEquipmentPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const updateEquipment = useUpdateEquipment();
  const { data: categories } = useEquipmentCategories();
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [equipmentId, setEquipmentId] = useState<string | null>(null);

  useEffect(() => {
    params.then(p => setEquipmentId(p.id));
  }, [params]);

  const { data: equipment, isLoading } = useQuery<Equipment>({
    queryKey: ['equipment', equipmentId],
    queryFn: async () => {
      if (!equipmentId) throw new Error('No equipment ID');
      return clientFetch(`/equipments/${equipmentId}`);
    },
    enabled: !!equipmentId,
  });

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<UpdateEquipmentForm>({
    resolver: zodResolver(updateEquipmentSchema) as any,
  });

  useEffect(() => {
    if (equipment) {
      reset({
        name: equipment.name,
        description: equipment.description || '',
        category_id: equipment.category_id || undefined,
      });
      setExistingImageUrl(equipment.image);
    }
  }, [equipment, reset]);

  const onSubmit = async (data: any) => {
    const formData = data as UpdateEquipmentForm;
    if (!equipmentId) return;

    try {
      await updateEquipment.mutateAsync({
        id: equipmentId,
        data: {
          ...formData,
          image: imageFile || undefined,
        },
      });
      toast.success('Equipment updated successfully');
      router.push('/admin/equipments');
    } catch (error) {
      if (error instanceof ApiError && error.fieldErrors) {
        error.fieldErrors.forEach((err) => {
          setError(err.field as any, { message: err.message });
        });
      } else {
        toast.error('Failed to update equipment');
      }
    }
  };

  const handleFileSelected = (files: File[]) => {
    if (files.length > 0) {
      const file = files[0];
      setImageFile(file);
      const url = URL.createObjectURL(file);
      if (preview) URL.revokeObjectURL(preview);
      setPreview(url);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
  };

  if (isLoading || !equipmentId) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!equipment) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Equipment not found</p>
        <Link href="/admin/equipments" className="text-indigo-600 hover:underline mt-2 inline-block">
          Back to equipment
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/equipments"
          className="p-2 text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5" />
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Edit Equipment</h1>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-700 font-medium">Equipment Name</Label>
              <Input
                id="name"
                placeholder="Enter equipment name"
                className="bg-white border-gray-300 text-gray-900 focus:ring-indigo-500"
                {...register('name')}
              />
              {errors.name && (
                <p className="text-xs text-red-600 font-medium">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category_id" className="text-gray-700 font-medium">Category</Label>
              <select
                id="category_id"
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 h-10"
                {...register('category_id')}
              >
                <option value="">Select a category</option>
                {categories?.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.category_name}
                  </option>
                ))}
              </select>
              {errors.category_id && (
                <p className="text-xs text-red-600 font-medium">{errors.category_id.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-gray-700 font-medium">Description</Label>
            <Textarea
              id="description"
              placeholder="Technical specifications, features, etc."
              rows={4}
              className="bg-white border-gray-300 text-gray-900 focus:ring-indigo-500"
              {...register('description')}
            />
          </div>

          <div className="space-y-4">
            <Label className="text-gray-700 font-medium">Image</Label>

            <div className="flex flex-wrap gap-8 items-start">
              {existingImageUrl && !preview && (
                <div className="space-y-2">
                  <span className="text-xs text-gray-500 font-medium block">Current Image</span>
                  <div className="relative w-48 h-48 group">
                    <div className="relative w-full h-full rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                      <img
                        src={existingImageUrl}
                        alt="Current equipment image"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              )}

              {preview && (
                <div className="space-y-2">
                  <span className="text-xs text-indigo-600 font-medium block">New Selection</span>
                  <div className="relative w-48 h-48 group">
                    <div className="relative w-full h-full rounded-lg overflow-hidden border border-indigo-200 shadow-sm bg-indigo-50/20">
                      <img
                        src={preview}
                        alt="New image selection"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors shadow-lg"
                      >
                        <XIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-2 flex-1 min-w-[300px]">
                <span className="text-xs text-gray-500 font-medium block">Upload New</span>
                <ImageUpload
                  onFilesSelected={handleFileSelected}
                  aspectRatio={1}
                  maxImages={1}
                  useCropper={false}
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-6 border-t border-gray-100">
            <Button
              type="submit"
              disabled={updateEquipment.isPending}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 h-11"
            >
              {updateEquipment.isPending ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </div>
              ) : 'Update Equipment'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/admin/equipments')}
              className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50 h-11"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ArrowLeftIcon({ className }: { className?: string }) {
  return <ArrowLeft className={className} />;
}

function XIcon({ className }: { className?: string }) {
  return <X className={className} />;
}
