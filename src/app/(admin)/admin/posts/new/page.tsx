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
import { useCreatePost } from '@/hooks/use-admin-posts';
import { useTags } from '@/hooks/use-tags';
import { toast } from 'sonner';
import { ImageUpload } from '@/components/admin/image-upload';
import { useState, useCallback } from 'react';
import { ApiError } from '@/lib/api/client';
import { ArrowLeft, X, Star } from 'lucide-react';

const createPostSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  event_name: z.string().min(1, 'Event name is required'),
  description: z.string().optional().or(z.literal('')),
  tag_id: z.coerce.number().optional(),
});

type CreatePostForm = z.infer<typeof createPostSchema>;

export default function NewPostPage() {
  const router = useRouter();
  const createPost = useCreatePost();
  const { data: tags } = useTags();
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [headerIndex, setHeaderIndex] = useState<number>(0);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<CreatePostForm>({
    resolver: zodResolver(createPostSchema) as any,
  });

  const onSubmit = async (data: CreatePostForm) => {
    if (imageFiles.length === 0) {
      toast.error('Please upload at least one image');
      return;
    }

    try {
      // Reorder files so header is first before sending (backend auto-sets first image as header)
      const reorderedFiles = [...imageFiles];
      if (headerIndex > 0 && headerIndex < reorderedFiles.length) {
        const [headerFile] = reorderedFiles.splice(headerIndex, 1);
        reorderedFiles.unshift(headerFile);
      }
      await createPost.mutateAsync({
        ...data,
        post_images: reorderedFiles,
      });
      toast.success('Post created successfully');
      router.push('/admin/posts');
    } catch (error) {
      if (error instanceof ApiError && error.fieldErrors) {
        error.fieldErrors.forEach((err) => {
          setError(err.field as any, { message: err.message });
        });
      } else {
        toast.error('Failed to create post');
      }
    }
  };

  const handleFilesSelected = (files: File[]) => {
    setImageFiles((prev) => [...prev, ...files]);
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const handleSetHeader = (index: number) => {
    setHeaderIndex(index);
  };

  const handleRemoveImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => {
      const newPreviews = [...prev];
      URL.revokeObjectURL(newPreviews[index]);
      const filtered = newPreviews.filter((_, i) => i !== index);
      return filtered;
    });
    if (headerIndex === index) {
      setHeaderIndex(0);
    } else if (headerIndex > index) {
      setHeaderIndex((prev) => prev - 1);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/posts"
          className="p-2 text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5" />
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Add New Post</h1>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-gray-700 font-medium">Title</Label>
              <Input
                id="title"
                placeholder="Ex: Wedding at Bali"
                className="bg-white border-gray-300 text-gray-900 focus:ring-indigo-500"
                {...register('title')}
              />
              {errors.title && (
                <p className="text-xs text-red-600 font-medium">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="event_name" className="text-gray-700 font-medium">Event Name (Slug)</Label>
              <Input
                id="event_name"
                placeholder="Ex: wedding-bali-2024"
                className="bg-white border-gray-300 text-gray-900 focus:ring-indigo-500"
                {...register('event_name')}
              />
              {errors.event_name && (
                <p className="text-xs text-red-600 font-medium">{errors.event_name.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tag_id" className="text-gray-700 font-medium">Category / Tag</Label>
            <select
              id="tag_id"
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              {...register('tag_id')}
            >
              <option value="">Select a tag (optional)</option>
              {tags?.map((tag) => (
                <option key={tag.id} value={tag.id}>
                  {tag.name}
                </option>
              ))}
            </select>
            {errors.tag_id && (
              <p className="text-xs text-red-600 font-medium">{errors.tag_id.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-gray-700 font-medium">Description</Label>
            <Textarea
              id="description"
              placeholder="Tell more about this event..."
              rows={4}
              className="bg-white border-gray-300 text-gray-900 focus:ring-indigo-500"
              {...register('description')}
            />
          </div>

          <div className="space-y-4">
            <Label className="text-gray-700 font-medium">Event Images</Label>
            <ImageUpload
              onFilesSelected={handleFilesSelected}
              aspectRatio={16 / 9}
              maxImages={10}
              useCropper={false}
            />

            {previews.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
                {previews.map((preview, index) => (
                  <div key={preview} className="relative group aspect-video rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleSetHeader(index)}
                        className={`p-1.5 rounded-full transition-colors shadow-lg ${
                          headerIndex === index
                            ? 'bg-amber-400 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-100'
                        }`}
                        title="Set as header"
                      >
                        <StarIcon className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="p-1.5 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors shadow-lg"
                        title="Remove image"
                      >
                        <XIcon className="w-4 h-4" />
                      </button>
                    </div>
                    {headerIndex === index && (
                      <span className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-indigo-600 text-white text-[10px] font-bold rounded uppercase">
                        Header
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {previews.length === 0 && (
              <p className="text-sm text-gray-500 italic">No images selected. At least one image is required.</p>
            )}
          </div>

          <div className="flex gap-3 pt-6 border-t border-gray-100">
            <Button
              type="submit"
              disabled={createPost.isPending}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 h-11"
            >
              {createPost.isPending ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating...
                </div>
              ) : 'Publish Post'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/admin/posts')}
              className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50 h-11"
            >
              Discard Changes
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

function StarIcon({ className }: { className?: string }) {
  return <Star className={className} />;
}
