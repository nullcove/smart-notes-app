# Smart Notes — Monorepo

## Overview

Full-stack note-taking application with two frontends and a shared Express backend. Notes are persisted via the Insforge API.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.8
- **Backend**: Express 5 (`artifacts/api-server`) — proxies all Insforge calls, port 8080
- **Data source**: Insforge (cloud Postgres-compatible BaaS)
- **Validation**: Zod, OpenAPI-generated schemas

## Artifacts

| Artifact | Path | Stack | Purpose |
|---|---|---|---|
| `smart-notes` | `/` | React 19 + Vite | Landing page + basic Notes workspace |
| `api-server` | `/api` | Express 5 | Shared backend for all frontends |
| `notes-next` | `/notes-next/` | Next.js 15 App Router | Standard Notes-style 3-panel clone |
| `mockup-sandbox` | `/__mockup` | Vite | Canvas component preview server |

## Insforge Tables

| Table | Columns |
|---|---|
| `notes` | id, title, content, starred, archived, trashed, created_at, updated_at |
| `tags` | id, name, color, created_at, updated_at |

## API Routes (Express — `/api`)

- `GET /api/healthz` — health check
- `GET /api/notes` — list all notes (ordered by updated_at desc)
- `POST /api/notes` — create note `{ title, content }`
- `PATCH /api/notes/:id` — update note `{ title?, content?, starred?, archived?, trashed? }`
- `DELETE /api/notes/:id` — hard delete note
- `GET /api/tags` — list all tags
- `POST /api/tags` — create tag `{ name, color? }`
- `DELETE /api/tags/:id` — delete tag
- `GET /api/ai/keys` — list AI provider keys
- `POST /api/ai/keys` — save API key for a provider
- `DELETE /api/ai/keys/:provider` — delete API key
- `GET /api/ai/settings` — get AI settings
- `PATCH /api/ai/settings` — update AI settings
- `GET /api/ai/memory` — get AI memory entries
- `POST /api/ai/chat` — AI chat (multi-provider routing)

## Key Commands

```bash
pnpm run typecheck                          # full typecheck
pnpm --filter @workspace/api-spec run codegen  # regenerate hooks + Zod schemas
pnpm --filter @workspace/api-server run dev    # run API server
pnpm --filter @workspace/smart-notes run dev   # run smart-notes frontend
pnpm --filter @workspace/notes-next run dev    # run Next.js frontend
```

## Environment Variables / Secrets

- `INSFORGE_API_KEY` — API key for Insforge (secret)
- `INSFORGE_ANON_KEY` — Insforge anon JWT (secret)
- `INSFORGE_API_BASE_URL` — `https://smvf3cap.ap-southeast.insforge.app`
- `GITHUB_TOKEN` — GitHub PAT for repo push (secret)
- `SESSION_SECRET` — session secret

## File Structure

```
artifacts/
  api-server/src/
    routes/
      health.ts      — healthcheck
      notes.ts       — Notes CRUD + PATCH (starred/archived/trashed)
      tags.ts        — Tags CRUD
      ai.ts          — AI keys, settings, memory, chat routes
    lib/
      aiRouter.ts    — Multi-provider AI router (OpenAI/Anthropic/Google/OpenRouter)
      aiDb.ts        — SQLite AI database (memories, conversations, keys, settings)
      aiMemory.ts    — Memory engine (store + retrieve user memories)
  smart-notes/src/
    pages/           — Landing.tsx, Notes.tsx
    components/      — Navbar, Footer, NoteCard, CreateNoteForm
  notes-next/
    app/             — Next.js App Router (layout.tsx, page.tsx, globals.css)
    components/
      AppShell.tsx   — 3-panel layout orchestrator
      Sidebar.tsx    — Nav sidebar with 3D clay icons
      ClayIcons.tsx  — 3D clay/soft SVG icon library (14 icons)
      NoteList.tsx   — Note list with search and filters
      Editor.tsx     — Note editor header + controls
      RichTextEditor.tsx — Tiptap-based rich text editor, 2-row organized toolbar
      ChatBot.tsx    — AI chatbot panel (backend-wired)
      AIKeyManager.tsx  — Modal for managing AI provider API keys
      AIErrorPopup.tsx  — Error popup for AI failures
    lib/
      api.ts         — Fetch helpers for notes/tags
      ai-api.ts      — Frontend AI API client
      providers.tsx  — React Query + theme providers
    next.config.ts   — basePath /notes-next/, rewrites /api → Express
lib/
  api-spec/openapi.yaml   — OpenAPI spec (source of truth)
  api-client-react/       — Generated React Query hooks
  api-zod/                — Generated Zod schemas
```

## notes-next Features

- 3-panel layout: left sidebar / note list / editor
- Views: Notes, Starred, Archived, Trash
- Tags: create and delete tags via sidebar
- Note actions: star, archive, trash, restore, delete forever
- Full-text search across title + content
- Auto-save with 600 ms debounce
- Dark / light mode toggle
- Responsive note count and date formatting
- **3D Clay SVG icons** in sidebar nav (14 custom clay-style icons)
- **2-row organized editor toolbar**: Row 1 (History | Type | Format | Color | Align), Row 2 (Lists | Block | Insert)
- **AI Chatbot** with multi-provider routing (OpenAI / Anthropic / Google / OpenRouter)
- **AI Key Manager** for storing provider API keys
- **AI Memory** — persists user context across sessions

## ClayIcons Reference

All icons in `artifacts/notes-next/components/ClayIcons.tsx`:

| Export | Color | Used for |
|---|---|---|
| `ClayNotes` | violet | Notes nav item |
| `ClayPin` | coral/red | Pinned nav item |
| `ClayStar` | amber | Starred nav item |
| `ClayArchive` | sky blue | Archived nav item |
| `ClayTrash` | rose/red | Trash nav item |
| `ClayHash` | emerald | Tags section header |
| `ClaySettings` | slate | AI Settings footer button |
| `ClayKeyboard` | indigo | Shortcuts footer button |
| `ClayHome` | violet | Back to Home footer button |
| `ClaySun` | yellow | Light mode toggle |
| `ClayMoon` | blue | Dark mode toggle |
| `ClayBook` | indigo | Brand logo |
| `ClayPlus` | teal | Add tag button |
| `ClayBrain` | fuchsia | AI chatbot icon |
| `ClaySparkles` | purple | Magic/AI sparkles |
| `ClayCollapse` | slate | Collapse sidebar |
