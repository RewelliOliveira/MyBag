import { Loader2 } from 'lucide-react'

export function PageLoader() {
  return (
    <div role="status" className="flex min-h-svh items-center justify-center text-muted-foreground">
      <Loader2 className="size-6 animate-spin" />
      <span className="sr-only">Carregando</span>
    </div>
  )
}
