import { ArrowDownLeft, ArrowUpRight } from 'lucide-react'
import { AnimatedNumber } from '@/components/shared/AnimatedNumber'
import { MonthPicker } from '@/components/shared/MonthPicker'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useAccounts, useTotalBalance } from '@/features/accounts/hooks/use-accounts'
import { useCurrentUser } from '@/features/profile/hooks/use-profile'
import { useTransactionTotal } from '@/features/transactions/hooks/use-transactions'
import { formatCurrency, formatMonthName } from '@/lib/format'
import type { Period, TransactionType } from '@/types/models'

function greeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Bom dia'
  if (hour < 18) return 'Boa tarde'
  return 'Boa noite'
}

interface BalanceHeroProps {
  period: Period
  onCreate: (type: TransactionType) => void
}

export function BalanceHero({ period, onCreate }: BalanceHeroProps) {
  const { data: user } = useCurrentUser()
  const { data: balance } = useTotalBalance(period)
  const { data: accounts } = useAccounts(period)
  const { data: income } = useTransactionTotal('RECEITA', period)
  const { data: expenses } = useTransactionTotal('DESPESA', period)

  const firstName = user?.nome.split(' ')[0]
  const accountCount = accounts?.length ?? 0
  const monthName = formatMonthName(period.month, period.year)

  return (
    <section className="flex flex-col gap-6 sm:gap-8 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-3xl">
        <p className="text-muted-foreground">
          {greeting()}
          {firstName && `, ${firstName}`}.
        </p>
        <h1 className="mt-2 text-2xl leading-tight font-semibold sm:text-3xl md:text-5xl">
          Você tem{' '}
          {balance === undefined ? (
            <Skeleton className="inline-block h-8 w-48 align-middle sm:h-10 sm:w-64 md:h-12" />
          ) : (
            <AnimatedNumber
              value={balance}
              format={formatCurrency}
              className="money font-bold whitespace-nowrap text-primary"
            />
          )}{' '}
          em {accountCount} {accountCount === 1 ? 'conta' : 'contas'}.
        </h1>
        <p className="mt-4 text-muted-foreground sm:text-lg">
          Em {monthName} entraram{' '}
          <span className="money font-semibold text-income">{formatCurrency(income)}</span> e saíram{' '}
          <span className="money font-semibold text-expense">{formatCurrency(expenses)}</span>.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center lg:flex-col lg:items-end">
        <MonthPicker />
        <div className="flex gap-2 *:flex-1 sm:*:flex-none">
          <Button size="lg" variant="outline" onClick={() => onCreate('RECEITA')}>
            <ArrowDownLeft className="text-income" />
            Nova receita
          </Button>
          <Button size="lg" onClick={() => onCreate('DESPESA')}>
            <ArrowUpRight />
            Nova despesa
          </Button>
        </div>
      </div>
    </section>
  )
}
