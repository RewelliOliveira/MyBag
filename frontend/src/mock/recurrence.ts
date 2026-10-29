import { addDays, addMonths, addWeeks, endOfMonth, isAfter, parseISO, setDate } from 'date-fns'
import { toApiDate } from '@/lib/format'
import { nextId, type MockDatabase, type MockRecurrence } from '@/mock/db'
import type { Periodicity } from '@/types/models'

export function advanceDate(start: Date, steps: number, periodicity: Periodicity) {
  switch (periodicity) {
    case 'DIARIO':
      return addDays(start, steps)
    case 'SEMANAL':
      return addWeeks(start, steps)
    case 'ULTIMO_DIA_MES':
      return endOfMonth(addMonths(start, steps))
    case 'MENSAL': {
      const target = addMonths(start, steps)
      return setDate(target, Math.min(start.getDate(), endOfMonth(target).getDate()))
    }
  }
}

export function firstOccurrence(date: Date, periodicity: Periodicity) {
  return periodicity === 'ULTIMO_DIA_MES' ? endOfMonth(date) : date
}

function installmentValue({ valor, qtdParcelas }: MockRecurrence) {
  return qtdParcelas ? Math.floor((valor / qtdParcelas) * 100) / 100 : valor
}

function materialize(db: MockDatabase, recurrence: MockRecurrence, until: Date) {
  const start = firstOccurrence(parseISO(recurrence.dataCadastro), recurrence.periodicidade)
  const end = recurrence.dataFinal ? parseISO(recurrence.dataFinal) : null
  let step = 0
  let date = start

  if (recurrence.ultimaExecucao) {
    const last = parseISO(recurrence.ultimaExecucao)
    while (!isAfter(date, last)) date = advanceDate(start, ++step, recurrence.periodicidade)
  }

  while (!isAfter(date, until) && !(end && isAfter(date, end))) {
    db.transactions.push({
      id: nextId(db),
      valor: installmentValue(recurrence),
      data: toApiDate(date),
      tipo: recurrence.tipo,
      descricao: recurrence.descricao,
      comentario: null,
      origem: recurrence.origem,
      recorrenciaId: recurrence.id,
      categoriaId: recurrence.categoriaId,
      contaId: recurrence.contaId,
    })
    recurrence.ultimaExecucao = toApiDate(date)
    date = advanceDate(start, ++step, recurrence.periodicidade)
  }
}

export function materializeRecurrences(db: MockDatabase, until: Date) {
  db.recurrences.forEach((recurrence) => materialize(db, recurrence, until))
}
