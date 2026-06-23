'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Post } from '@/types/post';
import { getImageUrl, formatDate } from '@/lib/utils';

interface PostCardProps {
  post: Post;
  index?: number;
  showImage?: boolean;
}

export function PostCard({ post, index = 0, showImage = true }: PostCardProps) {
  // Use event_name as slug for URL
  const slug = post.event_name.toLowerCase().replace(/\s+/g, '-');
  const featuredImage = post.images?.find((image) => image.is_header) || post.images?.[0];
  const imagePath = featuredImage?.url || featuredImage?.image_url || featuredImage?.image_path;
  const imageUrl = imagePath ? getImageUrl(imagePath) : null;

  return (
    <Link
      href={`/events/${slug}`}
      className="group glass-card overflow-hidden transition-all duration-300 hover:-translate-y-2 animate-fade-in-up block"
      style={{ animationDelay: `${0.1 * (index % 3)}s` }}
    >
      {/* Image Section */}
      {showImage && (
        <div className="relative h-60 bg-secondary overflow-hidden">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              unoptimized
              onError={(e) => {
                console.error('Image load error:', imageUrl);
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
              <span className="text-white/50 text-sm">No Image</span>
            </div>
          )}

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-primary/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="text-white font-semibold uppercase tracking-wider border-2 border-white rounded-full px-6 py-3">
              View Project
            </span>
          </div>
        </div>
      )}

      {/* Content Section */}
      <div className="p-6">
        <div className="flex justify-between items-center mb-3 text-xs font-semibold uppercase">
          <span className="text-primary">
            {post.tag?.name || post.tag_name || 'Event'}
          </span>
          <span className="text-muted-foreground">
            {formatDate(post.created_at)}
          </span>
        </div>
        <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
          {post.title}
        </h3>
        {post.description && (
          <p className="text-muted-foreground text-[15px] leading-relaxed line-clamp-2">
            {post.description}
          </p>
        )}
      </div>
    </Link>
  );
}

/**
 * Compact version for related posts
 */
export function PostCardCompact({ post }: { post: Post }) {
  const slug = post.event_name.toLowerCase().replace(/\s+/g, '-');
  const featuredImage = post.images?.find((image) => image.is_header) || post.images?.[0];
  const imagePath = featuredImage?.url || featuredImage?.image_url || featuredImage?.image_path;
  const imageUrl = imagePath ? getImageUrl(imagePath) : null;

  return (
    <Link
      href={`/events/${slug}`}
      className="group glass-card overflow-hidden block hover:-translate-y-2 transition-transform"
    >
      <div className="h-48 bg-secondary relative overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gray-800" />
        )}
        <div className="absolute inset-0 bg-primary/20 group-hover:bg-primary/40 transition-colors" />
      </div>
      <div className="p-6">
        <h4 className="font-bold text-foreground group-hover:text-primary transition-colors">
          {post.title}
        </h4>
      </div>
    </Link>
  );
}
