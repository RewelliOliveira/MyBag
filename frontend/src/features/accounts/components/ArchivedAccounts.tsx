import { useState } from 'react'
import { ChevronDown, RotateCcw, Trash2 } from 'lucide-react'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { Button } from '@/components/ui/button'
import { BankAvatar } from '@/features/accounts/components/BankAvatar'
import {
  useArchivedAccounts,
  useDeleteAccount,
  useRestoreAccount,
} from '@/features/accounts/hooks/use-accounts'
import { formatCurrency } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { Account } from '@/types/models'

export function ArchivedAccounts() {
  const { data: accounts = [] } = useArchivedAccounts()
  const restoreAccount = useRestoreAccount()
  const deleteAccount = useDeleteAccount()
  const [expanded, setExpanded] = useState(false)
  const [deleting, setDeleting] = useState<Account>()

  if (accounts.length === 0) return null

  const confirmDelete = () => {
    if (!deleting) return
    deleteAccount.mutate(deleting.id, { onSettled: () => setDeleting(undefined) })
  }

  return (
    <section className="mt-10">
      <Button
        variant="ghost"
        className="-ml-3 text-muted-foreground"
        aria-expanded={expanded}
        onClick={() => setExpanded((value) => !value)}
      >
        Contas arquivadas ({accounts.length})
        <ChevronDown className={cn('transition-transform', expanded && 'rotate-180')} />
      </Button>

      {expanded && (
        <ul className="mt-2 divide-y rounded-2xl border bg-card">
          {accounts.map((account) => (
            <li key={account.id} className="flex items-center gap-3 px-4 py-3 md:px-5">
              <BankAvatar
                name={account.banco.nome}
                iconUrl={account.banco.iconeUrl}
                className="size-8 rounded-lg"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{account.descricao}</p>
                <p className="truncate money text-sm text-muted-foreground">
                  {formatCurrency(account.saldo)}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => restoreAccount.mutate(account.id)}
                disabled={restoreAccount.isPending}
              >
                <RotateCcw />
                Reativar
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label={`Excluir a conta ${account.descricao}`}
                onClick={() => setDeleting(account)}
              >
                <Trash2 />
              </Button>
            </li>
          ))}
        </ul>
      )}

      <ConfirmDialog
        open={!!deleting}
        onOpenChange={(open) => !open && setDeleting(undefined)}
        title="Excluir conta?"
        description={
          <>
            <strong>{deleting?.descricao}</strong> será excluída de vez. Só é possível excluir
            contas sem transações; as demais ficam arquivadas para preservar seu histórico.
          </>
        }
        confirmLabel="Excluir conta"
        onConfirm={confirmDelete}
        isPending={deleteAccount.isPending}
      />
    </section>
  )
}
