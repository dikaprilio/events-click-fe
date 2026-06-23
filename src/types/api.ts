/**
 * Common API Response Types
 * Matches backend response format: { code, message, data }
 */

export interface ApiSuccessResponse<T> {
  code: number;
  message: string;
  data: T;
}

export interface ApiErrorResponse {
  code: number;
  error: string | Array<{ field: string; message: string }>;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export interface PaginatedParams {
  limit?: number;
  offset?: number;
}

export interface PaginatedData<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
}

/**
 * Type guard to check if response is successful
 */
export function isSuccessResponse<T>(
  response: ApiResponse<T>
): response is ApiSuccessResponse<T> {
  return 'data' in response && 'message' in response;
}

/**
 * Type guard to check if response is an error
 */
export function isErrorResponse<T>(
  response: ApiResponse<T>
): response is ApiErrorResponse {
  return 'error' in response;
}
