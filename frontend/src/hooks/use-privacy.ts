import { useEffect, useState } from 'react'

const STORAGE_KEY = 'mybag:hide-values'

function readStored() {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'true'
  } catch {
    return false
  }
}

export function usePrivacy() {
  const [hidden, setHidden] = useState(readStored)

  useEffect(() => {
    document.documentElement.toggleAttribute('data-hide-values', hidden)
    try {
      localStorage.setItem(STORAGE_KEY, String(hidden))
    } catch {
      // storage unavailable: preference lasts for this session only
    }
  }, [hidden])

  return [hidden, () => setHidden((value) => !value)] as const
}
