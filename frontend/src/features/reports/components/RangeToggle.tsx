import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'

const rangeOptions = [3, 6, 12] as const
export type RangeMonths = (typeof rangeOptions)[number]

interface RangeToggleProps {
  value: RangeMonths
  onChange: (value: RangeMonths) => void
}

export function RangeToggle({ value, onChange }: RangeToggleProps) {
  return (
    <ToggleGroup
      type="single"
      variant="outline"
      size="sm"
      value={value.toString()}
      onValueChange={(next) => next && onChange(Number(next) as RangeMonths)}
      aria-label="Período do gráfico"
    >
      {rangeOptions.map((months) => (
        <ToggleGroupItem
          key={months}
          value={months.toString()}
          className="data-[state=on]:border-primary data-[state=on]:bg-accent data-[state=on]:text-accent-foreground"
        >
          {months} meses
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}
