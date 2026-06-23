'use client';

import Image from 'next/image';
import { getImageUrl } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Clock, User, ArrowRight } from 'lucide-react';

export interface SimpleContent {
  title: string;
  subtitle?: string;
  heroImage?: string;
  content: string;
  author?: string;
  readTime?: string;
}

interface SimpleTemplateProps {
  content: SimpleContent;
}

export function SimpleTemplate({ content }: SimpleTemplateProps) {
  const { title, subtitle, heroImage, content: htmlContent, author, readTime } = content;

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      {/* Hero Section */}
      <section
        className={`relative ${
          heroImage
            ? 'h-[65vh] min-h-[480px]'
            : 'py-24 md:py-36 bg-gradient-to-br from-primary to-primary-dark'
        }`}
      >
        {heroImage ? (
          <>
            <div className="absolute inset-0">
              <Image
                src={getImageUrl(heroImage)}
                alt={title}
                fill
                className="object-cover"
                priority
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
            </div>
            <div className="relative h-full flex items-end pb-12 md:pb-16">
              <div className="max-w-3xl mx-auto px-6 w-full">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-[1.1]">
                    {title}
                  </h1>
                  {subtitle && (
                    <p className="text-lg md:text-xl text-white/85 max-w-2xl">{subtitle}</p>
                  )}
                </motion.div>
              </div>
            </div>
          </>
        ) : (
          <div className="max-w-3xl mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
              {subtitle && <p className="text-xl text-white/80">{subtitle}</p>}
            </motion.div>
          </div>
        )}
      </section>

      {/* Content Section */}
      <section className="py-12 md:py-20">
        <div className="max-w-2xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {/* Meta Bar */}
            <div className="flex flex-wrap items-center gap-5 pb-8 mb-8 border-b border-border/60">
              {author && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                  <span className="font-medium text-foreground">{author}</span>
                </div>
              )}
              {readTime && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>{readTime} read</span>
                </div>
              )}
            </div>

            {/* Article Content */}
            <article
              className="simple-article prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-img:rounded-2xl prose-img:shadow-lg prose-blockquote:border-l-primary prose-blockquote:bg-secondary/50 prose-blockquote:py-2 prose-blockquote:px-5 prose-blockquote:rounded-r-xl prose-strong:text-foreground"
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
            <style jsx>{`
              .simple-article > p:first-of-type::first-letter {
                float: left;
                font-size: 3.5rem;
                line-height: 0.9;
                font-weight: 700;
                margin-right: 0.6rem;
                margin-top: 0.15rem;
                color: #00a8eb;
              }
              .dark .simple-article > p:first-of-type::first-letter {
                color: #33b9ef;
              }
            `}</style>
          </motion.div>

          {/* Inline CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-14"
          >
            <div className="bg-secondary/60 rounded-2xl p-6 md:p-8 border border-border/40">
              <h3 className="text-xl font-bold text-foreground mb-2">
                Need help with your event?
              </h3>
              <p className="text-muted-foreground mb-5">
                Let&apos;s create something amazing together. Reach out and we&apos;ll get back to you within 24 hours.
              </p>
              <a
                href="/contact"
                className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-full font-medium hover:bg-primary-dark transition-colors"
              >
                Get in Touch
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default SimpleTemplate;
