import { apiClient } from '@/lib/api-client'
import type { Period, TransactionType } from '@/types/models'

export interface CategoryTotal {
  id: number
  nome: string
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

const categoryEndpoint: Record<TransactionType, string> = {
  RECEITA: '/dashboards/receitasCategoria',
  DESPESA: '/dashboards/despesasCategoria',
}

const rangeParams = ({ start, end }: PeriodRange) => ({
  params: {
    anoInicial: start.year,
    mesInicial: start.month,
    anoFinal: end.year,
    mesFinal: end.month,
  },
})

export async function getCategoryTotals(type: TransactionType, { month, year }: Period) {
  const { data } = await apiClient.get<CategoryTotal[]>(categoryEndpoint[type], {
    params: { mes: month, ano: year },
  })
  return data
}

export async function getIncomeExpenseHistory(range: PeriodRange) {
  const { data } = await apiClient.get<IncomeExpensePoint[]>(
    '/dashboards/transacoes/balanco',
    rangeParams(range),
  )
  return data
}

export async function getBalanceHistory(range: PeriodRange) {
  const { data } = await apiClient.get<BalancePoint[]>(
    '/dashboards/saldo/balanco',
    rangeParams(range),
  )
  return data
}
