import type { ComponentType } from 'react'
import { createBrowserRouter } from 'react-router'
import { AppLayout } from '@/components/layout/AppLayout'
import { PageLoader } from '@/components/shared/PageLoader'
import { ProtectedRoute, PublicOnlyRoute } from '@/features/auth/components/RouteGuards'
import { RouteErrorPage } from '@/pages/RouteErrorPage'

function lazyPage<T extends Record<string, unknown>>(load: () => Promise<T>, name: keyof T) {
  return async () => ({ Component: (await load())[name] as ComponentType })
}

export const router = createBrowserRouter([
  {
    errorElement: <RouteErrorPage />,
    hydrateFallbackElement: <PageLoader />,
    children: [
      {
        element: <PublicOnlyRoute />,
        children: [
          { path: '/login', lazy: lazyPage(() => import('@/pages/LoginPage'), 'LoginPage') },
          { path: '/cadastro', lazy: lazyPage(() => import('@/pages/SignupPage'), 'SignupPage') },
        ],
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <AppLayout />,
            children: [
              {
                index: true,
                lazy: lazyPage(() => import('@/pages/DashboardPage'), 'DashboardPage'),
              },
              {
                path: 'contas',
                lazy: lazyPage(() => import('@/pages/AccountsPage'), 'AccountsPage'),
              },
              {
                path: 'transacoes',
                lazy: lazyPage(() => import('@/pages/TransactionsPage'), 'TransactionsPage'),
              },
              {
                path: 'orcamentos',
                lazy: lazyPage(() => import('@/pages/BudgetsPage'), 'BudgetsPage'),
              },
              {
                path: 'relatorios',
                lazy: lazyPage(() => import('@/pages/ReportsPage'), 'ReportsPage'),
              },
              {
                path: 'perfil',
                lazy: lazyPage(() => import('@/pages/ProfilePage'), 'ProfilePage'),
              },
            ],
          },
        ],
      },
      { path: '*', lazy: lazyPage(() => import('@/pages/NotFoundPage'), 'NotFoundPage') },
    ],
  },
])
