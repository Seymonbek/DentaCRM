# DentaCRM frontend

React 18 + TypeScript + Vite SPA. Tailwind + shadcn-style UI, TanStack Query,
Zustand, React Hook Form + Zod, Axios (with auto-refresh), React Router v6,
Recharts, Vitest.

## Local development

```bash
docker compose up frontend
# → http://localhost:5173
```

Or on the host directly:

```bash
npm install
npm run dev
```

## Scripts

| Command             | Purpose                              |
|---------------------|--------------------------------------|
| `npm run dev`       | Vite dev server on :5173             |
| `npm run build`     | Typecheck + production build         |
| `npm run preview`   | Serve the production build           |
| `npm run typecheck` | `tsc --noEmit`                       |
| `npm run test`      | Vitest (jsdom) — unit + component    |
| `npm run lint`      | ESLint                                |

## Environment

Copy `.env.example` → `.env.local` and adjust. The Vite dev server proxies
`/api` and `/media` to `VITE_API_PROXY_TARGET` (defaults to `http://backend:8000`
inside docker-compose, or `http://localhost:8000` on the host).

## Directory layout

```
src/
├── api/            Axios client + endpoint wrappers
├── app/            Router, RoleGuard, query client
├── components/
│   ├── layout/     AppShell, Sidebar, Header
│   └── ui/         Button, Input, Toast, Skeleton, EmptyState
├── lib/            utils (cn, formatters)
├── pages/          Route components
├── store/          Zustand stores (auth, ui, notification)
└── types/          Shared TS interfaces (User, Patient, ...)
```
