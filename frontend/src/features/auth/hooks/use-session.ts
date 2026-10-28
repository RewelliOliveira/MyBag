import { useSyncExternalStore } from 'react'
import { getToken, isTokenValid, subscribeToToken } from '@/lib/token-storage'

export function useIsAuthenticated() {
  const token = useSyncExternalStore(subscribeToToken, getToken)
  return isTokenValid(token)
}
