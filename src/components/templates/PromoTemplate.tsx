'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Check, Sparkles, ArrowRight, Star } from 'lucide-react';
import { getImageUrl } from '@/lib/utils';
import { motion } from 'framer-motion';

export interface PromoContent {
  heroImage?: string;
  heroTitle: string;
  heroSubtitle?: string;
  price?: string;
  originalPrice?: string;
  features: string[];
  ctaText: string;
  ctaLink?: string;
  description?: string;
  badge?: string;
}

interface PromoTemplateProps {
  content: PromoContent;
}

export function PromoTemplate({ content }: PromoTemplateProps) {
  const {
    heroImage,
    heroTitle,
    heroSubtitle,
    price,
    originalPrice,
    features = [],
    ctaText,
    ctaLink = '/contact',
    description,
    badge,
  } = content;

  const savings =
    price && originalPrice ? calculateSavings(price, originalPrice) : '';

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-primary to-primary-dark text-white py-20 md:py-32 overflow-hidden">
        {/* Animated mesh background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-10 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-10 right-10 w-[28rem] h-[28rem] bg-white/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-white/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {(badge || heroSubtitle) && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md px-4 py-2 rounded-full text-sm font-medium mb-6 border border-white/20"
                >
                  <Sparkles className="w-4 h-4" />
                  {badge || heroSubtitle}
                </motion.div>
              )}

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-[1.1]">
                {heroTitle}
              </h1>

              {price && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mb-8"
                >
                  <div className="flex items-baseline gap-4 flex-wrap">
                    <span className="text-5xl md:text-7xl font-bold tracking-tight">
                      {price}
                    </span>
                    {originalPrice && (
                      <div className="flex flex-col">
                        <span className="text-xl md:text-2xl text-white/50 line-through">
                          {originalPrice}
                        </span>
                        {savings && (
                          <span className="text-sm text-green-300 font-semibold">
                            Save {savings}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Link
                  href={ctaLink}
                  className="group inline-flex items-center gap-3 bg-white text-primary px-8 py-4 rounded-full font-bold text-lg hover:bg-white/90 transition-all duration-300 hover:shadow-2xl hover:shadow-white/20 hover:scale-105"
                >
                  {ctaText}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="flex items-center gap-6 mt-8 text-sm text-white/80"
              >
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-green-400/20 flex items-center justify-center">
                    <Check className="w-3 h-3 text-green-300" />
                  </div>
                  <span>Limited slots available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-green-400/20 flex items-center justify-center">
                    <Check className="w-3 h-3 text-green-300" />
                  </div>
                  <span>Instant confirmation</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Right - Image */}
            {heroImage && (
              <motion.div
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="relative"
              >
                <div className="relative h-80 md:h-[520px] rounded-3xl overflow-hidden shadow-2xl shadow-black/20">
                  <Image
                    src={getImageUrl(heroImage)}
                    alt={heroTitle}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent" />
                </div>

                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                  className="absolute -bottom-6 -left-6 bg-card text-card-foreground p-4 rounded-2xl shadow-xl border border-border/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <Star className="w-6 h-6 text-primary fill-primary" />
                    </div>
                    <div>
                      <p className="font-bold">4.9 Rating</p>
                      <p className="text-sm text-muted-foreground">
                        500+ happy clients
                      </p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="block dark:hidden">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
          </svg>
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="hidden dark:block">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#000000"/>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-32 bg-background transition-colors duration-300 overflow-hidden">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16 md:mb-20"
          >
            <span className="inline-flex items-center gap-2 text-primary font-semibold mb-4 text-sm uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              What You Get
            </span>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-foreground">
              What&apos;s Included
            </h2>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto text-lg md:text-xl">
              Everything you need for an amazing event experience, bundled into one seamless package.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {features.map((feature, index) => {
              const isLarge = index === 0 || index === 3;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.06 }}
                  whileHover={{ y: -6, transition: { duration: 0.25 } }}
                  className={`group relative p-6 md:p-8 rounded-3xl overflow-hidden transition-all duration-300 ${
                    isLarge ? 'md:col-span-2 lg:col-span-1' : ''
                  }`}
                  style={{
                    background: index % 3 === 0
                      ? 'linear-gradient(135deg, rgba(0,168,235,0.08) 0%, rgba(0,168,235,0.02) 100%)'
                      : index % 3 === 1
                      ? 'linear-gradient(135deg, rgba(99,102,241,0.06) 0%, rgba(99,102,241,0.02) 100%)'
                      : 'linear-gradient(135deg, rgba(16,185,129,0.06) 0%, rgba(16,185,129,0.02) 100%)'
                  }}
                >
                  {/* Soft inner glow */}
                  <div className="absolute inset-0 rounded-3xl bg-white/40 dark:bg-white/[0.02]" />
                  
                  {/* Hover glow */}
                  <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: index % 3 === 0
                        ? 'radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(0,168,235,0.12), transparent 40%)'
                        : index % 3 === 1
                        ? 'radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(99,102,241,0.1), transparent 40%)'
                        : 'radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(16,185,129,0.1), transparent 40%)'
                    }}
                  />

                  {/* Number watermark */}
                  <span className="absolute top-4 right-5 text-5xl font-bold text-foreground/[0.04] select-none pointer-events-none">
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  <div className="relative z-10">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110 ${
                      index % 3 === 0
                        ? 'bg-primary text-white shadow-lg shadow-primary/25'
                        : index % 3 === 1
                        ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/25'
                        : 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25'
                    }`}>
                      <Check className="w-5 h-5" />
                    </div>
                    <p className="text-lg md:text-xl font-medium text-foreground leading-relaxed">
                      {feature}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Description Section */}
      {description && (
        <section className="py-20 md:py-28 bg-secondary transition-colors duration-300">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid lg:grid-cols-5 gap-12 lg:gap-16 items-start">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="lg:col-span-3"
              >
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                  Package Details
                </h2>
                <div
                  className="prose prose-lg max-w-none text-muted-foreground prose-headings:text-foreground prose-strong:text-foreground"
                  dangerouslySetInnerHTML={{ __html: description }}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="lg:col-span-2"
              >
                <div className="bg-card p-6 md:p-8 rounded-3xl shadow-xl shadow-gray-200/40 dark:shadow-none border border-border/50 sticky top-24">
                  <h3 className="text-xl font-bold text-foreground mb-5">
                    Why choose this?
                  </h3>
                  <ul className="space-y-4">
                    {[
                      'Professional team with 8+ years experience',
                      'Premium cinema-grade equipment',
                      'Fully customizable setup',
                      '24/7 support until final delivery',
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="w-6 h-6 mt-0.5 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <Check className="w-3.5 h-3.5 text-primary" />
                        </div>
                        <span className="text-foreground/90">{item}</span>
                      </li>
                    ))}
                  </ul>

                  {price && (
                    <div className="mt-8 pt-6 border-t border-border/50">
                      <p className="text-sm text-muted-foreground mb-1">Total investment</p>
                      <p className="text-3xl font-bold text-foreground">{price}</p>
                      {originalPrice && (
                        <p className="text-sm text-muted-foreground line-through mt-1">
                          {originalPrice}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 md:py-28 bg-background transition-colors duration-300">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden bg-gradient-to-r from-primary via-primary to-primary-dark rounded-3xl p-10 md:p-16 text-center text-white shadow-2xl shadow-primary/25"
          >
            <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-52 h-52 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

            <div className="relative">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">
                Ready to Book?
              </h2>
              <p className="text-lg md:text-xl text-white/80 mb-8 max-w-xl mx-auto">
                Don&apos;t miss out on this special offer. Limited slots available for this month!
              </p>

              {price && (
                <div className="mb-8">
                  <span className="text-4xl md:text-5xl font-bold">{price}</span>
                  {originalPrice && (
                    <span className="ml-3 text-lg text-white/50 line-through">
                      {originalPrice}
                    </span>
                  )}
                </div>
              )}

              <Link
                href={ctaLink}
                className="group inline-flex items-center gap-3 bg-white text-primary px-10 py-5 rounded-full font-bold text-lg hover:bg-white/90 transition-all duration-300 hover:shadow-2xl hover:scale-105"
              >
                {ctaText}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

function calculateSavings(price: string, originalPrice: string): string {
  const priceNum = parseFloat(price.replace(/[^0-9]/g, ''));
  const originalNum = parseFloat(originalPrice.replace(/[^0-9]/g, ''));
  if (originalNum > 0 && originalNum > priceNum) {
    const savings = Math.round(((originalNum - priceNum) / originalNum) * 100);
    return `${savings}%`;
  }
  return '';
}

export default PromoTemplate;
