import type { ChartType, TooltipItem } from 'chart.js'
import type { ChartTheme } from '@/features/reports/hooks/use-chart-theme'
import { formatCompactCurrency, formatCurrency } from '@/lib/format'

const HIDDEN_VALUE = 'R$ •••'

export function withAlpha(hex: string, alpha: number) {
  const channel = Math.round(alpha * 255)
    .toString(16)
    .padStart(2, '0')
  return `${hex.slice(0, 7)}${channel}`
}

export function currency(theme: ChartTheme, value: number) {
  return theme.hideValues ? HIDDEN_VALUE : formatCurrency(value)
}

export function legendOptions(theme: ChartTheme) {
  return {
    position: 'bottom' as const,
    labels: {
      color: theme.mutedForeground,
      usePointStyle: true,
      pointStyle: 'rectRounded' as const,
      boxWidth: 8,
      boxHeight: 8,
      padding: 16,
    },
  }
}

export function tooltipOptions<T extends ChartType>(
  theme: ChartTheme,
  formatLabel: (item: TooltipItem<T>) => string = (item) =>
    `${(item.dataset as { label?: string }).label}: ${currency(theme, Number(item.raw))}`,
) {
  return {
    backgroundColor: theme.popover,
    titleColor: theme.foreground,
    bodyColor: theme.foreground,
    borderColor: theme.border,
    borderWidth: 1,
    cornerRadius: 8,
    padding: 10,
    boxPadding: 4,
    usePointStyle: true,
    titleFont: { weight: 600 },
    callbacks: { label: formatLabel },
  }
}

export function cartesianScales(
  theme: ChartTheme,
  formatTick: (value: number) => string = formatCompactCurrency,
) {
  return {
    x: {
      grid: { display: false },
      border: { display: false },
      ticks: { color: theme.mutedForeground, maxRotation: 0, autoSkipPadding: 12 },
    },
    y: {
      grid: { color: theme.border },
      border: { display: false },
      ticks: {
        color: theme.mutedForeground,
        maxTicksLimit: 5,
        callback: (value: number | string) =>
          theme.hideValues ? '•••' : formatTick(Number(value)),
      },
    },
  }
}
