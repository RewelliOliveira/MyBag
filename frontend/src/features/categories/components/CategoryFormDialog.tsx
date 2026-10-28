import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { ColorPicker } from '@/components/shared/ColorPicker'
import { TransactionTypeToggle } from '@/components/shared/TransactionTypeToggle'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { useCreateCategory, useUpdateCategory } from '@/features/categories/hooks/use-categories'
import { categorySchema, type CategoryFormValues } from '@/features/categories/schemas'
import { categoryColors } from '@/lib/category-colors'
import { normalizeHexColor } from '@/lib/format'
import type { Category, TransactionType } from '@/types/models'

interface CategoryFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  category?: Category
  defaultType?: TransactionType
}

function toFormValues(category?: Category, defaultType?: TransactionType): CategoryFormValues {
  return {
    nome: category?.nome ?? '',
    tipo: category?.tipo ?? defaultType ?? 'DESPESA',
    cor: category ? normalizeHexColor(category.cor) : categoryColors[0].value,
  }
}

export function CategoryFormDialog({
  open,
  onOpenChange,
  category,
  defaultType,
}: CategoryFormDialogProps) {
  const isEditing = !!category
  const createCategory = useCreateCategory()
  const updateCategory = useUpdateCategory()
  const isPending = createCategory.isPending || updateCategory.isPending

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: toFormValues(category, defaultType),
  })

  useEffect(() => {
    if (open) reset(toFormValues(category, defaultType))
  }, [open, category, defaultType, reset])

  const onSubmit = (values: CategoryFormValues) => {
    const options = { onSuccess: () => onOpenChange(false) }
    if (category) updateCategory.mutate({ id: category.id, ...values }, options)
    else createCategory.mutate(values, options)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar categoria' : 'Nova categoria'}</DialogTitle>
          <DialogDescription>
            Categorias agrupam suas transações nos relatórios e orçamentos.
          </DialogDescription>
        </DialogHeader>

        <form id="category-form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <FieldGroup>
            <Field>
              <FieldLabel>Tipo</FieldLabel>
              <Controller
                control={control}
                name="tipo"
                render={({ field }) => (
                  <TransactionTypeToggle value={field.value} onChange={field.onChange} />
                )}
              />
            </Field>

            <Field data-invalid={!!errors.nome}>
              <FieldLabel htmlFor="nome">Nome</FieldLabel>
              <Input
                id="nome"
                placeholder="Ex.: Mercado"
                aria-invalid={!!errors.nome}
                {...register('nome')}
              />
              <FieldError errors={[errors.nome]} />
            </Field>

            <Field data-invalid={!!errors.cor}>
              <FieldLabel>Cor</FieldLabel>
              <Controller
                control={control}
                name="cor"
                render={({ field }) => (
                  <ColorPicker value={field.value} onChange={field.onChange} />
                )}
              />
              <FieldError errors={[errors.cor]} />
            </Field>
          </FieldGroup>
        </form>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
            Cancelar
          </Button>
          <Button type="submit" form="category-form" disabled={isPending}>
            {isPending && <Loader2 className="animate-spin" />}
            {isEditing ? 'Salvar alterações' : 'Criar categoria'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
