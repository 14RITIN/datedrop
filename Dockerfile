# Build native SQLite dependencies on the same Node/Debian version as runtime.
FROM node:24-bookworm-slim AS dependencies
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends python3 make g++ \
    && rm -rf /var/lib/apt/lists/*
COPY package.json package-lock.json ./
COPY client/package.json ./client/package.json
COPY server/package.json ./server/package.json
# The official image includes matching headers; native builds need no extra download.
ENV npm_package_config_node_gyp_nodedir=/usr/local

FROM dependencies AS build
RUN npm ci
COPY client/ ./client/
COPY server/ ./server/
RUN npm run build

FROM dependencies AS production-dependencies
RUN npm ci --workspace server --omit=dev --include-workspace-root=false

FROM node:24-bookworm-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production \
    PORT=4000 \
    HOST=0.0.0.0 \
    DATABASE_PATH=/app/data/datedrop.db \
    CLIENT_DIST_PATH=/app/client/dist
COPY --from=production-dependencies /app/node_modules ./node_modules
COPY --from=production-dependencies /app/server ./server
COPY --from=build /app/server/dist ./server/dist
COPY --from=build /app/client/dist ./client/dist
RUN mkdir -p /app/data && chown node:node /app/data
USER node
EXPOSE 4000
CMD ["node", "server/dist/index.js"]
