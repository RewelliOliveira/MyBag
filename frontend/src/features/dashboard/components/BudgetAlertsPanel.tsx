import { CircleAlert, CircleCheck, OctagonAlert } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { getBudgetStatus } from '@/features/budgets/budget-status'
import { useBudgets } from '@/features/budgets/hooks/use-budgets'
import { DashboardPanel } from '@/features/dashboard/components/DashboardPanel'
import { formatCurrency, formatPercent } from '@/lib/format'
import type { Period } from '@/types/models'

interface BudgetAlertsPanelProps {
  period: Period
  className?: string
}

export function BudgetAlertsPanel({ period, className }: BudgetAlertsPanelProps) {
  const { data: budgets = [], isPending } = useBudgets(period)
  const alerts = budgets
    .filter((budget) => getBudgetStatus(budget) !== 'ok')
    .sort((a, b) => b.progresso - a.progresso)

  return (
    <DashboardPanel
      title="Orçamentos"
      linkTo="/orcamentos"
      linkLabel="Ver todos"
      className={className}
    >
      {isPending ? (
        <div className="space-y-3 p-5">
          <Skeleton className="h-10" />
          <Skeleton className="h-10" />
        </div>
      ) : budgets.length === 0 ? (
        <p className="p-5 text-sm text-muted-foreground">
          Defina limites por categoria para acompanhar seus gastos aqui.
        </p>
      ) : alerts.length === 0 ? (
        <div className="flex items-center gap-3 p-5 text-sm">
          <CircleCheck className="size-5 shrink-0 text-income" />
          <p>Todos os {budgets.length} orçamentos estão dentro do limite.</p>
        </div>
      ) : (
        <ul className="divide-y">
          {alerts.map((budget) => {
            const exceeded = getBudgetStatus(budget) === 'exceeded'
            const Icon = exceeded ? OctagonAlert : CircleAlert
            return (
              <li key={budget.id} className="flex items-start gap-3 px-5 py-3">
                <Icon
                  className={
                    exceeded ? 'size-5 shrink-0 text-expense' : 'size-5 shrink-0 text-primary'
                  }
                />
                <div className="min-w-0 flex-1 text-sm">
                  <p className="font-medium">{budget.categoriaDTO.nome}</p>
                  <p className="text-muted-foreground">
                    {exceeded ? (
                      <>
                        Passou{' '}
                        <span className="money">
                          {formatCurrency(Math.abs(budget.valorRestante))}
                        </span>{' '}
                        do limite
                      </>
                    ) : (
                      <>
                        {formatPercent(budget.progresso)} usado, restam{' '}
                        <span className="money">{formatCurrency(budget.valorRestante)}</span>
                      </>
                    )}
                  </p>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </DashboardPanel>
  )
}
