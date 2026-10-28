import { useMutation, useQuery } from '@tanstack/react-query'
import {
  createBudget,
  deleteBudget,
  getBudgets,
  updateBudget,
  type BudgetPayload,
} from '@/features/budgets/services/budgets-service'
import type { Period } from '@/types/models'

export function useBudgets(period: Period) {
  return useQuery({
    queryKey: ['budgets', period],
    queryFn: () => getBudgets(period),
  })
}

export function useCreateBudget() {
  return useMutation({
    mutationFn: createBudget,
    meta: {
      successMessage: 'Orçamento criado.',
      errorMessage: 'Não foi possível criar o orçamento.',
    },
  })
}

export function useUpdateBudget() {
  return useMutation({
    mutationFn: ({ id, ...payload }: BudgetPayload & { id: number }) => updateBudget(id, payload),
    meta: {
      successMessage: 'Orçamento atualizado.',
      errorMessage: 'Não foi possível atualizar o orçamento.',
    },
  })
}

export function useDeleteBudget() {
  return useMutation({
    mutationFn: deleteBudget,
    meta: {
      successMessage: 'Orçamento excluído.',
      errorMessage: 'Não foi possível excluir o orçamento.',
    },
  })
}
