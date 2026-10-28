import { FieldDescription } from '@/components/ui/field'
import { useBudgets } from '@/features/budgets/hooks/use-budgets'
import { formatCurrency, parseApiDate } from '@/lib/format'
import type { Transaction } from '@/types/models'

interface BudgetImpactHintProps {
  categoryId: number | undefined
  date: Date | undefined
  amount: number
  editing?: Transaction
}

export function BudgetImpactHint({ categoryId, date, amount, editing }: BudgetImpactHintProps) {
  const day = date ?? new Date()
  const period = { month: day.getMonth() + 1, year: day.getFullYear() }
  const { data: budgets = [] } = useBudgets(period)
  const budget = budgets.find((item) => item.categoriaDTO.id === categoryId)

  if (!budget || amount <= 0) return null

  const editingDate = editing && parseApiDate(editing.data_transacao)
  const alreadyCounted =
    editing &&
    editingDate &&
    editing.categoria.id === categoryId &&
    editingDate.getMonth() + 1 === period.month &&
    editingDate.getFullYear() === period.year
      ? editing.valor
      : 0
  const remaining = budget.valorRestante + alreadyCounted - amount

  if (remaining < 0) {
    return (
      <FieldDescription className="text-expense">
        Passa <span className="money">{formatCurrency(-remaining)}</span> do orçamento de{' '}
        {budget.categoriaDTO.nome}.
      </FieldDescription>
    )
  }

  return (
    <FieldDescription>
      Depois desta despesa, restam <span className="money">{formatCurrency(remaining)}</span> no
      orçamento de {budget.categoriaDTO.nome}.
    </FieldDescription>
  )
}
