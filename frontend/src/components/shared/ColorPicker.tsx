import { Check } from 'lucide-react'
import { categoryColors } from '@/lib/category-colors'
import { cn } from '@/lib/utils'

interface ColorPickerProps {
  value: string
  onChange: (color: string) => void
}

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  return (
    <div role="radiogroup" aria-label="Cor" className="flex flex-wrap gap-2">
      {categoryColors.map((color) => {
        const selected = value.toUpperCase() === color.value
        return (
          <button
            key={color.value}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={color.label}
            title={color.label}
            onClick={() => onChange(color.value)}
            style={{ backgroundColor: color.value }}
            className={cn(
              'flex size-8 items-center justify-center rounded-full ring-offset-2 ring-offset-background transition-transform outline-none hover:scale-110 focus-visible:ring-2 focus-visible:ring-ring',
              selected && 'ring-2 ring-foreground',
            )}
          >
            {selected && <Check className="size-4 text-white drop-shadow" />}
          </button>
        )
      })}
    </div>
  )
}
