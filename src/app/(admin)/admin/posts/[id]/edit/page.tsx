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
import { useUpdatePost } from '@/hooks/use-admin-posts';
import { useTags } from '@/hooks/use-tags';
import { toast } from 'sonner';
import { ImageUpload } from '@/components/admin/image-upload';
import { useState, useCallback, useEffect } from 'react';
import { Post, PostImage } from '@/types/post';
import { clientFetch, ApiError } from '@/lib/api/client';
import { getImageUrl } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, X, Pencil, Star } from 'lucide-react';
import { useRef } from 'react';

const updatePostSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  event_name: z.string().min(1, 'Event name is required'),
  description: z.string().optional().or(z.literal('')),
  tag_id: z.coerce.number().optional(),
});

type UpdatePostForm = z.infer<typeof updatePostSchema>;

export default function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const updatePost = useUpdatePost();
  const { data: tags } = useTags();
  const [existingImages, setExistingImages] = useState<PostImage[]>([]);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
  const [deleteImageIds, setDeleteImageIds] = useState<number[]>([]);
  const [postId, setPostId] = useState<string | null>(null);
  const [replacedImages, setReplacedImages] = useState<Record<number, { file: File; id: number }>>({});
  const replaceInputRef = useRef<HTMLInputElement>(null);
  const [activeReplaceId, setActiveReplaceId] = useState<number | null>(null);
  const [headerImageId, setHeaderImageId] = useState<number | null>(null);

  useEffect(() => {
    params.then(p => setPostId(p.id));
  }, [params]);

  const { data: post, isLoading } = useQuery<Post>({
    queryKey: ['post', postId],
    queryFn: async () => {
      if (!postId) throw new Error('No post ID');
      return clientFetch(`/posts/${postId}`);
    },
    enabled: !!postId,
  });

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<UpdatePostForm>({
    resolver: zodResolver(updatePostSchema) as any,
  });

  useEffect(() => {
    if (post) {
      reset({
        title: post.title,
        event_name: post.event_name,
        description: post.description || '',
        tag_id: post.tag?.id || undefined,
      });
      setExistingImages(post.images || []);
      const currentHeader = post.images?.find((img) => img.is_header);
      if (currentHeader) {
        setHeaderImageId(Number(currentHeader.id));
      } else if (post.images && post.images.length > 0) {
        setHeaderImageId(Number(post.images[0].id));
      }
    }
  }, [post, reset]);

  const onSubmit = async (data: UpdatePostForm) => {
    if (!postId) return;

    if (existingImages.length === 0 && newImageFiles.length === 0) {
      toast.error('Post must have at least one image');
      return;
    }

    try {
      await updatePost.mutateAsync({
        id: postId,
        data: {
          ...data,
          new_images: newImageFiles,
          delete_image_id: deleteImageIds,
          edited_image_id: Object.keys(replacedImages).map(Number),
          updated_image_file: Object.values(replacedImages).map(r => r.file),
          header_image_id: headerImageId ?? undefined,
        },
      });
      toast.success('Post updated successfully');
      router.push('/admin/posts');
    } catch (error) {
      if (error instanceof ApiError && error.fieldErrors) {
        error.fieldErrors.forEach((err) => {
          setError(err.field as any, { message: err.message });
        });
      } else {
        toast.error('Failed to update post');
      }
    }
  };

  const handleFilesSelected = (files: File[]) => {
    setNewImageFiles((prev) => [...prev, ...files]);
    const previews = files.map((file) => URL.createObjectURL(file));
    setNewImagePreviews((prev) => [...prev, ...previews]);
  };

  const handleRemoveExistingImage = (id: number) => {
    setExistingImages((prev) => {
      const filtered = prev.filter((img) => img.id !== id);
      // If we removed the header, fallback to the first remaining image
      if (headerImageId === id && filtered.length > 0) {
        setHeaderImageId(Number(filtered[0].id));
      }
      return filtered;
    });
    setDeleteImageIds((prev) => [...prev, id]);
    // Also clear replacement if it was scheduled for this image
    if (replacedImages[id]) {
      setReplacedImages((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    }
  };

  const handleRemoveNewImage = (index: number) => {
    setNewImageFiles((prev) => prev.filter((_, i) => i !== index));
    setNewImagePreviews((prev) => {
      const newPreviews = [...prev];
      URL.revokeObjectURL(newPreviews[index]);
      return newPreviews.filter((_, i) => i !== index);
    });
  };

  const handleReplaceClick = (id: number) => {
    setActiveReplaceId(id);
    replaceInputRef.current?.click();
  };

  const handleReplaceFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && activeReplaceId !== null) {
      setReplacedImages(prev => ({
        ...prev,
        [activeReplaceId]: { file, id: activeReplaceId }
      }));
    }
    e.target.value = '';
    setActiveReplaceId(null);
  };

  const handleSetHeader = (id: number) => {
    setHeaderImageId(id);
  };

  if (isLoading || !postId) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Post not found</p>
        <Link href="/admin/posts" className="text-indigo-600 hover:underline mt-2 inline-block">
          Back to posts
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/posts"
          className="p-2 text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5" />
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Edit Post</h1>
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

            {(existingImages.length > 0 || newImagePreviews.length > 0) && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
                {/* Existing Images */}
                {existingImages.map((image) => {
                  const isReplaced = replacedImages[image.id as number];
                  const isHeader = headerImageId === (image.id as number);
                  const previewUrl = isReplaced
                    ? URL.createObjectURL(isReplaced.file)
                    : getImageUrl(image.url || image.image_url);

                  return (
                    <div key={image.id} className={`relative group aspect-video rounded-lg overflow-hidden border shadow-sm ${isReplaced ? 'border-amber-400' : 'border-gray-200'}`}>
                      <img
                        src={previewUrl}
                        alt="Post image"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleSetHeader(image.id as number)}
                          className={`p-1.5 rounded-full transition-colors shadow-lg ${
                            isHeader
                              ? 'bg-amber-400 text-white'
                              : 'bg-white text-gray-700 hover:bg-gray-100'
                          }`}
                          title="Set as header"
                        >
                          <StarIcon className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleReplaceClick(image.id as number)}
                          className="p-1.5 bg-white text-indigo-600 rounded-full hover:bg-gray-100 transition-colors shadow-lg"
                          title="Replace image"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveExistingImage(image.id as number)}
                          className="p-1.5 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors shadow-lg"
                          title="Remove image"
                        >
                          <XIcon className="w-4 h-4" />
                        </button>
                      </div>
                      {isHeader && (
                        <span className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-indigo-600 text-white text-[10px] font-bold rounded uppercase">
                          Header
                        </span>
                      )}
                      {isReplaced && (
                        <span className="absolute top-1 right-1 px-1.5 py-0.5 bg-amber-500 text-white text-[10px] font-bold rounded uppercase">
                          Replaced
                        </span>
                      )}
                    </div>
                  );
                })}

                {/* New Images Previews */}
                {newImagePreviews.map((preview, index) => {
                  // New images don't have IDs yet; we can't set them as header until saved.
                  // We'll show a placeholder badge.
                  return (
                    <div key={preview} className="relative group aspect-video rounded-lg overflow-hidden border border-indigo-200 shadow-sm">
                      <img
                        src={preview}
                        alt={`New preview ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveNewImage(index)}
                          className="p-1.5 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors shadow-lg"
                          title="Remove image"
                        >
                          <XIcon className="w-4 h-4" />
                        </button>
                      </div>
                      <span className="absolute top-1 left-1 px-1.5 py-0.5 bg-green-600 text-white text-[10px] font-bold rounded uppercase">
                        New
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            {existingImages.length === 0 && newImagePreviews.length === 0 && (
              <p className="text-sm text-gray-500 italic">No images remaining. At least one image is required.</p>
            )}
          </div>

          <div className="flex gap-3 pt-6 border-t border-gray-100">
            {/* Hidden Input for Replacement */}
            <input
              type="file"
              ref={replaceInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleReplaceFileChange}
            />
            <Button
              type="submit"
              disabled={updatePost.isPending}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 h-11"
            >
              {updatePost.isPending ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </div>
              ) : 'Save Changes'}
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

function PencilIcon({ className }: { className?: string }) {
  return <Pencil className={className} />;
}

function StarIcon({ className }: { className?: string }) {
  return <Star className={className} />;
}
