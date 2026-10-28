import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

const percentFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'percent',
  maximumFractionDigits: 1,
})

export function formatCurrency(value: number | null | undefined) {
  return currencyFormatter.format(value ?? 0)
}

export function formatPercent(value: number) {
  return percentFormatter.format(value / 100)
}

export function parseApiDate(value: string) {
  return parseISO(value)
}

export function toApiDate(date: Date) {
  return format(date, 'yyyy-MM-dd')
}

export function formatDate(value: string | Date, pattern = 'dd/MM/yyyy') {
  const date = typeof value === 'string' ? parseApiDate(value) : value
  return format(date, pattern, { locale: ptBR })
}

export function formatMonthYear(month: number, year: number) {
  return format(new Date(year, month - 1, 1), "MMMM 'de' yyyy", { locale: ptBR })
}

export function formatShortMonth(month: number, year: number) {
  return format(new Date(year, month - 1, 1), 'MMM/yy', { locale: ptBR })
}

export function normalizeHexColor(color: string) {
  return color.startsWith('#') ? color : `#${color}`
}

export function getInitials(name: string | undefined) {
  const parts = name?.trim().split(/\s+/).filter(Boolean) ?? []
  const first = parts.at(0)?.[0] ?? ''
  const last = parts.length > 1 ? (parts.at(-1)?.[0] ?? '') : ''
  return (first + last).toUpperCase()
}
