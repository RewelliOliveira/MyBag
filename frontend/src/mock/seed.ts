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

const income = (id: number, nome: string, icone: string, cor: string) => ({
  id,
  nome,
  tipo: 'RECEITA' as const,
  icone,
  cor,
})

const expense = (id: number, nome: string, icone: string, cor: string) => ({
  id,
  nome,
  tipo: 'DESPESA' as const,
  icone,
  cor,
})

const categories = [
  income(1, 'Salário', 'briefcase', '#2F9E44'),
  income(2, 'Freelance', 'laptop', '#1C7ED6'),
  income(3, 'Rendimentos', 'trending-up', '#0CA678'),
  income(4, 'Vendas', 'tag', '#7048E8'),
  income(5, 'Reembolsos', 'undo', '#1098AD'),
  income(6, 'Outras receitas', 'circle-plus', '#868E96'),
  expense(10, 'Mercado', 'shopping-cart', '#37B24D'),
  expense(11, 'Restaurantes', 'utensils', '#F76707'),
  expense(12, 'Moradia', 'house', '#7950F2'),
  expense(13, 'Contas da casa', 'zap', '#F59F00'),
  expense(14, 'Transporte', 'car', '#1C7ED6'),
  expense(15, 'Saúde', 'heart-pulse', '#E03131'),
  expense(16, 'Educação', 'graduation-cap', '#4263EB'),
  expense(17, 'Lazer', 'popcorn', '#D6336C'),
  expense(18, 'Compras', 'shopping-bag', '#AE3EC9'),
  expense(19, 'Assinaturas', 'tv', '#0C8599'),
  expense(20, 'Viagens', 'plane', '#15AABF'),
  expense(21, 'Cuidados pessoais', 'sparkles', '#F06595'),
  expense(22, 'Pets', 'paw-print', '#E67700'),
  expense(23, 'Presentes', 'gift', '#C2255C'),
  expense(24, 'Impostos e taxas', 'landmark', '#5C7CFA'),
  expense(25, 'Outras despesas', 'circle-ellipsis', '#868E96'),
]

const accounts = [
  {
    id: 1,
    descricao: 'Conta principal',
    saldoInicial: 3200,
    bancoId: 3,
    tipoContaId: 1,
    arquivada: false,
  },
  {
    id: 2,
    descricao: 'Reserva de emergência',
    saldoInicial: 12000,
    bancoId: 1,
    tipoContaId: 3,
    arquivada: false,
  },
  {
    id: 3,
    descricao: 'Conta salário',
    saldoInicial: 850,
    bancoId: 2,
    tipoContaId: 1,
    arquivada: false,
  },
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
  { descricao: 'Supermercado', categoriaId: 10, contaId: 1, min: 180, max: 420, perMonth: 3 },
  { descricao: 'Restaurante', categoriaId: 11, contaId: 1, min: 45, max: 160, perMonth: 3 },
  { descricao: 'Combustível', categoriaId: 14, contaId: 1, min: 120, max: 260, perMonth: 2 },
  {
    descricao: 'Aplicativo de transporte',
    categoriaId: 14,
    contaId: 1,
    min: 18,
    max: 55,
    perMonth: 3,
  },
  { descricao: 'Cinema', categoriaId: 17, contaId: 1, min: 40, max: 90, perMonth: 1 },
  { descricao: 'Farmácia', categoriaId: 15, contaId: 1, min: 30, max: 150, perMonth: 1 },
  { descricao: 'Roupas', categoriaId: 18, contaId: 1, min: 90, max: 350, perMonth: 1 },
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
      categoriaId: 12,
      contaId: 3,
      dataCadastro: toApiDate(setDate(firstMonth, 10)),
    }),
    recurrence({
      origem: 'FIXA',
      periodicidade: 'MENSAL',
      valor: 119.9,
      tipo: 'DESPESA',
      descricao: 'Internet',
      categoriaId: 13,
      contaId: 1,
      dataCadastro: toApiDate(setDate(firstMonth, 12)),
    }),
    recurrence({
      origem: 'FIXA',
      periodicidade: 'MENSAL',
      valor: 39.9,
      tipo: 'DESPESA',
      descricao: 'Streaming',
      categoriaId: 19,
      contaId: 1,
      dataCadastro: toApiDate(setDate(firstMonth, 18)),
    }),
    recurrence({
      origem: 'PARCELADA',
      periodicidade: 'MENSAL',
      valor: 4800,
      tipo: 'DESPESA',
      descricao: 'Notebook',
      categoriaId: 18,
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
      categoriaId: 16,
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
      { id: nextId(), categoriaId: 10, valorEstimado: 1200, ...period },
      { id: nextId(), categoriaId: 11, valorEstimado: 400, ...period },
      { id: nextId(), categoriaId: 14, valorEstimado: 500, ...period },
      { id: nextId(), categoriaId: 17, valorEstimado: 150, ...period },
      { id: nextId(), categoriaId: 18, valorEstimado: 900, ...period },
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
