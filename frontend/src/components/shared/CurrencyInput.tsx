import type { ComponentProps } from 'react'
import { Input } from '@/components/ui/input'
import { formatCurrency } from '@/lib/format'
import { cn } from '@/lib/utils'

interface CurrencyInputProps extends Omit<ComponentProps<typeof Input>, 'value' | 'onChange'> {
  value: number | undefined
  onChange: (value: number) => void
  allowNegative?: boolean
}

export function CurrencyInput({
  value,
  onChange,
  allowNegative,
  className,
  ...props
}: CurrencyInputProps) {
  const handleChange = (raw: string) => {
    const digits = raw.replace(/\D/g, '')
    const negative = allowNegative && raw.includes('-')
    const amount = Number(digits || '0') / 100
    onChange(negative ? -amount : amount)
  }

  return (
    <Input
      inputMode="numeric"
      autoComplete="off"
      className={cn('text-right money', className)}
      value={formatCurrency(value ?? 0)}
      onChange={(event) => handleChange(event.target.value)}
      {...props}
    />
  )
}
