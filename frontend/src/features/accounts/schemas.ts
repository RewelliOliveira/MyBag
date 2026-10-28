import { z } from 'zod'

export const accountSchema = z.object({
  descricao: z.string().trim().min(1, 'Dê um nome para a conta.'),
  saldo: z.number(),
  bancoId: z.number({ error: 'Selecione o banco.' }),
  tipoContaId: z.number({ error: 'Selecione o tipo de conta.' }),
  data: z.date(),
})

export type AccountFormValues = z.infer<typeof accountSchema>
