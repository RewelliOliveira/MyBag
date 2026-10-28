import type { AccountTypeName } from '@/types/models'

export const accountTypeLabels: Record<AccountTypeName, string> = {
  CONTA_CORRENTE: 'Conta corrente',
  CARTEIRA: 'Carteira',
  POUPANCA: 'Poupança',
  INVESTIMENTOS: 'Investimentos',
  OUTRO: 'Outro',
}
