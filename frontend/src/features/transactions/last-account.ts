const STORAGE_KEY = 'mybag:last-account'

export function getLastAccountId() {
  try {
    const stored = Number(localStorage.getItem(STORAGE_KEY))
    return Number.isInteger(stored) && stored > 0 ? stored : undefined
  } catch {
    return undefined
  }
}

export function saveLastAccountId(id: number) {
  try {
    localStorage.setItem(STORAGE_KEY, String(id))
  } catch {
    // storage unavailable: the form falls back to no default account
  }
}
