'use client';

import Image from 'next/image';
import { useState, useCallback, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Grid3X3 } from 'lucide-react';
import { getImageUrl } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { PostImage } from '@/types/post';

interface EventGalleryProps {
  images: PostImage[];
  title: string;
}

export function EventGallery({ images, title }: EventGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
  }, []);

  const nextImage = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const prevImage = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  // Keyboard navigation
  useEffect(() => {
    if (!lightboxOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [lightboxOpen, closeLightbox, nextImage, prevImage]);

  if (images.length === 0) return null;

  return (
    <section className="py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
            <Grid3X3 className="w-4 h-4" />
            Photo Gallery
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Moments from the Event
          </h2>
          <p className="text-muted-foreground">
            Click any image to view in full screen
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {images.map((image, index) => {
            const imagePath = image.url || image.image_url;
            if (!imagePath) return null;
            const isFeatured = index === 0;

            return (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className={`relative cursor-pointer group overflow-hidden rounded-2xl ${
                  isFeatured ? 'col-span-2 row-span-2' : ''
                }`}
                onClick={() => openLightbox(index)}
              >
                <div
                  className={`relative w-full ${
                    isFeatured ? 'aspect-square' : 'aspect-square'
                  }`}
                >
                  <Image
                    src={getImageUrl(imagePath)}
                    alt={`${title} - Image ${index + 1}`}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes={
                      isFeatured
                        ? '(max-width: 768px) 100vw, 50vw'
                        : '(max-width: 768px) 50vw, 25vw'
                    }
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="absolute top-3 right-3 w-9 h-9 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Grid3X3 className="w-4 h-4 text-white" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          >
            <button
              onClick={closeLightbox}
              className="absolute top-5 right-5 z-20 text-white/80 hover:text-white p-3 bg-white/10 backdrop-blur-sm rounded-full transition-colors hover:bg-white/20"
              aria-label="Close lightbox"
            >
              <X className="w-6 h-6" />
            </button>

            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 md:left-6 z-20 text-white/80 hover:text-white p-3 bg-white/10 backdrop-blur-sm rounded-full transition-colors hover:bg-white/20"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-7 h-7 md:w-8 md:h-8" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 md:right-6 z-20 text-white/80 hover:text-white p-3 bg-white/10 backdrop-blur-sm rounded-full transition-colors hover:bg-white/20"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-7 h-7 md:w-8 md:h-8" />
                </button>
              </>
            )}

            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25 }}
              className="relative w-full h-full max-w-6xl max-h-[85vh] mx-4"
            >
              <Image
                src={getImageUrl(
                  images[currentIndex].url || images[currentIndex].image_url || ''
                )}
                alt={`${title} - Image ${currentIndex + 1}`}
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
            </motion.div>

            <div className="absolute bottom-6 left-0 right-0 text-center pointer-events-none">
              <p className="text-white/60 text-sm font-medium">
                {currentIndex + 1} / {images.length}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
