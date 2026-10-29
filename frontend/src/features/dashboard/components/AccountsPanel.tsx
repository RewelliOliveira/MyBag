import { Skeleton } from '@/components/ui/skeleton'
import { BankAvatar } from '@/features/accounts/components/BankAvatar'
import { useAccounts } from '@/features/accounts/hooks/use-accounts'
import { DashboardPanel } from '@/features/dashboard/components/DashboardPanel'
import { formatCurrency } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { Period } from '@/types/models'

interface AccountsPanelProps {
  period: Period
  className?: string
}

export function AccountsPanel({ period, className }: AccountsPanelProps) {
  const { data: accounts = [], isPending } = useAccounts(period)
  const sorted = [...accounts].sort((a, b) => b.saldo - a.saldo)

  return (
    <DashboardPanel title="Contas" linkTo="/contas" linkLabel="Gerenciar" className={className}>
      {isPending ? (
        <div className="space-y-3 p-5">
          {Array.from({ length: 3 }, (_, index) => (
            <Skeleton key={index} className="h-10" />
          ))}
        </div>
      ) : sorted.length === 0 ? (
        <p className="p-5 text-sm text-muted-foreground">
          Cadastre uma conta para começar a registrar transações.
        </p>
      ) : (
        <ul className="divide-y">
          {sorted.map((account) => (
            <li key={account.id} className="flex items-center gap-3 px-5 py-3">
              <BankAvatar
                name={account.banco.nome}
                iconUrl={account.banco.iconeUrl}
                className="size-9"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{account.descricao}</p>
                <p className="truncate text-sm text-muted-foreground">{account.banco.nome}</p>
              </div>
              <p className={cn('money font-semibold', account.saldo < 0 && 'text-expense')}>
                {formatCurrency(account.saldo)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </DashboardPanel>
  )
}
