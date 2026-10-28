import { ApiError } from '@/lib/api-error'
import { nextId, type MockDatabase } from '@/mock/db'
import { mockRequest } from '@/mock/request'
import { findCategory, toCategory } from '@/mock/selectors'
import type { TransactionType } from '@/types/models'

export interface CategoryPayload {
  nome: string
  tipo: TransactionType
  cor: string
}

function assertUniqueName(db: MockDatabase, { nome, tipo }: CategoryPayload, ignoreId?: number) {
  const taken = db.categories.some(
    (category) =>
      category.id !== ignoreId &&
      category.tipo === tipo &&
      category.nome.toLowerCase() === nome.trim().toLowerCase(),
  )
  if (taken) throw new ApiError(409, 'Já existe uma categoria com esse nome.')
}

export function getCategories(type?: TransactionType) {
  return mockRequest((db) =>
    db.categories.filter(({ ativa, tipo }) => ativa && (!type || tipo === type)).map(toCategory),
  )
}

export function getArchivedCategories() {
  return mockRequest((db) => db.categories.filter(({ ativa }) => !ativa).map(toCategory))
}

export function createCategory(payload: CategoryPayload) {
  return mockRequest((db) => {
    assertUniqueName(db, payload)
    const category = { id: nextId(db), ...payload, nome: payload.nome.trim(), ativa: true }
    db.categories.push(category)
    return toCategory(category)
  })
}

export function updateCategory(id: number, payload: CategoryPayload) {
  return mockRequest((db) => {
    const category = findCategory(db, id)
    assertUniqueName(db, payload, id)
    Object.assign(category, payload, { nome: payload.nome.trim() })
    return toCategory(category)
  })
}

export function setCategoryActive(id: number, ativa: boolean) {
  return mockRequest((db) => {
    const category = findCategory(db, id)
    category.ativa = ativa
    return toCategory(category)
  })
}
