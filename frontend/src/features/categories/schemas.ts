import { z } from 'zod'

export const categorySchema = z.object({
  nome: z.string().trim().min(1, 'Dê um nome para a categoria.').max(40, 'Use até 40 caracteres.'),
  tipo: z.enum(['RECEITA', 'DESPESA'], { error: 'Escolha se é receita ou despesa.' }),
  cor: z.string().min(1, 'Escolha uma cor.'),
})

export type CategoryFormValues = z.infer<typeof categorySchema>
