import { Link } from 'react-router'
import { AuthLayout } from '@/features/auth/components/AuthLayout'
import { LoginForm } from '@/features/auth/components/LoginForm'

export function LoginPage() {
  return (
    <AuthLayout
      title="Entre na sua conta"
      description="Acompanhe seu saldo e as movimentações do mês."
      footer={
        <>
          Ainda não tem conta?{' '}
          <Link to="/cadastro" className="font-medium text-foreground underline underline-offset-4">
            Criar conta
          </Link>
        </>
      }
    >
      <LoginForm />
    </AuthLayout>
  )
}
