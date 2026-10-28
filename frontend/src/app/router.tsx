import { createBrowserRouter } from 'react-router'
import { AppLayout } from '@/components/layout/AppLayout'
import { ProtectedRoute, PublicOnlyRoute } from '@/features/auth/components/RouteGuards'
import { AccountsPage } from '@/pages/AccountsPage'
import { BudgetsPage } from '@/pages/BudgetsPage'
import { CategoriesPage } from '@/pages/CategoriesPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { LoginPage } from '@/pages/LoginPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { ProfilePage } from '@/pages/ProfilePage'
import { ReportsPage } from '@/pages/ReportsPage'
import { SignupPage } from '@/pages/SignupPage'
import { TransactionsPage } from '@/pages/TransactionsPage'

export const router = createBrowserRouter([
  {
    element: <PublicOnlyRoute />,
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: '/cadastro', element: <SignupPage /> },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { index: true, element: <DashboardPage /> },
          { path: 'contas', element: <AccountsPage /> },
          { path: 'transacoes', element: <TransactionsPage /> },
          { path: 'orcamentos', element: <BudgetsPage /> },
          { path: 'categorias', element: <CategoriesPage /> },
          { path: 'relatorios', element: <ReportsPage /> },
          { path: 'perfil', element: <ProfilePage /> },
        ],
      },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
])
