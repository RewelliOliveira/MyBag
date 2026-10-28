import { Skeleton } from '@/components/ui/skeleton'
import { DashboardPanel } from '@/features/dashboard/components/DashboardPanel'
import { TransactionRow } from '@/features/transactions/components/TransactionRow'
import { useTransactions } from '@/features/transactions/hooks/use-transactions'
import type { Period } from '@/types/models'

const RECENT_LIMIT = 6

interface RecentTransactionsPanelProps {
  period: Period
  className?: string
}

export function RecentTransactionsPanel({ period, className }: RecentTransactionsPanelProps) {
  const { data: transactions = [], isPending } = useTransactions(period)
  const recent = [...transactions]
    .sort((a, b) => b.data_transacao.localeCompare(a.data_transacao) || b.id - a.id)
    .slice(0, RECENT_LIMIT)

  return (
    <DashboardPanel
      title="Últimas transações"
      linkTo="/transacoes"
      linkLabel="Ver todas"
      className={className}
    >
      {isPending ? (
        <div className="space-y-3 p-5">
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton key={index} className="h-10" />
          ))}
        </div>
      ) : recent.length === 0 ? (
        <p className="p-5 text-sm text-muted-foreground">Nenhuma transação registrada neste mês.</p>
      ) : (
        <div className="divide-y">
          {recent.map((transaction) => (
            <TransactionRow key={transaction.id} transaction={transaction} />
          ))}
        </div>
      )}
    </DashboardPanel>
  )
}
