import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { CurrencyInput } from '@/components/shared/CurrencyInput'
import { DatePicker } from '@/components/shared/DatePicker'
import { FormSheet } from '@/components/shared/FormSheet'
import { Button } from '@/components/ui/button'
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { accountTypeLabels } from '@/features/accounts/account-types'
import { BankAvatar } from '@/features/accounts/components/BankAvatar'
import {
  useAccountTypes,
  useBanks,
  useCreateAccount,
  useUpdateAccount,
} from '@/features/accounts/hooks/use-accounts'
import { accountSchema, type AccountFormValues } from '@/features/accounts/schemas'
import type { Account } from '@/types/models'

interface AccountFormSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  account?: Account
}

function toFormValues(account?: Account): Partial<AccountFormValues> {
  return {
    descricao: account?.descricao ?? '',
    saldo: account?.saldo ?? 0,
    bancoId: account?.banco.id,
    tipoContaId: account?.tipo_conta.id,
    data: new Date(),
  }
}

export function AccountFormSheet({ open, onOpenChange, account }: AccountFormSheetProps) {
  const isEditing = !!account
  const { data: banks = [] } = useBanks()
  const { data: accountTypes = [] } = useAccountTypes()
  const createAccount = useCreateAccount()
  const updateAccount = useUpdateAccount()
  const isPending = createAccount.isPending || updateAccount.isPending

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AccountFormValues>({
    resolver: zodResolver(accountSchema),
    defaultValues: toFormValues(account),
  })

  useEffect(() => {
    if (open) reset(toFormValues(account))
  }, [open, account, reset])

  const onSubmit = (values: AccountFormValues) => {
    const options = { onSuccess: () => onOpenChange(false) }
    if (account) updateAccount.mutate({ id: account.id, ...values }, options)
    else createAccount.mutate(values, options)
  }

  return (
    <FormSheet
      open={open}
      onOpenChange={onOpenChange}
      title={isEditing ? 'Editar conta' : 'Nova conta'}
      description={
        isEditing
          ? 'Se o saldo não bater com o do banco, informe o valor correto e a data: a conta é ajustada.'
          : 'Cadastre uma conta bancária, carteira ou investimento.'
      }
      footer={
        <>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
            Cancelar
          </Button>
          <Button type="submit" form="account-form" disabled={isPending}>
            {isPending && <Loader2 className="animate-spin" />}
            {isEditing ? 'Salvar alterações' : 'Criar conta'}
          </Button>
        </>
      }
    >
      <form id="account-form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <FieldGroup>
          <Field data-invalid={!!errors.descricao}>
            <FieldLabel htmlFor="descricao">Nome da conta</FieldLabel>
            <Input
              id="descricao"
              placeholder="Ex.: Conta principal"
              aria-invalid={!!errors.descricao}
              {...register('descricao')}
            />
            <FieldError errors={[errors.descricao]} />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field data-invalid={!!errors.bancoId}>
              <FieldLabel htmlFor="bancoId">Banco</FieldLabel>
              <Controller
                control={control}
                name="bancoId"
                render={({ field }) => (
                  <Select
                    value={field.value?.toString()}
                    onValueChange={(value) => field.onChange(Number(value))}
                  >
                    <SelectTrigger id="bancoId" className="w-full" aria-invalid={!!errors.bancoId}>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {banks.map((bank) => (
                        <SelectItem key={bank.id} value={bank.id.toString()}>
                          <BankAvatar
                            name={bank.nome}
                            iconUrl={bank.iconeUrl}
                            className="size-5 rounded-md"
                          />
                          {bank.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <FieldError errors={[errors.bancoId]} />
            </Field>

            <Field data-invalid={!!errors.tipoContaId}>
              <FieldLabel htmlFor="tipoContaId">Tipo</FieldLabel>
              <Controller
                control={control}
                name="tipoContaId"
                render={({ field }) => (
                  <Select
                    value={field.value?.toString()}
                    onValueChange={(value) => field.onChange(Number(value))}
                  >
                    <SelectTrigger
                      id="tipoContaId"
                      className="w-full"
                      aria-invalid={!!errors.tipoContaId}
                    >
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {accountTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id.toString()}>
                          {accountTypeLabels[type.tipoConta]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <FieldError errors={[errors.tipoContaId]} />
            </Field>
          </div>

          <Field>
            <FieldLabel htmlFor="saldo">{isEditing ? 'Saldo' : 'Saldo inicial'}</FieldLabel>
            <Controller
              control={control}
              name="saldo"
              render={({ field }) => (
                <CurrencyInput
                  id="saldo"
                  allowNegative
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </Field>

          {isEditing && (
            <Field>
              <FieldLabel htmlFor="data">Saldo em</FieldLabel>
              <Controller
                control={control}
                name="data"
                render={({ field }) => (
                  <DatePicker
                    id="data"
                    value={field.value}
                    onChange={(date) => date && field.onChange(date)}
                  />
                )}
              />
              <FieldDescription>Data em que a conta tinha o saldo informado.</FieldDescription>
            </Field>
          )}
        </FieldGroup>
      </form>
    </FormSheet>
  )
}
