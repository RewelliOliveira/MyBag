import { RefreshCw, TriangleAlert } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/shared/EmptyState'

interface ErrorStateProps {
  title?: string
  onRetry: () => void
}

export function ErrorState({
  title = 'Não foi possível carregar os dados',
  onRetry,
}: ErrorStateProps) {
  return (
    <EmptyState
      icon={TriangleAlert}
      title={title}
      description="Verifique sua conexão e tente novamente."
      action={
        <Button variant="outline" onClick={onRetry}>
          <RefreshCw />
          Tentar novamente
        </Button>
      }
    />
  )
}
