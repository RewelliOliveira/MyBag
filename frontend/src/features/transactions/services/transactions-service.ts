import { endOfMonth, subDays } from 'date-fns'
import { toApiDate } from '@/lib/format'
import { nextId, type MockTransaction } from '@/mock/db'
import { advanceDate, firstOccurrence } from '@/mock/recurrence'
import { mockRequest, notFound } from '@/mock/request'
import {
  findAccount,
  findCategory,
  isInPeriod,
  periodEnd,
  sumByType,
  syncUntil,
  toTransaction,
} from '@/mock/selectors'
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

export function getTransactions(period: Period) {
  return mockRequest((db) => {
    syncUntil(db, periodEnd(period))
    return db.transactions
      .filter(({ data }) => isInPeriod(data, period))
      .sort((a, b) => b.data.localeCompare(a.data) || b.id - a.id)
      .map((transaction) => toTransaction(db, transaction))
  })
}

export function getTransactionTotal(type: TransactionType, period: Period) {
  return mockRequest((db) => {
    syncUntil(db, periodEnd(period))
    return sumByType(db, period, type)
  })
}

export function createTransaction({
  recorrencia,
  periodicidade,
  qtdParcelas,
  tipo,
  valor,
  descricao,
  categoriaId,
  contaId,
  data,
  comentario,
}: RecurringTransactionPayload) {
  return mockRequest((db) => {
    findCategory(db, categoriaId)
    findAccount(db, contaId)

    if (recorrencia === 'NORMAL') {
      db.transactions.push({
        id: nextId(db),
        valor,
        data: toApiDate(data),
        tipo,
        descricao: descricao.trim(),
        comentario: comentario?.trim() || null,
        origem: 'NORMAL',
        recorrenciaId: null,
        categoriaId,
        contaId,
      })
      return
    }

    const isInstallment = recorrencia === 'PARCELADA'
    const start = firstOccurrence(data, periodicidade)

    db.recurrences.push({
      id: nextId(db),
      origem: recorrencia,
      periodicidade,
      valor,
      tipo,
      descricao: descricao.trim(),
      categoriaId,
      contaId,
      dataCadastro: toApiDate(data),
      dataFinal:
        isInstallment && qtdParcelas
          ? toApiDate(advanceDate(start, qtdParcelas - 1, periodicidade))
          : null,
      ultimaExecucao: null,
      qtdParcelas: isInstallment ? (qtdParcelas ?? null) : null,
    })
    syncUntil(db, endOfMonth(data))
  })
}

export function updateTransaction(id: number, payload: TransactionPayload) {
  return mockRequest<Transaction>((db) => {
    const transaction = db.transactions.find((item) => item.id === id) ?? notFound('Transação')
    findCategory(db, payload.categoriaId)
    findAccount(db, payload.contaId)

    Object.assign(transaction, {
      tipo: payload.tipo,
      valor: payload.valor,
      descricao: payload.descricao.trim(),
      categoriaId: payload.categoriaId,
      contaId: payload.contaId,
      data: toApiDate(payload.data),
      comentario: payload.comentario?.trim() || null,
    })
    return toTransaction(db, transaction)
  })
}

export function deleteTransaction(transaction: Transaction, scope: RecurringDeleteScope) {
  return mockRequest((db): MockTransaction[] => {
    const recurringId = transaction.idTransacaoRecorrente

    if (scope === 'single' || !recurringId) {
      const removed = db.transactions.filter(({ id }) => id === transaction.id)
      db.transactions = db.transactions.filter(({ id }) => id !== transaction.id)
      return removed
    }

    if (scope === 'upcoming') {
      const recurrence = db.recurrences.find(({ id }) => id === recurringId)
      if (recurrence)
        recurrence.dataFinal = toApiDate(
          subDays(new Date(`${transaction.data_transacao}T00:00`), 1),
        )
      db.transactions = db.transactions.filter(
        ({ recorrenciaId, data }) =>
          recorrenciaId !== recurringId || data < transaction.data_transacao,
      )
      return []
    }

    db.recurrences = db.recurrences.filter(({ id }) => id !== recurringId)
    db.transactions = db.transactions.filter(({ recorrenciaId }) => recorrenciaId !== recurringId)
    return []
  })
}

export function restoreTransactions(transactions: MockTransaction[]) {
  return mockRequest((db) => {
    db.transactions.push(...transactions)
  })
}
