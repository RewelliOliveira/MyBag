import { useEffect } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AnimatePresence, motion } from 'motion/react'
import { Loader2 } from 'lucide-react'
import { CurrencyInput } from '@/components/shared/CurrencyInput'
import { DatePicker } from '@/components/shared/DatePicker'
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
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { useAccounts } from '@/features/accounts/hooks/use-accounts'
import { CategoryPicker } from '@/features/categories/components/CategoryPicker'
import { BudgetImpactHint } from '@/features/transactions/components/BudgetImpactHint'
import { useCategories } from '@/features/categories/hooks/use-categories'
import {
  useCreateTransaction,
  useUpdateTransaction,
} from '@/features/transactions/hooks/use-transactions'
import { getLastAccountId, saveLastAccountId } from '@/features/transactions/last-account'
import { periodicityLabels, recurrenceOptions } from '@/features/transactions/recurrence'
import { transactionSchema, type TransactionFormValues } from '@/features/transactions/schemas'
import type { Recurrence } from '@/features/transactions/services/transactions-service'
import { usePeriod } from '@/hooks/use-period'
import { formatCurrency, parseApiDate } from '@/lib/format'
import { transactionTypeLabels } from '@/lib/transaction-types'
import type { Periodicity, Transaction, TransactionType } from '@/types/models'

interface TransactionFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  transaction?: Transaction
  defaultType?: TransactionType
}

function toFormValues(
  transaction?: Transaction,
  defaultType: TransactionType = 'DESPESA',
): Partial<TransactionFormValues> {
  return {
    tipo: transaction?.tipo ?? defaultType,
    valor: transaction?.valor ?? 0,
    descricao: transaction?.descricao ?? '',
    categoriaId: transaction?.categoria.id,
    contaId: transaction?.conta.id,
    data: transaction ? parseApiDate(transaction.data_transacao) : new Date(),
    comentario: transaction?.comentario ?? '',
    recorrencia: 'NORMAL',
    periodicidade: 'MENSAL',
    qtdParcelas: 2,
  }
}

export function TransactionFormDialog({
  open,
  onOpenChange,
  transaction,
  defaultType,
}: TransactionFormDialogProps) {
  const isEditing = !!transaction
  const [period] = usePeriod()
  const createTransaction = useCreateTransaction()
  const updateTransaction = useUpdateTransaction()
  const isPending = createTransaction.isPending || updateTransaction.isPending

  const {
    control,
    register,
    handleSubmit,
    reset,
    getValues,
    resetField,
    setValue,
    formState: { errors },
  } = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: toFormValues(transaction, defaultType),
  })

  const [tipo, recorrencia, valor, qtdParcelas, categoriaId, data] = useWatch({
    control,
    name: ['tipo', 'recorrencia', 'valor', 'qtdParcelas', 'categoriaId', 'data'],
  })

  const { data: categories = [] } = useCategories(tipo)
  const { data: accounts = [] } = useAccounts(period)

  useEffect(() => {
    if (open) reset(toFormValues(transaction, defaultType))
  }, [open, transaction, defaultType, reset])

  useEffect(() => {
    if (!open || transaction || accounts.length === 0) return
    const isValid = (id?: number) => accounts.some((account) => account.id === id)
    if (isValid(getValues('contaId'))) return

    const lastAccountId = getLastAccountId()
    if (isValid(lastAccountId)) setValue('contaId', lastAccountId!)
    else if (accounts.length === 1) setValue('contaId', accounts[0].id)
  }, [open, transaction, accounts, getValues, setValue])

  const changeType = (next: TransactionType) => {
    setValue('tipo', next)
    resetField('categoriaId')
  }

  const onSubmit = ({
    recorrencia,
    periodicidade,
    qtdParcelas,
    ...values
  }: TransactionFormValues) => {
    const options = { onSuccess: () => onOpenChange(false) }
    if (transaction) {
      updateTransaction.mutate({ id: transaction.id, ...values }, options)
    } else {
      saveLastAccountId(values.contaId)
      createTransaction.mutate({ ...values, recorrencia, periodicidade, qtdParcelas }, options)
    }
  }

  const installmentValue = qtdParcelas && qtdParcelas >= 2 ? (valor ?? 0) / qtdParcelas : 0
  const monthlyImpact = recorrencia === 'PARCELADA' ? installmentValue : (valor ?? 0)
  const typeLabel = transactionTypeLabels[tipo ?? 'DESPESA'].toLowerCase()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-svh overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar transação' : 'Nova transação'}</DialogTitle>
          <DialogDescription>
            {isEditing && transaction.origem !== 'NORMAL'
              ? 'As alterações valem só para esta ocorrência.'
              : `Registre uma ${typeLabel} em uma das suas contas.`}
          </DialogDescription>
        </DialogHeader>

        <form id="transaction-form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <FieldGroup>
            <TransactionTypeToggle value={tipo} onChange={changeType} disabled={isEditing} />

            <Field data-invalid={!!errors.valor}>
              <FieldLabel htmlFor="valor">
                {recorrencia === 'PARCELADA' ? 'Valor total' : 'Valor'}
              </FieldLabel>
              <Controller
                control={control}
                name="valor"
                render={({ field }) => (
                  <CurrencyInput
                    id="valor"
                    value={field.value}
                    onChange={field.onChange}
                    aria-invalid={!!errors.valor}
                    className="h-12 text-2xl md:text-2xl"
                  />
                )}
              />
              <FieldError errors={[errors.valor]} />
            </Field>

            <Field data-invalid={!!errors.descricao}>
              <FieldLabel htmlFor="descricao">Descrição</FieldLabel>
              <Input
                id="descricao"
                placeholder={tipo === 'RECEITA' ? 'Ex.: Salário' : 'Ex.: Mercado'}
                aria-invalid={!!errors.descricao}
                {...register('descricao')}
              />
              <FieldError errors={[errors.descricao]} />
            </Field>

            <Field data-invalid={!!errors.categoriaId}>
              <FieldLabel htmlFor="categoriaId">Categoria</FieldLabel>
              <Controller
                control={control}
                name="categoriaId"
                render={({ field }) => (
                  <CategoryPicker
                    id="categoriaId"
                    categories={categories}
                    value={field.value}
                    onChange={field.onChange}
                    invalid={!!errors.categoriaId}
                  />
                )}
              />
              <FieldError errors={[errors.categoriaId]} />
              {tipo === 'DESPESA' && (
                <BudgetImpactHint
                  categoryId={categoriaId}
                  date={data}
                  amount={monthlyImpact}
                  editing={transaction}
                />
              )}
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field data-invalid={!!errors.contaId}>
                <FieldLabel htmlFor="contaId">Conta</FieldLabel>
                <Controller
                  control={control}
                  name="contaId"
                  render={({ field }) => (
                    <Select
                      value={field.value?.toString() ?? ''}
                      onValueChange={(value) => field.onChange(Number(value))}
                    >
                      <SelectTrigger
                        id="contaId"
                        className="w-full"
                        aria-invalid={!!errors.contaId}
                      >
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        {accounts.map((account) => (
                          <SelectItem key={account.id} value={account.id.toString()}>
                            {account.descricao}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                <FieldError errors={[errors.contaId]} />
              </Field>
              <Field data-invalid={!!errors.data}>
                <FieldLabel htmlFor="data">
                  {recorrencia === 'NORMAL' ? 'Data' : 'Primeira ocorrência'}
                </FieldLabel>
                <Controller
                  control={control}
                  name="data"
                  render={({ field }) => (
                    <DatePicker
                      id="data"
                      value={field.value}
                      onChange={(date) => date && field.onChange(date)}
                      invalid={!!errors.data}
                    />
                  )}
                />
                <FieldError errors={[errors.data]} />
              </Field>
            </div>

            {!isEditing && (
              <Field>
                <FieldLabel>Repetição</FieldLabel>
                <Controller
                  control={control}
                  name="recorrencia"
                  render={({ field }) => (
                    <ToggleGroup
                      type="single"
                      variant="outline"
                      value={field.value}
                      onValueChange={(value) => value && field.onChange(value as Recurrence)}
                      className="w-full"
                    >
                      {recurrenceOptions.map((option) => (
                        <ToggleGroupItem
                          key={option.value}
                          value={option.value}
                          className="flex-1 data-[state=on]:border-primary data-[state=on]:bg-accent data-[state=on]:text-accent-foreground"
                        >
                          {option.label}
                        </ToggleGroupItem>
                      ))}
                    </ToggleGroup>
                  )}
                />
                <FieldDescription>
                  {recurrenceOptions.find((option) => option.value === recorrencia)?.description}
                </FieldDescription>
              </Field>
            )}

            <AnimatePresence initial={false}>
              {!isEditing && recorrencia !== 'NORMAL' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                  className="overflow-hidden"
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field>
                      <FieldLabel htmlFor="periodicidade">Frequência</FieldLabel>
                      <Controller
                        control={control}
                        name="periodicidade"
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onValueChange={(value) => field.onChange(value as Periodicity)}
                          >
                            <SelectTrigger id="periodicidade" className="w-full">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.entries(periodicityLabels).map(([value, label]) => (
                                <SelectItem key={value} value={value}>
                                  {label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </Field>

                    {recorrencia === 'PARCELADA' && (
                      <Field data-invalid={!!errors.qtdParcelas}>
                        <FieldLabel htmlFor="qtdParcelas">Parcelas</FieldLabel>
                        <Input
                          id="qtdParcelas"
                          type="number"
                          min={2}
                          aria-invalid={!!errors.qtdParcelas}
                          {...register('qtdParcelas', { valueAsNumber: true })}
                        />
                        {errors.qtdParcelas ? (
                          <FieldError errors={[errors.qtdParcelas]} />
                        ) : (
                          installmentValue > 0 && (
                            <FieldDescription>
                              {qtdParcelas}× de {formatCurrency(installmentValue)}
                            </FieldDescription>
                          )
                        )}
                      </Field>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <Field>
              <FieldLabel htmlFor="comentario">
                Observação <span className="font-normal text-muted-foreground">(opcional)</span>
              </FieldLabel>
              <Textarea id="comentario" rows={2} {...register('comentario')} />
            </Field>
          </FieldGroup>
        </form>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
            Cancelar
          </Button>
          <Button type="submit" form="transaction-form" disabled={isPending}>
            {isPending && <Loader2 className="animate-spin" />}
            {isEditing ? 'Salvar alterações' : `Registrar ${typeLabel}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
