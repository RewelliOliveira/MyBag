import { z } from 'zod'

export const loginSchema = z.object({
  email: z.email('Informe um e-mail válido.'),
  senha: z.string().min(1, 'Informe sua senha.'),
})

export const signupSchema = z
  .object({
    nome: z
      .string()
      .trim()
      .min(3, 'O nome precisa ter pelo menos 3 caracteres.')
      .max(50, 'O nome pode ter no máximo 50 caracteres.'),
    email: z.email('Informe um e-mail válido.'),
    senha: z.string().min(6, 'A senha precisa ter pelo menos 6 caracteres.'),
    confirmarSenha: z.string(),
  })
  .refine((data) => data.senha === data.confirmarSenha, {
    message: 'As senhas não coincidem.',
    path: ['confirmarSenha'],
  })

export type LoginInput = z.infer<typeof loginSchema>
export type SignupInput = z.infer<typeof signupSchema>
