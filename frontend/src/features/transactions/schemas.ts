import { z } from 'zod'

export const transactionSchema = z
  .object({
    tipo: z.enum(['RECEITA', 'DESPESA']),
    valor: z.number().positive('Informe um valor maior que zero.'),
    descricao: z.string().trim().min(1, 'Descreva a transação.'),
    categoriaId: z.number({ error: 'Selecione uma categoria.' }),
    contaId: z.number({ error: 'Selecione uma conta.' }),
    data: z.date({ error: 'Informe a data.' }),
    comentario: z.string().optional(),
    recorrencia: z.enum(['NORMAL', 'FIXA', 'PARCELADA']),
    periodicidade: z.enum(['DIARIO', 'SEMANAL', 'MENSAL', 'ULTIMO_DIA_MES']),
    qtdParcelas: z.number().optional(),
  })
  .refine(
    (values) =>
      values.recorrencia !== 'PARCELADA' ||
      (Number.isInteger(values.qtdParcelas) && (values.qtdParcelas ?? 0) >= 2),
    { message: 'Informe pelo menos 2 parcelas.', path: ['qtdParcelas'] },
  )

export type TransactionFormValues = z.infer<typeof transactionSchema>
