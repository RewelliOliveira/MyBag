import type { ReactNode } from 'react'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface DashboardPanelProps {
  title: string
  linkTo: string
  linkLabel: string
  children: ReactNode
  className?: string
}

export function DashboardPanel({
  title,
  linkTo,
  linkLabel,
  children,
  className,
}: DashboardPanelProps) {
  return (
    <section className={cn('flex min-w-0 flex-col rounded-2xl border bg-card', className)}>
      <header className="flex items-center justify-between border-b px-4 py-3 sm:px-5 sm:py-4">
        <h2 className="text-lg font-semibold">{title}</h2>
        <Button asChild variant="ghost" size="sm">
          <Link to={linkTo}>
            {linkLabel}
            <ArrowRight />
          </Link>
        </Button>
      </header>
      <div className="flex-1">{children}</div>
    </section>
  )
}
