import { useState } from 'react'
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import { ChartContainer, ChartTooltip, type ChartConfig } from '@/components/ui/chart'
import { ChartCard } from '@/features/reports/components/ChartCard'
import { CurrencyTooltip } from '@/features/reports/components/CurrencyTooltip'
import { RangeToggle, type RangeMonths } from '@/features/reports/components/RangeToggle'
import { rangeEndingAt, useBalanceHistory } from '@/features/reports/hooks/use-reports'
import { formatCompactCurrency, formatShortMonth } from '@/lib/format'
import type { Period } from '@/types/models'

const config = {
  saldo: { label: 'Saldo', color: 'var(--chart-1)' },
} satisfies ChartConfig

interface BalanceHistoryChartProps {
  period: Period
  className?: string
}

export function BalanceHistoryChart({ period, className }: BalanceHistoryChartProps) {
  const [months, setMonths] = useState<RangeMonths>(6)
  const {
    data = [],
    isPending,
    isError,
    refetch,
  } = useBalanceHistory(rangeEndingAt(period, months))
  const chartData = data.map((point) => ({
    ...point,
    label: formatShortMonth(point.mes, point.ano),
  }))

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
      <ChartContainer config={config} className="aspect-auto h-72 w-full">
        <AreaChart data={chartData} accessibilityLayer>
          <defs>
            <linearGradient id="balance-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-saldo)" stopOpacity={0.25} />
              <stop offset="100%" stopColor="var(--color-saldo)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} />
          <YAxis
            tickLine={false}
            axisLine={false}
            width={64}
            tickFormatter={(value: number) => formatCompactCurrency(value)}
          />
          <ChartTooltip
            cursor={{ stroke: 'var(--color-border)' }}
            content={<CurrencyTooltip labels={{ saldo: 'Saldo' }} />}
          />
          <Area
            dataKey="saldo"
            type="monotone"
            stroke="var(--color-saldo)"
            strokeWidth={2}
            fill="url(#balance-fill)"
            activeDot={{ r: 5, strokeWidth: 2, stroke: 'var(--color-card)' }}
          />
        </AreaChart>
      </ChartContainer>
    </ChartCard>
  )
}
