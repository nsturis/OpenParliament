# Open Parliament (Doha)

Danish parliamentary transparency platform making Folketinget data accessible through semantic search and structured browsing. Fork of Parlamentet.dk.

## Architecture

**Frontend**: Nuxt 3 (SPA mode, `ssr: false`) + Vue 3 + Tailwind CSS + Nuxt UI
**Backend**: Nuxt server API routes (h3) + Drizzle ORM
**Database**: PostgreSQL 16 with pgvector extension (768-dim embeddings)
**LLM Service**: FastAPI (Python) using Danish BERT (`Maltehb/danish-bert-botxo`)
**Runtime**: Bun (package manager + runtime)
**Data Source**: Folketingets Åbne Data (ODA) API — `oda.ft.dk`

### Docker Services

| Service | Purpose | Port |
|---------|---------|------|
| `pgsqldb` | PostgreSQL 16 + pgvector | 5432 |
| `MSSQLDB` | SQL Server 2019 (source for migration) | 1433 |
| `oda_pg` | pgloader (MSSQL → PostgreSQL migration) | — |
| `fastapi` | LLM embedding service | 8000 |
| `nuxt_app` | Nuxt frontend | 3000 |

## Environment Variables

Create `.env` in project root:

```env
# PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=oda
DB_USER=postgres
DB_PASSWORD=root

# Docker PostgreSQL
POSTGRES_USER=postgres
POSTGRES_PASSWORD=root
POSTGRES_DB=oda

# MSSQL (migration only)
MS_DB_USER=sa
MS_DB_PASSWORD=1234AbCd!

# LLM Service
LLM_SERVICE_URL=http://127.0.0.1:8000
```

## Quick Start

```bash
# Install dependencies
bun install

# Start PostgreSQL (requires Docker)
docker compose up -d pgsqldb

# Start LLM service (requires Docker or local Python)
docker compose up -d fastapi

# Start dev server
bun dev
```

## Project Structure

```
server/
  api/             # Nuxt API routes (h3 event handlers)
    db.ts          # Drizzle ORM + pg Pool connection
    search.ts      # Semantic search endpoint
    sag/           # Case (legislation) endpoints
    actors/        # Actor (politician/party/committee) endpoints
    meeting/       # Meeting endpoints
    ugeplan/       # Weekly schedule
  database/
    schema.ts      # Drizzle schema (all tables)
    relations.ts   # Drizzle relation definitions
    *.sql          # Generated migrations
  repositories/    # Data access layer (BaseRepository pattern)
  oda/             # ODA API sync logic + cron scheduler
  parser/          # Meeting XML parser
  services/        # Business logic (search service)
  llm/             # LLM integration helpers

pages/             # Nuxt file-based routing
  index.vue        # Home — search bar
  sager/           # Cases listing + detail
  actors.vue       # Actor listing
  meeting/         # Meeting detail
  ugeplan/         # Weekly schedule

components/        # Vue components (27 total)
composables/       # useMetadata, useSagDocuments, useAktorer
stores/            # Pinia stores (main, meta, sag, electionQuiz)
plugins/           # vue-query setup
layouts/           # Default layout with HeaderMenu
types/             # TypeScript interfaces

llm_service/       # FastAPI Python service
  main.py          # Endpoints: /process_document_embeddings, /get_embedding, /health

scripts/           # Data pipeline scripts
  parseMeetings.ts # Parse meeting XML → DB
  processDocuments.ts # Multi-threaded document processing
  worker.ts        # Worker thread for document processing

config/            # Setup and migration scripts
```

## Database Schema (Key Tables)

### Parliamentary Structure
- **periode** — Parliamentary periods/sessions
- **møde** — Meetings (date, location, type)
- **dagsordenspunkt** — Agenda items

### Legislation
- **sag** — Cases/bills (type, status, period, voting conclusion)
- **sagstrin** — Case steps in legislative process
- **sagstype** — Case types (L=Law, B=Decision, etc.)
- **sagsstatus** — Case status

### Actors
- **aktør** — People, parties, committees, ministries
- **aktørtype** — Actor types
- **aktørAktør** — Actor-to-actor relationships (party membership)

### Documents & Files
- **dokument** — Parliamentary documents
- **fil** — Files (PDF, HTML) attached to documents
- **filContent** — Extracted text chunks + 768-dim embeddings

### Voting
- **afstemning** — Votes on cases
- **stemme** — Individual votes by actors

### Speeches (custom, not from ODA backup)
- **taleSegmentRaw** — Original speech segments
- **taleSegmentChunk** — Speech chunks + embeddings
- **taleSegment** — Legacy speech segments with embeddings

### System
- **idmap** — ODA ID ↔ internal ID mapping
- **synclogger** — Sync tracking per entity

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/sag?id=X` | Single case with relations |
| GET | `/api/sag/list` | Paginated case list (filters: typeid, periodeid, search) |
| GET | `/api/sag/documents?id=X` | Case documents |
| GET | `/api/sag/partyStances?id=X` | Party voting positions |
| GET | `/api/sag/types` | All case types |
| GET | `/api/actors` | Actors with filters |
| GET | `/api/actors/by-period` | Actors grouped by type per period |
| GET | `/api/search?q=X` | Semantic vector search (docs + speeches) |
| GET | `/api/meeting?id=X` | Meeting details |
| GET | `/api/perioder` | Parliamentary periods |
| GET | `/api/sagsstatus` | Case statuses |
| GET | `/api/ugeplan` | Weekly schedule |
| GET | `/api/randomSag` | Random case |
| GET | `/api/randomQuestion` | Random question |

The Nuxt config also proxies `/llm/**` → `http://127.0.0.1:8000/**`.

## Data Pipeline

1. **MSSQL backup** (`oda.bak`) → restored in Docker SQL Server
2. **pgloader** migrates MSSQL → PostgreSQL (`loadfile.load`)
3. **ODA sync** (`server/oda/scheduler.ts`) runs hourly cron to pull incremental updates from `oda.ft.dk/api`
4. **Meeting parser** (`scripts/parseMeetings.ts`) parses XML transcripts → speeches → embeddings
5. **Document processor** (`scripts/processDocuments.ts`) extracts text from PDFs/HTML → embeddings via FastAPI

## Code Conventions

- Composition API with `<script setup>` in all Vue components
- TypeScript everywhere, `strict: true`
- Kebab-case for file names, PascalCase for component names in templates
- Drizzle ORM for all database access (no raw SQL in app code)
- Pinia for global state, Vue reactivity for local state
- TanStack Vue Query for server state caching (5 min stale time)
- Danish language UI (`lang: da`)

## Commands

```bash
bun dev                    # Dev server (port 3000)
bun build                  # Production build
bun test                   # Run Vitest
bun lint                   # ESLint
bun drizzle:generate       # Generate DB migrations
bun parse-meetings         # Parse meeting XML files
bun process-documents      # Process document files
bun update-embeddings      # Regenerate embeddings
bun new:page               # Scaffold new page (hygen)
bun new:component          # Scaffold new component (hygen)
```

## Important Notes

- The `assets` directory is gitignored (contains large scraped PDFs/HTML)
- `.env` is gitignored — must be created manually
- The PostgreSQL Docker image builds pgvector v0.5.0 from source
- Embedding dimension is 768 (Danish BERT output size)
- The LLM service imports `mlx_lm` (Apple Silicon ML) — may fail on non-Mac; the import is only used for a commented-out Ministral 8B feature
- Column names use Danish: `opdateringsdato`, `mødeid`, `aktørid`, etc.
- Table names are mixed-case from the MSSQL migration: `Aktør`, `Møde`, `SagAktør`, etc.
