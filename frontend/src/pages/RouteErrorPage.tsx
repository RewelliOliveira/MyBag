import { RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function RouteErrorPage() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-4 p-6 text-center">
      <h1 className="text-2xl font-bold">Algo deu errado</h1>
      <p className="max-w-sm text-muted-foreground">
        Encontramos um erro inesperado ao abrir esta página. Recarregue para tentar de novo.
      </p>
      <Button onClick={() => window.location.reload()}>
        <RefreshCw />
        Recarregar página
      </Button>
    </main>
  )
}
