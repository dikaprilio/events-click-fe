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
import { useCreateEquipment } from '@/hooks/use-admin-equipments';
import { useEquipmentCategories } from '@/hooks/use-equipments';
import { toast } from 'sonner';
import { ImageUpload } from '@/components/admin/image-upload';
import { useState, useCallback } from 'react';
import { ApiError } from '@/lib/api/client';
import { ArrowLeft, X } from 'lucide-react';

const createEquipmentSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters').max(50),
  description: z.string().optional().or(z.literal('')),
  category_id: z.coerce.number().optional(),
});

type CreateEquipmentForm = z.infer<typeof createEquipmentSchema>;

export default function NewEquipmentPage() {
  const router = useRouter();
  const createEquipment = useCreateEquipment();
  const { data: categories } = useEquipmentCategories();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<CreateEquipmentForm>({
    resolver: zodResolver(createEquipmentSchema) as any,
  });

  const onSubmit = async (data: any) => {
    const formData = data as CreateEquipmentForm;
    if (!imageFile) {
      toast.error('Please upload an image');
      return;
    }

    try {
      await createEquipment.mutateAsync({
        ...formData,
        image: imageFile,
      });
      toast.success('Equipment created successfully');
      router.push('/admin/equipments');
    } catch (error) {
      if (error instanceof ApiError && error.fieldErrors) {
        error.fieldErrors.forEach((err) => {
          setError(err.field as any, { message: err.message });
        });
      } else {
        toast.error('Failed to create equipment');
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

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/equipments"
          className="p-2 text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5" />
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Add New Equipment</h1>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-700 font-medium">Equipment Name</Label>
              <Input
                id="name"
                placeholder="Ex: Kamera Sony A7III"
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
            <Label className="text-gray-700 font-medium">Product Image</Label>
            {!preview ? (
              <ImageUpload
                onFilesSelected={handleFileSelected}
                aspectRatio={1}
                maxImages={1}
                useCropper={false}
              />
            ) : (
              <div className="relative w-48 h-48 group">
                <div className="relative w-full h-full rounded-lg overflow-hidden border border-gray-200 shadow-sm bg-gray-50">
                  <img
                    src={preview}
                    alt="Equipment preview"
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
            )}
            {!preview && (
              <p className="text-sm text-gray-500 italic">An image is required for the equipment listing.</p>
            )}
          </div>

          <div className="flex gap-3 pt-6 border-t border-gray-100">
            <Button
              type="submit"
              disabled={createEquipment.isPending}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 h-11"
            >
              {createEquipment.isPending ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating...
                </div>
              ) : 'Add Equipment'}
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
