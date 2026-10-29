import { EllipsisVertical, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Progress } from '@/components/ui/progress'
import { getBudgetStatus, type BudgetStatus } from '@/features/budgets/budget-status'
import { CategoryIcon } from '@/features/categories/components/CategoryIcon'
import { formatCurrency, formatPercent } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { Budget } from '@/types/models'

const indicatorClasses: Record<BudgetStatus, string> = {
  ok: '[&>[data-slot=progress-indicator]]:bg-income',
  warning: '[&>[data-slot=progress-indicator]]:bg-primary',
  exceeded: '[&>[data-slot=progress-indicator]]:bg-expense',
}

interface BudgetCardProps {
  budget: Budget
  onEdit: (budget: Budget) => void
  onDelete: (budget: Budget) => void
}

export function BudgetCard({ budget, onEdit, onDelete }: BudgetCardProps) {
  const status = getBudgetStatus(budget)
  const exceeded = status === 'exceeded'

  return (
    <article className="rounded-2xl border bg-card p-5">
      <header className="flex items-center gap-3">
        <CategoryIcon category={budget.categoriaDTO} />
        <h3 className="flex-1 truncate font-sans text-base font-semibold">
          {budget.categoriaDTO.nome}
        </h3>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={`Ações do orçamento ${budget.categoriaDTO.nome}`}
            >
              <EllipsisVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={() => onEdit(budget)}>
              <Pencil />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem variant="destructive" onSelect={() => onDelete(budget)}>
              <Trash2 />
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      <div className="mt-5 flex items-baseline justify-between gap-2">
        <p className="money text-2xl font-semibold">{formatCurrency(budget.valorGasto)}</p>
        <p className="text-sm text-muted-foreground">
          de <span className="money">{formatCurrency(budget.valorEstimado)}</span>
        </p>
      </div>

      <Progress
        value={Math.min(budget.progresso, 100)}
        aria-label={`${formatPercent(budget.progresso)} do orçamento usado`}
        className={cn('mt-3 h-2', indicatorClasses[status])}
      />

      <p
        className={cn(
          'mt-3 flex justify-between gap-2 text-sm',
          exceeded ? 'text-expense' : 'text-muted-foreground',
        )}
      >
        <span>
          {exceeded ? (
            <>
              <span className="money">{formatCurrency(Math.abs(budget.valorRestante))}</span> acima
              do limite
            </>
          ) : (
            <>
              Restam <span className="money">{formatCurrency(budget.valorRestante)}</span>
            </>
          )}
        </span>
        <span className="tabular-nums">{formatPercent(budget.progresso)}</span>
      </p>
    </article>
  )
}
