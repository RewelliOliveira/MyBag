import { ApiError } from '@/lib/api-error'
import { getSessionUser, mockRequest } from '@/mock/request'
import type { User } from '@/types/models'

export interface ProfilePayload {
  nome: string
  email: string
  foto?: File
}

function readAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(new ApiError(400, 'Não foi possível ler a imagem.'))
    reader.readAsDataURL(file)
  })
}

export function getCurrentUser() {
  return mockRequest<User>((db) => {
    const { nome, email, imgUrl } = getSessionUser(db)
    return { nome, email, imgUrl }
  })
}

export async function updateProfile({ nome, email, foto }: ProfilePayload) {
  const imgUrl = foto ? await readAsDataUrl(foto) : undefined

  return mockRequest<User>((db) => {
    const user = getSessionUser(db)
    const emailTaken = db.users.some(
      (other) => other.id !== user.id && other.email.toLowerCase() === email.trim().toLowerCase(),
    )
    if (emailTaken) throw new ApiError(409, 'Esse e-mail já está em uso.')

    user.nome = nome.trim()
    user.email = email.trim()
    if (imgUrl) user.imgUrl = imgUrl
    return { nome: user.nome, email: user.email, imgUrl: user.imgUrl }
  })
}
