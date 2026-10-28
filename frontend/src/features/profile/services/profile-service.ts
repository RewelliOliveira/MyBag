import { apiClient } from '@/lib/api-client'
import type { User } from '@/types/models'

export async function getCurrentUser() {
  const { data } = await apiClient.get<User>('/usuarios')
  return data
}
