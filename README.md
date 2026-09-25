# DateDrop 💌

DateDrop is a playful full-stack application for sending someone an interactive date invitation. Recipients can accept or decline, choose a date type and cuisine, and select a date and time.

The frontend uses React, TypeScript, Vite, and Tailwind CSS. The backend uses Express, TypeScript, Zod, and SQLite through better-sqlite3. Both packages are npm workspaces.

## Local development

Use Node.js 24 LTS and npm. From the repository root:

```bash
npm ci
npm run dev
```

Open the URL printed by Vite (normally http://localhost:5173). Vite proxies `/api` to Express on port 4000. Both applications reload as you edit. The local database is `server/database/datedrop.db`.

To typecheck and build both workspaces:

```bash
npm run build
```

## Docker: local production-style usage

### Prerequisites

Install Docker Desktop (macOS/Windows), or Docker Engine with the Docker Compose plugin (Linux), and start the Docker daemon. Local Node.js/npm installation is not required for Docker usage. The first build needs internet access to download the base image and dependencies.

### Build and start

Run from the repository root:

```bash
docker compose up --build
```

Open http://localhost:8080. To run in the background instead:

```bash
docker compose up --build -d
docker compose ps
docker compose logs -f datedrop
```

The multi-stage Dockerfile builds the frontend production bundle and compiles the backend. One small runtime container runs the compiled Express application as the non-root `node` user with backend production dependencies. Express serves the frontend and `/api` on the same port, including direct visits to invitation and management routes. Vite and build tools are not run in the runtime container. Hashed frontend assets receive long-lived cache headers.

This intentionally uses one application service: no reverse proxy or cross-container hostname configuration is needed. Browser API requests remain relative to the same origin. The container listens on port 4000, mapped to port 8080 on the host loopback interface for local usage. Links opened on another device will require a reachable deployment address; localhost links only work on this computer.

### Stop

```bash
docker compose down
```

This removes the container and network but retains the database volume. Use `docker compose stop` / `docker compose start` to stop and restart the existing container instead.

### SQLite persistence

Compose mounts the named volume `datedrop-data` at `/app/data`. SQLite writes `/app/data/datedrop.db` and its WAL/SHM files there. Docker normally prefixes the volume name with the Compose project name, such as `datedrop_datedrop-data`.

The volume survives restarts, container recreation, image rebuilds, and `docker compose down`. **`docker compose down -v` deletes the database volume and its invitations.** Docker's database is separate from the development database; local database files are excluded from the build context.

Keep the same Compose project name to reuse the same volume. Creator tracking links in localStorage remain browser/origin-specific: development on port 5173 and Docker on port 8080 have separate saved lists.

### Configuration

Defaults work without an environment file. To change the host port, copy `.env.example` to `.env` and set `DATEDROP_PORT`, then start Compose again. For example:

```bash
DATEDROP_PORT=8081 docker compose up --build
```

Compose reads `.env`; it is ignored by Git and excluded from Docker builds. Do not put secrets in the Dockerfile or commit them.

The backend also accepts these process environment variables (Docker sets them in the image):

| Variable | Docker value | Local default |
| --- | --- | --- |
| `PORT` | `4000` | `4000` |
| `HOST` | `0.0.0.0` | `0.0.0.0` |
| `DATABASE_PATH` | `/app/data/datedrop.db` | `server/database/datedrop.db` |
| `CLIENT_DIST_PATH` | `/app/client/dist` | Unset; frontend served by Vite |
| `NODE_ENV` | `production` | Unset |

For normal development keep the API on port 4000 to match Vite's proxy. The root `.env` is used by Compose for port substitution; `npm run dev` does not automatically load it.

### Development versus Docker

- Use `npm run dev` for editing with hot reload.
- Use `docker compose up --build` to run compiled production assets with persistent Docker-managed storage. Rebuild after source changes.
- Use `docker compose build` to validate image creation without starting the application.
