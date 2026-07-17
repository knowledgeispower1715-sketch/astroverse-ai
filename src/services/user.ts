import { apiClient } from '@/lib/api-client';
import type { ApiResponse } from '@/types';
import type { User, UserProfile } from '@/types/user';

export async function getCurrentUser(): Promise<ApiResponse<User>> {
  return apiClient.get('/user/me');
}

export async function updateProfile(data: Partial<UserProfile>): Promise<ApiResponse<UserProfile>> {
  return apiClient.patch('/user/profile', data);
}

export async function deleteAccount(): Promise<ApiResponse> {
  return apiClient.delete('/user/me');
}
