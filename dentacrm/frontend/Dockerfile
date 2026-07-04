# syntax=docker/dockerfile:1.6
#
# DentaCRM frontend — development image (Vite dev server).
#
# The image only needs Node + npm. In dev, the frontend/ tree is bind-mounted
# on top of /app so hot-reload works. A stub package.json is provided by T1
# so `docker compose build frontend` succeeds even before Vite is initialised
# (task T5 replaces it with the real Vite+TS scaffold).

FROM node:20.17.0-bookworm-slim AS base

ENV NODE_ENV=development \
    NPM_CONFIG_UPDATE_NOTIFIER=false \
    NPM_CONFIG_FUND=false \
    CI=1

# ---------------------------------------------------------------------------
# System dependencies (curl for healthcheck, git for optional post-install
# hooks). Kept minimal.
# ---------------------------------------------------------------------------
RUN apt-get update \
    && apt-get install -y --no-install-recommends curl git \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# ---------------------------------------------------------------------------
# Dependency layer.
# Copy the manifest first so `npm install` can be cached separately from
# source changes.
# ---------------------------------------------------------------------------
COPY package.json ./
RUN if [ -f package-lock.json ]; then \
        cp package-lock.json ./ && npm ci --no-audit --no-fund; \
    else \
        npm install --no-audit --no-fund; \
    fi

# ---------------------------------------------------------------------------
# Source code (bind-mounted in dev).
# ---------------------------------------------------------------------------
COPY . /app

# Vite default dev port.
EXPOSE 5173

# Bind to 0.0.0.0 so the port is reachable from the host through docker-compose.
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]
