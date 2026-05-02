# Smart Notes App

## Overview

Full-stack Smart Notes application built with React + Vite frontend and Express backend. Notes are stored and managed via the Insforge API. The monorepo uses pnpm workspaces with shared OpenAPI-generated types.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Frontend**: React 19 + Vite, Tailwind CSS, Wouter routing
- **Backend**: Express 5
- **API codegen**: Orval (from OpenAPI spec)
- **Data source**: Insforge API (proxied via Express)
- **Validation**: Zod (`zod/v4`), generated from OpenAPI

## Artifacts

- **smart-notes** (`/`) — React + Vite frontend: Landing page + Notes workspace
- **api-server** (`/api`) — Express backend proxying requests to Insforge

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/api-server run dev` — run API server locally
- `pnpm --filter @workspace/smart-notes run dev` — run frontend locally

## Environment Variables / Secrets

- `INSFORGE_API_KEY` — API key for Insforge backend (secret)
- `INSFORGE_API_BASE_URL` — Base URL for Insforge API (env var, shared)
- `GITHUB_TOKEN` — GitHub personal access token for repo push (secret)
- `SESSION_SECRET` — Session secret

## Pages

- `/` — Landing page (hero, features, how-it-works, CTA, footer)
- `/notes` — Notes workspace (create, view, delete notes)

## API Routes

- `GET /api/healthz` — Health check
- `GET /api/notes` — Fetch all notes from Insforge
- `POST /api/notes` — Create a note
- `DELETE /api/notes/:id` — Delete a note

## File Structure

```
artifacts/
  api-server/src/routes/
    health.ts     — Health check route
    notes.ts      — Notes CRUD (proxies to Insforge)
  smart-notes/src/
    pages/        — Landing.tsx, Notes.tsx, not-found.tsx
    components/
      layout/     — Navbar.tsx, Footer.tsx
      notes/      — CreateNoteForm.tsx, NoteCard.tsx
    index.css     — Indigo/slate theme (Plus Jakarta Sans + Playfair Display)
lib/
  api-spec/openapi.yaml  — OpenAPI spec (source of truth)
  api-client-react/      — Generated React Query hooks
  api-zod/               — Generated Zod schemas
README.md
```
