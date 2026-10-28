import { useState } from 'react'
import { AccountsPanel } from '@/features/dashboard/components/AccountsPanel'
import { BalanceHero } from '@/features/dashboard/components/BalanceHero'
import { BudgetAlertsPanel } from '@/features/dashboard/components/BudgetAlertsPanel'
import { RecentTransactionsPanel } from '@/features/dashboard/components/RecentTransactionsPanel'
import { IncomeExpenseChart } from '@/features/reports/components/IncomeExpenseChart'
import { TransactionFormDialog } from '@/features/transactions/components/TransactionFormDialog'
import { usePeriod } from '@/hooks/use-period'
import type { TransactionType } from '@/types/models'

export function DashboardPage() {
  const [period] = usePeriod()
  const [formOpen, setFormOpen] = useState(false)
  const [formType, setFormType] = useState<TransactionType>('DESPESA')

  const openCreate = (type: TransactionType) => {
    setFormType(type)
    setFormOpen(true)
  }

  return (
    <div className="space-y-10">
      <BalanceHero period={period} onCreate={openCreate} />

      <div className="grid gap-4 lg:grid-cols-3">
        <RecentTransactionsPanel period={period} className="lg:col-span-2" />
        <div className="grid min-w-0 content-start gap-4">
          <AccountsPanel period={period} />
          <BudgetAlertsPanel period={period} />
        </div>
        <IncomeExpenseChart period={period} defaultRange={3} className="lg:col-span-3" />
      </div>

      <TransactionFormDialog open={formOpen} onOpenChange={setFormOpen} defaultType={formType} />
    </div>
  )
}
