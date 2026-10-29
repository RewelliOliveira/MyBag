# MyBag — Frontend

Aplicação web de finanças pessoais: contas, transações (únicas, fixas e parceladas), categorias pré-definidas com ícones, orçamentos mensais e relatórios.

## Stack

- React 19 + TypeScript + Vite
- Tailwind CSS v4 + shadcn/ui (Radix)
- React Router (rotas com carregamento sob demanda)
- TanStack Query
- React Hook Form + Zod
- Motion para animações
- Recharts (via shadcn Chart)

## Primeiros passos

```bash
npm install
npm run dev
```

| Script | O que faz |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Checagem de tipos e build de produção |
| `npm run lint` | ESLint |
| `npm run format` | Prettier (com ordenação de classes Tailwind) |

## Dados mockados

Ainda não há backend hospedado, então os serviços em `src/features/*/services` leem e gravam em um banco simulado em `src/mock`, com latência artificial. Os dados são gerados relativos à data atual (últimos 6 meses) e ficam salvos no `localStorage` (`mybag:mock-db:v1`); apague essa chave para restaurar a carga inicial.

Login de demonstração: `demo@mybag.com` / `123456` (já preenchido na tela de login).

## Estrutura

```
src/
├── app/          App, providers e rotas
├── components/
│   ├── ui/       componentes do shadcn/ui (nomes originais do CLI)
│   ├── layout/   shell da aplicação: sidebar, header, cabeçalho de página
│   └── shared/   componentes reutilizáveis entre features
├── features/     uma pasta por domínio (auth, accounts, categories, transactions,
│                 budgets, reports, dashboard, profile) com components/, hooks/,
│                 services/ e schemas.ts
├── pages/        páginas das rotas, compostas a partir das features
├── hooks/        hooks globais
├── lib/          query client, erros, formatação e utilitários
├── mock/         banco simulado: carga inicial, recorrências e helpers de requisição
└── types/        modelos da API
```

## Convenções

- Componentes `.tsx` em PascalCase; arquivos `.ts` em kebab-case.
- Arquivos gerados pelo shadcn mantêm o nome original.
- Somente a escala padrão do Tailwind; cores e raios vêm dos tokens em `src/index.css`.
- Commits no padrão Conventional Commits.
