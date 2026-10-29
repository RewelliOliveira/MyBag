import { useState } from 'react'
import type { ChartData, ChartOptions } from 'chart.js'
import { Bar } from 'react-chartjs-2'
import '@/features/reports/chart-setup'
import { cartesianScales, currency, tooltipOptions } from '@/features/reports/chart-options'
import { ChartCard } from '@/features/reports/components/ChartCard'
import { RangeToggle, type RangeMonths } from '@/features/reports/components/RangeToggle'
import { useChartTheme } from '@/features/reports/hooks/use-chart-theme'
import { rangeEndingAt, useIncomeExpenseHistory } from '@/features/reports/hooks/use-reports'
import { formatShortMonth } from '@/lib/format'
import type { Period } from '@/types/models'

interface MonthlyResultChartProps {
  period: Period
  className?: string
}

export function MonthlyResultChart({ period, className }: MonthlyResultChartProps) {
  const [months, setMonths] = useState<RangeMonths>(6)
  const theme = useChartTheme()
  const {
    data = [],
    isPending,
    isError,
    refetch,
  } = useIncomeExpenseHistory(rangeEndingAt(period, months))

  const results = data.map((point) => point.receitas - point.despesas)
  const positiveMonths = results.filter((value) => value >= 0).length

  const chartData: ChartData<'bar'> = {
    labels: data.map((point) => formatShortMonth(point.mes, point.ano)),
    datasets: [
      {
        label: 'Resultado',
        data: results,
        backgroundColor: results.map((value) => (value >= 0 ? theme.income : theme.expense)),
        borderRadius: 4,
        borderSkipped: 'start',
        maxBarThickness: 32,
      },
    ],
  }

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: cartesianScales(theme),
    plugins: {
      legend: { display: false },
      tooltip: tooltipOptions<'bar'>(theme, (item) => {
        const value = Number(item.raw)
        return `${value >= 0 ? 'Sobrou' : 'Faltou'}: ${currency(theme, Math.abs(value))}`
      }),
    },
  }

  return (
    <ChartCard
      title="Resultado do mês"
      description={
        data.length > 0
          ? `Fechou no positivo em ${positiveMonths} de ${data.length} meses`
          : undefined
      }
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
          aria-label="Gráfico de barras com o resultado (receitas menos despesas) de cada mês"
        />
      </div>
    </ChartCard>
  )
}
