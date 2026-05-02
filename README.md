# Smart Notes App

A full-stack Smart Notes application built with React + Vite, Express, and the Insforge backend.

## Features

- **Landing Page** — Hero section, features grid, how-it-works steps, CTA, and footer
- **Notes Workspace** — Create, view, and delete notes with real-time updates
- **Insforge Backend** — Notes are stored and managed via the Insforge API
- **Modern UI** — Indigo/slate palette, responsive design, smooth animations
- **Clean Architecture** — Monorepo with shared types, OpenAPI spec, and generated hooks

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite, Tailwind CSS |
| Routing | Wouter |
| API Hooks | Orval (generated from OpenAPI) |
| Backend | Express 5 (Node.js) |
| API Spec | OpenAPI 3.1 |
| Data Source | Insforge API |
| Package Manager | pnpm (workspace monorepo) |

## Project Structure

```
├── artifacts/
│   ├── api-server/          # Express backend
│   │   └── src/routes/
│   │       ├── health.ts    # Health check
│   │       └── notes.ts     # Notes CRUD (proxies to Insforge)
│   └── smart-notes/         # React + Vite frontend
│       └── src/
│           ├── pages/       # Landing, Notes, NotFound
│           ├── components/  # Layout + Notes components
│           └── index.css    # Theme (indigo/slate palette)
├── lib/
│   ├── api-spec/            # OpenAPI YAML spec
│   ├── api-client-react/    # Generated React Query hooks
│   └── api-zod/             # Generated Zod schemas
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 9+

### Environment Variables

Set the following environment variables (or secrets):

```
INSFORGE_API_KEY=your_insforge_api_key
INSFORGE_API_BASE_URL=https://your-insforge-instance.insforge.app
```

### Install dependencies

```bash
pnpm install
```

### Run in development

The app uses Replit workflows. Two services run:

- **API Server** — `pnpm --filter @workspace/api-server run dev`
- **Frontend** — `pnpm --filter @workspace/smart-notes run dev`

### Regenerate API types

After editing `lib/api-spec/openapi.yaml`:

```bash
pnpm --filter @workspace/api-spec run codegen
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/healthz` | Health check |
| GET | `/api/notes` | Fetch all notes |
| POST | `/api/notes` | Create a note |
| DELETE | `/api/notes/:id` | Delete a note |

## Notes Data Model

```typescript
interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
}
```

## Pages

- `/` — Landing page with product overview
- `/notes` — Notes workspace (create, view, delete)

## License

MIT
