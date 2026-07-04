# syntax=docker/dockerfile:1.6
#
# DentaCRM frontend — development image (Vite dev server).
#
# In dev, the frontend/ tree is bind-mounted on top of /app so hot-reload
# works. The image only needs Node + npm. Production build is produced by
# ``docker compose -f docker-compose.prod.yml build`` in a later task.

FROM node:20.17.0-bookworm-slim AS base

ENV NODE_ENV=development \
    NPM_CONFIG_UPDATE_NOTIFIER=false \
    NPM_CONFIG_FUND=false \
    CI=1

# System dependencies (curl for healthcheck).
RUN apt-get update \
    && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Dependency layer — copy manifest first so npm install caches separately.
COPY package.json ./
RUN if [ -f package-lock.json ]; then \
        cp package-lock.json ./ && npm ci --no-audit --no-fund; \
    else \
        npm install --no-audit --no-fund; \
    fi

# Source code (bind-mounted in dev).
COPY . /app

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]
