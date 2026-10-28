import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/features/auth/components/PasswordInput'
import { useSignup } from '@/features/auth/hooks/use-auth'
import { signupSchema, type SignupInput } from '@/features/auth/schemas'

export function SignupForm() {
  const { mutate, isPending } = useSignup()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: { nome: '', email: '', senha: '', confirmarSenha: '' },
  })

  return (
    <form onSubmit={handleSubmit((values) => mutate(values))} noValidate>
      <FieldGroup>
        <Field data-invalid={!!errors.nome}>
          <FieldLabel htmlFor="nome">Nome</FieldLabel>
          <Input
            id="nome"
            autoComplete="name"
            placeholder="Como devemos te chamar?"
            aria-invalid={!!errors.nome}
            {...register('nome')}
          />
          <FieldError errors={[errors.nome]} />
        </Field>

        <Field data-invalid={!!errors.email}>
          <FieldLabel htmlFor="email">E-mail</FieldLabel>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="voce@email.com"
            aria-invalid={!!errors.email}
            {...register('email')}
          />
          <FieldError errors={[errors.email]} />
        </Field>

        <Field data-invalid={!!errors.senha}>
          <FieldLabel htmlFor="senha">Senha</FieldLabel>
          <PasswordInput
            id="senha"
            autoComplete="new-password"
            aria-invalid={!!errors.senha}
            {...register('senha')}
          />
          {errors.senha ? (
            <FieldError errors={[errors.senha]} />
          ) : (
            <FieldDescription>Use pelo menos 6 caracteres.</FieldDescription>
          )}
        </Field>

        <Field data-invalid={!!errors.confirmarSenha}>
          <FieldLabel htmlFor="confirmarSenha">Confirme a senha</FieldLabel>
          <PasswordInput
            id="confirmarSenha"
            autoComplete="new-password"
            aria-invalid={!!errors.confirmarSenha}
            {...register('confirmarSenha')}
          />
          <FieldError errors={[errors.confirmarSenha]} />
        </Field>

        <Button type="submit" size="lg" disabled={isPending}>
          {isPending && <Loader2 className="animate-spin" />}
          Criar conta
        </Button>
      </FieldGroup>
    </form>
  )
}
