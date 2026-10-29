import type { TransactionType } from '@/types/models'

export const transactionTypeLabels: Record<TransactionType, string> = {
  RECEITA: 'Receita',
  DESPESA: 'Despesa',
}

export const transactionTypePluralLabels: Record<TransactionType, string> = {
  RECEITA: 'Receitas',
  DESPESA: 'Despesas',
}
