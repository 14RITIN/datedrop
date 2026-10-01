# DateDrop 💌

A playful, mobile-first way to turn a date invitation into a plan.

**[🚀 Live Demo](https://datedrop-server-production.up.railway.app/)**

## What is DateDrop?

DateDrop is a full-stack app for creating personal date invitations, sharing a link, and tracking the response. Recipients can accept or decline, then choose date details if interested.

## Live Demo

[Try DateDrop on Railway](https://datedrop-server-production.up.railway.app/).

**Screenshots & GIF — coming soon:** a walkthrough of the creator and recipient journeys.

## Features

- Personalized invitations with separate public sharing and private creator access.
- Native sharing through the Web Share API, with clipboard fallback.
- Guided recipient flow for interest, date type, cuisine where applicable, and date/time selection.
- Creator response tracking and a “Your DateDrops” list saved in localStorage on the same browser and origin.
- Playful interactions with keyboard, touch, and reduced-motion support.
- Persistent SQLite storage and a single production Docker container.

## User Flow

Creator creates invitation → shares link → recipient responds → chooses date details if interested → creator tracks response.

Share the public invitation link only; creator tracking links are private.

## Tech Stack

| Layer | Technologies |
| --- | --- |
| Frontend | React, TypeScript, Vite, Tailwind CSS, React Router |
| Server state | TanStack Query |
| Backend | Node.js, Express, TypeScript, Zod validation |
| Database | SQLite via better-sqlite3 |
| Tooling and hosting | npm workspaces, Docker, Docker Compose, Railway |

## Architecture

```text
Browser (React)
      │ same-origin requests
      ▼
Node.js / Express
      ├── /api/* → routes → controllers → services → repositories → SQLite
      └── React production assets + SPA routing fallback
```

One Express process serves the API and built React app from the same origin, with a fallback for React Router pages. A multi-stage Docker build compiles both npm workspaces.

## Getting Started

For local development, install Node.js 24 and npm. Clone the repository, enter its root directory, and install workspace dependencies:

```bash
npm ci
```

SQLite tables and cuisine seed data initialize on startup. For setup without local Node.js, see [Docker](#docker).

## Local Development

```bash
npm run dev
```

Open the Vite URL, normally http://localhost:5173. Vite proxies `/api` to Express on port 4000; both workspaces reload during development. The database is stored at `server/database/datedrop.db`.

Typecheck and build both workspaces:

```bash
npm run build
```

Keep the backend on port 4000 to match the development proxy. The root `.env` is used by Compose and is not automatically loaded by `npm run dev`.

## Docker

Install Docker Desktop or Docker Engine with the Compose plugin, then run:

```bash
docker compose up --build
```

Open http://localhost:8080. Compose maps local port 8080 to container port 4000. To change the local port, copy `.env.example` to `.env` and set `DATEDROP_PORT`.

Stop the application:

```bash
docker compose down
```

SQLite persists at `/app/data/datedrop.db` in the named volume `datedrop-data`, mounted at `/app/data`. The volume survives container recreation and `docker compose down`. Adding `-v` permanently deletes the volume and its invitations.

Use `npm run dev` for hot reload and Docker for production-style local usage. Rebuild the image after source changes.

## Deployment

Deploy the repository root to Railway using the existing Dockerfile and one application replica.

| Setting | Value |
| --- | --- |
| Start command | Leave unset to use the Dockerfile's `node server/dist/index.js` |
| Healthcheck path | `/api/health` |
| Persistent volume mount | `/data` |
| Service variable | `DATABASE_PATH=/data/datedrop.db` |
| Port | Let Railway supply `PORT`; Express falls back to 4000 locally |

Generate a public domain for the service. The Dockerfile already sets the production environment, listen address, and React asset path.

The persistent SQLite volume must be writable by the runtime user. The image uses non-root `node` (UID 1000). For Railway's default root-owned volume, its documented workaround is `RAILWAY_RUN_UID=0`, which runs the service as root; omit this override if the directory and database files are already writable by UID 1000. See [Railway volume permissions](https://docs.railway.com/volumes#permissions).

Keep the volume attached across deployments to retain invitations. No separate database service or pre-deploy schema command is needed.

## Accessibility

Accessibility work includes visible focus states, labeled fields, semantic buttons, selection and progress indicators, and announced status/error feedback. The app respects reduced-motion preferences and provides a stable decline option for keyboard and touch users.

Work toward WCAG 2.2 AA is ongoing; full conformance has not been verified.

## Project Structure

```text
client/src/
  pages/                  Creator and recipient journeys
  components/invitation/  Selection cards, timeline, sharing controls
  api/                    API requests
  hooks/                  Shared React hooks
  utils/                  Browser storage helpers
server/src/
  index.ts                Express startup and static serving
  database/               SQLite connection, schema, cuisine seeds
  modules/                Invitation and date-options API layers
  middleware/             Error handling
Dockerfile                Production build and runtime
docker-compose.yml       Local container and persistent volume
.env.example              Configuration guidance
```

## API Overview

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/api/health` | Application health |
| GET | `/api/date-options` | Available date types and cuisines |
| POST | `/api/invitations` | Create an invitation |
| GET | `/api/invitations/:token` | Read a public invitation |
| POST | `/api/invitations/:token/response` | Submit the recipient's response |

A private creator endpoint provides response tracking; keep creator links and tokens private.

## Roadmap

- [ ] Add screenshots and a short demo GIF.
- [ ] Expand automated coverage of creator and recipient journeys.
- [ ] Continue accessibility testing across browsers and assistive technologies.
- [ ] Document and test SQLite backup and restore procedures.
