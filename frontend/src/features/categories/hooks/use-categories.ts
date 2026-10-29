import { useQuery } from '@tanstack/react-query'
import { getCategories } from '@/features/categories/services/categories-service'
import type { TransactionType } from '@/types/models'

export function useCategories(type?: TransactionType) {
  return useQuery({
    queryKey: ['categories', type ?? 'all'],
    queryFn: () => getCategories(type),
    staleTime: Infinity,
  })
}
