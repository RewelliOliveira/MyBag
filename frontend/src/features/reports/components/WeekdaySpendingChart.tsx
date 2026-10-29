import type { ChartData, ChartOptions } from 'chart.js'
import { Bar } from 'react-chartjs-2'
import '@/features/reports/chart-setup'
import {
  cartesianScales,
  currency,
  tooltipOptions,
  withAlpha,
} from '@/features/reports/chart-options'
import { ChartCard } from '@/features/reports/components/ChartCard'
import { useChartTheme } from '@/features/reports/hooks/use-chart-theme'
import { useTransactions } from '@/features/transactions/hooks/use-transactions'
import { capitalize, parseApiDate } from '@/lib/format'
import type { Period } from '@/types/models'

const weekdays = [
  { short: 'Seg', long: 'segunda-feira' },
  { short: 'Ter', long: 'terça-feira' },
  { short: 'Qua', long: 'quarta-feira' },
  { short: 'Qui', long: 'quinta-feira' },
  { short: 'Sex', long: 'sexta-feira' },
  { short: 'Sáb', long: 'sábado' },
  { short: 'Dom', long: 'domingo' },
]

interface WeekdaySpendingChartProps {
  period: Period
  className?: string
}

export function WeekdaySpendingChart({ period, className }: WeekdaySpendingChartProps) {
  const theme = useChartTheme()
  const { data = [], isPending, isError, refetch } = useTransactions(period)

  const totals = Array.from({ length: 7 }, () => 0)
  data
    .filter((transaction) => transaction.tipo === 'DESPESA')
    .forEach((transaction) => {
      const weekday = (parseApiDate(transaction.data_transacao).getDay() + 6) % 7
      totals[weekday] += transaction.valor
    })

  const peak = totals.indexOf(Math.max(...totals))
  const hasData = totals.some((value) => value > 0)

  const chartData: ChartData<'bar'> = {
    labels: weekdays.map((day) => day.short),
    datasets: [
      {
        label: 'Despesas',
        data: totals,
        backgroundColor: totals.map((_, index) =>
          index === peak ? theme.expense : withAlpha(theme.expense, 0.4),
        ),
        hoverBackgroundColor: theme.expense,
        borderRadius: 4,
        borderSkipped: 'start',
        maxBarThickness: 36,
      },
    ],
  }

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: cartesianScales(theme),
    plugins: {
      legend: { display: false },
      tooltip: {
        ...tooltipOptions<'bar'>(theme),
        callbacks: {
          title: (items) => capitalize(weekdays[items[0]?.dataIndex ?? 0].long),
          label: (item) => `Despesas: ${currency(theme, Number(item.raw))}`,
        },
      },
    },
  }

  return (
    <ChartCard
      title="Gastos por dia da semana"
      description={hasData ? `Dia de maior gasto: ${weekdays[peak].long}` : undefined}
      isPending={isPending}
      isError={isError}
      onRetry={refetch}
      isEmpty={!hasData}
      emptyMessage="Nenhuma despesa registrada no mês."
      className={className}
    >
      <div className="relative h-64 sm:h-72">
        <Bar
          data={chartData}
          options={options}
          role="img"
          aria-label="Gráfico de barras com o total de despesas por dia da semana"
        />
      </div>
    </ChartCard>
  )
}
