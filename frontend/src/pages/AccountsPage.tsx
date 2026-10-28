import { useState } from 'react'
import { Landmark, Plus } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import { PageHeader } from '@/components/layout/PageHeader'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { EmptyState } from '@/components/shared/EmptyState'
import { ErrorState } from '@/components/shared/ErrorState'
import { MonthPicker } from '@/components/shared/MonthPicker'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { AccountCard } from '@/features/accounts/components/AccountCard'
import { AccountFormDialog } from '@/features/accounts/components/AccountFormDialog'
import { ArchivedAccounts } from '@/features/accounts/components/ArchivedAccounts'
import { useAccounts, useArchiveAccount } from '@/features/accounts/hooks/use-accounts'
import { usePeriod } from '@/hooks/use-period'
import { formatCurrency } from '@/lib/format'
import type { Account } from '@/types/models'

export function AccountsPage() {
  const [period] = usePeriod()
  const { data: accounts = [], isPending, isError, refetch } = useAccounts(period)
  const archiveAccount = useArchiveAccount()
  const reduceMotion = useReducedMotion()

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Account>()
  const [archiving, setArchiving] = useState<Account>()

  const total = accounts.reduce((sum, account) => sum + account.saldo, 0)

  const openCreate = () => {
    setEditing(undefined)
    setFormOpen(true)
  }

  const openEdit = (account: Account) => {
    setEditing(account)
    setFormOpen(true)
  }

  const confirmArchive = () => {
    if (!archiving) return
    archiveAccount.mutate(archiving.id, { onSuccess: () => setArchiving(undefined) })
  }

  return (
    <>
      <PageHeader
        title="Contas"
        description={
          accounts.length > 0 ? (
            <>
              <span className="money">{formatCurrency(total)}</span> somando {accounts.length}{' '}
              {accounts.length === 1 ? 'conta' : 'contas'}
            </>
          ) : (
            'Onde seu dinheiro está guardado.'
          )
        }
        actions={
          <>
            <MonthPicker />
            <Button size="lg" onClick={openCreate}>
              <Plus />
              Nova conta
            </Button>
          </>
        }
      />

      {isPending ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }, (_, index) => (
            <Skeleton key={index} className="h-40 rounded-2xl" />
          ))}
        </div>
      ) : isError ? (
        <ErrorState onRetry={refetch} />
      ) : accounts.length === 0 ? (
        <EmptyState
          icon={Landmark}
          title="Nenhuma conta cadastrada"
          description="Cadastre sua primeira conta para começar a registrar transações."
          action={
            <Button onClick={openCreate}>
              <Plus />
              Nova conta
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {accounts.map((account, index) => (
            <motion.div
              key={account.id}
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3, ease: 'easeOut' }}
            >
              <AccountCard account={account} onEdit={openEdit} onArchive={setArchiving} />
            </motion.div>
          ))}
        </div>
      )}

      <AccountFormDialog open={formOpen} onOpenChange={setFormOpen} account={editing} />

      <ArchivedAccounts />

      <ConfirmDialog
        open={!!archiving}
        onOpenChange={(open) => !open && setArchiving(undefined)}
        title="Arquivar conta?"
        description={
          <>
            <strong>{archiving?.descricao}</strong> sai da lista e do saldo total, mas as transações
            continuam nos relatórios. Lançamentos fixos ligados a ela são encerrados. Você pode
            reativá-la quando quiser.
          </>
        }
        confirmLabel="Arquivar conta"
        confirmVariant="default"
        onConfirm={confirmArchive}
        isPending={archiveAccount.isPending}
      />
    </>
  )
}
