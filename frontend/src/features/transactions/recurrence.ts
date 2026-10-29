import type { Recurrence } from '@/features/transactions/services/transactions-service'
import type { Periodicity, TransactionOrigin } from '@/types/models'

export const recurrenceOptions: { value: Recurrence; label: string; description: string }[] = [
  { value: 'NORMAL', label: 'Única', description: 'Acontece uma vez.' },
  { value: 'FIXA', label: 'Fixa', description: 'Repete sem data para terminar.' },
  { value: 'PARCELADA', label: 'Parcelada', description: 'Valor total dividido em parcelas.' },
]

export const periodicityLabels: Record<Periodicity, string> = {
  DIARIO: 'Todo dia',
  SEMANAL: 'Toda semana',
  MENSAL: 'Todo mês',
  ULTIMO_DIA_MES: 'Último dia do mês',
}

export const originLabels: Record<Exclude<TransactionOrigin, 'NORMAL'>, string> = {
  FIXA: 'Fixa',
  PARCELADA: 'Parcela',
}
