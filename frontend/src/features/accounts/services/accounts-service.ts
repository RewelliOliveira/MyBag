import { ApiError } from '@/lib/api-error'
import { toApiDate } from '@/lib/format'
import { nextId, type MockDatabase } from '@/mock/db'
import { mockRequest } from '@/mock/request'
import {
  balanceAt,
  findAccount,
  periodEnd,
  roundMoney,
  syncUntil,
  toAccount,
} from '@/mock/selectors'
import type { Period } from '@/types/models'

export interface AccountPayload {
  descricao: string
  saldo: number
  bancoId: number
  tipoContaId: number
}

export interface AccountUpdatePayload extends AccountPayload {
  data: Date
}

function assertUniqueDescription(db: MockDatabase, descricao: string, ignoreId?: number) {
  const taken = db.accounts.some(
    (account) =>
      account.id !== ignoreId && account.descricao.toLowerCase() === descricao.trim().toLowerCase(),
  )
  if (taken) throw new ApiError(409, 'Já existe uma conta com essa descrição.')
}

export function getAccounts(period: Period) {
  return mockRequest((db) => {
    const date = periodEnd(period)
    syncUntil(db, date)
    return db.accounts
      .filter(({ arquivada }) => !arquivada)
      .map((account) => toAccount(db, account, date))
  })
}

export function getArchivedAccounts() {
  return mockRequest((db) =>
    db.accounts
      .filter(({ arquivada }) => arquivada)
      .map((account) => toAccount(db, account, new Date())),
  )
}

export function getTotalBalance(period: Period) {
  return mockRequest((db) => {
    const date = periodEnd(period)
    syncUntil(db, date)
    return roundMoney(
      db.accounts
        .filter(({ arquivada }) => !arquivada)
        .reduce((sum, account) => sum + balanceAt(db, account, date), 0),
    )
  })
}

export function createAccount({ descricao, saldo, bancoId, tipoContaId }: AccountPayload) {
  return mockRequest((db) => {
    assertUniqueDescription(db, descricao)
    const account = {
      id: nextId(db),
      descricao: descricao.trim(),
      saldoInicial: saldo,
      bancoId,
      tipoContaId,
      arquivada: false,
    }
    db.accounts.push(account)
    return toAccount(db, account, new Date())
  })
}

export function updateAccount(
  id: number,
  { descricao, saldo, bancoId, tipoContaId, data }: AccountUpdatePayload,
) {
  return mockRequest((db) => {
    const account = findAccount(db, id)
    assertUniqueDescription(db, descricao, id)

    account.descricao = descricao.trim()
    account.bancoId = bancoId
    account.tipoContaId = tipoContaId
    account.saldoInicial = roundMoney(account.saldoInicial + saldo - balanceAt(db, account, data))
    return toAccount(db, account, data)
  })
}

export function setAccountArchived(id: number, arquivada: boolean) {
  return mockRequest((db) => {
    const account = findAccount(db, id)
    account.arquivada = arquivada
    if (arquivada) {
      const today = toApiDate(new Date())
      db.recurrences
        .filter(({ contaId, dataFinal }) => contaId === id && (!dataFinal || dataFinal > today))
        .forEach((recurrence) => (recurrence.dataFinal = today))
      db.transactions = db.transactions.filter(
        ({ contaId, recorrenciaId, data }) => contaId !== id || !recorrenciaId || data <= today,
      )
    }
  })
}

export function deleteAccount(id: number) {
  return mockRequest((db) => {
    findAccount(db, id)
    if (db.transactions.some(({ contaId }) => contaId === id))
      throw new ApiError(409, 'Essa conta tem transações no histórico. Mantenha-a arquivada.')
    db.accounts = db.accounts.filter((account) => account.id !== id)
    db.recurrences = db.recurrences.filter(({ contaId }) => contaId !== id)
  })
}

export function getBanks() {
  return mockRequest((db) => db.banks)
}

export function getAccountTypes() {
  return mockRequest((db) => db.accountTypes)
}
