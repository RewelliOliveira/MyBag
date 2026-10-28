import type { ReactNode } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CategoryDot } from '@/features/categories/components/CategoryDot'
import { cn } from '@/lib/utils'
import type { Category } from '@/types/models'

interface CategoryListProps {
  title: string
  categories: Category[]
  emptyMessage: string
  renderActions: (category: Category) => ReactNode
  onAdd?: () => void
  className?: string
}

export function CategoryList({
  title,
  categories,
  emptyMessage,
  renderActions,
  onAdd,
  className,
}: CategoryListProps) {
  return (
    <section className={cn('rounded-2xl border bg-card', className)}>
      <header className="flex items-center justify-between border-b px-5 py-4">
        <h2 className="text-lg font-semibold">
          {title}
          <span className="ml-2 text-sm font-normal text-muted-foreground tabular-nums">
            {categories.length}
          </span>
        </h2>
        {onAdd && (
          <Button variant="ghost" size="sm" onClick={onAdd}>
            <Plus />
            Adicionar
          </Button>
        )}
      </header>
      {categories.length === 0 ? (
        <p className="px-5 py-8 text-center text-sm text-muted-foreground">{emptyMessage}</p>
      ) : (
        <ul className="divide-y">
          {categories.map((category) => (
            <li key={category.id} className="flex items-center gap-3 px-5 py-3">
              <CategoryDot color={category.cor} />
              <span className="flex-1 truncate">{category.nome}</span>
              {renderActions(category)}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
