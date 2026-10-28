import { Cell, Pie, PieChart } from 'recharts'
import { ChartContainer, ChartTooltip, type ChartConfig } from '@/components/ui/chart'
import { CategoryIcon } from '@/features/categories/components/CategoryIcon'
import { ChartCard } from '@/features/reports/components/ChartCard'
import { CurrencyTooltip } from '@/features/reports/components/CurrencyTooltip'
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

  const config = Object.fromEntries(
    sorted.map((item) => [item.nome, { label: item.nome, color: item.cor }]),
  ) satisfies ChartConfig

  return (
    <ChartCard
      title={`${transactionTypePluralLabels[type]} por categoria`}
      description={data.length > 0 ? `${formatCurrency(total)} no mês` : undefined}
      isPending={isPending}
      isError={isError}
      onRetry={refetch}
      isEmpty={data.length === 0}
      emptyMessage={`Nenhuma ${type === 'RECEITA' ? 'receita' : 'despesa'} registrada no mês.`}
    >
      <div className="grid items-center gap-6 sm:grid-cols-2">
        <ChartContainer config={config} className="mx-auto aspect-square w-full max-w-56">
          <PieChart>
            <ChartTooltip content={<CurrencyTooltip hideLabel />} />
            <Pie
              data={sorted}
              dataKey="valorTotal"
              nameKey="nome"
              innerRadius="62%"
              paddingAngle={2}
              cornerRadius={4}
              stroke="var(--color-card)"
              strokeWidth={2}
            >
              {sorted.map((item) => (
                <Cell key={item.id} fill={item.cor} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>

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
