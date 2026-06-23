/**
 * Client Types
 * Maps to backend clients table
 */

export interface Client {
  id: number;
  clientName: string;
  urlPortofolio?: string;
  ImagePath: string;
}

/**
 * Frontend client with additional computed fields
 */
export interface ClientWithMeta extends Client {
  slug: string;
  category?: string;
}
