'use client';

import { useState, useRef, useCallback } from 'react';
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Button } from './button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './dialog';

interface ImageCropperProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  onCropComplete: (croppedFile: File) => void;
  aspectRatio?: number;
  title?: string;
}

export function ImageCropper({
  isOpen,
  onClose,
  imageSrc,
  onCropComplete,
  aspectRatio = 1,
  title = 'Crop Image',
}: ImageCropperProps) {
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    width: 90,
    height: 90,
    x: 5,
    y: 5,
  });
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    imgRef.current = e.currentTarget;
    const { width, height, naturalWidth, naturalHeight } = e.currentTarget;

    // Initialize crop to center with proper aspect ratio
    const initialWidth = 90;
    const initialHeight = aspectRatio
      ? (initialWidth * width) / (aspectRatio * height)
      : initialWidth;

    const finalWidth = Math.min(initialWidth, 100);
    const finalHeight = Math.min(initialHeight, 100);
    const x = (100 - finalWidth) / 2;
    const y = (100 - finalHeight) / 2;

    const newCrop: Crop = {
      unit: '%',
      width: finalWidth,
      height: finalHeight,
      x,
      y,
    };

    setCrop(newCrop);

    // Also set completedCrop so "Crop & Use" works without touching the handles
    setCompletedCrop({
      unit: 'px',
      width: (finalWidth * width) / 100,
      height: (finalHeight * height) / 100,
      x: (x * width) / 100,
      y: (y * height) / 100,
    });
  }, [aspectRatio]);

  const getCroppedImage = useCallback(async (): Promise<File | null> => {
    if (!imgRef.current || !completedCrop) return null;

    const image = imgRef.current;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = completedCrop.width;
    canvas.height = completedCrop.height;

    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      completedCrop.width,
      completedCrop.height
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          resolve(null);
          return;
        }
        const file = new File([blob], 'cropped-image.jpg', {
          type: 'image/jpeg',
          lastModified: Date.now(),
        });
        resolve(file);
      }, 'image/jpeg', 0.9);
    });
  }, [completedCrop]);

  const handleConfirm = async () => {
    const croppedFile = await getCroppedImage();
    if (croppedFile) {
      onCropComplete(croppedFile);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="max-h-[400px] overflow-auto">
            <ReactCrop
              crop={crop}
              onChange={(c) => setCrop(c)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={aspectRatio}
              className="max-w-full"
            >
              <img
                src={imageSrc}
                alt="Crop preview"
                onLoad={onImageLoad}
                className="max-w-full h-auto"
              />
            </ReactCrop>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleConfirm}>
              Crop & Use
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
