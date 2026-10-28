import { ApiError } from '@/lib/api-error'
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
    return db.accounts.map((account) => toAccount(db, account, date))
  })
}

export function getTotalBalance(period: Period) {
  return mockRequest((db) => {
    const date = periodEnd(period)
    syncUntil(db, date)
    return roundMoney(db.accounts.reduce((sum, account) => sum + balanceAt(db, account, date), 0))
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

export function deleteAccount(id: number) {
  return mockRequest((db) => {
    findAccount(db, id)
    db.accounts = db.accounts.filter((account) => account.id !== id)
    db.transactions = db.transactions.filter(({ contaId }) => contaId !== id)
    db.recurrences = db.recurrences.filter(({ contaId }) => contaId !== id)
  })
}

export function getBanks() {
  return mockRequest((db) => db.banks)
}

export function getAccountTypes() {
  return mockRequest((db) => db.accountTypes)
}
