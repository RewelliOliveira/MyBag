import { apiClient } from '@/lib/api-client'
import { toApiDate } from '@/lib/format'
import type { Budget, Period } from '@/types/models'

export interface BudgetPayload {
  categoriaId: number
  valorEstimado: number
  period: Period
}

function toRequestBody({ categoriaId, valorEstimado, period }: BudgetPayload) {
  return {
    idCategoria: categoriaId,
    valorEstimado,
    periodo: toApiDate(new Date(period.year, period.month - 1, 1)),
  }
}

export async function getBudgets({ month, year }: Period) {
  const { data } = await apiClient.get<Budget[]>('/orcamentos', {
    params: { mes: month, ano: year },
  })
  return data
}

export async function createBudget(payload: BudgetPayload) {
  const { data } = await apiClient.post<Budget>('/orcamentos', toRequestBody(payload))
  return data
}

export async function updateBudget(id: number, payload: BudgetPayload) {
  const { data } = await apiClient.put<Budget>(`/orcamentos/${id}`, toRequestBody(payload))
  return data
}

export async function deleteBudget(id: number) {
  await apiClient.delete(`/orcamentos/${id}`)
}
