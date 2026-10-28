import { useState } from 'react'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  type ChartConfig,
} from '@/components/ui/chart'
import { ChartCard } from '@/features/reports/components/ChartCard'
import { CurrencyTooltip } from '@/features/reports/components/CurrencyTooltip'
import { RangeToggle, type RangeMonths } from '@/features/reports/components/RangeToggle'
import { rangeEndingAt, useIncomeExpenseHistory } from '@/features/reports/hooks/use-reports'
import { formatCompactCurrency, formatShortMonth } from '@/lib/format'
import type { Period } from '@/types/models'

const config = {
  receitas: { label: 'Receitas', color: 'var(--chart-income)' },
  despesas: { label: 'Despesas', color: 'var(--chart-expense)' },
} satisfies ChartConfig

const labels = { receitas: 'Receitas', despesas: 'Despesas' }

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
  const {
    data = [],
    isPending,
    isError,
    refetch,
  } = useIncomeExpenseHistory(rangeEndingAt(period, months))
  const chartData = data.map((point) => ({
    ...point,
    label: formatShortMonth(point.mes, point.ano),
  }))

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
      <ChartContainer config={config} className="aspect-auto h-72 w-full">
        <BarChart data={chartData} barGap={2} accessibilityLayer>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} />
          <YAxis
            tickLine={false}
            axisLine={false}
            width={64}
            tickFormatter={(value: number) => formatCompactCurrency(value)}
          />
          <ChartTooltip
            cursor={{ fill: 'var(--color-muted)' }}
            content={<CurrencyTooltip labels={labels} />}
          />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar
            dataKey="receitas"
            fill="var(--color-receitas)"
            radius={[4, 4, 0, 0]}
            maxBarSize={28}
          />
          <Bar
            dataKey="despesas"
            fill="var(--color-despesas)"
            radius={[4, 4, 0, 0]}
            maxBarSize={28}
          />
        </BarChart>
      </ChartContainer>
    </ChartCard>
  )
}
