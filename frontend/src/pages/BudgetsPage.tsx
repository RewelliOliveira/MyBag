import { useState } from 'react'
import { Plus, Target } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import { PageHeader } from '@/components/layout/PageHeader'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { EmptyState } from '@/components/shared/EmptyState'
import { ErrorState } from '@/components/shared/ErrorState'
import { MonthPicker } from '@/components/shared/MonthPicker'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { BudgetCard } from '@/features/budgets/components/BudgetCard'
import { BudgetFormDialog } from '@/features/budgets/components/BudgetFormDialog'
import { useBudgets, useDeleteBudget } from '@/features/budgets/hooks/use-budgets'
import { usePeriod } from '@/hooks/use-period'
import { formatCurrency } from '@/lib/format'
import type { Budget } from '@/types/models'

export function BudgetsPage() {
  const [period] = usePeriod()
  const { data: budgets = [], isPending, isError, refetch } = useBudgets(period)
  const deleteBudget = useDeleteBudget()
  const reduceMotion = useReducedMotion()

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Budget>()
  const [deleting, setDeleting] = useState<Budget>()

  const planned = budgets.reduce((sum, budget) => sum + budget.valorEstimado, 0)
  const spent = budgets.reduce((sum, budget) => sum + budget.valorGasto, 0)

  const openCreate = () => {
    setEditing(undefined)
    setFormOpen(true)
  }

  const openEdit = (budget: Budget) => {
    setEditing(budget)
    setFormOpen(true)
  }

  const confirmDelete = () => {
    if (!deleting) return
    deleteBudget.mutate(deleting.id, { onSuccess: () => setDeleting(undefined) })
  }

  return (
    <>
      <PageHeader
        title="Orçamentos"
        description={
          budgets.length > 0
            ? `${formatCurrency(spent)} gastos de ${formatCurrency(planned)} planejados`
            : 'Defina limites de gastos por categoria.'
        }
        actions={
          <>
            <MonthPicker />
            <Button size="lg" onClick={openCreate}>
              <Plus />
              Novo orçamento
            </Button>
          </>
        }
      />

      {isPending ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }, (_, index) => (
            <Skeleton key={index} className="h-44 rounded-2xl" />
          ))}
        </div>
      ) : isError ? (
        <ErrorState onRetry={refetch} />
      ) : budgets.length === 0 ? (
        <EmptyState
          icon={Target}
          title="Nenhum orçamento neste mês"
          description="Escolha uma categoria de despesa e defina quanto quer gastar com ela."
          action={
            <Button onClick={openCreate}>
              <Plus />
              Novo orçamento
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {budgets.map((budget, index) => (
            <motion.div
              key={budget.id}
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3, ease: 'easeOut' }}
            >
              <BudgetCard budget={budget} onEdit={openEdit} onDelete={setDeleting} />
            </motion.div>
          ))}
        </div>
      )}

      <BudgetFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        period={period}
        budget={editing}
        usedCategoryIds={budgets.map((budget) => budget.categoriaDTO.id)}
      />

      <ConfirmDialog
        open={!!deleting}
        onOpenChange={(open) => !open && setDeleting(undefined)}
        title="Excluir orçamento?"
        description={
          <>
            O limite de <strong>{deleting?.categoriaDTO.nome}</strong> para este mês será removido.
            As transações não são afetadas.
          </>
        }
        confirmLabel="Excluir orçamento"
        onConfirm={confirmDelete}
        isPending={deleteBudget.isPending}
      />
    </>
  )
}
