import { useMutation, useQuery } from '@tanstack/react-query'
import {
  createTransaction,
  deleteTransaction,
  getTransactions,
  getTransactionTotal,
  updateTransaction,
  type RecurringDeleteScope,
  type TransactionPayload,
} from '@/features/transactions/services/transactions-service'
import type { Period, Transaction, TransactionType } from '@/types/models'

export function useTransactions(period: Period) {
  return useQuery({
    queryKey: ['transactions', period],
    queryFn: () => getTransactions(period),
  })
}

export function useTransactionTotal(type: TransactionType, period: Period) {
  return useQuery({
    queryKey: ['transactions', 'total', type, period],
    queryFn: () => getTransactionTotal(type, period),
  })
}

export function useCreateTransaction() {
  return useMutation({
    mutationFn: createTransaction,
    meta: {
      successMessage: 'Transação registrada.',
      errorMessage: 'Não foi possível registrar a transação.',
    },
  })
}

export function useUpdateTransaction() {
  return useMutation({
    mutationFn: ({ id, ...payload }: TransactionPayload & { id: number }) =>
      updateTransaction(id, payload),
    meta: {
      successMessage: 'Transação atualizada.',
      errorMessage: 'Não foi possível atualizar a transação.',
    },
  })
}

export function useDeleteTransaction() {
  return useMutation({
    mutationFn: ({
      transaction,
      scope,
    }: {
      transaction: Transaction
      scope: RecurringDeleteScope
    }) => deleteTransaction(transaction, scope),
    meta: {
      successMessage: 'Transação excluída.',
      errorMessage: 'Não foi possível excluir a transação.',
    },
  })
}
