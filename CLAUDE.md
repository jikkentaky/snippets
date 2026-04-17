# Snippet Vault — Claude Code Context

## Stack
- **Backend**: NestJS 11 · Mongoose 11 · MongoDB · TypeScript · Port 3001
- **Frontend**: Next.js 16.2.4 (App Router) · React 19 · Tailwind CSS 4 · TypeScript · Port 3000

## Critical Gotchas

### Backend — nodenext module resolution
`backend/tsconfig.json` uses `"module": "nodenext"`. All relative imports between local files **must use `.js` extensions**, even though source files are `.ts`:
```ts
import { Snippet } from './snippet.schema.js';  // correct
import { Snippet } from './snippet.schema';       // BROKEN at runtime
```

### Frontend — Next.js 16 params is a Promise
`params` and `searchParams` in page components are now **Promises**. In Client Components (`'use client'`), unwrap with React `use()`:
```tsx
const { id } = use(params);   // correct for Client Components
// do NOT await — Client Components cannot be async functions
```

### Frontend — Tailwind CSS 4
Already configured via `@import "tailwindcss"` in `globals.css`. Do **not** create `tailwind.config.js` — it is not needed and will conflict.

### Frontend — API cache
All `fetch` calls in `src/lib/api.ts` use `cache: 'no-store'` to bypass Next.js server fetch caching. This is intentional.

## Project Structure
```
backend/src/
  main.ts                        # CORS, ValidationPipe, port 3001
  app.module.ts                  # ConfigModule, MongooseModule, SnippetsModule
  snippets/
    snippet.schema.ts            # Mongoose schema + text index
    dto/create-snippet.dto.ts
    dto/update-snippet.dto.ts
    snippets.service.ts          # CRUD + FilterQuery logic
    snippets.controller.ts       # REST endpoints
    snippets.module.ts

frontend/src/
  lib/types.ts                   # Shared TypeScript interfaces
  lib/api.ts                     # Typed fetch wrapper
  app/
    page.tsx                     # List page (Client Component)
    snippets/[id]/page.tsx       # Detail/edit page (Client Component)
  components/
    SnippetCard.tsx
    SnippetForm.tsx              # Used for both create and edit
    Modal.tsx
    ConfirmDialog.tsx
    SearchBar.tsx                # 300ms debounce
    TagFilter.tsx
    Pagination.tsx
```

## Running Dev
```bash
# Terminal 1
cd backend && npm run start:dev

# Terminal 2
cd frontend && npm run dev
```
