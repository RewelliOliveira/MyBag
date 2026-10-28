import { Archive, EllipsisVertical, Pencil } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { accountTypeLabels } from '@/features/accounts/account-types'
import { BankAvatar } from '@/features/accounts/components/BankAvatar'
import { formatCurrency } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { Account } from '@/types/models'

interface AccountCardProps {
  account: Account
  onEdit: (account: Account) => void
  onArchive: (account: Account) => void
}

export function AccountCard({ account, onEdit, onArchive }: AccountCardProps) {
  return (
    <article className="flex flex-col gap-6 rounded-2xl border bg-card p-5 transition-shadow hover:shadow-md">
      <div className="flex items-start gap-3">
        <BankAvatar name={account.banco.nome} iconUrl={account.banco.iconeUrl} />
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-sans text-base font-semibold">{account.descricao}</h3>
          <p className="truncate text-sm text-muted-foreground">{account.banco.nome}</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={`Ações da conta ${account.descricao}`}
            >
              <EllipsisVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={() => onEdit(account)}>
              <Pencil />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => onArchive(account)}>
              <Archive />
              Arquivar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-end justify-between gap-2">
        <p className={cn('money text-2xl font-semibold', account.saldo < 0 && 'text-expense')}>
          {formatCurrency(account.saldo)}
        </p>
        <Badge variant="secondary">{accountTypeLabels[account.tipo_conta.tipoConta]}</Badge>
      </div>
    </article>
  )
}
