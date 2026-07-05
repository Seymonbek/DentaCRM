# =============================================================================
# DentaCRM — one-stop task runner.
#
# All commands are safe to invoke from the ``dentacrm/`` folder. They wrap the
# canonical venv-based invocations documented in ``README.md`` so that both
# humans and the AI orchestrator use identical commands without falling into
# the "bare ``python`` is not on PATH" trap (see plan task 101).
#
# Usage:
#   make help                 # list targets
#   make backend-test         # run pytest via .venv
#   make frontend-test        # run vitest
#   make frontend-e2e         # run Playwright (chromium)
#   make lint                 # ruff + eslint
#   make check                # everything CI runs, sequentially
#   make compose-up           # docker compose up --build
# =============================================================================

BACKEND_DIR := backend
FRONTEND_DIR := frontend
VENV_PY := $(BACKEND_DIR)/.venv/bin/python
VENV_PIP := $(BACKEND_DIR)/.venv/bin/pip

.DEFAULT_GOAL := help
.PHONY: help \
	backend-venv backend-install backend-migrate backend-test backend-lint \
	backend-shell backend-check \
	frontend-install frontend-test frontend-e2e frontend-e2e-install \
	frontend-lint frontend-typecheck frontend-build \
	lint test check clean compose-up compose-down compose-prod-config

help:
	@echo "DentaCRM — Makefile targets:"
	@echo "  backend-venv         Create .venv (once)"
	@echo "  backend-install      pip install -r requirements/dev.txt"
	@echo "  backend-migrate      manage.py migrate"
	@echo "  backend-test         pytest via .venv"
	@echo "  backend-lint         ruff check via .venv"
	@echo "  backend-check        manage.py check"
	@echo "  frontend-install     npm ci"
	@echo "  frontend-test        vitest run"
	@echo "  frontend-e2e-install playwright install --with-deps chromium"
	@echo "  frontend-e2e         playwright test"
	@echo "  frontend-lint        eslint"
	@echo "  frontend-typecheck   tsc --noEmit"
	@echo "  frontend-build       vite build"
	@echo "  lint                 backend-lint + frontend-lint"
	@echo "  test                 backend-test + frontend-test"
	@echo "  check                Everything CI runs, sequentially"
	@echo "  compose-up           docker compose up --build"
	@echo "  compose-down         docker compose down"
	@echo "  compose-prod-config  Validate prod compose (no run)"
	@echo "  clean                Remove caches (.pytest_cache, .ruff_cache, node_modules build cache)"

# -- Backend -----------------------------------------------------------------

$(VENV_PY):
	cd $(BACKEND_DIR) && python3.12 -m venv .venv

backend-venv: $(VENV_PY)

backend-install: backend-venv
	$(VENV_PIP) install --upgrade "pip==24.2" "setuptools==75.1.0" "wheel==0.44.0"
	$(VENV_PIP) install -r $(BACKEND_DIR)/requirements/dev.txt

backend-migrate: backend-venv
	cd $(BACKEND_DIR) && ../$(VENV_PY) manage.py migrate

backend-test: backend-venv
	cd $(BACKEND_DIR) && ../$(VENV_PY) -m pytest --tb=short -q

backend-lint: backend-venv
	cd $(BACKEND_DIR) && ../$(VENV_PY) -m ruff check .

backend-check: backend-venv
	cd $(BACKEND_DIR) && ../$(VENV_PY) manage.py check

backend-shell: backend-venv
	cd $(BACKEND_DIR) && ../$(VENV_PY) manage.py shell

# -- Frontend ----------------------------------------------------------------

frontend-install:
	cd $(FRONTEND_DIR) && npm ci --no-audit --no-fund

frontend-test:
	cd $(FRONTEND_DIR) && npm test -- --run

frontend-e2e-install:
	cd $(FRONTEND_DIR) && npm run test:e2e:install

frontend-e2e:
	cd $(FRONTEND_DIR) && npm run test:e2e

frontend-lint:
	cd $(FRONTEND_DIR) && npm run lint

frontend-typecheck:
	cd $(FRONTEND_DIR) && npm run typecheck

frontend-build:
	cd $(FRONTEND_DIR) && npm run build

# -- Aggregates --------------------------------------------------------------

lint: backend-lint frontend-lint

test: backend-test frontend-test

check: backend-lint backend-check backend-test frontend-lint frontend-typecheck frontend-test frontend-build

# -- Compose -----------------------------------------------------------------

compose-up:
	docker compose up --build

compose-down:
	docker compose down

compose-prod-config:
	docker compose -f docker-compose.prod.yml config >/dev/null

# -- Housekeeping ------------------------------------------------------------

clean:
	rm -rf $(BACKEND_DIR)/.pytest_cache $(BACKEND_DIR)/.ruff_cache
	rm -rf $(FRONTEND_DIR)/node_modules/.vite $(FRONTEND_DIR)/dist \
		$(FRONTEND_DIR)/playwright-report $(FRONTEND_DIR)/test-results
