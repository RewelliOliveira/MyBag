# MyBag

Aplicação web de finanças pessoais para organizar contas, registrar transações, acompanhar orçamentos mensais e visualizar relatórios de gastos.

## Funcionalidades

- **Dashboard** com saldo total, contas, transações recentes e alertas de orçamento
- **Contas** bancárias e carteiras, com arquivamento que preserva o histórico
- **Transações** únicas, fixas e parceladas, agrupadas por dia e com prévia do impacto no orçamento
- **Categorias** pré-definidas com ícones
- **Orçamentos** mensais por categoria, com status de consumo
- **Relatórios** com evolução do saldo, receitas x despesas, gastos por categoria, ritmo de gastos, resultado mensal e gastos por dia da semana
- **Perfil** com foto, tema claro/escuro e modo de privacidade para ocultar valores
- Layout responsivo, com formulários em painéis laterais adaptados para telas pequenas

## Stack

React 19, TypeScript, Vite, Tailwind CSS v4, shadcn/ui, React Router, TanStack Query, React Hook Form + Zod, Chart.js e Motion.

## Como rodar

Requer Node.js 20.19+ ou 22.12+ (exigência do Vite 8).

```bash
cd frontend
npm install
npm run dev
```

A aplicação abre em `http://localhost:5173`. Use o login de demonstração `demo@mybag.com` / `123456` (já preenchido na tela de login).

Ainda não há backend: os dados vêm de um banco simulado salvo no `localStorage` do navegador. Veja o [README do frontend](frontend/README.md) para detalhes sobre os dados mockados, scripts, estrutura de pastas e convenções.

## Estrutura do repositório

```
MyBag/
└── frontend/   aplicação web (React + Vite)
```
