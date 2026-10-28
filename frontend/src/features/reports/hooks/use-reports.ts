import { useQuery } from '@tanstack/react-query'
import {
  getBalanceHistory,
  getCategoryTotals,
  getIncomeExpenseHistory,
  type PeriodRange,
} from '@/features/reports/services/reports-service'
import { shiftPeriod } from '@/hooks/use-period'
import type { Period, TransactionType } from '@/types/models'

export function rangeEndingAt(end: Period, months: number): PeriodRange {
  return { start: shiftPeriod(end, -(months - 1)), end }
}

export function useCategoryTotals(type: TransactionType, period: Period) {
  return useQuery({
    queryKey: ['reports', 'categories', type, period],
    queryFn: () => getCategoryTotals(type, period),
  })
}

export function useIncomeExpenseHistory(range: PeriodRange) {
  return useQuery({
    queryKey: ['reports', 'income-expense', range],
    queryFn: () => getIncomeExpenseHistory(range),
  })
}

export function useBalanceHistory(range: PeriodRange) {
  return useQuery({
    queryKey: ['reports', 'balance', range],
    queryFn: () => getBalanceHistory(range),
  })
}
