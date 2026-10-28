import { useMutation, useQuery } from '@tanstack/react-query'
import {
  createCategory,
  getArchivedCategories,
  getCategories,
  setCategoryActive,
  updateCategory,
  type CategoryPayload,
} from '@/features/categories/services/categories-service'
import type { TransactionType } from '@/types/models'

export function useCategories(type?: TransactionType) {
  return useQuery({
    queryKey: ['categories', type ?? 'all'],
    queryFn: () => getCategories(type),
  })
}

export function useArchivedCategories() {
  return useQuery({
    queryKey: ['categories', 'archived'],
    queryFn: getArchivedCategories,
  })
}

export function useCreateCategory() {
  return useMutation({
    mutationFn: createCategory,
    meta: {
      successMessage: 'Categoria criada.',
      errorMessage: 'Não foi possível criar a categoria.',
    },
  })
}

export function useUpdateCategory() {
  return useMutation({
    mutationFn: ({ id, ...payload }: CategoryPayload & { id: number }) =>
      updateCategory(id, payload),
    meta: {
      successMessage: 'Categoria atualizada.',
      errorMessage: 'Não foi possível atualizar a categoria.',
    },
  })
}

export function useArchiveCategory() {
  return useMutation({
    mutationFn: (id: number) => setCategoryActive(id, false),
    meta: {
      successMessage: 'Categoria arquivada.',
      errorMessage: 'Não foi possível arquivar a categoria.',
    },
  })
}

export function useRestoreCategory() {
  return useMutation({
    mutationFn: (id: number) => setCategoryActive(id, true),
    meta: {
      successMessage: 'Categoria restaurada.',
      errorMessage: 'Não foi possível restaurar a categoria.',
    },
  })
}
