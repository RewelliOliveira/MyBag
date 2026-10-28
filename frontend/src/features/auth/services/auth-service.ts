import { ApiError } from '@/lib/api-error'
import { nextId } from '@/mock/db'
import { createMockToken, mockRequest } from '@/mock/request'
import type { LoginInput, SignupInput } from '@/features/auth/schemas'

const sameEmail = (a: string, b: string) => a.trim().toLowerCase() === b.trim().toLowerCase()

export function login({ email, senha }: LoginInput) {
  return mockRequest(
    (db) => {
      const user = db.users.find((candidate) => sameEmail(candidate.email, email))
      if (!user || user.senha !== senha) throw new ApiError(401, 'E-mail ou senha incorretos.')
      return createMockToken(user.id)
    },
    { auth: false },
  )
}

export function signup({ nome, email, senha }: SignupInput) {
  return mockRequest(
    (db) => {
      if (db.users.some((user) => sameEmail(user.email, email))) {
        throw new ApiError(409, 'Já existe uma conta com esse e-mail.')
      }
      db.users.push({ id: nextId(db), nome: nome.trim(), email: email.trim(), senha, imgUrl: null })
    },
    { auth: false },
  )
}
