import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { CurrencyInput } from '@/components/shared/CurrencyInput'
import { FormSheet } from '@/components/shared/FormSheet'
import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { useCreateBudget, useUpdateBudget } from '@/features/budgets/hooks/use-budgets'
import { budgetSchema, type BudgetFormValues } from '@/features/budgets/schemas'
import { CategoryPicker } from '@/features/categories/components/CategoryPicker'
import { useCategories } from '@/features/categories/hooks/use-categories'
import { formatMonthYear } from '@/lib/format'
import type { Budget, Period } from '@/types/models'

interface BudgetFormSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  period: Period
  budget?: Budget
  usedCategoryIds: number[]
}

function toFormValues(budget?: Budget): Partial<BudgetFormValues> {
  return {
    categoriaId: budget?.categoriaDTO.id,
    valorEstimado: budget?.valorEstimado ?? 0,
  }
}

export function BudgetFormSheet({
  open,
  onOpenChange,
  period,
  budget,
  usedCategoryIds,
}: BudgetFormSheetProps) {
  const isEditing = !!budget
  const budgetPeriod = budget ? { month: budget.mes, year: budget.ano } : period
  const { data: categories = [] } = useCategories('DESPESA')
  const createBudget = useCreateBudget()
  const updateBudget = useUpdateBudget()
  const isPending = createBudget.isPending || updateBudget.isPending

  const availableCategories = categories.filter((category) =>
    budget ? category.id === budget.categoriaDTO.id : !usedCategoryIds.includes(category.id),
  )

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BudgetFormValues>({
    resolver: zodResolver(budgetSchema),
    defaultValues: toFormValues(budget),
  })

  useEffect(() => {
    if (open) reset(toFormValues(budget))
  }, [open, budget, reset])

  const onSubmit = (values: BudgetFormValues) => {
    const payload = { ...values, period: budgetPeriod }
    const options = { onSuccess: () => onOpenChange(false) }
    if (budget) updateBudget.mutate({ id: budget.id, ...payload }, options)
    else createBudget.mutate(payload, options)
  }

  return (
    <FormSheet
      open={open}
      onOpenChange={onOpenChange}
      title={isEditing ? 'Editar orçamento' : 'Novo orçamento'}
      description={`Limite de gastos para ${formatMonthYear(budgetPeriod.month, budgetPeriod.year)}.`}
      footer={
        <>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
            Cancelar
          </Button>
          <Button type="submit" form="budget-form" disabled={isPending}>
            {isPending && <Loader2 className="animate-spin" />}
            {isEditing ? 'Salvar alterações' : 'Criar orçamento'}
          </Button>
        </>
      }
    >
      <form id="budget-form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <FieldGroup>
          <Field data-invalid={!!errors.categoriaId}>
            <FieldLabel htmlFor="categoriaId">Categoria de despesa</FieldLabel>
            <Controller
              control={control}
              name="categoriaId"
              render={({ field }) => (
                <CategoryPicker
                  id="categoriaId"
                  categories={availableCategories}
                  value={field.value}
                  onChange={field.onChange}
                  invalid={!!errors.categoriaId}
                />
              )}
            />
            <FieldError errors={[errors.categoriaId]} />
          </Field>

          <Field data-invalid={!!errors.valorEstimado}>
            <FieldLabel htmlFor="valorEstimado">Limite do mês</FieldLabel>
            <Controller
              control={control}
              name="valorEstimado"
              render={({ field }) => (
                <CurrencyInput
                  id="valorEstimado"
                  value={field.value}
                  onChange={field.onChange}
                  aria-invalid={!!errors.valorEstimado}
                />
              )}
            />
            <FieldError errors={[errors.valorEstimado]} />
          </Field>
        </FieldGroup>
      </form>
    </FormSheet>
  )
}
