import { createElement } from 'react'
import { getCategoryIcon } from '@/features/categories/category-icons'
import { cn } from '@/lib/utils'
import type { Category } from '@/types/models'

interface CategoryIconProps {
  category: Pick<Category, 'icone' | 'cor'>
  className?: string
}

export function CategoryIcon({ category, className }: CategoryIconProps) {
  return (
    <span
      aria-hidden="true"
      style={{
        color: category.cor,
        backgroundColor: `color-mix(in oklab, ${category.cor} 15%, transparent)`,
      }}
      className={cn(
        'inline-flex size-9 shrink-0 items-center justify-center rounded-full [&_svg]:size-4',
        className,
      )}
    >
      {createElement(getCategoryIcon(category.icone))}
    </span>
  )
}
