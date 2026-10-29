import type { ChartData, ChartOptions } from 'chart.js'
import { getDaysInMonth } from 'date-fns'
import { Line } from 'react-chartjs-2'
import '@/features/reports/chart-setup'
import {
  cartesianScales,
  currency,
  legendOptions,
  tooltipOptions,
} from '@/features/reports/chart-options'
import { ChartCard } from '@/features/reports/components/ChartCard'
import { useChartTheme } from '@/features/reports/hooks/use-chart-theme'
import { useTransactions } from '@/features/transactions/hooks/use-transactions'
import { isCurrentPeriod, shiftPeriod } from '@/hooks/use-period'
import { formatMonthName, parseApiDate } from '@/lib/format'
import type { Period, Transaction } from '@/types/models'

function cumulativeExpenses(transactions: Transaction[], days: number, untilDay = days) {
  const daily = Array.from({ length: days }, () => 0)
  transactions
    .filter((transaction) => transaction.tipo === 'DESPESA')
    .forEach((transaction) => {
      daily[parseApiDate(transaction.data_transacao).getDate() - 1] += transaction.valor
    })

  let total = 0
  return daily.map((value, index) => {
    total += value
    return index < untilDay ? total : null
  })
}

interface SpendingPaceChartProps {
  period: Period
  className?: string
}

export function SpendingPaceChart({ period, className }: SpendingPaceChartProps) {
  const theme = useChartTheme()
  const previousPeriod = shiftPeriod(period, -1)
  const current = useTransactions(period)
  const previous = useTransactions(previousPeriod)

  const currentDays = getDaysInMonth(new Date(period.year, period.month - 1))
  const previousDays = getDaysInMonth(new Date(previousPeriod.year, previousPeriod.month - 1))
  const days = Math.max(currentDays, previousDays)
  const today = isCurrentPeriod(period) ? new Date().getDate() : currentDays

  const currentSeries = cumulativeExpenses(current.data ?? [], currentDays, today)
  const previousSeries = cumulativeExpenses(previous.data ?? [], previousDays)
  const spentSoFar = currentSeries[today - 1] ?? 0
  const previousSameDay = previousSeries[Math.min(today, previousDays) - 1] ?? 0
  const difference = spentSoFar - previousSameDay

  const lineStyle = {
    borderWidth: 2,
    tension: 0.3,
    pointRadius: 0,
    pointHoverRadius: 5,
    pointHoverBorderWidth: 2,
    pointHoverBorderColor: theme.card,
    spanGaps: false,
  }

  const chartData: ChartData<'line'> = {
    labels: Array.from({ length: days }, (_, index) => String(index + 1)),
    datasets: [
      {
        label: formatMonthName(period.month, period.year),
        data: currentSeries,
        borderColor: theme.expense,
        pointHoverBackgroundColor: theme.expense,
        ...lineStyle,
      },
      {
        label: formatMonthName(previousPeriod.month, previousPeriod.year),
        data: previousSeries,
        borderColor: theme.mutedForeground,
        pointHoverBackgroundColor: theme.mutedForeground,
        borderDash: [6, 4],
        ...lineStyle,
      },
    ],
  }

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    scales: cartesianScales(theme),
    plugins: {
      legend: legendOptions(theme),
      tooltip: {
        ...tooltipOptions<'line'>(theme),
        callbacks: {
          title: (items) => `Até o dia ${items[0]?.label}`,
          label: (item) => `${item.dataset.label}: ${currency(theme, Number(item.raw))}`,
        },
      },
    },
  }

  const description =
    previousSameDay === 0
      ? 'Despesas acumuladas dia a dia'
      : `${currency(theme, Math.abs(difference))} ${difference > 0 ? 'a mais' : 'a menos'} que no mesmo ponto do mês anterior`

  return (
    <ChartCard
      title="Ritmo de gastos"
      description={description}
      isPending={current.isPending || previous.isPending}
      isError={current.isError || previous.isError}
      onRetry={() => {
        current.refetch()
        previous.refetch()
      }}
      isEmpty={spentSoFar === 0 && previousSeries[previousDays - 1] === 0}
      emptyMessage="Nenhuma despesa neste mês nem no anterior."
      className={className}
    >
      <div className="relative h-64 sm:h-72">
        <Line
          data={chartData}
          options={options}
          role="img"
          aria-label="Gráfico de linha comparando despesas acumuladas deste mês com o mês anterior"
        />
      </div>
    </ChartCard>
  )
}
