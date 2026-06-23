'use client';

import Image from 'next/image';
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { getImageUrl, formatDate } from '@/lib/utils';
import { ArrowRight, ChevronDown } from 'lucide-react';

export interface GalleryContent {
  title: string;
  subtitle?: string;
  description?: string;
  eventDate?: string;
  venue?: string;
  client?: string;
  images: {
    src: string;
    caption?: string;
  }[];
}

interface GalleryTemplateProps {
  content: GalleryContent;
}

export function GalleryTemplate({ content }: GalleryTemplateProps) {
  const { title, subtitle, description, eventDate, venue, client, images = [] } = content;
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const heroImageY = useTransform(scrollYProgress, [0, 0.15], [0, 120]);
  const heroTextY = useTransform(scrollYProgress, [0, 0.15], [0, -40]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);

  const firstImage = images[0];
  const remainingImages = images.slice(1);

  return (
    <div ref={containerRef} className="min-h-screen bg-background transition-colors duration-300">
      {/* HERO — Full viewport, massive type + floating image */}
      <section className="relative h-screen min-h-[700px] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-secondary" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div style={{ y: heroTextY, opacity: heroOpacity }} className="order-2 lg:order-1">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="inline-block text-primary text-sm font-bold uppercase tracking-[0.2em] mb-5"
            >
              Portfolio
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.7 }}
              className="text-5xl md:text-7xl lg:text-8xl font-bold text-foreground leading-[0.95] mb-6"
            >
              {title}
            </motion.h1>

            {subtitle && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.6 }}
                className="text-lg md:text-xl text-muted-foreground max-w-md mb-8"
              >
                {subtitle}
              </motion.p>
            )}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="hidden lg:flex items-center gap-3 text-muted-foreground text-sm"
            >
              <div className="w-8 h-[1px] bg-muted-foreground" />
              <span>Scroll to explore</span>
              <ChevronDown className="w-4 h-4 animate-bounce" />
            </motion.div>
          </motion.div>

          {firstImage && (
            <motion.div
              style={{ y: heroImageY }}
              className="order-1 lg:order-2 relative"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 40 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8, ease: 'easeOut' }}
                className="relative aspect-[4/5] md:aspect-[3/4] w-full max-w-lg lg:max-w-none mx-auto lg:ml-auto rounded-2xl overflow-hidden shadow-2xl shadow-black/10"
              >
                <Image
                  src={getImageUrl(firstImage.src)}
                  alt={firstImage.caption || title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </motion.div>

              {/* Floating caption card */}
              {firstImage.caption && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                  className="absolute -bottom-6 -left-6 md:left-auto md:-right-6 bg-card border border-border/50 p-5 rounded-xl shadow-xl max-w-[240px]"
                >
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {firstImage.caption}
                  </p>
                </motion.div>
              )}
            </motion.div>
          )}
        </div>
      </section>

      {/* META STRIP — Minimal elegant labels */}
      {(eventDate || venue || client) && (
        <section className="border-y border-border/40 bg-secondary/30">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12">
              {eventDate && (
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-1">Date</p>
                  <p className="text-lg font-medium text-foreground">{formatDate(eventDate)}</p>
                </div>
              )}
              {venue && (
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-1">Venue</p>
                  <p className="text-lg font-medium text-foreground">{venue}</p>
                </div>
              )}
              {client && (
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-1">Client</p>
                  <p className="text-lg font-medium text-foreground">{client}</p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* CINEMATIC IMAGE SECTIONS */}
      <section className="py-12 md:py-20">
        <div className="space-y-24 md:space-y-32">
          {remainingImages.map((image, index) => {
            const isEven = index % 2 === 0;
            return (
              <CinematicImage
                key={index}
                image={image}
                index={index}
                alignment={isEven ? 'left' : 'right'}
              />
            );
          })}
        </div>
      </section>

      {/* FILMSTRIP — Horizontal thumbnails */}
      {images.length > 1 && (
        <section className="py-16 md:py-24 bg-secondary/30 border-y border-border/40 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 mb-8">
            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground">
              All Frames
            </h3>
          </div>
          <div className="flex gap-4 overflow-x-auto px-6 pb-4 scrollbar-hide snap-x snap-mandatory">
            {images.map((image, index) => (
              <div
                key={index}
                className="relative flex-shrink-0 w-64 md:w-80 aspect-[3/2] rounded-xl overflow-hidden snap-center group"
              >
                <Image
                  src={getImageUrl(image.src)}
                  alt={image.caption || `Frame ${index + 1}`}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="320px"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                {image.caption && (
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white text-xs font-medium truncate">{image.caption}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CLOSING STATEMENT */}
      <section className="py-24 md:py-40">
        <div className="max-w-4xl mx-auto px-6 text-center">
          {description && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="mb-12"
            >
              <div
                className="prose prose-lg md:prose-xl max-w-none text-muted-foreground prose-headings:text-foreground prose-strong:text-foreground"
                dangerouslySetInnerHTML={{ __html: description }}
              />
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <a
              href="/contact"
              className="group inline-flex items-center gap-3 bg-primary text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-primary-dark transition-all duration-300 hover:shadow-glow hover:scale-105"
            >
              Start a Project
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

// Individual cinematic image section with scroll-linked parallax
function CinematicImage({
  image,
  index,
  alignment,
}: {
  image: { src: string; caption?: string };
  index: number;
  alignment: 'left' | 'right';
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.92, 1, 1, 0.92]);

  return (
    <motion.div
      ref={ref}
      style={{ opacity, scale }}
      className="relative max-w-7xl mx-auto px-6"
    >
      <div
        className={`grid lg:grid-cols-12 gap-6 lg:gap-10 items-center ${
          alignment === 'right' ? 'lg:flex-row-reverse' : ''
        }`}
      >
        {/* Image */}
        <div className={`lg:col-span-8 ${alignment === 'right' ? 'lg:col-start-5' : 'lg:col-start-1'}`}>
          <motion.div style={{ y }} className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden shadow-2xl shadow-black/10">
            <Image
              src={getImageUrl(image.src)}
              alt={image.caption || `Gallery image ${index + 2}`}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 66vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </motion.div>
        </div>

        {/* Caption */}
        {image.caption && (
          <div
            className={`lg:col-span-3 ${
              alignment === 'right' ? 'lg:col-start-1 lg:row-start-1 lg:text-right' : 'lg:col-start-10'
            }`}
          >
            <motion.div
              initial={{ opacity: 0, x: alignment === 'right' ? 20 : -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <span className="text-primary text-sm font-bold tracking-widest uppercase mb-3 block">
                Frame {String(index + 2).padStart(2, '0')}
              </span>
              <p className="text-xl md:text-2xl font-medium text-foreground leading-snug">
                {image.caption}
              </p>
            </motion.div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default GalleryTemplate;
