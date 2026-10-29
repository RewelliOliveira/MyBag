import { useState } from 'react'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useDeleteTransaction } from '@/features/transactions/hooks/use-transactions'
import type { RecurringDeleteScope } from '@/features/transactions/services/transactions-service'
import type { Transaction } from '@/types/models'

const scopeOptions: { value: RecurringDeleteScope; label: string }[] = [
  { value: 'single', label: 'Somente esta ocorrência' },
  { value: 'upcoming', label: 'Esta e as próximas' },
  { value: 'all', label: 'Todas as ocorrências' },
]

interface DeleteTransactionDialogProps {
  transaction: Transaction | undefined
  onClose: () => void
}

export function DeleteTransactionDialog({ transaction, onClose }: DeleteTransactionDialogProps) {
  const [scope, setScope] = useState<RecurringDeleteScope>('single')
  const deleteTransaction = useDeleteTransaction()

  const handleOpenChange = (open: boolean) => {
    if (open) return
    setScope('single')
    onClose()
  }

  const confirm = () => {
    if (!transaction) return
    deleteTransaction.mutate({ transaction, scope }, { onSuccess: () => handleOpenChange(false) })
  }

  return (
    <ConfirmDialog
      open={!!transaction}
      onOpenChange={handleOpenChange}
      title="Excluir transação recorrente?"
      description={
        <>
          <strong>{transaction?.descricao}</strong> se repete. Escolha o que excluir.
        </>
      }
      confirmLabel="Excluir"
      onConfirm={confirm}
      isPending={deleteTransaction.isPending}
    >
      <RadioGroup
        value={scope}
        onValueChange={(value) => setScope(value as RecurringDeleteScope)}
        className="gap-3"
      >
        {scopeOptions.map((option) => (
          <Label
            key={option.value}
            htmlFor={`scope-${option.value}`}
            className="flex cursor-pointer items-center gap-3 rounded-lg border p-3 font-normal has-data-[state=checked]:border-primary has-data-[state=checked]:bg-accent"
          >
            <RadioGroupItem id={`scope-${option.value}`} value={option.value} />
            {option.label}
          </Label>
        ))}
      </RadioGroup>
    </ConfirmDialog>
  )
}
