import { Link } from 'react-router'
import { Button } from '@/components/ui/button'

export function NotFoundPage() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-4 p-6 text-center">
      <p className="money text-8xl font-bold text-primary">404</p>
      <h1 className="text-2xl font-bold">Página não encontrada</h1>
      <p className="max-w-sm text-muted-foreground">
        O endereço pode ter mudado ou não existe mais.
      </p>
      <Button asChild>
        <Link to="/">Voltar para o início</Link>
      </Button>
    </main>
  )
}
