/**
 * API Client
 * Base fetch wrappers for server and client-side requests
 */

import { ApiResponse, ApiSuccessResponse, isErrorResponse } from '@/types/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

/**
 * Error class for API errors
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public code: number,
    public fieldErrors?: Array<{ field: string; message: string }>
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Extract error message from API error response
 */
function extractErrorMessage(error: string | Array<{ field: string; message: string }>): string {
  if (typeof error === 'string') {
    return error;
  }
  return error.map(e => e.message).join(', ');
}

/**
 * Server-side fetch wrapper
 * Use this in Server Components and Server Actions
 * 
 * @example
 * const posts = await serverFetch<Post[]>('/posts/get-all');
 * return posts.data; // Post[]
 */
export async function serverFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiSuccessResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  const data: ApiResponse<T> = await response.json();

  if (!response.ok || data.code >= 400 || isErrorResponse(data)) {
    const errorMessage = isErrorResponse(data)
      ? extractErrorMessage(data.error)
      : 'An error occurred';

    throw new ApiError(
      errorMessage,
      data.code || response.status,
      isErrorResponse(data) && typeof data.error !== 'string'
        ? data.error
        : undefined
    );
  }

  return data;
}

/**
 * Client-side fetch wrapper
 * Use this with React Query or in Client Components
 * Returns the data directly (unwraps the response)
 * 
 * @example
 * const posts = await clientFetch<Post[]>('/posts/get-all');
 * // posts is Post[] directly
 */
export async function clientFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  // Get auth token from localStorage (client-side only)
  let authHeader = {};
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('admin_token');
    if (token) {
      authHeader = { Authorization: `Bearer ${token}` };
    }
  }

  try {
    const isJsonBody = options?.body && typeof options.body === 'string';

    const response = await fetch(url, {
      ...options,
      headers: {
        ...(isJsonBody ? { 'Content-Type': 'application/json' } : {}),
        ...authHeader,
        ...options?.headers,
      },
    });

    const data: ApiResponse<T> = await response.json();

    if (!response.ok || data.code >= 400 || isErrorResponse(data)) {
      const errorMessage = isErrorResponse(data)
        ? extractErrorMessage(data.error)
        : 'An error occurred';

      const fieldErrors = isErrorResponse(data) && typeof data.error !== 'string'
        ? data.error
        : undefined;

      throw new ApiError(
        errorMessage,
        data.code || response.status,
        fieldErrors
      );
    }

    return (data as ApiSuccessResponse<T>).data;
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error);
    throw error;
  }
}

/**
 * Build query string from object
 */
export function buildQueryString(params: Record<string, string | number | undefined>): string {
  const query = Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== '')
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
    .join('&');

  return query ? `?${query}` : '';
}
