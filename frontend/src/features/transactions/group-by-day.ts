import type { Transaction } from '@/types/models'

export interface TransactionDayGroup {
  date: string
  transactions: Transaction[]
  net: number
}

export function groupTransactionsByDay(transactions: Transaction[]): TransactionDayGroup[] {
  const groups = new Map<string, Transaction[]>()

  for (const transaction of transactions) {
    const day = groups.get(transaction.data_transacao) ?? []
    day.push(transaction)
    groups.set(transaction.data_transacao, day)
  }

  return [...groups.entries()]
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([date, items]) => ({
      date,
      transactions: items,
      net: items.reduce(
        (sum, item) => sum + (item.tipo === 'RECEITA' ? item.valor : -item.valor),
        0,
      ),
    }))
}
