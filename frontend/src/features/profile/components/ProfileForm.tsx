import { useEffect } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { AvatarUpload } from '@/features/profile/components/AvatarUpload'
import { useUpdateProfile } from '@/features/profile/hooks/use-profile'
import { profileSchema, type ProfileFormValues } from '@/features/profile/schemas'
import type { User } from '@/types/models'

interface ProfileFormProps {
  user: User
}

export function ProfileForm({ user }: ProfileFormProps) {
  const updateProfile = useUpdateProfile()

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { nome: user.nome, email: user.email },
  })

  const nome = useWatch({ control, name: 'nome' })

  useEffect(() => {
    reset({ nome: user.nome, email: user.email })
  }, [user, reset])

  return (
    <form
      onSubmit={handleSubmit((values) => updateProfile.mutate(values))}
      noValidate
      className="rounded-2xl border bg-card p-5 md:p-6"
    >
      <FieldGroup>
        <Field data-invalid={!!errors.foto}>
          <Controller
            control={control}
            name="foto"
            render={({ field }) => (
              <AvatarUpload
                name={nome}
                imageUrl={user.imgUrl}
                file={field.value}
                onFileChange={(file) => field.onChange(file)}
              />
            )}
          />
          <FieldError errors={[errors.foto]} />
        </Field>

        <div className="grid gap-4 md:grid-cols-2">
          <Field data-invalid={!!errors.nome}>
            <FieldLabel htmlFor="nome">Nome</FieldLabel>
            <Input
              id="nome"
              autoComplete="name"
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
              aria-invalid={!!errors.email}
              {...register('email')}
            />
            <FieldError errors={[errors.email]} />
          </Field>
        </div>

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={!isDirty || updateProfile.isPending}
            onClick={() => reset()}
          >
            Descartar
          </Button>
          <Button type="submit" disabled={!isDirty || updateProfile.isPending}>
            {updateProfile.isPending && <Loader2 className="animate-spin" />}
            Salvar alterações
          </Button>
        </div>
      </FieldGroup>
    </form>
  )
}
