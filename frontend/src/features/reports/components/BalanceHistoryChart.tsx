import { useState } from 'react'
import type { ChartData, ChartOptions, ScriptableContext } from 'chart.js'
import { Line } from 'react-chartjs-2'
import '@/features/reports/chart-setup'
import { cartesianScales, tooltipOptions, withAlpha } from '@/features/reports/chart-options'
import { ChartCard } from '@/features/reports/components/ChartCard'
import { RangeToggle, type RangeMonths } from '@/features/reports/components/RangeToggle'
import { useChartTheme } from '@/features/reports/hooks/use-chart-theme'
import { rangeEndingAt, useBalanceHistory } from '@/features/reports/hooks/use-reports'
import { formatShortMonth } from '@/lib/format'
import type { Period } from '@/types/models'

interface BalanceHistoryChartProps {
  period: Period
  className?: string
}

export function BalanceHistoryChart({ period, className }: BalanceHistoryChartProps) {
  const [months, setMonths] = useState<RangeMonths>(6)
  const theme = useChartTheme()
  const {
    data = [],
    isPending,
    isError,
    refetch,
  } = useBalanceHistory(rangeEndingAt(period, months))

  const fillGradient = ({ chart }: ScriptableContext<'line'>) => {
    const { ctx, chartArea } = chart
    if (!chartArea) return 'transparent'
    const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom)
    gradient.addColorStop(0, withAlpha(theme.primary, 0.25))
    gradient.addColorStop(1, withAlpha(theme.primary, 0))
    return gradient
  }

  const chartData: ChartData<'line'> = {
    labels: data.map((point) => formatShortMonth(point.mes, point.ano)),
    datasets: [
      {
        label: 'Saldo',
        data: data.map((point) => point.saldo),
        borderColor: theme.primary,
        borderWidth: 2,
        backgroundColor: fillGradient,
        fill: 'start',
        tension: 0.35,
        pointRadius: 0,
        pointHoverRadius: 5,
        pointHoverBorderWidth: 2,
        pointHoverBackgroundColor: theme.primary,
        pointHoverBorderColor: theme.card,
      },
    ],
  }

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    scales: cartesianScales(theme),
    plugins: { legend: { display: false }, tooltip: tooltipOptions<'line'>(theme) },
  }

  return (
    <ChartCard
      title="Evolução do saldo"
      description="Soma das contas no fim de cada mês"
      actions={<RangeToggle value={months} onChange={setMonths} />}
      isPending={isPending}
      isError={isError}
      onRetry={refetch}
      isEmpty={data.length === 0}
      className={className}
    >
      <div className="relative h-64 sm:h-72">
        <Line
          data={chartData}
          options={options}
          role="img"
          aria-label="Gráfico de linha com a evolução do saldo por mês"
        />
      </div>
    </ChartCard>
  )
}
