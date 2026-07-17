import { apiClient } from '@/lib/api-client';
import type { ApiResponse } from '@/types';

export async function subscribeToNewsletter(email: string): Promise<ApiResponse> {
  return apiClient.post('/newsletter', { email });
}
