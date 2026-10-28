import { motion, useReducedMotion } from 'motion/react'
import { Outlet, useLocation } from 'react-router'
import { AppSidebar } from '@/components/layout/AppSidebar'
import { PrivacyToggle } from '@/components/shared/PrivacyToggle'
import { ThemeToggle } from '@/components/shared/ThemeToggle'
import { Separator } from '@/components/ui/separator'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'

export function AppLayout() {
  const { pathname } = useLocation()
  const reduceMotion = useReducedMotion()

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 items-center gap-2 border-b bg-background/80 px-4 backdrop-blur">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
          <div className="ml-auto flex items-center gap-1">
            <PrivacyToggle />
            <ThemeToggle />
          </div>
        </header>
        <motion.main
          key={pathname}
          initial={reduceMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="mx-auto w-full max-w-7xl flex-1 p-4 md:p-8"
        >
          <Outlet />
        </motion.main>
      </SidebarInset>
    </SidebarProvider>
  )
}
