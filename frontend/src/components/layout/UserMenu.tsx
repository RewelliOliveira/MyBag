import { ChevronsUpDown, LogOut, UserRound } from 'lucide-react'
import { Link } from 'react-router'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { Skeleton } from '@/components/ui/skeleton'
import { useLogout } from '@/features/auth/hooks/use-auth'
import { useCurrentUser } from '@/features/profile/hooks/use-current-user'
import { getInitials } from '@/lib/format'

export function UserMenu() {
  const { data: user, isPending } = useCurrentUser()
  const { isMobile } = useSidebar()
  const logout = useLogout()

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent">
              <Avatar className="size-8 rounded-lg">
                <AvatarImage src={user?.imgUrl ?? undefined} alt="" />
                <AvatarFallback className="rounded-lg">{getInitials(user?.nome)}</AvatarFallback>
              </Avatar>
              <span className="grid flex-1 text-left text-sm leading-tight">
                {isPending ? (
                  <>
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="mt-1 h-3 w-32" />
                  </>
                ) : (
                  <>
                    <span className="truncate font-medium">{user?.nome}</span>
                    <span className="truncate text-xs text-muted-foreground">{user?.email}</span>
                  </>
                )}
              </span>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent side={isMobile ? 'bottom' : 'right'} align="end" className="w-56">
            <DropdownMenuLabel className="truncate">{user?.nome}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/perfil">
                <UserRound />
                Meu perfil
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem variant="destructive" onSelect={logout}>
              <LogOut />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
