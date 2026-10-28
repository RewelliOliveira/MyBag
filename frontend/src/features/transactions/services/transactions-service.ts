import { apiClient } from '@/lib/api-client'
import { toApiDate } from '@/lib/format'
import type { Periodicity, Period, Transaction, TransactionType } from '@/types/models'

export type Recurrence = 'NORMAL' | 'FIXA' | 'PARCELADA'

export interface TransactionPayload {
  tipo: TransactionType
  valor: number
  descricao: string
  categoriaId: number
  contaId: number
  data: Date
  comentario?: string
}

export interface RecurringTransactionPayload extends TransactionPayload {
  recorrencia: Recurrence
  periodicidade: Periodicity
  qtdParcelas?: number
}

export type RecurringDeleteScope = 'single' | 'upcoming' | 'all'

const recurrenceEndpoint: Record<Recurrence, string> = {
  NORMAL: '/transacoes',
  FIXA: '/transacoesRecorrentes/fixas',
  PARCELADA: '/transacoesRecorrentes/parceladas',
}

function toRequestBody({ tipo, data, comentario, ...rest }: TransactionPayload) {
  return {
    ...rest,
    tipoTransacao: tipo,
    data: toApiDate(data),
    comentario: comentario?.trim() || null,
  }
}

export async function getTransactions({ month, year }: Period) {
  const { data } = await apiClient.get<Transaction[]>('/transacoes', {
    params: { mes: month, ano: year },
  })
  return data
}

export async function getTransactionTotal(type: TransactionType, { month, year }: Period) {
  const endpoint = type === 'RECEITA' ? 'somatorioReceitas' : 'somatorioDespesas'
  const { data } = await apiClient.get<{ valor: number }>(`/transacoes/${endpoint}`, {
    params: { mes: month, ano: year },
  })
  return data.valor ?? 0
}

export async function createTransaction({
  recorrencia,
  periodicidade,
  qtdParcelas,
  ...payload
}: RecurringTransactionPayload) {
  const body = {
    ...toRequestBody(payload),
    ...(recorrencia !== 'NORMAL' && { periodicidade }),
    ...(recorrencia === 'PARCELADA' && { qtdParcelas }),
  }
  await apiClient.post(recurrenceEndpoint[recorrencia], body)
}

export async function updateTransaction(id: number, payload: TransactionPayload) {
  const { data } = await apiClient.put<Transaction>(`/transacoes/${id}`, toRequestBody(payload))
  return data
}

export async function deleteTransaction(transaction: Transaction, scope: RecurringDeleteScope) {
  const recurringId = transaction.idTransacaoRecorrente

  if (scope === 'single' || !recurringId) {
    await apiClient.delete(`/transacoes/${transaction.id}`)
  } else if (scope === 'upcoming') {
    await apiClient.delete(`/transacoesRecorrentes/futuras/${recurringId}`, {
      params: { data: transaction.data_transacao },
    })
  } else {
    await apiClient.delete(`/transacoesRecorrentes/${recurringId}`)
  }
}
