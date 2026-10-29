import { ArrowDownLeft, ArrowUpRight } from 'lucide-react'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { transactionTypeLabels } from '@/lib/transaction-types'
import type { TransactionType } from '@/types/models'

interface TransactionTypeToggleProps {
  value: TransactionType | undefined
  onChange: (value: TransactionType) => void
  disabled?: boolean
}

export function TransactionTypeToggle({ value, onChange, disabled }: TransactionTypeToggleProps) {
  return (
    <ToggleGroup
      type="single"
      variant="outline"
      value={value}
      disabled={disabled}
      onValueChange={(next) => next && onChange(next as TransactionType)}
      className="w-full"
    >
      <ToggleGroupItem
        value="DESPESA"
        className="flex-1 data-[state=on]:border-expense data-[state=on]:bg-expense-soft data-[state=on]:text-expense"
      >
        <ArrowUpRight />
        {transactionTypeLabels.DESPESA}
      </ToggleGroupItem>
      <ToggleGroupItem
        value="RECEITA"
        className="flex-1 data-[state=on]:border-income data-[state=on]:bg-income-soft data-[state=on]:text-income"
      >
        <ArrowDownLeft />
        {transactionTypeLabels.RECEITA}
      </ToggleGroupItem>
    </ToggleGroup>
  )
}
