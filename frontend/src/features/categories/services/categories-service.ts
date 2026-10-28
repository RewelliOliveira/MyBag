import { mockRequest } from '@/mock/request'
import { toCategory } from '@/mock/selectors'
import type { TransactionType } from '@/types/models'

export function getCategories(type?: TransactionType) {
  return mockRequest((db) =>
    db.categories.filter(({ tipo }) => !type || tipo === type).map(toCategory),
  )
}
