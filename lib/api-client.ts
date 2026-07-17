import type { ApiResponse } from '@/types';
import type { ApiRequestConfig } from '@/types/api';

const DEFAULT_CONFIG: ApiRequestConfig = {
  baseUrl: '/api',
  timeout: 10000,
  retries: 2,
};

class ApiClient {
  private config: ApiRequestConfig;

  constructor(config: Partial<ApiRequestConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  private async request<T>(
    method: string,
    path: string,
    body?: unknown
  ): Promise<ApiResponse<T>> {
    const url = `${this.config.baseUrl}${path}`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...this.config.headers,
        },
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeout);
      
      // If no content, just return success
      if (response.status === 204) {
        return { success: true };
      }

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.error || 'Request failed' };
      }

      return { success: true, data };
    } catch (error) {
      clearTimeout(timeout);
      if (error instanceof DOMException && error.name === 'AbortError') {
        return { success: false, error: 'Request timeout' };
      }
      return { success: false, error: 'Network error' };
    }
  }

  async get<T>(path: string) { return this.request<T>('GET', path); }
  async post<T>(path: string, body: unknown) { return this.request<T>('POST', path, body); }
  async put<T>(path: string, body: unknown) { return this.request<T>('PUT', path, body); }
  async patch<T>(path: string, body: unknown) { return this.request<T>('PATCH', path, body); }
  async delete<T>(path: string) { return this.request<T>('DELETE', path); }
}

export const apiClient = new ApiClient();
export { ApiClient };
