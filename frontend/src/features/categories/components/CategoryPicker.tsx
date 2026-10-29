import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { CategoryIcon } from '@/features/categories/components/CategoryIcon'
import type { Category } from '@/types/models'

interface CategoryPickerProps {
  id?: string
  categories: Category[]
  value: number | undefined
  onChange: (id: number) => void
  invalid?: boolean
  disabled?: boolean
}

export function CategoryPicker({
  id,
  categories,
  value,
  onChange,
  invalid,
  disabled,
}: CategoryPickerProps) {
  return (
    <ToggleGroup
      id={id}
      type="single"
      value={value?.toString() ?? ''}
      onValueChange={(next) => next && onChange(Number(next))}
      aria-invalid={invalid}
      disabled={disabled}
      className="grid w-full grid-cols-3 gap-2 sm:grid-cols-4"
    >
      {categories.map((category) => (
        <ToggleGroupItem
          key={category.id}
          value={category.id.toString()}
          aria-label={category.nome}
          className="h-auto min-w-0 flex-col gap-1.5 rounded-xl border border-transparent px-1 py-2.5 text-xs font-normal data-[state=on]:border-primary data-[state=on]:bg-accent data-[state=on]:text-accent-foreground"
        >
          <CategoryIcon category={category} />
          <span className="w-full truncate">{category.nome}</span>
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}
