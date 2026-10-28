import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { getCurrentPeriod, isCurrentPeriod, shiftPeriod, usePeriod } from '@/hooks/use-period'
import { formatMonthYear } from '@/lib/format'

const monthLabels = [
  'Jan',
  'Fev',
  'Mar',
  'Abr',
  'Mai',
  'Jun',
  'Jul',
  'Ago',
  'Set',
  'Out',
  'Nov',
  'Dez',
]

export function MonthPicker() {
  const [period, setPeriod] = usePeriod()
  const [open, setOpen] = useState(false)
  const [visibleYear, setVisibleYear] = useState(period.year)

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) setVisibleYear(period.year)
    setOpen(nextOpen)
  }

  const selectMonth = (month: number) => {
    setPeriod({ month, year: visibleYear })
    setOpen(false)
  }

  return (
    <div className="flex items-center gap-1 rounded-lg border bg-card p-1">
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label="Mês anterior"
        onClick={() => setPeriod(shiftPeriod(period, -1))}
      >
        <ChevronLeft />
      </Button>

      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm" className="min-w-36 capitalize">
            {formatMonthYear(period.month, period.year)}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-72" align="center">
          <div className="mb-3 flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Ano anterior"
              onClick={() => setVisibleYear((year) => year - 1)}
            >
              <ChevronLeft />
            </Button>
            <span className="font-heading font-semibold tabular-nums">{visibleYear}</span>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Próximo ano"
              onClick={() => setVisibleYear((year) => year + 1)}
            >
              <ChevronRight />
            </Button>
          </div>
          <div className="grid grid-cols-4 gap-1">
            {monthLabels.map((label, index) => {
              const month = index + 1
              const selected = period.month === month && period.year === visibleYear
              return (
                <Button
                  key={label}
                  variant={selected ? 'default' : 'ghost'}
                  size="sm"
                  aria-pressed={selected}
                  onClick={() => selectMonth(month)}
                >
                  {label}
                </Button>
              )
            })}
          </div>
          {!isCurrentPeriod(period) && (
            <Button
              variant="outline"
              size="sm"
              className="mt-3 w-full"
              onClick={() => {
                setPeriod(getCurrentPeriod())
                setOpen(false)
              }}
            >
              Ir para o mês atual
            </Button>
          )}
        </PopoverContent>
      </Popover>

      <Button
        variant="ghost"
        size="icon-sm"
        aria-label="Próximo mês"
        onClick={() => setPeriod(shiftPeriod(period, 1))}
      >
        <ChevronRight />
      </Button>
    </div>
  )
}
