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

### Reset the Docker database

This permanently deletes all invitations in the Docker database (not the local development database):

```bash
docker compose down -v
docker compose up --build
```

### Configuration

Defaults work without an environment file. To change the host port, copy `.env.example` to `.env` and set `DATEDROP_PORT`, then start Compose again. For example:

```bash
DATEDROP_PORT=8081 docker compose up --build
```

Compose reads `.env`; it is ignored by Git and excluded from Docker builds. Do not put secrets in the Dockerfile or commit them.

The backend also accepts these process environment variables:

| Variable | Docker value | Local default |
| --- | --- | --- |
| `PORT` | Unset; server falls back to `4000` | `4000` |
| `HOST` | `0.0.0.0` | `0.0.0.0` |
| `DATABASE_PATH` | `/app/data/datedrop.db` | `server/database/datedrop.db` |
| `CLIENT_DIST_PATH` | `/app/client/dist` | Unset; frontend served by Vite |
| `NODE_ENV` | `production` | Unset |

For normal development keep the API on port 4000 to match Vite's proxy. The root `.env` is used by Compose for port substitution; `npm run dev` does not automatically load it.

### Development versus Docker

- Use `npm run dev` for editing with hot reload.
- Use `docker compose up --build` to run compiled production assets with persistent Docker-managed storage. Rebuild after source changes.
- Use `docker compose build` to validate image creation without starting the application.

## Deployment

Deploy one Railway service from this repository, using the repository root (`/`) as the Root Directory. Railway detects the root `Dockerfile`; leave custom build/start commands unset to use its build stages and `node server/dist/index.js` command. React and `/api` share the same Express service; no frontend API URL or second web server is needed.

Before deploying, attach a persistent Railway volume at **`/data`** and set this service variable:

```dotenv
DATABASE_PATH=/data/datedrop.db
```

Leave `PORT` unset in Railway's Variables UI so Railway supplies it automatically. Express listens on that port, falling back to 4000 only when no `PORT` is provided. The Dockerfile already supplies `NODE_ENV=production`, `HOST=0.0.0.0`, and `CLIENT_DIST_PATH=/app/client/dist`; do not duplicate them manually. Do not set `DATEDROP_PORT` on Railway; it is only for local Compose. See [Railway's port guidance](https://docs.railway.com/networking/troubleshooting/application-failed-to-respond).

**Volume permissions:** the current Dockerfile uses `USER node` (UID/GID 1000), while Railway mounts volumes as root. For a default Railway volume, also set **`RAILWAY_RUN_UID=0`**, following [Railway's volume permissions documentation](https://docs.railway.com/volumes#permissions). This explicitly runs the Railway service as root to permit SQLite writes; it is not required by DateDrop itself. Omit the override if the mounted directory and existing database/WAL files are already writable by UID/GID 1000. The image has no startup permission-fixing entrypoint, and build-time `chown` cannot fix a volume mounted later. Local Compose continues running as `node`. Schema creation and cuisine seeding happen at startup; no pre-deploy database command is needed.

In Railway Settings, set **Healthcheck Path** to **`/api/health`**, keep a single replica for this SQLite service, and generate a public domain using the automatically detected port. If a target-port override is present, it must match Railway's supplied `PORT`, not the local fallback of 4000. The public health URL is `https://<your-domain>/api/health`. Direct visits to `/invite/:token` and `/manage/:token` serve the React app; unknown API/asset requests remain 404s.

SQLite and its WAL files persist under `/data` across deployments. Keep the volume attached; deleting it deletes the invitations. Normal local development still uses `npm run dev` and `server/database/datedrop.db`.

References: [Railway Dockerfile deployment](https://docs.railway.com/builds/dockerfiles), [health checks](https://docs.railway.com/deployments/healthchecks).
