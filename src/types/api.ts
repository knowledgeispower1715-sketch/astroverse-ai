export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasMore: boolean;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string[]>;
  timestamp: string;
}

export interface ApiRequestConfig {
  baseUrl?: string;
  headers?: Record<string, string>;
  timeout?: number;
  retries?: number;
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface ApiEndpoint {
  method: HttpMethod;
  path: string;
  authenticated: boolean;
  rateLimit?: number;
}
