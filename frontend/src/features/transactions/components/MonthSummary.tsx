import { ArrowDownLeft, ArrowUpRight, Scale } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { AnimatedNumber } from '@/components/shared/AnimatedNumber'
import { Skeleton } from '@/components/ui/skeleton'
import { useTransactionTotal } from '@/features/transactions/hooks/use-transactions'
import { formatCurrency } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { Period } from '@/types/models'

interface SummaryItemProps {
  label: string
  value: number | undefined
  icon: LucideIcon
  tone: 'income' | 'expense' | 'neutral'
}

const toneClasses: Record<SummaryItemProps['tone'], string> = {
  income: 'bg-income-soft text-income',
  expense: 'bg-expense-soft text-expense',
  neutral: 'bg-accent text-accent-foreground',
}

function SummaryItem({ label, value, icon: Icon, tone }: SummaryItemProps) {
  return (
    <div className="flex items-center gap-3 p-4 md:p-5">
      <span
        className={cn(
          'flex size-10 shrink-0 items-center justify-center rounded-xl',
          toneClasses[tone],
        )}
      >
        <Icon className="size-5" />
      </span>
      <div className="min-w-0">
        <p className="text-sm text-muted-foreground">{label}</p>
        {value === undefined ? (
          <Skeleton className="mt-1 h-6 w-28" />
        ) : (
          <AnimatedNumber
            value={value}
            format={formatCurrency}
            className="block truncate money text-xl font-semibold"
          />
        )}
      </div>
    </div>
  )
}

interface MonthSummaryProps {
  period: Period
}

export function MonthSummary({ period }: MonthSummaryProps) {
  const { data: income } = useTransactionTotal('RECEITA', period)
  const { data: expenses } = useTransactionTotal('DESPESA', period)
  const result = income !== undefined && expenses !== undefined ? income - expenses : undefined

  return (
    <div className="grid divide-y rounded-2xl border bg-card sm:grid-cols-3 sm:divide-x sm:divide-y-0">
      <SummaryItem label="Receitas" value={income} icon={ArrowDownLeft} tone="income" />
      <SummaryItem label="Despesas" value={expenses} icon={ArrowUpRight} tone="expense" />
      <SummaryItem label="Resultado do mês" value={result} icon={Scale} tone="neutral" />
    </div>
  )
}
