'use client';

import { useCallback, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ImageCropper } from '@/components/ui/image-cropper';
import { UploadIcon, XIcon, CropIcon } from 'lucide-react';

interface ImageUploadProps {
  onFilesSelected: (files: File[]) => void;
  aspectRatio?: number;
  maxImages?: number;
  useCropper?: boolean;
}

export function ImageUpload({
  onFilesSelected,
  aspectRatio = 16 / 9,
  maxImages = 10,
  useCropper = true
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [cropperState, setCropperState] = useState<{
    isOpen: boolean;
    imageSrc: string;
    pendingFiles: File[];
  }>({
    isOpen: false,
    imageSrc: '',
    pendingFiles: [],
  });

  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const imageFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
    if (imageFiles.length === 0) {
      toast.error('Please select image files only');
      return;
    }

    // Check sizes
    const validFiles = imageFiles.filter(file => {
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`${file.name} is too large (max 10MB)`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    if (useCropper && validFiles.length > 0) {
      // For now, only crop the first image if multiple selected, or handle sequentially
      const reader = new FileReader();
      reader.onload = () => {
        setCropperState({
          isOpen: true,
          imageSrc: reader.result as string,
          pendingFiles: validFiles,
        });
      };
      reader.readAsDataURL(validFiles[0]);
    } else {
      onFilesSelected(validFiles);
      toast.success(`${validFiles.length} image(s) selected`);
    }

    setIsDragging(false);
  };

  const handleCropComplete = (croppedFile: File) => {
    onFilesSelected([croppedFile]);
    toast.success('Image cropped and selected');
    setCropperState(prev => ({ ...prev, isOpen: false }));
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  }, [useCropper, onFilesSelected]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
    e.target.value = '';
  }, [useCropper, onFilesSelected]);

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-colors duration-200
          ${isDragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 bg-indigo-50/30 hover:border-indigo-400 hover:bg-indigo-50/50'
          }
        `}
        style={{ minHeight: '150px' }}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple={maxImages > 1}
          onChange={handleInputChange}
          className="hidden"
        />

        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
            <UploadIcon className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <p className="text-gray-700 font-medium">
              {isDragging ? 'Drop images here' : 'Click or drag images here'}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              PNG, JPG, GIF up to 10MB
              {useCropper && ' • Cropper enabled'}
            </p>
          </div>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="mt-2 bg-white border border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300 shadow-sm"
            onClick={(e) => {
              e.stopPropagation();
              handleClick();
            }}
          >
            Select Files
          </Button>
        </div>
      </div>

      {cropperState.isOpen && (
        <ImageCropper
          isOpen={cropperState.isOpen}
          imageSrc={cropperState.imageSrc}
          onClose={() => setCropperState(prev => ({ ...prev, isOpen: false }))}
          onCropComplete={handleCropComplete}
          aspectRatio={aspectRatio}
          title="Adjust Image"
        />
      )}
    </>
  );
}
