import { ApiError } from '@/lib/api-error'
import { clearToken, getToken } from '@/lib/token-storage'
import { getDb, saveDb, type MockDatabase } from '@/mock/db'

const MIN_LATENCY = 200
const MAX_LATENCY = 600
const TOKEN_PREFIX = 'mock-token-'

function wait() {
  const latency = MIN_LATENCY + Math.random() * (MAX_LATENCY - MIN_LATENCY)
  return new Promise((resolve) => setTimeout(resolve, latency))
}

export function createMockToken(userId: number) {
  return `${TOKEN_PREFIX}${userId}`
}

export function getSessionUser(db: MockDatabase) {
  const token = getToken()
  const userId = token?.startsWith(TOKEN_PREFIX) ? Number(token.slice(TOKEN_PREFIX.length)) : NaN
  const user = db.users.find(({ id }) => id === userId)
  if (!user) throw new ApiError(401, 'Sessão expirada. Entre novamente.')
  return user
}

export function notFound(entity: string): never {
  throw new ApiError(404, `${entity} não encontrada.`)
}

interface MockRequestOptions {
  auth?: boolean
}

export async function mockRequest<T>(
  handler: (db: MockDatabase) => T,
  { auth = true }: MockRequestOptions = {},
): Promise<T> {
  await wait()
  const db = getDb()

  try {
    if (auth) getSessionUser(db)
    const result = handler(db)
    saveDb()
    return structuredClone(result)
  } catch (error) {
    if (error instanceof ApiError && error.status === 401 && getToken()) clearToken()
    throw error
  }
}
