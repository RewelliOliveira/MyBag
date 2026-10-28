import type { ComponentProps } from 'react'
import { ChartTooltipContent } from '@/components/ui/chart'
import { formatCurrency } from '@/lib/format'

type CurrencyTooltipProps = ComponentProps<typeof ChartTooltipContent> & {
  labels?: Record<string, string>
}

export function CurrencyTooltip({ labels, ...props }: CurrencyTooltipProps) {
  return (
    <ChartTooltipContent
      {...props}
      formatter={(value, name, item) => (
        <div className="flex w-full items-center gap-2">
          <span
            className="size-2.5 shrink-0 rounded-sm"
            style={{ backgroundColor: item.payload?.fill ?? item.color }}
          />
          <span className="flex-1 text-muted-foreground">{labels?.[String(name)] ?? name}</span>
          <span className="money font-medium text-foreground">{formatCurrency(Number(value))}</span>
        </div>
      )}
    />
  )
}
