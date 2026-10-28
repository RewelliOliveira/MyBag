import { addMonths, endOfMonth, isAfter, setDate, startOfMonth, subMonths } from 'date-fns'
import { toApiDate } from '@/lib/format'
import { materializeRecurrences } from '@/mock/recurrence'
import type { MockDatabase, MockRecurrence, MockTransaction } from '@/mock/db'
import type { TransactionType } from '@/types/models'

export const DEMO_CREDENTIALS = { email: 'demo@mybag.com', senha: '123456' }

const HISTORY_MONTHS = 6

const banks = [
  {
    id: 1,
    nome: 'Bradesco',
    iconeUrl:
      'https://play-lh.googleusercontent.com/ReQEaxm44OuduIlJEVO_-xs9iZXSyRNdzGKrONYoLSgAdOzyhPKTb1xuuoPXK6tABm0',
  },
  {
    id: 2,
    nome: 'Banco do Brasil',
    iconeUrl:
      'https://play-lh.googleusercontent.com/1-aNhsSPNqiVluwNGZar_7F5PbQ4u1zteuJ1jumnArhe8bfYHHaVwu4aVOF5-NAmLaA',
  },
  {
    id: 3,
    nome: 'Nubank',
    iconeUrl: 'https://t.ctcdn.com.br/DIEw0gGtQl_GNhWXJwgrRmuGpIk=/i624750.png',
  },
  { id: 4, nome: 'Itaú', iconeUrl: '' },
  { id: 5, nome: 'Inter', iconeUrl: '' },
  { id: 6, nome: 'Caixa', iconeUrl: '' },
]

const accountTypes = [
  { id: 1, tipoConta: 'CONTA_CORRENTE' as const },
  { id: 2, tipoConta: 'CARTEIRA' as const },
  { id: 3, tipoConta: 'POUPANCA' as const },
  { id: 4, tipoConta: 'INVESTIMENTOS' as const },
  { id: 5, tipoConta: 'OUTRO' as const },
]

const categories = [
  { id: 1, nome: 'Salário', tipo: 'RECEITA' as const, cor: '#2A9D8F', ativa: true },
  { id: 2, nome: 'Freelance', tipo: 'RECEITA' as const, cor: '#3399FF', ativa: true },
  { id: 3, nome: 'Rendimentos', tipo: 'RECEITA' as const, cor: '#33FF57', ativa: true },
  { id: 4, nome: 'Alimentação', tipo: 'DESPESA' as const, cor: '#FF5733', ativa: true },
  { id: 5, nome: 'Moradia', tipo: 'DESPESA' as const, cor: '#9B59B6', ativa: true },
  { id: 6, nome: 'Transporte', tipo: 'DESPESA' as const, cor: '#F39C12', ativa: true },
  { id: 7, nome: 'Lazer', tipo: 'DESPESA' as const, cor: '#FF33A8', ativa: true },
  { id: 8, nome: 'Saúde', tipo: 'DESPESA' as const, cor: '#E63946', ativa: true },
  { id: 9, nome: 'Compras', tipo: 'DESPESA' as const, cor: '#00C8FF', ativa: true },
  { id: 10, nome: 'Educação', tipo: 'DESPESA' as const, cor: '#FFBF00', ativa: true },
  { id: 11, nome: 'Academia', tipo: 'DESPESA' as const, cor: '#2A9D8F', ativa: false },
]

const accounts = [
  { id: 1, descricao: 'Conta principal', saldoInicial: 3200, bancoId: 3, tipoContaId: 1 },
  { id: 2, descricao: 'Reserva de emergência', saldoInicial: 12000, bancoId: 1, tipoContaId: 3 },
  { id: 3, descricao: 'Conta salário', saldoInicial: 850, bancoId: 2, tipoContaId: 1 },
]

interface VariableExpense {
  descricao: string
  categoriaId: number
  contaId: number
  min: number
  max: number
  perMonth: number
}

const variableExpenses: VariableExpense[] = [
  { descricao: 'Supermercado', categoriaId: 4, contaId: 1, min: 180, max: 420, perMonth: 3 },
  { descricao: 'Restaurante', categoriaId: 4, contaId: 1, min: 45, max: 160, perMonth: 3 },
  { descricao: 'Combustível', categoriaId: 6, contaId: 1, min: 120, max: 260, perMonth: 2 },
  {
    descricao: 'Aplicativo de transporte',
    categoriaId: 6,
    contaId: 1,
    min: 18,
    max: 55,
    perMonth: 3,
  },
  { descricao: 'Cinema', categoriaId: 7, contaId: 1, min: 40, max: 90, perMonth: 1 },
  { descricao: 'Farmácia', categoriaId: 8, contaId: 1, min: 30, max: 150, perMonth: 1 },
  { descricao: 'Roupas', categoriaId: 9, contaId: 1, min: 90, max: 350, perMonth: 1 },
]

function createRandom(seed: number) {
  let state = seed
  return () => {
    state = (state + 0x6d2b79f5) | 0
    let t = Math.imul(state ^ (state >>> 15), 1 | state)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function createSeed(): MockDatabase {
  const today = new Date()
  const random = createRandom(2026)
  const between = (min: number, max: number) =>
    Math.round((min + random() * (max - min)) * 100) / 100
  const firstMonth = startOfMonth(subMonths(today, HISTORY_MONTHS))
  let sequence = 100
  const nextId = () => ++sequence

  const transactions: MockTransaction[] = []
  const addTransaction = (
    date: Date,
    tipo: TransactionType,
    descricao: string,
    valor: number,
    categoriaId: number,
    contaId: number,
    comentario: string | null = null,
  ) => {
    if (isAfter(date, today)) return
    transactions.push({
      id: nextId(),
      valor,
      data: toApiDate(date),
      tipo,
      descricao,
      comentario,
      origem: 'NORMAL',
      recorrenciaId: null,
      categoriaId,
      contaId,
    })
  }

  for (let offset = HISTORY_MONTHS; offset >= 0; offset--) {
    const month = startOfMonth(subMonths(today, offset))
    const lastDay = endOfMonth(month).getDate()
    const randomDay = () => setDate(month, 1 + Math.floor(random() * lastDay))

    variableExpenses.forEach((expense) => {
      for (let i = 0; i < expense.perMonth; i++) {
        addTransaction(
          randomDay(),
          'DESPESA',
          expense.descricao,
          between(expense.min, expense.max),
          expense.categoriaId,
          expense.contaId,
        )
      }
    })

    if (offset % 2 === 0) {
      addTransaction(
        randomDay(),
        'RECEITA',
        'Projeto freelance',
        between(800, 2200),
        2,
        1,
        'Landing page para cliente',
      )
    }
    addTransaction(endOfMonth(month), 'RECEITA', 'Rendimento da poupança', between(60, 95), 3, 2)
  }

  const recurrence = (
    data: Omit<MockRecurrence, 'id' | 'ultimaExecucao' | 'dataFinal' | 'qtdParcelas'> &
      Partial<Pick<MockRecurrence, 'dataFinal' | 'qtdParcelas'>>,
  ): MockRecurrence => ({
    id: nextId(),
    ultimaExecucao: null,
    dataFinal: null,
    qtdParcelas: null,
    ...data,
  })

  const installmentStart = setDate(subMonths(today, 3), 15)
  const recurrences: MockRecurrence[] = [
    recurrence({
      origem: 'FIXA',
      periodicidade: 'MENSAL',
      valor: 6500,
      tipo: 'RECEITA',
      descricao: 'Salário',
      categoriaId: 1,
      contaId: 3,
      dataCadastro: toApiDate(setDate(firstMonth, 5)),
    }),
    recurrence({
      origem: 'FIXA',
      periodicidade: 'MENSAL',
      valor: 1850,
      tipo: 'DESPESA',
      descricao: 'Aluguel',
      categoriaId: 5,
      contaId: 3,
      dataCadastro: toApiDate(setDate(firstMonth, 10)),
    }),
    recurrence({
      origem: 'FIXA',
      periodicidade: 'MENSAL',
      valor: 119.9,
      tipo: 'DESPESA',
      descricao: 'Internet',
      categoriaId: 5,
      contaId: 1,
      dataCadastro: toApiDate(setDate(firstMonth, 12)),
    }),
    recurrence({
      origem: 'FIXA',
      periodicidade: 'MENSAL',
      valor: 39.9,
      tipo: 'DESPESA',
      descricao: 'Streaming',
      categoriaId: 7,
      contaId: 1,
      dataCadastro: toApiDate(setDate(firstMonth, 18)),
    }),
    recurrence({
      origem: 'PARCELADA',
      periodicidade: 'MENSAL',
      valor: 4800,
      tipo: 'DESPESA',
      descricao: 'Notebook',
      categoriaId: 9,
      contaId: 1,
      dataCadastro: toApiDate(installmentStart),
      dataFinal: toApiDate(addMonths(installmentStart, 9)),
      qtdParcelas: 10,
    }),
    recurrence({
      origem: 'PARCELADA',
      periodicidade: 'MENSAL',
      valor: 1200,
      tipo: 'DESPESA',
      descricao: 'Curso de inglês',
      categoriaId: 10,
      contaId: 1,
      dataCadastro: toApiDate(setDate(subMonths(today, 5), 8)),
      dataFinal: toApiDate(setDate(today, 8)),
      qtdParcelas: 6,
    }),
  ]

  const budgets = [0, 1].flatMap((offset) => {
    const date = subMonths(today, offset)
    const period = { mes: date.getMonth() + 1, ano: date.getFullYear() }
    return [
      { id: nextId(), categoriaId: 4, valorEstimado: 1500, ...period },
      { id: nextId(), categoriaId: 6, valorEstimado: 500, ...period },
      { id: nextId(), categoriaId: 7, valorEstimado: 150, ...period },
      { id: nextId(), categoriaId: 9, valorEstimado: 900, ...period },
    ]
  })

  const db: MockDatabase = {
    sequence,
    users: [{ id: 1, nome: 'Usuário Demo', imgUrl: null, ...DEMO_CREDENTIALS }],
    banks,
    accountTypes,
    accounts,
    categories,
    transactions,
    recurrences,
    budgets,
  }

  materializeRecurrences(db, endOfMonth(today))
  return db
}
