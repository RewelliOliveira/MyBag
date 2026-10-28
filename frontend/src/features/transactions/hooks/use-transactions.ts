import { useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  createTransaction,
  deleteTransaction,
  getTransactions,
  getTransactionTotal,
  restoreTransactions,
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
  const restore = useMutation({
    mutationFn: restoreTransactions,
    meta: {
      successMessage: 'Transação restaurada.',
      errorMessage: 'Não foi possível restaurar a transação.',
    },
  })

  return useMutation({
    mutationFn: ({
      transaction,
      scope,
    }: {
      transaction: Transaction
      scope: RecurringDeleteScope
    }) => deleteTransaction(transaction, scope),
    onSuccess: (removed, { transaction }) => {
      if (removed.length === 0) {
        toast.success('Transações excluídas.')
        return
      }
      toast.success(`"${transaction.descricao}" excluída.`, {
        action: { label: 'Desfazer', onClick: () => restore.mutate(removed) },
      })
    },
    meta: {
      errorMessage: 'Não foi possível excluir a transação.',
    },
  })
}
