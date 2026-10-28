import axios from 'axios'
import { clearToken, getToken, isTokenValid } from '@/lib/token-storage'

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
})

apiClient.interceptors.request.use((config) => {
  const token = getToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

apiClient.interceptors.response.use(undefined, (error) => {
  const status = axios.isAxiosError(error) ? error.response?.status : undefined
  const sessionExpired = status === 401 || (status === 403 && !isTokenValid(getToken()))

  if (sessionExpired && getToken()) clearToken()

  return Promise.reject(error)
})
