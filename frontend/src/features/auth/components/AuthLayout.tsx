import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { Logo } from '@/components/shared/Logo'
import { ThemeToggle } from '@/components/shared/ThemeToggle'
import { formatCurrency } from '@/lib/format'

const statementPreview = [
  { label: 'Salário', category: 'Receita', value: 4200 },
  { label: 'Aluguel', category: 'Moradia', value: -1350 },
  { label: 'Mercado do mês', category: 'Alimentação', value: -386.4 },
  { label: 'Freelance', category: 'Receita', value: 900 },
]

const balance = statementPreview.reduce((total, entry) => total + entry.value, 0)

interface AuthLayoutProps {
  title: string
  description: string
  children: ReactNode
  footer: ReactNode
}

export function AuthLayout({ title, description, children, footer }: AuthLayoutProps) {
  const reduceMotion = useReducedMotion()

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col p-6 md:p-10">
        <div className="flex items-center justify-between">
          <Logo />
          <ThemeToggle />
        </div>

        <div className="flex flex-1 items-center justify-center py-12">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="w-full max-w-sm"
          >
            <h1 className="text-3xl font-bold">{title}</h1>
            <p className="mt-2 text-muted-foreground">{description}</p>
            <div className="mt-8">{children}</div>
            <p className="mt-6 text-center text-sm text-muted-foreground">{footer}</p>
          </motion.div>
        </div>
      </div>

      <aside className="relative hidden overflow-hidden bg-primary text-primary-foreground lg:flex lg:flex-col lg:justify-between lg:p-12">
        <p className="max-w-md font-heading text-5xl leading-tight font-bold tracking-tight">
          Cada real no seu lugar.
        </p>

        <div className="max-w-md rounded-3xl bg-primary-foreground p-6 text-background shadow-2xl dark:text-foreground">
          <div className="flex items-baseline justify-between">
            <span className="text-sm opacity-70">Saldo do mês</span>
            <span className="money text-3xl font-bold">{formatCurrency(balance)}</span>
          </div>
          <ul className="mt-6 space-y-1">
            {statementPreview.map((entry, index) => (
              <motion.li
                key={entry.label}
                initial={reduceMotion ? false : { opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.12, duration: 0.4, ease: 'easeOut' }}
                className="flex items-center justify-between border-t border-background/10 py-3 dark:border-foreground/10"
              >
                <span>
                  <span className="block font-medium">{entry.label}</span>
                  <span className="text-sm opacity-60">{entry.category}</span>
                </span>
                <span
                  className={
                    entry.value > 0
                      ? 'money text-income-soft'
                      : 'money text-background/80 dark:text-foreground/80'
                  }
                >
                  {entry.value > 0 ? '+' : '−'} {formatCurrency(Math.abs(entry.value))}
                </span>
              </motion.li>
            ))}
          </ul>
        </div>

        <p className="max-w-sm text-sm opacity-80">
          Contas, transações, orçamentos e relatórios do mês em um só lugar.
        </p>
      </aside>
    </div>
  )
}
