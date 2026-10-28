import { normalizeHexColor } from '@/lib/format'
import { cn } from '@/lib/utils'

interface CategoryDotProps {
  color: string
  className?: string
}

export function CategoryDot({ color, className }: CategoryDotProps) {
  return (
    <span
      aria-hidden="true"
      style={{ backgroundColor: normalizeHexColor(color) }}
      className={cn('inline-block size-3 shrink-0 rounded-full', className)}
    />
  )
}
