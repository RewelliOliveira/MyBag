import type { ReactNode } from 'react'
import { ErrorState } from '@/components/shared/ErrorState'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

interface ChartCardProps {
  title: string
  description?: ReactNode
  actions?: ReactNode
  isPending: boolean
  isError: boolean
  onRetry: () => void
  isEmpty?: boolean
  emptyMessage?: string
  children: ReactNode
  className?: string
}

export function ChartCard({
  title,
  description,
  actions,
  isPending,
  isError,
  onRetry,
  isEmpty,
  emptyMessage = 'Sem dados para o período.',
  children,
  className,
}: ChartCardProps) {
  return (
    <section className={cn('min-w-0 rounded-2xl border bg-card p-5 md:p-6', className)}>
      <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold">{title}</h2>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
        {actions}
      </header>
      {isPending ? (
        <Skeleton className="h-64 w-full rounded-xl" />
      ) : isError ? (
        <ErrorState onRetry={onRetry} />
      ) : isEmpty ? (
        <p className="flex h-64 items-center justify-center text-sm text-muted-foreground">
          {emptyMessage}
        </p>
      ) : (
        children
      )}
    </section>
  )
}
