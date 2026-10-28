import { useState } from 'react'
import { Archive, ArchiveRestore, EllipsisVertical, Pencil, Plus } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { ErrorState } from '@/components/shared/ErrorState'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CategoryFormDialog } from '@/features/categories/components/CategoryFormDialog'
import { CategoryList } from '@/features/categories/components/CategoryList'
import {
  useArchiveCategory,
  useArchivedCategories,
  useCategories,
  useRestoreCategory,
} from '@/features/categories/hooks/use-categories'
import { transactionTypePluralLabels } from '@/lib/transaction-types'
import type { Category, TransactionType } from '@/types/models'

const transactionTypes: TransactionType[] = ['DESPESA', 'RECEITA']

export function CategoriesPage() {
  const categories = useCategories()
  const archived = useArchivedCategories()
  const archiveCategory = useArchiveCategory()
  const restoreCategory = useRestoreCategory()

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Category>()
  const [defaultType, setDefaultType] = useState<TransactionType>('DESPESA')
  const [archiving, setArchiving] = useState<Category>()

  const openCreate = (type: TransactionType = 'DESPESA') => {
    setEditing(undefined)
    setDefaultType(type)
    setFormOpen(true)
  }

  const openEdit = (category: Category) => {
    setEditing(category)
    setFormOpen(true)
  }

  const confirmArchive = () => {
    if (!archiving) return
    archiveCategory.mutate(archiving.id, { onSuccess: () => setArchiving(undefined) })
  }

  const renderActiveActions = (category: Category) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon-sm" aria-label={`Ações da categoria ${category.nome}`}>
          <EllipsisVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onSelect={() => openEdit(category)}>
          <Pencil />
          Editar
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => setArchiving(category)}>
          <Archive />
          Arquivar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )

  const renderArchivedActions = (category: Category) => (
    <Button
      variant="ghost"
      size="sm"
      disabled={restoreCategory.isPending}
      onClick={() => restoreCategory.mutate(category.id)}
    >
      <ArchiveRestore />
      Restaurar
    </Button>
  )

  return (
    <>
      <PageHeader
        title="Categorias"
        description="Organize receitas e despesas do seu jeito."
        actions={
          <Button size="lg" onClick={() => openCreate()}>
            <Plus />
            Nova categoria
          </Button>
        }
      />

      <Tabs defaultValue="active">
        <TabsList>
          <TabsTrigger value="active">Em uso</TabsTrigger>
          <TabsTrigger value="archived">
            Arquivadas
            {!!archived.data?.length && (
              <span className="text-muted-foreground tabular-nums">{archived.data.length}</span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-4">
          {categories.isPending ? (
            <div className="grid gap-4 lg:grid-cols-2">
              <Skeleton className="h-80 rounded-2xl" />
              <Skeleton className="h-80 rounded-2xl" />
            </div>
          ) : categories.isError ? (
            <ErrorState onRetry={categories.refetch} />
          ) : (
            <div className="grid items-start gap-4 lg:grid-cols-2">
              {transactionTypes.map((type) => (
                <CategoryList
                  key={type}
                  title={transactionTypePluralLabels[type]}
                  categories={categories.data.filter((category) => category.tipo === type)}
                  emptyMessage="Nenhuma categoria por aqui ainda."
                  renderActions={renderActiveActions}
                  onAdd={() => openCreate(type)}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="archived" className="mt-4">
          {archived.isPending ? (
            <Skeleton className="h-60 rounded-2xl" />
          ) : archived.isError ? (
            <ErrorState onRetry={archived.refetch} />
          ) : (
            <CategoryList
              title="Arquivadas"
              categories={archived.data}
              emptyMessage="Categorias arquivadas saem das listas de seleção, mas mantêm o histórico."
              renderActions={renderArchivedActions}
              className="max-w-2xl"
            />
          )}
        </TabsContent>
      </Tabs>

      <CategoryFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        category={editing}
        defaultType={defaultType}
      />

      <ConfirmDialog
        open={!!archiving}
        onOpenChange={(open) => !open && setArchiving(undefined)}
        title="Arquivar categoria?"
        description={
          <>
            <strong>{archiving?.nome}</strong> deixa de aparecer nas listas de seleção. As
            transações já registradas continuam no histórico, e você pode restaurá-la quando quiser.
          </>
        }
        confirmLabel="Arquivar"
        onConfirm={confirmArchive}
        isPending={archiveCategory.isPending}
      />
    </>
  )
}
