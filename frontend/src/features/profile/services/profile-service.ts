import { apiClient } from '@/lib/api-client'
import type { User } from '@/types/models'

export interface ProfilePayload {
  nome: string
  email: string
  foto?: File
}

export async function getCurrentUser() {
  const { data } = await apiClient.get<User>('/usuarios')
  return data
}

export async function updateProfile({ nome, email, foto }: ProfilePayload) {
  const formData = new FormData()
  formData.append('nome', nome)
  formData.append('email', email)
  if (foto) formData.append('img', foto)

  const { data } = await apiClient.put<User>('/usuarios', formData)
  return data
}
