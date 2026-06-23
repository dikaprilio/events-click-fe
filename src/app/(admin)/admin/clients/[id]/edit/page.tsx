'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUpdateClient } from '@/hooks/use-admin-clients';
import { toast } from 'sonner';
import { ImageUpload } from '@/components/admin/image-upload';
import { useState, useCallback, useEffect } from 'react';
import { Client } from '@/types/client';
import { clientFetch, ApiError } from '@/lib/api/client';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, X } from 'lucide-react';

const updateClientSchema = z.object({
  clientName: z.string().min(3, 'Name must be at least 3 characters').max(50),
  urlPortofolio: z.string().url('Must be a valid URL').optional().or(z.literal('')),
});

type UpdateClientForm = z.infer<typeof updateClientSchema>;

export default function EditClientPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const updateClient = useUpdateClient();
  const [existingLogoUrl, setExistingLogoUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [clientId, setClientId] = useState<string | null>(null);

  useEffect(() => {
    params.then(p => setClientId(p.id));
  }, [params]);

  const { data: client, isLoading } = useQuery<Client>({
    queryKey: ['client', clientId],
    queryFn: async () => {
      if (!clientId) throw new Error('No client ID');
      return clientFetch(`/clients/${clientId}`);
    },
    enabled: !!clientId,
  });

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<UpdateClientForm>({
    resolver: zodResolver(updateClientSchema),
  });

  useEffect(() => {
    if (client) {
      reset({
        clientName: client.clientName,
        urlPortofolio: client.urlPortofolio || '',
      });
      setExistingLogoUrl(client.ImagePath);
    }
  }, [client, reset]);

  const onSubmit = async (data: UpdateClientForm) => {
    if (!clientId) return;

    try {
      await updateClient.mutateAsync({
        id: clientId,
        data: {
          ...data,
          image: imageFile || undefined,
        },
      });
      toast.success('Client updated successfully');
      router.push('/admin/clients');
    } catch (error) {
      if (error instanceof ApiError && error.fieldErrors) {
        error.fieldErrors.forEach((err) => {
          setError(err.field as any, { message: err.message });
        });
      } else {
        toast.error('Failed to update client');
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

  if (isLoading || !clientId) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!client) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Client not found</p>
        <Link href="/admin/clients" className="text-indigo-600 hover:underline mt-2 inline-block">
          Back to clients
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/clients"
          className="p-2 text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5" />
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Edit Client</h1>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="clientName" className="text-gray-700 font-medium">Client Name</Label>
            <Input
              id="clientName"
              placeholder="Enter client name"
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
              placeholder="https://example.com"
              className="bg-white border-gray-300 text-gray-900 focus:ring-indigo-500"
              {...register('urlPortofolio')}
            />
            {errors.urlPortofolio && (
              <p className="text-xs text-red-600 font-medium">{errors.urlPortofolio.message}</p>
            )}
          </div>

          <div className="space-y-4">
            <Label className="text-gray-700 font-medium">Logo</Label>

            <div className="flex flex-wrap gap-8 items-start">
              {existingLogoUrl && !preview && (
                <div className="space-y-2">
                  <span className="text-xs text-gray-500 font-medium block">Current Logo</span>
                  <div className="relative w-40 h-40 group">
                    <div className="relative w-full h-full rounded-lg overflow-hidden border border-gray-200 shadow-sm bg-gray-50">
                      <img
                        src={existingLogoUrl}
                        alt="Current logo"
                        className="w-full h-full object-contain p-2"
                      />
                    </div>
                  </div>
                </div>
              )}

              {preview && (
                <div className="space-y-2">
                  <span className="text-xs text-indigo-600 font-medium block">New Selection</span>
                  <div className="relative w-40 h-40 group">
                    <div className="relative w-full h-full rounded-lg overflow-hidden border border-indigo-200 shadow-sm bg-indigo-50/20">
                      <img
                        src={preview}
                        alt="New logo selection"
                        className="w-full h-full object-contain p-2"
                      />
                    </div>
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors shadow-lg"
                        title="Discard new logo"
                      >
                        <XIcon className="w-5 h-5" />
                      </button>
                    </div>
                    <span className="absolute -top-2 -right-2 px-2 py-0.5 bg-green-600 text-white text-[10px] font-bold rounded-full uppercase shadow-sm">
                      Replaces Current
                    </span>
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
              disabled={updateClient.isPending}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 h-11"
            >
              {updateClient.isPending ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </div>
              ) : 'Update Client'}
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
