import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useLocation } from 'react-router'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/features/auth/components/PasswordInput'
import { useLogin } from '@/features/auth/hooks/use-auth'
import { loginSchema, type LoginInput } from '@/features/auth/schemas'
import { DEMO_CREDENTIALS } from '@/mock/seed'

interface LocationState {
  from?: string
}

export function LoginForm() {
  const location = useLocation()
  const redirectTo = (location.state as LocationState | null)?.from ?? '/'
  const { mutate, isPending } = useLogin(redirectTo)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: DEMO_CREDENTIALS,
  })

  return (
    <form onSubmit={handleSubmit((values) => mutate(values))} noValidate>
      <FieldGroup>
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
            autoComplete="current-password"
            aria-invalid={!!errors.senha}
            {...register('senha')}
          />
          <FieldError errors={[errors.senha]} />
        </Field>

        <Button type="submit" size="lg" disabled={isPending}>
          {isPending && <Loader2 className="animate-spin" />}
          Entrar
        </Button>
      </FieldGroup>
    </form>
  )
}
