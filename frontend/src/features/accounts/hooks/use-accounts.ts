import { useMutation, useQuery } from '@tanstack/react-query'
import {
  createAccount,
  deleteAccount,
  getAccounts,
  getAccountTypes,
  getBanks,
  getTotalBalance,
  updateAccount,
  type AccountPayload,
  type AccountUpdatePayload,
} from '@/features/accounts/services/accounts-service'
import type { Period } from '@/types/models'

const STATIC_DATA_STALE_TIME = 60 * 60_000

export function useAccounts(period: Period) {
  return useQuery({
    queryKey: ['accounts', period],
    queryFn: () => getAccounts(period),
  })
}

export function useTotalBalance(period: Period) {
  return useQuery({
    queryKey: ['accounts', 'total-balance', period],
    queryFn: () => getTotalBalance(period),
  })
}

export function useBanks() {
  return useQuery({
    queryKey: ['banks'],
    queryFn: getBanks,
    staleTime: STATIC_DATA_STALE_TIME,
  })
}

export function useAccountTypes() {
  return useQuery({
    queryKey: ['account-types'],
    queryFn: getAccountTypes,
    staleTime: STATIC_DATA_STALE_TIME,
  })
}

export function useCreateAccount() {
  return useMutation({
    mutationFn: (payload: AccountPayload) => createAccount(payload),
    meta: {
      successMessage: 'Conta criada.',
      errorMessage: 'Não foi possível criar a conta.',
    },
  })
}

export function useUpdateAccount() {
  return useMutation({
    mutationFn: ({ id, ...payload }: AccountUpdatePayload & { id: number }) =>
      updateAccount(id, payload),
    meta: {
      successMessage: 'Conta atualizada.',
      errorMessage: 'Não foi possível atualizar a conta.',
    },
  })
}

export function useDeleteAccount() {
  return useMutation({
    mutationFn: deleteAccount,
    meta: {
      successMessage: 'Conta excluída.',
      errorMessage: 'Não foi possível excluir a conta.',
    },
  })
}
