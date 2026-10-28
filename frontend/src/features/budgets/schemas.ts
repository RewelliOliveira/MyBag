import { z } from 'zod'

export const budgetSchema = z.object({
  categoriaId: z.number({ error: 'Selecione uma categoria.' }),
  valorEstimado: z.number().positive('Informe um limite maior que zero.'),
})

export type BudgetFormValues = z.infer<typeof budgetSchema>
