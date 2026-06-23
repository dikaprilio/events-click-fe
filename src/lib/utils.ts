import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Get full image URL from image path
 * 
 * Database stores: "clients/file.jpg" or "equipments/file.jpg" or "posts/file.jpg"
 * Output URL: "http://api.com/uploads/clients/file.jpg"
 */
export function getImageUrl(path: string | undefined | null): string {
  if (!path) return '';
  
  // Already a full URL
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  // Get base URL (API URL without /api suffix)
  const baseUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000')
    .replace(/\/api$/, '');
  
  // Clean path - remove any leading slashes or uploads/ prefix
  // Backend stores paths like "clients/file.jpg" (without uploads/ prefix)
  const cleanPath = path.replace(/^\/+/, '').replace(/^uploads\//, '');
  
  return `${baseUrl}/uploads/${cleanPath}`;
}

/**
 * Format date to locale string
 */
export function formatDate(dateString: string | undefined | null): string {
  if (!dateString) return '-';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '-';
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return '-';
  }
}

/**
 * Format date with time
 */
export function formatDateTime(dateString: string | undefined | null): string {
  if (!dateString) return '-';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '-';
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '-';
  }
}
