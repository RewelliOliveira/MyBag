const TOKEN_KEY = 'mybag:token'
const listeners = new Set<() => void>()

function notify() {
  listeners.forEach((listener) => listener())
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token)
  notify()
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
  notify()
}

export function isTokenValid(token: string | null) {
  return Boolean(token)
}

export function subscribeToToken(listener: () => void) {
  listeners.add(listener)

  const onStorage = (event: StorageEvent) => {
    if (event.key === TOKEN_KEY) listener()
  }
  window.addEventListener('storage', onStorage)

  return () => {
    listeners.delete(listener)
    window.removeEventListener('storage', onStorage)
  }
}
