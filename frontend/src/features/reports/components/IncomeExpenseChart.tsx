import { useState } from 'react'
import type { ChartData, ChartOptions } from 'chart.js'
import { Bar } from 'react-chartjs-2'
import '@/features/reports/chart-setup'
import { cartesianScales, legendOptions, tooltipOptions } from '@/features/reports/chart-options'
import { ChartCard } from '@/features/reports/components/ChartCard'
import { RangeToggle, type RangeMonths } from '@/features/reports/components/RangeToggle'
import { useChartTheme } from '@/features/reports/hooks/use-chart-theme'
import { rangeEndingAt, useIncomeExpenseHistory } from '@/features/reports/hooks/use-reports'
import { formatShortMonth } from '@/lib/format'
import type { Period } from '@/types/models'

interface IncomeExpenseChartProps {
  period: Period
  defaultRange?: RangeMonths
  className?: string
}

export function IncomeExpenseChart({
  period,
  defaultRange = 6,
  className,
}: IncomeExpenseChartProps) {
  const [months, setMonths] = useState<RangeMonths>(defaultRange)
  const theme = useChartTheme()
  const {
    data = [],
    isPending,
    isError,
    refetch,
  } = useIncomeExpenseHistory(rangeEndingAt(period, months))

  const barStyle = {
    borderRadius: 4,
    borderSkipped: 'start' as const,
    maxBarThickness: 28,
    categoryPercentage: 0.7,
    barPercentage: 0.9,
  }

  const chartData: ChartData<'bar'> = {
    labels: data.map((point) => formatShortMonth(point.mes, point.ano)),
    datasets: [
      {
        label: 'Receitas',
        data: data.map((point) => point.receitas),
        backgroundColor: theme.income,
        ...barStyle,
      },
      {
        label: 'Despesas',
        data: data.map((point) => point.despesas),
        backgroundColor: theme.expense,
        ...barStyle,
      },
    ],
  }

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    scales: cartesianScales(theme),
    plugins: { legend: legendOptions(theme), tooltip: tooltipOptions<'bar'>(theme) },
  }

  return (
    <ChartCard
      title="Receitas e despesas"
      description="Comparativo mês a mês"
      actions={<RangeToggle value={months} onChange={setMonths} />}
      isPending={isPending}
      isError={isError}
      onRetry={refetch}
      isEmpty={data.length === 0}
      className={className}
    >
      <div className="relative h-64 sm:h-72">
        <Bar
          data={chartData}
          options={options}
          role="img"
          aria-label="Gráfico de barras com receitas e despesas por mês"
        />
      </div>
    </ChartCard>
  )
}
