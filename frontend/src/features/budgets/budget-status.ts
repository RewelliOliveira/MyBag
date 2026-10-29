import type { Budget } from '@/types/models'

export type BudgetStatus = 'ok' | 'warning' | 'exceeded'

const WARNING_THRESHOLD = 80

export function getBudgetStatus({ progresso }: Pick<Budget, 'progresso'>): BudgetStatus {
  if (progresso > 100) return 'exceeded'
  if (progresso >= WARNING_THRESHOLD) return 'warning'
  return 'ok'
}
