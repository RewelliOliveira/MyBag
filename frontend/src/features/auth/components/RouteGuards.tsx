import { Navigate, Outlet, useLocation } from 'react-router'
import { useIsAuthenticated } from '@/features/auth/hooks/use-session'

export function ProtectedRoute() {
  const isAuthenticated = useIsAuthenticated()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return <Outlet />
}

export function PublicOnlyRoute() {
  const isAuthenticated = useIsAuthenticated()

  if (isAuthenticated) return <Navigate to="/" replace />

  return <Outlet />
}
