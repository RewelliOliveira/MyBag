import { ApiError } from '@/lib/api-error'
import { nextId, type MockDatabase } from '@/mock/db'
import { mockRequest, notFound } from '@/mock/request'
import { findCategory, periodEnd, syncUntil, toBudget } from '@/mock/selectors'
import type { Period } from '@/types/models'

export interface BudgetPayload {
  categoriaId: number
  valorEstimado: number
  period: Period
}

function assertAvailable(
  db: MockDatabase,
  { categoriaId, period }: BudgetPayload,
  ignoreId?: number,
) {
  findCategory(db, categoriaId)
  const taken = db.budgets.some(
    (budget) =>
      budget.id !== ignoreId &&
      budget.categoriaId === categoriaId &&
      budget.mes === period.month &&
      budget.ano === period.year,
  )
  if (taken) throw new ApiError(409, 'Já existe um orçamento para essa categoria neste mês.')
}

function findBudget(db: MockDatabase, id: number) {
  return db.budgets.find((budget) => budget.id === id) ?? notFound('Orçamento')
}

export function getBudgets(period: Period) {
  return mockRequest((db) => {
    syncUntil(db, periodEnd(period))
    return db.budgets
      .filter(({ mes, ano }) => mes === period.month && ano === period.year)
      .map((budget) => toBudget(db, budget))
  })
}

export function createBudget(payload: BudgetPayload) {
  return mockRequest((db) => {
    assertAvailable(db, payload)
    const budget = {
      id: nextId(db),
      categoriaId: payload.categoriaId,
      valorEstimado: payload.valorEstimado,
      mes: payload.period.month,
      ano: payload.period.year,
    }
    db.budgets.push(budget)
    return toBudget(db, budget)
  })
}

export function updateBudget(id: number, payload: BudgetPayload) {
  return mockRequest((db) => {
    const budget = findBudget(db, id)
    assertAvailable(db, payload, id)
    Object.assign(budget, {
      categoriaId: payload.categoriaId,
      valorEstimado: payload.valorEstimado,
      mes: payload.period.month,
      ano: payload.period.year,
    })
    return toBudget(db, budget)
  })
}

export function deleteBudget(id: number) {
  return mockRequest((db) => {
    findBudget(db, id)
    db.budgets = db.budgets.filter((budget) => budget.id !== id)
  })
}
