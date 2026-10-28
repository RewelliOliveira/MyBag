import axios from 'axios'

const FALLBACK_MESSAGE = 'Não foi possível concluir a operação. Tente novamente.'
const NETWORK_MESSAGE = 'Sem conexão com o servidor. Verifique sua internet e tente novamente.'

interface ApiErrorBody {
  mensagem?: string
  message?: string
}

function extractMessage(data: unknown): string | undefined {
  if (typeof data === 'string' && data.trim()) return data
  if (Array.isArray(data)) return extractMessage(data[0])
  if (data && typeof data === 'object') {
    const body = data as ApiErrorBody
    return body.mensagem ?? body.message
  }
  return undefined
}

export function getErrorMessage(error: unknown, fallback = FALLBACK_MESSAGE) {
  if (!axios.isAxiosError(error)) return fallback
  if (!error.response) return NETWORK_MESSAGE
  return extractMessage(error.response.data) ?? fallback
}
