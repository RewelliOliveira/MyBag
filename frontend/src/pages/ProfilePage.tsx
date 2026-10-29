import { LogOut } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { ErrorState } from '@/components/shared/ErrorState'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useLogout } from '@/features/auth/hooks/use-auth'
import { ProfileForm } from '@/features/profile/components/ProfileForm'
import { useCurrentUser } from '@/features/profile/hooks/use-profile'

export function ProfilePage() {
  const { data: user, isPending, isError, refetch } = useCurrentUser()
  const logout = useLogout()

  return (
    <div className="max-w-3xl">
      <PageHeader title="Meu perfil" description="Seus dados de acesso e identificação." />

      {isPending ? (
        <Skeleton className="h-80 rounded-2xl" />
      ) : isError ? (
        <ErrorState onRetry={refetch} />
      ) : (
        <ProfileForm user={user} />
      )}

      <section className="mt-6 flex flex-col gap-4 rounded-2xl border bg-card p-5 sm:flex-row sm:items-center sm:justify-between md:p-6">
        <div>
          <h2 className="text-lg font-semibold">Sair da conta</h2>
          <p className="text-sm text-muted-foreground">Encerra a sessão neste navegador.</p>
        </div>
        <Button variant="outline" onClick={logout}>
          <LogOut />
          Sair
        </Button>
      </section>
    </div>
  )
}
