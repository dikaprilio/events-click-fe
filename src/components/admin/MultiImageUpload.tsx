'use client';

import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { Reorder, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { uploadPageImages, deletePageImage } from '@/lib/api/dynamic-pages';
import { getImageUrl } from '@/lib/utils';
import { Upload, X, Loader2, GripVertical } from 'lucide-react';
import { toast } from 'sonner';

interface GalleryImage {
  src: string;
  caption?: string;
}

interface MultiImageUploadProps {
  pageId: number;
  images: GalleryImage[];
  onChange: (images: GalleryImage[]) => void;
}

export function MultiImageUpload({ pageId, images, onChange }: MultiImageUploadProps) {
  const [uploadingCount, setUploadingCount] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const imageFiles = Array.from(files).filter((file) => file.type.startsWith('image/'));
    if (imageFiles.length === 0) {
      toast.error('Please select image files only');
      return;
    }

    const validFiles = imageFiles.filter((file) => {
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`${file.name} is too large (max 10MB)`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    setUploadingCount((prev) => prev + validFiles.length);
    try {
      const urls = await uploadPageImages(pageId, validFiles);
      const newImages = urls.map((url) => ({ src: url, caption: '' }));
      onChange([...images, ...newImages]);
      toast.success(`${urls.length} image(s) uploaded`);
    } catch (error) {
      toast.error('Failed to upload images');
    } finally {
      setUploadingCount((prev) => prev - validFiles.length);
    }
  };

  const handleDelete = async (index: number) => {
    const image = images[index];
    if (!image) return;

    try {
      await deletePageImage(pageId, image.src);
      const next = [...images];
      next.splice(index, 1);
      onChange(next);
      toast.success('Image removed');
    } catch (error) {
      toast.error('Failed to delete image');
    }
  };

  const updateCaption = (index: number, caption: string) => {
    const next = [...images];
    next[index] = { ...next[index], caption };
    onChange(next);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleUpload(e.dataTransfer.files);
  }, [images]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const reorderImages = (reordered: GalleryImage[]) => {
    onChange(reordered);
  };

  return (
    <div className="space-y-4">
      {/* Image Grid */}
      {images.length > 0 && (
        <Reorder.Group axis="y" values={images} onReorder={reorderImages} className="space-y-3">
          <AnimatePresence initial={false}>
            {images.map((image, index) => (
              <Reorder.Item
                key={image.src}
                value={image}
                className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm"
                whileDrag={{ scale: 1.02, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
              >
                <div className="flex gap-4">
                  {/* Drag Handle + Thumbnail */}
                  <div className="flex items-center gap-2">
                    <div className="cursor-grab active:cursor-grabbing p-1 text-gray-400 hover:text-gray-600">
                      <GripVertical className="w-5 h-5" />
                    </div>
                    <div className="relative w-24 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      <Image
                        src={getImageUrl(image.src)}
                        alt={image.caption || `Image ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    </div>
                  </div>

                  {/* Caption + Actions */}
                  <div className="flex-1 min-w-0 flex flex-col justify-center gap-2">
                    <Input
                      value={image.caption || ''}
                      onChange={(e) => updateCaption(index, e.target.value)}
                      placeholder="Caption (optional)"
                      className="h-9 text-sm"
                    />
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>Image {index + 1}</span>
                      <span className="text-gray-300">•</span>
                      <span className="truncate">{image.src.split('/').pop()}</span>
                    </div>
                  </div>

                  {/* Delete */}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:text-red-600 hover:bg-red-50 flex-shrink-0"
                    onClick={() => handleDelete(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </Reorder.Item>
            ))}
          </AnimatePresence>
        </Reorder.Group>
      )}

      {/* Upload Placeholders */}
      {uploadingCount > 0 && (
        <div className="grid grid-cols-4 gap-3">
          {Array.from({ length: Math.min(uploadingCount, 4) }).map((_, i) => (
            <div
              key={i}
              className="aspect-video rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 flex items-center justify-center"
            >
              <Loader2 className="w-6 h-6 text-indigo-600 animate-spin" />
            </div>
          ))}
        </div>
      )}

      {/* Upload Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`
          relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer
          transition-colors duration-200
          ${isDragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 bg-gray-50 hover:border-indigo-400 hover:bg-indigo-50/30'
          }
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleUpload(e.target.files)}
        />

        <div className="flex flex-col items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
            <Upload className="w-5 h-5 text-indigo-600" />
          </div>
          <p className="text-gray-700 font-medium text-sm">
            {isDragging ? 'Drop images here' : 'Click or drag images here'}
          </p>
          <p className="text-xs text-gray-500">
            PNG, JPG up to 10MB each
          </p>
        </div>
      </div>
    </div>
  );
}
