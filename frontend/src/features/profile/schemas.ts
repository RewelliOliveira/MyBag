import { z } from 'zod'

export const MAX_PHOTO_SIZE = 2 * 1024 * 1024

export const profileSchema = z.object({
  nome: z
    .string()
    .trim()
    .min(3, 'O nome precisa ter pelo menos 3 caracteres.')
    .max(50, 'O nome pode ter no máximo 50 caracteres.'),
  email: z.email('Informe um e-mail válido.'),
  foto: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_PHOTO_SIZE, 'A foto pode ter no máximo 2 MB.')
    .refine((file) => file.type.startsWith('image/'), 'Envie um arquivo de imagem.')
    .optional(),
})

export type ProfileFormValues = z.infer<typeof profileSchema>
