import { Link } from 'react-router'
import { AuthLayout } from '@/features/auth/components/AuthLayout'
import { SignupForm } from '@/features/auth/components/SignupForm'

export function SignupPage() {
  return (
    <AuthLayout
      title="Crie sua conta"
      description="Leva menos de um minuto. Depois é só cadastrar suas contas."
      footer={
        <>
          Já tem conta?{' '}
          <Link to="/login" className="font-medium text-foreground underline underline-offset-4">
            Entrar
          </Link>
        </>
      }
    >
      <SignupForm />
    </AuthLayout>
  )
}
