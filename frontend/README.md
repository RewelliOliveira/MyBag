# MyBag — Frontend

Aplicação web de finanças pessoais: contas, transações (únicas, fixas e parceladas), categorias, orçamentos mensais e relatórios.

## Stack

- React 19 + TypeScript + Vite
- Tailwind CSS v4 + shadcn/ui (Radix)
- React Router (rotas com carregamento sob demanda)
- TanStack Query + Axios
- React Hook Form + Zod
- Motion para animações
- Recharts (via shadcn Chart)

## Primeiros passos

```bash
cp .env.example .env   # ajuste VITE_API_BASE_URL para o backend
npm install
npm run dev
```

| Script | O que faz |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Checagem de tipos e build de produção |
| `npm run lint` | ESLint |
| `npm run format` | Prettier (com ordenação de classes Tailwind) |

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
├── lib/          cliente HTTP, query client, formatação e utilitários
└── types/        modelos da API
```

## Convenções

- Componentes `.tsx` em PascalCase; arquivos `.ts` em kebab-case.
- Arquivos gerados pelo shadcn mantêm o nome original.
- Somente a escala padrão do Tailwind; cores e raios vêm dos tokens em `src/index.css`.
- Commits no padrão Conventional Commits.
