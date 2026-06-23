'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCreateClient } from '@/hooks/use-admin-clients';
import { toast } from 'sonner';
import { ImageUpload } from '@/components/admin/image-upload';
import { useState, useCallback } from 'react';
import { ApiError } from '@/lib/api/client';
import { ArrowLeft, X } from 'lucide-react';

const createClientSchema = z.object({
  clientName: z.string().min(3, 'Name must be at least 3 characters').max(50),
  urlPortofolio: z.string().url('Must be a valid URL').optional().or(z.literal('')),
});

type CreateClientForm = z.infer<typeof createClientSchema>;

export default function NewClientPage() {
  const router = useRouter();
  const createClient = useCreateClient();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<CreateClientForm>({
    resolver: zodResolver(createClientSchema),
  });

  const onSubmit = async (data: CreateClientForm) => {
    if (!imageFile) {
      toast.error('Please upload a logo');
      return;
    }

    try {
      await createClient.mutateAsync({
        ...data,
        image: imageFile,
      });
      toast.success('Client created successfully');
      router.push('/admin/clients');
    } catch (error) {
      if (error instanceof ApiError && error.fieldErrors) {
        error.fieldErrors.forEach((err) => {
          setError(err.field as any, { message: err.message });
        });
      } else {
        toast.error('Failed to create client');
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
          href="/admin/clients"
          className="p-2 text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5" />
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Add New Client</h1>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="clientName" className="text-gray-700 font-medium">Client Name</Label>
            <Input
              id="clientName"
              placeholder="Ex: Tech Corp"
              className="bg-white border-gray-300 text-gray-900 focus:ring-indigo-500"
              {...register('clientName')}
            />
            {errors.clientName && (
              <p className="text-xs text-red-600 font-medium">{errors.clientName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="urlPortofolio" className="text-gray-700 font-medium">Website URL (optional)</Label>
            <Input
              id="urlPortofolio"
              type="url"
              placeholder="https://techcorp.com"
              className="bg-white border-gray-300 text-gray-900 focus:ring-indigo-500"
              {...register('urlPortofolio')}
            />
            {errors.urlPortofolio && (
              <p className="text-xs text-red-600 font-medium">{errors.urlPortofolio.message}</p>
            )}
          </div>

          <div className="space-y-4">
            <Label className="text-gray-700 font-medium">Client Logo</Label>
            {!preview ? (
              <ImageUpload
                onFilesSelected={handleFileSelected}
                aspectRatio={1}
                maxImages={1}
                useCropper={false}
              />
            ) : (
              <div className="relative w-40 h-40 group">
                <div className="relative w-full h-full rounded-lg overflow-hidden border border-gray-200 shadow-sm bg-gray-50">
                  <img
                    src={preview}
                    alt="Logo preview"
                    className="w-full h-full object-contain p-2"
                  />
                </div>
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors shadow-lg"
                    title="Remove and upload new"
                  >
                    <XIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
            {!preview && (
              <p className="text-sm text-gray-500 italic">A logo is required for the client profile.</p>
            )}
          </div>

          <div className="flex gap-3 pt-6 border-t border-gray-100">
            <Button
              type="submit"
              disabled={createClient.isPending}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 h-11"
            >
              {createClient.isPending ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating...
                </div>
              ) : 'Add Client'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/admin/clients')}
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
