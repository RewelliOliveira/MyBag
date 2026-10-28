import { PageHeader } from '@/components/layout/PageHeader'
import { MonthPicker } from '@/components/shared/MonthPicker'
import { BalanceHistoryChart } from '@/features/reports/components/BalanceHistoryChart'
import { CategoryBreakdownChart } from '@/features/reports/components/CategoryBreakdownChart'
import { IncomeExpenseChart } from '@/features/reports/components/IncomeExpenseChart'
import { usePeriod } from '@/hooks/use-period'

export function ReportsPage() {
  const [period] = usePeriod()

  return (
    <>
      <PageHeader
        title="Relatórios"
        description="Para onde o dinheiro foi e como o saldo evoluiu."
        actions={<MonthPicker />}
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <CategoryBreakdownChart type="DESPESA" period={period} />
        <CategoryBreakdownChart type="RECEITA" period={period} />
        <IncomeExpenseChart period={period} className="lg:col-span-2" />
        <BalanceHistoryChart period={period} className="lg:col-span-2" />
      </div>
    </>
  )
}
