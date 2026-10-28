export interface Period {
  month: number
  year: number
}

export type TransactionType = 'RECEITA' | 'DESPESA'

export type TransactionOrigin = 'NORMAL' | 'FIXA' | 'PARCELADA'

export type Periodicity = 'DIARIO' | 'SEMANAL' | 'MENSAL' | 'ULTIMO_DIA_MES'

export type AccountTypeName = 'CONTA_CORRENTE' | 'CARTEIRA' | 'POUPANCA' | 'INVESTIMENTOS' | 'OUTRO'

export interface Bank {
  id: number
  nome: string
  iconeUrl: string
}

export interface AccountType {
  id: number
  tipoConta: AccountTypeName
}

export interface Account {
  id: number
  descricao: string
  saldo: number
  banco: Bank
  tipo_conta: AccountType
}

export interface AccountSummary {
  iconeUrl: string
  nomeBanco: string
  saldo: number
}

export interface Category {
  id: number
  nome: string
  tipo: TransactionType
  cor: string
}

export interface Transaction {
  id: number
  valor: number
  data_transacao: string
  tipo: TransactionType
  descricao: string
  comentario: string | null
  origem: TransactionOrigin
  idTransacaoRecorrente: number | null
  categoria: Category
  conta: Account
}

export interface Budget {
  id: number
  descricao: string
  valorEstimado: number
  valorGasto: number
  valorRestante: number
  progresso: number
  mes: number
  ano: number
  categoriaDTO: Category
}

export interface User {
  nome: string
  email: string
  imgUrl: string | null
}
