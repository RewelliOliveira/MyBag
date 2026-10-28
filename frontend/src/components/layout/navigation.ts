import { ArrowLeftRight, ChartPie, House, Landmark, Target, type LucideIcon } from 'lucide-react'

export interface NavigationItem {
  title: string
  to: string
  icon: LucideIcon
}

export const navigationItems: NavigationItem[] = [
  { title: 'Visão geral', to: '/', icon: House },
  { title: 'Transações', to: '/transacoes', icon: ArrowLeftRight },
  { title: 'Contas', to: '/contas', icon: Landmark },
  { title: 'Orçamentos', to: '/orcamentos', icon: Target },
  { title: 'Relatórios', to: '/relatorios', icon: ChartPie },
]
