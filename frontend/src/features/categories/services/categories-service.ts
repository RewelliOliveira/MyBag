import { apiClient } from '@/lib/api-client'
import type { Category, TransactionType } from '@/types/models'

export interface CategoryPayload {
  nome: string
  tipo: TransactionType
  cor: string
}

const endpointByType: Record<TransactionType, string> = {
  RECEITA: '/categorias/receitas',
  DESPESA: '/categorias/despesas',
}

export async function getCategories(type?: TransactionType) {
  const { data } = await apiClient.get<Category[]>(type ? endpointByType[type] : '/categorias')
  return data
}

export async function getArchivedCategories() {
  const { data } = await apiClient.get<Category[]>('/categorias/arquivadas')
  return data
}

export async function createCategory(payload: CategoryPayload) {
  const { data } = await apiClient.post<Category>('/categorias', payload)
  return data
}

export async function updateCategory(id: number, payload: CategoryPayload) {
  const { data } = await apiClient.put<Category>(`/categorias/${id}`, payload)
  return data
}

export async function setCategoryActive(id: number, ativa: boolean) {
  const { data } = await apiClient.patch<Category>(`/categorias/arquivadas/${id}`, { ativa })
  return data
}
