const FALLBACK_MESSAGE = 'Não foi possível concluir a operação. Tente novamente.'

export class ApiError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export function getErrorMessage(error: unknown, fallback = FALLBACK_MESSAGE) {
  if (error instanceof ApiError && error.status < 500) return error.message
  return fallback
}
