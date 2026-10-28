import { apiClient } from '@/lib/api-client'
import type { LoginInput, SignupInput } from '@/features/auth/schemas'

interface LoginResponse {
  token: string
}

export async function login(credentials: LoginInput) {
  const { data } = await apiClient.post<LoginResponse>('/auth/login', credentials)
  return data.token
}

export async function signup({ nome, email, senha }: SignupInput) {
  await apiClient.post('/auth/cadastro', { nome, email, senha })
}
