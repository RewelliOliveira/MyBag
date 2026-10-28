import { useSyncExternalStore } from 'react'
import type { Period } from '@/types/models'

export function getCurrentPeriod(): Period {
  const today = new Date()
  return { month: today.getMonth() + 1, year: today.getFullYear() }
}

let period = getCurrentPeriod()
const listeners = new Set<() => void>()

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function setPeriod(next: Period) {
  period = next
  listeners.forEach((listener) => listener())
}

export function shiftPeriod({ month, year }: Period, offset: number): Period {
  const date = new Date(year, month - 1 + offset, 1)
  return { month: date.getMonth() + 1, year: date.getFullYear() }
}

export function isCurrentPeriod({ month, year }: Period) {
  const today = getCurrentPeriod()
  return today.month === month && today.year === year
}

export function usePeriod() {
  const value = useSyncExternalStore(subscribe, () => period)
  return [value, setPeriod] as const
}
