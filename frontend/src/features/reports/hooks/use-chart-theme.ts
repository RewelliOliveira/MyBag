import { useMemo, useSyncExternalStore } from 'react'

export interface ChartTheme {
  foreground: string
  mutedForeground: string
  border: string
  card: string
  popover: string
  muted: string
  primary: string
  income: string
  expense: string
  hideValues: boolean
}

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange)
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class', 'data-hide-values'],
  })
  return () => observer.disconnect()
}

function getSnapshot() {
  const root = document.documentElement
  return `${root.className}|${root.hasAttribute('data-hide-values')}`
}

function readTheme(hideValues: boolean): ChartTheme {
  const styles = getComputedStyle(document.documentElement)
  const token = (name: string) => styles.getPropertyValue(`--${name}`).trim()

  return {
    foreground: token('foreground'),
    mutedForeground: token('muted-foreground'),
    border: token('border'),
    card: token('card'),
    popover: token('popover'),
    muted: token('muted'),
    primary: token('chart-1'),
    income: token('chart-income'),
    expense: token('chart-expense'),
    hideValues,
  }
}

export function useChartTheme() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, () => '')
  return useMemo(() => readTheme(snapshot.endsWith('|true')), [snapshot])
}
