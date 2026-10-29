import type { ChartData, ChartOptions } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'
import '@/features/reports/chart-setup'
import { CategoryIcon } from '@/features/categories/components/CategoryIcon'
import { currency, tooltipOptions } from '@/features/reports/chart-options'
import { ChartCard } from '@/features/reports/components/ChartCard'
import { useChartTheme } from '@/features/reports/hooks/use-chart-theme'
import { useCategoryTotals } from '@/features/reports/hooks/use-reports'
import { formatCurrency, formatPercent } from '@/lib/format'
import { transactionTypePluralLabels } from '@/lib/transaction-types'
import type { Period, TransactionType } from '@/types/models'

interface CategoryBreakdownChartProps {
  type: TransactionType
  period: Period
}

export function CategoryBreakdownChart({ type, period }: CategoryBreakdownChartProps) {
  const { data = [], isPending, isError, refetch } = useCategoryTotals(type, period)
  const total = data.reduce((sum, item) => sum + item.valorTotal, 0)
  const sorted = [...data].sort((a, b) => b.valorTotal - a.valorTotal)

  const theme = useChartTheme()

  const chartData: ChartData<'doughnut'> = {
    labels: sorted.map((item) => item.nome),
    datasets: [
      {
        data: sorted.map((item) => item.valorTotal),
        backgroundColor: sorted.map((item) => item.cor),
        borderColor: theme.card,
        borderWidth: 2,
        borderRadius: 4,
        hoverOffset: 6,
      },
    ],
  }

  const options: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: true,
    cutout: '62%',
    layout: { padding: 6 },
    plugins: {
      legend: { display: false },
      tooltip: tooltipOptions<'doughnut'>(
        theme,
        (item) => `${item.label}: ${currency(theme, Number(item.raw))}`,
      ),
    },
  }

  return (
    <ChartCard
      title={`${transactionTypePluralLabels[type]} por categoria`}
      description={
        data.length > 0 ? (
          <>
            <span className="money">{formatCurrency(total)}</span> no mês
          </>
        ) : undefined
      }
      isPending={isPending}
      isError={isError}
      onRetry={refetch}
      isEmpty={data.length === 0}
      emptyMessage={`Nenhuma ${type === 'RECEITA' ? 'receita' : 'despesa'} registrada no mês.`}
    >
      <div className="grid items-center gap-6 sm:grid-cols-2">
        <div className="relative mx-auto aspect-square w-full max-w-56">
          <Doughnut
            data={chartData}
            options={options}
            role="img"
            aria-label={`Gráfico de rosca com ${transactionTypePluralLabels[type].toLowerCase()} por categoria`}
          />
        </div>

        <ul className="space-y-3 text-sm">
          {sorted.map((item) => (
            <li key={item.id} className="flex items-center gap-2">
              <CategoryIcon category={item} className="size-7 [&_svg]:size-3.5" />
              <span className="flex-1 truncate">{item.nome}</span>
              <span className="money font-medium">{formatCurrency(item.valorTotal)}</span>
              <span className="w-12 text-right text-muted-foreground tabular-nums">
                {formatPercent(item.percentual)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </ChartCard>
  )
}
