import { endOfMonth, isAfter, max, parseISO } from 'date-fns'
import { materializeRecurrences } from '@/mock/recurrence'
import { notFound } from '@/mock/request'
import type { MockAccount, MockCategory, MockDatabase, MockTransaction } from '@/mock/db'
import type { Account, Budget, Category, Period, Transaction } from '@/types/models'

export function periodEnd({ month, year }: Period) {
  return endOfMonth(new Date(year, month - 1, 1))
}

export function syncUntil(db: MockDatabase, date: Date) {
  materializeRecurrences(db, max([date, endOfMonth(new Date())]))
}

export function isInPeriod(date: string, { month, year }: Period) {
  const [y, m] = date.split('-').map(Number)
  return y === year && m === month
}

export function roundMoney(value: number) {
  return Math.round(value * 100) / 100
}

export function signedValue({ tipo, valor }: Pick<MockTransaction, 'tipo' | 'valor'>) {
  return tipo === 'RECEITA' ? valor : -valor
}

export function balanceAt(db: MockDatabase, account: MockAccount, date: Date) {
  const total = db.transactions
    .filter(({ contaId, data }) => contaId === account.id && !isAfter(parseISO(data), date))
    .reduce((sum, transaction) => sum + signedValue(transaction), account.saldoInicial)
  return roundMoney(total)
}

export function findAccount(db: MockDatabase, id: number) {
  return db.accounts.find((account) => account.id === id) ?? notFound('Conta')
}

export function findCategory(db: MockDatabase, id: number) {
  return db.categories.find((category) => category.id === id) ?? notFound('Categoria')
}

export function toCategory({ id, nome, tipo, icone, cor }: MockCategory): Category {
  return { id, nome, tipo, icone, cor }
}

export function toAccount(db: MockDatabase, account: MockAccount, date: Date): Account {
  const banco = db.banks.find(({ id }) => id === account.bancoId) ?? notFound('Instituição')
  const tipoConta =
    db.accountTypes.find(({ id }) => id === account.tipoContaId) ?? notFound('Tipo de conta')

  return {
    id: account.id,
    descricao: account.descricao,
    saldo: balanceAt(db, account, date),
    banco,
    tipo_conta: tipoConta,
  }
}

export function toTransaction(db: MockDatabase, transaction: MockTransaction): Transaction {
  const date = parseISO(transaction.data)

  return {
    id: transaction.id,
    valor: transaction.valor,
    data_transacao: transaction.data,
    tipo: transaction.tipo,
    descricao: transaction.descricao,
    comentario: transaction.comentario,
    origem: transaction.origem,
    idTransacaoRecorrente: transaction.recorrenciaId,
    categoria: toCategory(findCategory(db, transaction.categoriaId)),
    conta: toAccount(db, findAccount(db, transaction.contaId), endOfMonth(date)),
  }
}

export function sumByType(db: MockDatabase, period: Period, type: MockTransaction['tipo']) {
  const total = db.transactions
    .filter(({ tipo, data }) => tipo === type && isInPeriod(data, period))
    .reduce((sum, { valor }) => sum + valor, 0)
  return roundMoney(total)
}

export function toBudget(db: MockDatabase, budget: MockDatabase['budgets'][number]): Budget {
  const period = { month: budget.mes, year: budget.ano }
  const valorGasto = roundMoney(
    db.transactions
      .filter(
        ({ tipo, categoriaId, data }) =>
          tipo === 'DESPESA' && categoriaId === budget.categoriaId && isInPeriod(data, period),
      )
      .reduce((sum, { valor }) => sum + valor, 0),
  )
  const progresso =
    budget.valorEstimado > 0 ? roundMoney((valorGasto / budget.valorEstimado) * 100) : 0

  return {
    id: budget.id,
    descricao: findCategory(db, budget.categoriaId).nome,
    valorEstimado: budget.valorEstimado,
    valorGasto,
    valorRestante: roundMoney(budget.valorEstimado - valorGasto),
    progresso,
    mes: budget.mes,
    ano: budget.ano,
    categoriaDTO: toCategory(findCategory(db, budget.categoriaId)),
  }
}
