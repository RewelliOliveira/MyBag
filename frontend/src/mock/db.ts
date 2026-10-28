import { createSeed } from '@/mock/seed'
import type {
  AccountType,
  Bank,
  Category,
  Periodicity,
  TransactionOrigin,
  TransactionType,
  User,
} from '@/types/models'

export interface MockUser extends User {
  id: number
  senha: string
}

export type MockCategory = Category

export interface MockAccount {
  id: number
  descricao: string
  saldoInicial: number
  bancoId: number
  tipoContaId: number
}

export interface MockTransaction {
  id: number
  valor: number
  data: string
  tipo: TransactionType
  descricao: string
  comentario: string | null
  origem: TransactionOrigin
  recorrenciaId: number | null
  categoriaId: number
  contaId: number
}

export interface MockRecurrence {
  id: number
  origem: Exclude<TransactionOrigin, 'NORMAL'>
  periodicidade: Periodicity
  valor: number
  tipo: TransactionType
  descricao: string
  categoriaId: number
  contaId: number
  dataCadastro: string
  dataFinal: string | null
  ultimaExecucao: string | null
  qtdParcelas: number | null
}

export interface MockBudget {
  id: number
  categoriaId: number
  valorEstimado: number
  mes: number
  ano: number
}

export interface MockDatabase {
  sequence: number
  users: MockUser[]
  banks: Bank[]
  accountTypes: AccountType[]
  accounts: MockAccount[]
  categories: MockCategory[]
  transactions: MockTransaction[]
  recurrences: MockRecurrence[]
  budgets: MockBudget[]
}

const STORAGE_KEY = 'mybag:mock-db:v2'

let database: MockDatabase | null = null

function load(): MockDatabase {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) return JSON.parse(stored) as MockDatabase
  } catch {
    // corrupted or unavailable storage falls back to a fresh seed
  }
  return createSeed()
}

function persist(db: MockDatabase) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db))
  } catch {
    // quota exceeded: keep working in memory
  }
}

export function getDb() {
  database ??= load()
  return database
}

export function saveDb() {
  persist(getDb())
}

export function nextId(db: MockDatabase) {
  db.sequence += 1
  return db.sequence
}

export function resetMockDb() {
  database = createSeed()
  persist(database)
}
