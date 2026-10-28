import { useDeferredValue, useState } from 'react'
import { ArrowLeftRight, Plus, Search } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { EmptyState } from '@/components/shared/EmptyState'
import { ErrorState } from '@/components/shared/ErrorState'
import { MonthPicker } from '@/components/shared/MonthPicker'
import { Button } from '@/components/ui/button'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DeleteTransactionDialog } from '@/features/transactions/components/DeleteTransactionDialog'
import { MonthSummary } from '@/features/transactions/components/MonthSummary'
import { TransactionFormDialog } from '@/features/transactions/components/TransactionFormDialog'
import { TransactionList } from '@/features/transactions/components/TransactionList'
import {
  useDeleteTransaction,
  useTransactions,
} from '@/features/transactions/hooks/use-transactions'
import { usePeriod } from '@/hooks/use-period'
import type { Transaction, TransactionType } from '@/types/models'

type TypeFilter = 'ALL' | TransactionType

function matchesSearch(transaction: Transaction, term: string) {
  const haystack = [transaction.descricao, transaction.categoria.nome, transaction.conta.descricao]
    .join(' ')
    .toLocaleLowerCase('pt-BR')
  return haystack.includes(term)
}

export function TransactionsPage() {
  const [period] = usePeriod()
  const { data: transactions = [], isPending, isError, refetch } = useTransactions(period)

  const [typeFilter, setTypeFilter] = useState<TypeFilter>('ALL')
  const [search, setSearch] = useState('')
  const deferredSearch = useDeferredValue(search.trim().toLocaleLowerCase('pt-BR'))

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Transaction>()
  const [deleting, setDeleting] = useState<Transaction>()
  const deleteTransaction = useDeleteTransaction()

  const filtered = transactions.filter(
    (transaction) =>
      (typeFilter === 'ALL' || transaction.tipo === typeFilter) &&
      (!deferredSearch || matchesSearch(transaction, deferredSearch)),
  )

  const openCreate = () => {
    setEditing(undefined)
    setFormOpen(true)
  }

  const requestDelete = (transaction: Transaction) => {
    if (transaction.idTransacaoRecorrente) setDeleting(transaction)
    else deleteTransaction.mutate({ transaction, scope: 'single' })
  }

  const openEdit = (transaction: Transaction) => {
    setEditing(transaction)
    setFormOpen(true)
  }

  return (
    <>
      <PageHeader
        title="Transações"
        description="Tudo o que entrou e saiu no mês."
        actions={
          <>
            <MonthPicker />
            <Button size="lg" onClick={openCreate}>
              <Plus />
              Nova transação
            </Button>
          </>
        }
      />

      <MonthSummary period={period} />

      <div className="mt-8 mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Tabs value={typeFilter} onValueChange={(value) => setTypeFilter(value as TypeFilter)}>
          <TabsList>
            <TabsTrigger value="ALL">Todas</TabsTrigger>
            <TabsTrigger value="RECEITA">Receitas</TabsTrigger>
            <TabsTrigger value="DESPESA">Despesas</TabsTrigger>
          </TabsList>
        </Tabs>
        <InputGroup className="sm:max-w-xs">
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
          <InputGroupInput
            type="search"
            placeholder="Buscar transações"
            aria-label="Buscar por descrição, categoria ou conta"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </InputGroup>
      </div>

      {isPending ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton key={index} className="h-16 rounded-2xl" />
          ))}
        </div>
      ) : isError ? (
        <ErrorState onRetry={refetch} />
      ) : transactions.length === 0 ? (
        <EmptyState
          icon={ArrowLeftRight}
          title="Nenhuma transação neste mês"
          description="Registre receitas e despesas para acompanhar para onde seu dinheiro vai."
          action={
            <Button onClick={openCreate}>
              <Plus />
              Nova transação
            </Button>
          }
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Search}
          title="Nada encontrado"
          description="Nenhuma transação corresponde aos filtros. Tente outro termo ou tipo."
        />
      ) : (
        <TransactionList transactions={filtered} onEdit={openEdit} onDelete={requestDelete} />
      )}

      <TransactionFormDialog open={formOpen} onOpenChange={setFormOpen} transaction={editing} />
      <DeleteTransactionDialog transaction={deleting} onClose={() => setDeleting(undefined)} />
    </>
  )
}
