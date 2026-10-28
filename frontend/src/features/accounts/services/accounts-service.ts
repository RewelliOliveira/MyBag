import { apiClient } from '@/lib/api-client'
import { toApiDate } from '@/lib/format'
import type { Account, AccountSummary, AccountType, Bank, Period } from '@/types/models'

export interface AccountPayload {
  descricao: string
  saldo: number
  bancoId: number
  tipoContaId: number
}

export interface AccountUpdatePayload extends AccountPayload {
  data: Date
}

const periodParams = ({ month, year }: Period) => ({ params: { mes: month, ano: year } })

function toRequestBody({ descricao, saldo, bancoId, tipoContaId }: AccountPayload) {
  return { descricao, saldo, id_banco: bancoId, id_tipo_conta: tipoContaId }
}

export async function getAccounts(period: Period) {
  const { data } = await apiClient.get<Account[]>('/contas', periodParams(period))
  return data
}

export async function getAccountSummaries(period: Period) {
  const { data } = await apiClient.get<AccountSummary[]>('/contas/min', periodParams(period))
  return data
}

export async function getTotalBalance(period: Period) {
  const { data } = await apiClient.get<{ saldo: number }>(
    '/contas/saldoTotal',
    periodParams(period),
  )
  return data.saldo
}

export async function createAccount(payload: AccountPayload) {
  const { data } = await apiClient.post<Account>('/contas', toRequestBody(payload))
  return data
}

export async function updateAccount(id: number, payload: AccountUpdatePayload) {
  const { data } = await apiClient.put<Account>(`/contas/${id}`, {
    ...toRequestBody(payload),
    data: toApiDate(payload.data),
  })
  return data
}

export async function deleteAccount(id: number) {
  await apiClient.delete(`/contas/${id}`)
}

export async function getBanks() {
  const { data } = await apiClient.get<Bank[]>('/bancos')
  return data
}

export async function getAccountTypes() {
  const { data } = await apiClient.get<AccountType[]>('/tipoConta')
  return data
}
