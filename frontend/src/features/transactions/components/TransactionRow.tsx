import { EllipsisVertical, Pencil, Repeat, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { CategoryIcon } from '@/features/categories/components/CategoryIcon'
import { originLabels } from '@/features/transactions/recurrence'
import { formatCurrency } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { Transaction } from '@/types/models'

interface TransactionRowProps {
  transaction: Transaction
  onEdit?: (transaction: Transaction) => void
  onDelete?: (transaction: Transaction) => void
}

export function TransactionRow({ transaction, onEdit, onDelete }: TransactionRowProps) {
  const isIncome = transaction.tipo === 'RECEITA'
  const hasActions = onEdit || onDelete

  return (
    <div className="flex items-center gap-3 px-4 py-3 md:px-5">
      <CategoryIcon category={transaction.categoria} />
      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-2 truncate font-medium">
          <span className="truncate">{transaction.descricao}</span>
          {transaction.origem !== 'NORMAL' && (
            <Badge
              variant="outline"
              className="shrink-0 gap-1 font-normal"
              aria-label={originLabels[transaction.origem]}
            >
              <Repeat />
              <span className="hidden sm:inline">{originLabels[transaction.origem]}</span>
            </Badge>
          )}
        </p>
        <p className="truncate text-sm text-muted-foreground">
          {transaction.categoria.nome}
          <span className="px-1.5" aria-hidden="true">
            /
          </span>
          {transaction.conta.descricao}
        </p>
      </div>
      <p
        className={cn(
          'shrink-0 text-right money font-semibold',
          isIncome ? 'text-income' : 'text-foreground',
        )}
      >
        {isIncome ? '+' : '−'} {formatCurrency(transaction.valor)}
      </p>
      {hasActions && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={`Ações da transação ${transaction.descricao}`}
            >
              <EllipsisVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {onEdit && (
              <DropdownMenuItem onSelect={() => onEdit(transaction)}>
                <Pencil />
                Editar
              </DropdownMenuItem>
            )}
            {onDelete && (
              <DropdownMenuItem variant="destructive" onSelect={() => onDelete(transaction)}>
                <Trash2 />
                Excluir
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  )
}
