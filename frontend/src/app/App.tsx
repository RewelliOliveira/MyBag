import { Providers } from '@/app/Providers'
import { Logo } from '@/components/shared/Logo'
import { ThemeToggle } from '@/components/shared/ThemeToggle'

export function App() {
  return (
    <Providers>
      <main className="flex min-h-svh items-center justify-center gap-4">
        <Logo />
        <ThemeToggle />
      </main>
    </Providers>
  )
}
