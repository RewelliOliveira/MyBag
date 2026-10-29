import { motion, useReducedMotion } from 'motion/react'
import { TransactionRow } from '@/features/transactions/components/TransactionRow'
import { groupTransactionsByDay } from '@/features/transactions/group-by-day'
import { capitalize, formatCurrency, formatDate } from '@/lib/format'
import type { Transaction } from '@/types/models'

interface TransactionListProps {
  transactions: Transaction[]
  onEdit: (transaction: Transaction) => void
  onDelete: (transaction: Transaction) => void
}

export function TransactionList({ transactions, onEdit, onDelete }: TransactionListProps) {
  const reduceMotion = useReducedMotion()
  const groups = groupTransactionsByDay(transactions)

  return (
    <div className="space-y-6">
      {groups.map((group, index) => (
        <motion.section
          key={group.date}
          initial={reduceMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: Math.min(index, 8) * 0.04, duration: 0.25, ease: 'easeOut' }}
        >
          <header className="mb-2 flex items-baseline justify-between px-1 text-sm">
            <h3 className="font-sans font-medium">
              {capitalize(formatDate(group.date, "EEEE, d 'de' MMMM"))}
            </h3>
            <span className="money text-muted-foreground">
              {group.net >= 0 ? '+' : '−'} {formatCurrency(Math.abs(group.net))}
            </span>
          </header>
          <div className="divide-y rounded-2xl border bg-card">
            {group.transactions.map((transaction) => (
              <TransactionRow
                key={transaction.id}
                transaction={transaction}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        </motion.section>
      ))}
    </div>
  )
}
