'use client';

import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { uploadPageImages, deletePageImage } from '@/lib/api/dynamic-pages';
import { getImageUrl } from '@/lib/utils';
import { Upload, X, Loader2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface SingleImageUploadProps {
  pageId: number;
  imageUrl?: string;
  onUpload: (url: string) => void;
  onDelete: () => void;
  aspectRatio?: number;
  label?: string;
}

export function SingleImageUpload({
  pageId,
  imageUrl,
  onUpload,
  onDelete,
  aspectRatio = 16 / 9,
  label = 'Upload image',
}: SingleImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image must be under 10MB');
      return;
    }

    setIsUploading(true);
    try {
      const urls = await uploadPageImages(pageId, [file]);
      if (urls && urls.length > 0) {
        onUpload(urls[0]);
        toast.success('Image uploaded');
      }
    } catch (error) {
      toast.error('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!imageUrl) return;
    setIsDeleting(true);
    try {
      await deletePageImage(pageId, imageUrl);
      onDelete();
      toast.success('Image deleted');
    } catch (error) {
      toast.error('Failed to delete image');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
    e.target.value = '';
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleUpload(file);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  if (imageUrl) {
    return (
      <div
        className="relative rounded-xl overflow-hidden border border-gray-200 bg-gray-50 group"
        style={{ aspectRatio }}
      >
        <Image
          src={getImageUrl(imageUrl)}
          alt="Uploaded image"
          fill
          className="object-cover"
          sizes="400px"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="bg-white/90 text-gray-900 hover:bg-white"
            onClick={() => inputRef.current?.click()}
            disabled={isUploading || isDeleting}
          >
            {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-1" />}
            Replace
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4 mr-1" />}
            Remove
          </Button>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    );
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className={`
        relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
        transition-colors duration-200
        ${isDragging
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-300 bg-gray-50 hover:border-indigo-400 hover:bg-indigo-50/30'
        }
      `}
      style={{ minHeight: '160px', aspectRatio }}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="flex flex-col items-center gap-3">
        {isUploading ? (
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        ) : (
          <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
            <Upload className="w-6 h-6 text-indigo-600" />
          </div>
        )}
        <div>
          <p className="text-gray-700 font-medium text-sm">
            {isDragging ? 'Drop image here' : isUploading ? 'Uploading...' : label}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Click or drag image here • PNG, JPG up to 10MB
          </p>
        </div>
      </div>
    </div>
  );
}
