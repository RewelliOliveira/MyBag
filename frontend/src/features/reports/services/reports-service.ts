import { addMonths, isAfter } from 'date-fns'
import { mockRequest } from '@/mock/request'
import {
  balanceAt,
  findCategory,
  isInPeriod,
  periodEnd,
  roundMoney,
  sumByType,
  syncUntil,
} from '@/mock/selectors'
import type { Period, TransactionType } from '@/types/models'

export interface CategoryTotal {
  id: number
  nome: string
  icone: string
  cor: string
  valorTotal: number
  percentual: number
}

export interface IncomeExpensePoint {
  ano: number
  mes: number
  receitas: number
  despesas: number
}

export interface BalancePoint {
  ano: number
  mes: number
  saldo: number
}

export interface PeriodRange {
  start: Period
  end: Period
}

function monthsInRange({ start, end }: PeriodRange) {
  const months: Period[] = []
  const last = new Date(end.year, end.month - 1, 1)
  for (
    let date = new Date(start.year, start.month - 1, 1);
    !isAfter(date, last);
    date = addMonths(date, 1)
  ) {
    months.push({ month: date.getMonth() + 1, year: date.getFullYear() })
  }
  return months
}

export function getCategoryTotals(type: TransactionType, period: Period) {
  return mockRequest((db) => {
    syncUntil(db, periodEnd(period))
    const totals = new Map<number, number>()

    db.transactions
      .filter(({ tipo, data }) => tipo === type && isInPeriod(data, period))
      .forEach(({ categoriaId, valor }) =>
        totals.set(categoriaId, (totals.get(categoriaId) ?? 0) + valor),
      )

    const grandTotal = [...totals.values()].reduce((sum, value) => sum + value, 0)

    return [...totals.entries()]
      .map(([id, total]): CategoryTotal => {
        const { nome, icone, cor } = findCategory(db, id)
        return {
          id,
          nome,
          icone,
          cor,
          valorTotal: roundMoney(total),
          percentual: grandTotal ? roundMoney((total / grandTotal) * 100) : 0,
        }
      })
      .sort((a, b) => b.valorTotal - a.valorTotal)
  })
}

export function getIncomeExpenseHistory(range: PeriodRange) {
  return mockRequest((db) => {
    syncUntil(db, periodEnd(range.end))
    return monthsInRange(range).map((period): IncomeExpensePoint => ({
      ano: period.year,
      mes: period.month,
      receitas: sumByType(db, period, 'RECEITA'),
      despesas: sumByType(db, period, 'DESPESA'),
    }))
  })
}

export function getBalanceHistory(range: PeriodRange) {
  return mockRequest((db) => {
    syncUntil(db, periodEnd(range.end))
    return monthsInRange(range).map((period): BalancePoint => {
      const date = periodEnd(period)
      const saldo = db.accounts.reduce((sum, account) => sum + balanceAt(db, account, date), 0)
      return { ano: period.year, mes: period.month, saldo: roundMoney(saldo) }
    })
  })
}
