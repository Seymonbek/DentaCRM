# kiro-builder

returncode: 0
seconds: 661.47
timed_out: False

## Command
```text
kiro-cli chat --no-interactive --agent ai-builder --trust-all-tools # Continue Building

You were building and got interrupted. Continue from where you left off.

## Rules
1. Check what exists in the repo snapshot
2. Find the next unfinished task from the plan
3. Implement it completely
4. Run verification
5. Report progress

## Previous Output

{{previous_builder_output}}

## Plan

STDOUT:
Reading directory: [38;5;141m/home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main[0m[38;5;244m (using tool: read, max depth: 2, max entries: 1000, excluding: defaults)[0m
[38;5;10m ✓ [0mSuccessfully read directory [38;5;141m/home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main[0m [38;5;244m(38 entries)[0m
[38;5;244m - Completed in 0.8s[0m

[38;5;141m> [0m[1mjson
[0m[38;5;10m{
  "plan_name": "DentaCRM — Modular monolith (Django 5 + React 18) implementation",
  "phase": 1,
  "done": false,
  "notes": "Initial full plan derived from PROJECT_BRIEF.md. Ordered strictly by dependency. Each task is one build iteration and ends with verification. Backend endpoints precede the frontend that consumes them. Tests and CI come at the end (Phase 6). done stays false until every acceptance criterion (1–33) in PROJECT_BRIEF is met.",
  "tasks": [
    {
      "id": 1,
      "phase": "1-foundation",
      "component": "infra",
      "title": "Repo skeleton + Docker Compose (dev)",
      "description": "Create top-level layout: dentacrm/backend, dentacrm/frontend, docker-compose.yml, .env.example, .gitignore, README stub. docker-compose.yml services: postgres:16 (with btree_gist init script), redis:7, minio, backend (build from backend/Dockerfile), celery_worker, celery_beat, bot, frontend (Vite dev server). Add healthchecks and named volumes. Add a postgres init SQL that runs `CREATE EXTENSION IF NOT EXISTS btree_gist;`. No Django code yet — only Dockerfile placeholders that install requirements.",
      "depends_on": [],
      "acceptance": "docker compose config validates; `docker compose up postgres redis minio` starts and psql shows btree_gist extension available. Files: docker-compose.yml, backend/Dockerfile, frontend/Dockerfile, .env.example, scripts/init-postgres.sql.",
      "brief_criteria": [33]
    },
    {
      "id": 2,
      "phase": "1-foundation",
      "component": "backend",
      "title": "Django project bootstrap + split settings",
      "description": "Create backend/config/{settings/{base.py,dev.py,prod.py}, urls.py, wsgi.py, asgi.py, celery.py}, manage.py, requirements/{base.txt,dev.txt,prod.txt} with PINNED versions (Django==5.0.x, DRF, simplejwt, drf-spectacular, django-filter, django-simple-history, django-storages, boto3, Pillow, psycopg[binary], redis, celery, django-celery-beat, aiogram, factory_boy, pytest-django). Configure DATABASES from env, INSTALLED_APPS with placeholders, LANGUAGE_CODE='uz', TIME_ZONE='Asia/Tashkent'. Wire drf-spectacular at /api/docs/ and /api/schema/. Configure Celery app in config/celery.py.",
      "depends_on": [1],
      "acceptance": "`python manage.py check` passes inside backend container; `python manage.py migrate` runs the auth+contenttypes tables; /api/docs/ returns Swagger UI (empty schema OK).",
      "brief_criteria": [1, 2, 14]
    },
    {
      "id": 3,
      "phase": "1-foundation",
      "component": "backend",
      "title": "core app — BaseModel, pagination, exception handler",
      "description": "Create apps/core with: models.BaseModel (UUID pk, created_at, updated_at, is_active, abstract=True); pagination.StandardResultsSetPagination returning {count,next,previous,results}; exceptions.custom_exception_handler returning {error:{code,message,details}} for DRF errors; permissions.IsBoshShifokor/IsDoctor/IsAdministrator (role checks against request.user.role). Register in settings (DEFAULT_PAGINATION_CLASS, EXCEPTION_HANDLER).",
      "depends_on": [2],
      "acceptance": "Import works; unit test hitting a stub view returns paginated shape; forcing a ValidationError returns the standard error envelope.",
      "brief_criteria": [1]
    },
    {
      "id": 4,
      "phase": "1-foundation",
      "component": "backend",
      "title": "accounts app — User + OTPCode + JWT auth",
      "description": "Custom User with phone_number USERNAME_FIELD (unique), first_name, last_name, role choices (bosh_shifokor|doctor|administrator), telegram_chat_id, two_factor_enabled, is_active. OTPCode model. UserManager. AUTH_USER_MODEL wired BEFORE any migrations run for other apps. simplejwt configured (access 15m, refresh 7d, rotate+blacklist). Endpoints: POST /api/v1/auth/login/ (phone+password → tokens), POST /api/v1/auth/refresh/, GET /api/v1/auth/me/. Serializer for me returns {id, firstName, lastName, phoneNumber, role} (camelCase via to_representation).",
      "depends_on": [3],
      "acceptance": "makemigrations+migrate succeed with custom User as initial. Manual login via httpie returns tokens; /auth/me/ with Bearer works; wrong password returns standard error envelope. Pytest: test_login_success, test_me_requires_auth.",
      "brief_criteria": [3, 15]
    },
    {
      "id": 5,
      "phase": "1-foundation",
      "component": "frontend",
      "title": "Frontend scaffold — Vite+TS+Tailwind+Router+shadcn",
      "description": "cd frontend && init Vite React-TS. Inst

## Reviewer Feedback



## Repository Snapshot

## git_status
```text
 M dentacrm/backend/config/settings/base.py
 M dentacrm/backend/config/urls.py
 M dentacrm/frontend/.dockerignore
 M dentacrm/frontend/Dockerfile
 M dentacrm/frontend/README.md
 M dentacrm/frontend/package.json
 D dentacrm/frontend/placeholder-server.mjs
?? dentacrm/backend/apps/accounts/
?? dentacrm/backend/apps/core/exceptions.py
?? dentacrm/backend/apps/core/pagination.py
?? dentacrm/backend/apps/core/permissions.py
?? dentacrm/backend/apps/departments/
?? dentacrm/backend/apps/doctors/
?? dentacrm/backend/apps/patients/
?? dentacrm/backend/apps/scheduling/
?? dentacrm/backend/tests/test_accounts.py
?? dentacrm/backend/tests/test_core.py
?? dentacrm/backend/tests/test_departments.py
?? dentacrm/backend/tests/test_doctors.py
?? dentacrm/backend/tests/test_patients.py
?? dentacrm/backend/tests/test_scheduling.py
?? dentacrm/frontend/.env.example
?? dentacrm/frontend/.gitignore
?? dentacrm/frontend/index.html
?? dentacrm/frontend/package-lock.json
?? dentacrm/frontend/postcss.config.js
?? dentacrm/frontend/src/
?? dentacrm/frontend/tailwind.config.js
?? dentacrm/frontend/tsconfig.json
?? dentacrm/frontend/tsconfig.node.json
?? dentacrm/frontend/vite.config.ts
?? dentacrm/frontend/vitest.setup.ts

```

## git_diff_stat
```text
 dentacrm/backend/config/settings/base.py | 20 ++++++++---
 dentacrm/backend/config/urls.py          | 12 ++++++-
 dentacrm/frontend/.dockerignore          | 15 +++++----
 dentacrm/frontend/Dockerfile             | 24 ++++----------
 dentacrm/frontend/README.md              | 40 +++++++++++++++++++---
 dentacrm/frontend/package.json           | 57 +++++++++++++++++++++++++++++---
 dentacrm/frontend/placeholder-server.mjs | 43 ------------------------
 7 files changed, 130 insertions(+), 81 deletions(-)

```

## recent_files
```text
agentloop.toml
agentloop.toml.example
AGENTS.md
ai_orchestrator/context_store.py
ai_orchestrator/dashboard.py
ai_orchestrator/__init__.py
ai_orchestrator/orchestrator.py
ai_orchestrator/telegram_notifier.py
dentacrm/backend/db.sqlite3
dentacrm/backend/Dockerfile
dentacrm/backend/.dockerignore
dentacrm/backend/.env.example
dentacrm/backend/manage.py
dentacrm/backend/pyproject.toml
dentacrm/backend/pytest.ini
dentacrm/backend/README.md
dentacrm/docker-compose.yml
dentacrm/.env.example
dentacrm/frontend/Dockerfile
dentacrm/frontend/.dockerignore
dentacrm/frontend/.env.example
dentacrm/frontend/.gitignore
dentacrm/frontend/index.html
dentacrm/frontend/package.json
dentacrm/frontend/package-lock.json
dentacrm/frontend/postcss.config.js
dentacrm/frontend/README.md
dentacrm/frontend/tailwind.config.js
dentacrm/frontend/tsconfig.json
dentacrm/frontend/tsconfig.node.json
dentacrm/frontend/vite.config.ts
dentacrm/frontend/vitest.setup.ts
dentacrm/.gitignore
dentacrm/README.md
dentacrm/scripts/init-postgres.sql
.env.example
examples/todo_app/agentloop.toml
examples/todo_app/PROJECT_BRIEF.md
.gitignore
.kiro/agents/ai-builder.json
.kiro/agents/ai-planner.json
.kiro/agents/ai-reviewer.json
.kiro/steering/orchestration.md
PROJECT_BRIEF.md
prompts/builder_codex.md
prompts/continue_codex.md
prompts/discovery_kiro.md
prompts/planner_kiro.md
prompts/replan_kiro.md
prompts/review_kiro.md
pyproject.toml
README.md

```

## Brief

# DentaCRM — Tish klinikalari uchun boshqaruv tizimi

## Goal

Tish klinikalari uchun to'liq CRM tizimi qurish: bemor boshqaruvi, navbat/jadval, davolanish yozuvlari, odontogram (tish formulasi), omborxona, to'lovlar, shifokor reytingi, Telegram bot va boshqaruv paneli. Modular monolith arxitektura: Django 5 backend + React 18 frontend.

---

## Tech Stack

### Backend
- Python 3.12, Django 5.x, Django REST Framework
- PostgreSQL 16 (btree_gist extension)
- Redis 7 (cache + Celery broker)
- Celery 5.x + Celery Beat
- Aiogram 3.x (Telegram bot)
- djangorestframework-simplejwt (auth)
- drf-spectacular (Swagger docs)
- django-filter, django-storages, django-simple-history
- Pillow, factory_boy, pytest-django

### Frontend
- React 18 + TypeScript + Vite
- TailwindCSS + shadcn/ui
- TanStack Query (server state)
- Zustand (UI state)
- React Hook Form + Zod (formalar)
- Axios (HTTP, auto-refresh interceptor)
- React Router v6
- Recharts (grafiklar)
- date-fns
- Vitest + React Testing Library + Playwright

### Infrastructure
- Docker + Docker Compose
- Nginx (reverse proxy)
- MinIO (S3-compatible storage, local dev)
- GitHub Actions (CI/CD)

---

## Architecture

Modular monolith: bitta Django loyihasi, ajratilgan apps/ modullar, bitta deploy birligi.

```
┌─────────────────────────────────────────────────────────────────┐
│                          CLIENT LAYER                             │
│   React SPA (Bosh shifokor / Doktor / Administrator panellari)    │
│                    Telegram (bemor va xodim botlari)               │
└───────────────────────┬───────────────────────┬───────────────────┘
                         │ HTTPS/REST (JWT)      │ Telegram Bot API
                         ▼                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                     APPLICATION LAYER                              │
│  Django 5 + DRF (Gunicorn)              Aiogram 3.x bot            │
│  /api/v1/...                             (webhook, prod)           │
└───────────────────────┬───────────────────────┬───────────────────┘
                         │                       │
              ┌──────────┴──────────┐   ┌────────┴─────────┐
              ▼                     ▼   ▼                  ▼
      ┌───────────────┐   ┌────────────────┐    ┌────────────────┐
      │  PostgreSQL 16 │   │  Redis 7        │    │  Object Storage │
      └───────────────┘   │  cache/broker    │    │  (S3 / MinIO)   │
                           └───────┬────────┘    └────────────────┘
                                   ▼
                          ┌──────────────────┐
                          │ Celery worker +   │
                          │ Celery beat       │
                          └──────────────────┘
```

Qatlamlar (har app ichida): models.py → selectors.py (o'qish) → services.py (yozish/logika) → serializers.py → permissions.py → views.py (faqat orkestratsiya) → tasks.py → signals.py

### Repository tuzilishi
```
dentacrm/
├── backend/
│   ├── config/
│   │   ├── settings/{base.py, dev.py, prod.py}
│   │   ├── urls.py, celery.py, asgi.py, wsgi.py
│   ├── apps/
│   │   ├── core/ accounts/ departments/ doctors/ patients/
│   │   ├── scheduling/ treatments/ odontogram/ prescriptions/
│   │   ├── inventory/ payments/ ratings/ notifications/
│   │   ├── reports/ telegram_bot/
│   ├── tests/
│   ├── manage.py
│   ├── requirements/{base.txt, dev.txt, prod.txt}
│   ├── .env.example
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── api/ app/ components/ pages/ hooks/ store/ types/ utils/
│   ├── .env.example
│   ├── vite.config.ts
│   └── Dockerfile
├── docker-compose.yml
├── docker-compose.prod.yml
└── .github/workflows/ci.yml
```

---

## Database Schema

### core app
- `BaseModel` (abstract): `id: UUID`, `created_at: DateTimeField(auto_now_add)`, `updated_at: DateTimeField(auto_now)`, `is_active: BooleanField(default=True)`

### accounts app
- `User`: `phone_number` (unique, login sifatida), `first_name`, `last_name`, `role` (choices: bosh_shifokor/doctor/administrator), `telegram_chat_id` (nullable), `two_factor_enabled` (bool), `is_active`
- `OTPCode`: `user` FK, `code` (CharField), `purpose` (choices: login/password_reset), `expires_at`, `is_used`

### departments app
- `Department`: `name`, `description`, `created_by` FK(User), `is_active`

### doctors app
- `DoctorProfile`: `user` OneToOne(User), `departments` M2M(Department), `specialization`, `bio`, `commission_basis` (choices: from_total/from_net), `default_commission_rate` (DecimalField), `can_view_other_doctors` (bool)
- `WorkingHours`: `doctor` FK(DoctorProfile), `weekday` (0-6), `start_time`, `end_time`
- `TimeOff`: `doctor` FK, `date_start`, `date_end`, `reason`
- `ProcedureType`: `name`, `department` FK, `default_duration_minutes`, `default_price`, `commission_rate_override` (nullable)

### patients app
- `Patient`: `first_name`, `last_name`, `phone_number`, `gender` (nullable, choices: male/female), `address` (nullable), `notes` (allergiya/surunkali kasalliklar), `telegram_chat_id` (nullable), `created_by` FK(User)

### scheduling app
- `Appointment`: `patient` FK, `doctor` FK, `department` FK, `procedure_type` FK (nullable), `scheduled_start` (DateTimeField), `scheduled_end` (DateTimeField), `status` (choices: scheduled/confirmed/in_progress/completed/cancelled/no_show), `created_by` FK, `reminder_1d_sent` (bool), `reminder_2h_sent` (bool)
- **Double-booking himoyasi:** PostgreSQL ExclusionConstraint (btree_gist) — `(doctor_id, tstzrange(scheduled_start, scheduled_end))` DB darajasida

### treatments app
- `Treatment`: `appointment` FK, `doctor` FK, `patient` FK, `department` FK, `procedure_type` FK, `diagnosis`, `description`, `price` (DecimalField), `payment_status` (choices: unpaid/partial/paid), `stage` (choices: in_progress/completed)
- `TreatmentPhoto`: `treatment` FK, `photo_type` (choices: before/after/xray), `image` (ImageField), `uploaded_at`

### odontogram app
- `ToothRecord`: `treatment` FK, `
...[middle truncated by orchestrator]...
RestockForm`, `WorkingHoursEditor` (React Hook Form + Zod)

### State Management
- `authStore` (Zustand): user, accessToken (faqat memory, localStorage emas), login/logout/refresh
- `uiStore` (Zustand): sidebarOpen, activeModal, theme
- `notificationStore` (Zustand): toast queue
- Server state: TanStack Query (usePatients, useAppointments, etc.)

### TypeScript Interfaces
- `User`: id, firstName, lastName, phoneNumber, role
- `Patient`: id, firstName, lastName, phoneNumber, gender?, address?, notes?
- `Doctor`: id, user, departments[], specialization, commissionBasis
- `Appointment`: id, patientId, doctorId, scheduledStart (ISO), scheduledEnd, status
- `Treatment`: id, appointmentId, diagnosis, price, paymentStatus, toothRecords[]
- `ToothRecord`: toothNumber, procedure, status
- `Material`: id, name, unit, quantityInStock, minimumThreshold
- `Payment`: id, treatmentId, amount, method

---

## Acceptance Criteria

### Backend
1. ✅ Django loyihasi ishlaydi, barcha app'lar ro'yxatdan o'tgan
2. ✅ PostgreSQL ga ulanadi, barcha modellar migrate qilingan
3. ✅ JWT auth ishlaydi (login, refresh, me endpoint)
4. ✅ RBAC — har rol faqat o'ziga ruxsat berilgan endpointlarga kira oladi
5. ✅ Double-booking himoyasi — PostgreSQL ExclusionConstraint bilan DB darajasida
6. ✅ Barcha CRUD endpointlar ishlaydi (patients, appointments, treatments, payments, materials)
7. ✅ Odontogram — tooth_number validatsiyasi (FDI: 11-48), treatment bilan bog'lanadi
8. ✅ Komissiya avtomatik hisoblanadi (from_total va from_net)
9. ✅ Inventory — MaterialUsage signal orqali stock avtomatik kamayadi + low_stock alert
10. ✅ Retsept Telegram orqali bemorga yuboriladi
11. ✅ Celery tasklar ishlaydi (reminder, follow-up, cache, backup)
12. ✅ Rasm yuklash (before/after/xray) + thumbnail generatsiya
13. ✅ Reports — aggregate querylar + Redis cache
14. ✅ Swagger docs `/api/docs/` da ko'rinadi
15. ✅ Tests — double-booking, komissiya, inventory, RBAC uchun pytest testlar
16. ✅ Docker Compose — backend, postgres, redis, celery, bot barasi ishlaydi
17. ✅ seed_demo_data management command (1 bosh shifokor, 2 doktor, 1 admin, 10 bemor)

### Frontend
18. ✅ Login sahifasi ishlaydi, JWT token bilan auth
19. ✅ Role-based routing — har rol faqat o'z sahifalarini ko'radi
20. ✅ Dashboard — statistika grafiklari (Recharts)
21. ✅ Patients CRUD — qidirish, kartochka, timeline
22. ✅ Odontogram — interaktiv SVG, tish tanlash va muolaja belgilash
23. ✅ ScheduleCalendar — shifokor jadvali, bo'sh slotlarni ko'rsatish
24. ✅ Appointments — yaratish (slot tanlash), status o'zgartirish
25. ✅ Treatments — forma (tish yozuvlari, materiallar birga), rasm yuklash
26. ✅ Payments — to'lov kiritish, qarzdorlik ko'rsatish
27. ✅ Inventory — materiallar ro'yxati, restock, low-stock warning
28. ✅ Ratings — leaderboard, badge'lar
29. ✅ Axios interceptor — access token avtomatik refresh
30. ✅ Loading (Skeleton), Error (toast), Empty state barcha sahifalarda

### Integration
31. ✅ Telegram bot — xodim bildirishnomalari + bemor eslatmalari ishlaydi
32. ✅ End-to-end: login → navbat → davolanish → to'lov oqimi ishlaydi
33. ✅ docker-compose up bilan butun tizim bir komandada ishga tushadi

---

## Non-goals

- Multi-tenant (ko'p klinika) — faqat bitta klinika uchun
- Bemor o'zi navbatga yozilishi (faqat administrator orqali)
- Real payment gateway integratsiyasi (Payme/Click API) — faqat to'lov turini saqlash
- Mobile native app — faqat responsive web
- Video konsultatsiya
- AI-based diagnostika

---

## Constraints

- Barcha external service'lar (Telegram, S3) local dev'da mock/MinIO bilan ishlashi kerak
- PostgreSQL 16 bilan ishlash kerak (btree_gist uchun)
- Python 3.12+, Node 20+
- Docker Compose bilan bir komandada ishga tushishi kerak
- Secrets faqat .env faylda, kodda hech qanday hardcoded secret bo'lmasligi kerak
- Barcha API response'lar standart error format (4.3 bandga mos)
- Frontend — mobile-first responsive dizayn
- Audit log — Treatment, Payment, Material o'zgarishlari django-simple-history bilan kuzatiladi

---

## Implementation Phases

### Faza 1 — Foundation (birinchi qurilishi kerak)
1. Docker Compose setup (postgres, redis, backend, frontend containers)
2. Django project structure (config/, apps/, settings)
3. core app (BaseModel, pagination, exception handler)
4. accounts app (User model, JWT auth, login/refresh/me)
5. RBAC permissions (IsBoshShifokor, IsDoctor, IsAdministrator)
6. Frontend: Vite + React + TypeScript setup, routing, auth store, login page

### Faza 2 — Core Business Logic
7. departments app (CRUD)
8. doctors app (DoctorProfile, WorkingHours, TimeOff, ProcedureType)
9. patients app (CRUD + search)
10. scheduling app (Appointments + double-booking constraint + available-slots)
11. Frontend: Sidebar, DataTable, departments/doctors/patients sahifalari

### Faza 3 — Clinical Features
12. treatments app (Treatment, TreatmentPhoto, nested creation)
13. odontogram app (ToothRecord, FDI validation)
14. prescriptions app (templates + generation)
15. inventory app (Material, MaterialUsage, signals, stock logs)
16. Frontend: PatientDetail (timeline + odontogram), TreatmentForm, InventoryPage

### Faza 4 — Finance & Ratings
17. payments app (Payment, CommissionRecord, balance calculation)
18. ratings app (ScoreLog, Badge, DoctorBadge, leaderboard)
19. reports app (aggregate selectors, Redis cache)
20. Frontend: FinancePage, RatingsPage, DashboardPage (charts)

### Faza 5 — Notifications & Bot
21. notifications app (NotificationLog)
22. telegram_bot app (Aiogram dispatcher, staff/patient routers)
23. Celery tasks (reminders, follow-up, cache refresh, backup)
24. Frontend: ScheduleCalendar, NewAppointmentPage (slot picker)

### Faza 6 — Polish & Deploy
25. Tests (pytest: double-booking, commission, inventory, RBAC)
26. Frontend tests (Vitest: forms, Odontogram; Playwright: e2e flow)
27. seed_demo_data management command
28. Docker Compose production config (nginx, gunicorn, env)
29. GitHub Actions CI (lint + test + build)
30. Swagger docs finalization


## Output

End with:
```json
{
  "state": "needs_review | complete | blocked",
  "summary": "What you changed",
  "files_changed": ["path/to/file"],
  "verification": "Commands run and results",
  "next_suggested_task": "What should happen next",
  "blockers": []
}
```

```

## STDOUT
```text
Reading directory: [38;5;141m/home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm[0m[38;5;244m (using tool: read, max depth: 4, max entries: 1000, excluding: defaults)[0m
[38;5;10m ✓ [0mSuccessfully read directory [38;5;141m/home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm[0m [38;5;244m(335 entries)[0m
[38;5;244m - Completed in 0.24s[0m

[38;5;141m> [0mLet me understand the current state — Phase 2 appears complete. I need to identify the next unfinished task (Phase 3: treatments/odontogram/prescriptions/inventory).[0m[0m
Batch fs_read operation with [38;5;141m3[0m operations[38;5;244m (using tool: read)[0m

↱ Operation 1: Reading file: [38;5;141m/home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/config/settings/base.py[0m, all lines
↱ Operation 2: Reading file: [38;5;141m/home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/config/urls.py[0m, all lines
↱ Operation 3: Reading file: [38;5;141m/home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/apps/__init__.py[0m, all lines
[38;5;10m ✓ [0mSuccessfully read [38;5;244m15669 bytes[0m from /home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/config/settings/base.py

[38;5;10m ✓ [0mSuccessfully read [38;5;244m2518 bytes[0m from /home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/config/urls.py

[38;5;10m ✓ [0mSuccessfully read [38;5;244m168 bytes[0m from /home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/apps/__init__.py

 ⋮ 

[38;5;244m- [0mSummary: 3 operations processed, 3 successful, 0 failed
[38;5;244m - Completed in 0.0s[0m

Batch fs_read operation with [38;5;141m2[0m operations[38;5;244m (using tool: read)[0m

↱ Operation 1: Reading file: [38;5;141m/home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/apps/patients/models.py[0m, all lines
↱ Operation 2: Reading file: [38;5;141m/home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/apps/patients/serializers.py[0m, all lines
[38;5;10m ✓ [0mSuccessfully read [38;5;244m5225 bytes[0m from /home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/apps/patients/models.py

[38;5;10m ✓ [0mSuccessfully read [38;5;244m8158 bytes[0m from /home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/apps/patients/serializers.py

 ⋮ 

[38;5;244m- [0mSummary: 2 operations processed, 2 successful, 0 failed
[38;5;244m - Completed in 0.0s[0m

Batch fs_read operation with [38;5;141m4[0m operations[38;5;244m (using tool: read)[0m

↱ Operation 1: Reading file: [38;5;141m/home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/apps/scheduling/models.py[0m, all lines
↱ Operation 2: Reading file: [38;5;141m/home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/apps/core/models.py[0m, all lines
↱ Operation 3: Reading file: [38;5;141m/home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/apps/core/permissions.py[0m, all lines
↱ Operation 4: Reading file: [38;5;141m/home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/requirements/base.txt[0m, all lines
[38;5;10m ✓ [0mSuccessfully read [38;5;244m5836 bytes[0m from /home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/apps/scheduling/models.py

[38;5;10m ✓ [0mSuccessfully read [38;5;244m1029 bytes[0m from /home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/apps/core/models.py

[38;5;10m ✓ [0mSuccessfully read [38;5;244m6566 bytes[0m from /home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/apps/core/permissions.py

[38;5;10m ✓ [0mSuccessfully read [38;5;244m1298 bytes[0m from /home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/requirements/base.txt

 ⋮ 

[38;5;244m- [0mSummary: 4 operations processed, 4 successful, 0 failed
[38;5;244m - Completed in 0.0s[0m

[38;5;141m> [0mLet me quickly verify existing tests pass, then proceed with treatments app (task 12).[0m[0m
I will run the following command: [38;5;141m.venv/bin/python -m pytest -q --tb=short 2>&1 | tail -30[0m (in [38;5;141mdentacrm/backend[0m)[38;5;244m (using tool: shell)[0m
Purpose: Run backend tests to verify current state

........................................................................ [ 48%]
........................................................................ [ 96%]
......                                                                   [100%]
150 passed in 78.15s (0:01:18)
[38;5;244m - Completed in 80.146s[0m

[38;5;141m> [0mAll 150 tests pass. Now proceeding with Phase 3 task 12: treatments app.[0m[0m
Batch fs_read operation with [38;5;141m8[0m operations[38;5;244m (using tool: read)[0m

↱ Operation 1: Reading file: [38;5;141m/home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/apps/patients/services.py[0m, all lines
↱ Operation 2: Reading file: [38;5;141m/home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/apps/patients/views.py[0m, all lines
↱ Operation 3: Reading file: [38;5;141m/home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/apps/patients/urls.py[0m, all lines
↱ Operation 4: Reading file: [38;5;141m/home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/apps/patients/selectors.py[0m, all lines
↱ Operation 5: Reading file: [38;5;141m/home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/apps/patients/permissions.py[0m, all lines
↱ Operation 6: Reading file: [38;5;141m/home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/apps/patients/admin.py[0m, all lines
↱ Operation 7: Reading file: [38;5;141m/home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/apps/patients/apps.py[0m, all lines
↱ Operation 8: Reading file: [38;5;141m/home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/apps/patients/__init__.py[0m, all lines
[38;5;10m ✓ [0mSuccessfully read [38;5;244m6703 bytes[0m from /home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/apps/patients/services.py

[38;5;10m ✓ [0mSuccessfully read [38;5;244m12326 bytes[0m from /home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/apps/patients/views.py

[38;5;10m ✓ [0mSuccessfully read [38;5;244m561 bytes[0m from /home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/apps/patients/urls.py

[38;5;10m ✓ [0mSuccessfully read [38;5;244m2699 bytes[0m from /home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/apps/patients/selectors.py

[38;5;10m ✓ [0mSuccessfully read [38;5;244m1798 bytes[0m from /home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/apps/patients/permissions.py

[38;5;10m ✓ [0mSuccessfully read [38;5;244m663 bytes[0m from /home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/apps/patients/admin.py

[38;5;10m ✓ [0mSuccessfully read [38;5;244m332 bytes[0m from /home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/apps/patients/apps.py

[38;5;10m ✓ [0mSuccessfully read [38;5;244m804 bytes[0m from /home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/apps/patients/__init__.py

 ⋮ 

[38;5;244m- [0mSummary: 8 operations processed, 8 successful, 0 failed
[38;5;244m - Completed in 0.0s[0m

Batch fs_read operation with [38;5;141m2[0m operations[38;5;244m (using tool: read)[0m

↱ Operation 1: Reading file: [38;5;141m/home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/apps/doctors/models.py[0m, all lines
↱ Operation 2: Reading file: [38;5;141m/home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/apps/accounts/models.py[0m, from line [38;5;141m1[0m to [38;5;141m60[0m
[38;5;10m ✓ [0mSuccessfully read [38;5;244m10039 bytes[0m from /home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/apps/doctors/models.py

[38;5;10m ✓ [0mSuccessfully read [38;5;244m2107 bytes[0m from /home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/apps/accounts/models.py

 ⋮ 

[38;5;244m- [0mSummary: 2 operations processed, 2 successful, 0 failed
[38;5;244m - Completed in 0.0s[0m

[38;5;141m> [0mI'll build the treatments app (task 12) following the established patterns in the codebase.[0m[0m
I'll create the following file: [38;5;141m/home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/apps/treatments/__init__.py[0m[38;5;244m (using tool: write)[0m

[48;2;40;67;43m[39m+     1[0m:[39m[48;2;24;38;30m [38;2;101;115;126m"""[38;2;101;115;126mTreatments app — davolash yozuvlari.[K
[0m[48;2;40;67;43m[39m+     2[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     3[0m:[39m[48;2;24;38;30m [38;2;101;115;126mModels (PROJECT_BRIEF § "treatments app"):[K
[0m[48;2;40;67;43m[39m+     4[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     5[0m:[39m[48;2;24;38;30m [38;2;101;115;126m* :class:`Treatment` — a single clinical intervention performed by a[K
[0m[48;2;40;67;43m[39m+     6[0m:[39m[48;2;24;38;30m [38;2;101;115;126m  doctor for a patient. Links to :class:`apps.scheduling.Appointment`,[K
[0m[48;2;40;67;43m[39m+     7[0m:[39m[48;2;24;38;30m [38;2;101;115;126m  :class:`apps.doctors.DoctorProfile`, :class:`apps.patients.Patient`,[K
[0m[48;2;40;67;43m[39m+     8[0m:[39m[48;2;24;38;30m [38;2;101;115;126m  :class:`apps.departments.Department`, and[K
[0m[48;2;40;67;43m[39m+     9[0m:[39m[48;2;24;38;30m [38;2;101;115;126m  :class:`apps.doctors.ProcedureType`. Owns diagnosis, description,[K
[0m[48;2;40;67;43m[39m+    10[0m:[39m[48;2;24;38;30m [38;2;101;115;126m  price, payment_status, and stage.[K
[0m[48;2;40;67;43m[39m+    11[0m:[39m[48;2;24;38;30m [38;2;101;115;126m* :class:`TreatmentPhoto` — before/after/x-ray images uploaded per[K
[0m[48;2;40;67;43m[39m+    12[0m:[39m[48;2;24;38;30m [38;2;101;115;126m  treatment. Thumbnail generation is deferred to T23 (celery task).[K
[0m[48;2;40;67;43m[39m+    13[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    14[0m:[39m[48;2;24;38;30m [38;2;101;115;126mRBAC (PROJECT_BRIEF § "RBAC"):[K
[0m[48;2;40;67;43m[39m+    15[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    16[0m:[39m[48;2;24;38;30m [38;2;101;115;126m* Read: ``bosh_shifokor`` sees all, ``doctor`` sees own (or all when[K
[0m[48;2;40;67;43m[39m+    17[0m:[39m[48;2;24;38;30m [38;2;101;115;126m  ``can_view_other_doctors=True``), ``administrator`` sees read-only.[K
[0m[48;2;40;67;43m[39m+    18[0m:[39m[48;2;24;38;30m [38;2;101;115;126m* Write (create / update / photos): ``bosh_shifokor`` and ``doctor``.[K
[0m[48;2;40;67;43m[39m+    19[0m:[39m[48;2;24;38;30m [38;2;101;115;126m"""[K
[0m[48;2;40;67;43m[39m+    20[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    21[0m:[39m[48;2;24;38;30m [38;2;192;197;206mdefault_app_config[38;2;192;197;206m [38;2;192;197;206m=[38;2;192;197;206m [38;2;192;197;206m"[38;2;163;190;140mapps.treatments.apps.TreatmentsConfig[38;2;192;197;206m"[K
[0m[K
Creating: [38;5;141m/home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/apps/treatments/__init__.py[0m
[38;5;244m - Completed in 0.1s[0m

I'll create the following file: [38;5;141m/home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/apps/treatments/apps.py[0m[38;5;244m (using tool: write)[0m

[48;2;40;67;43m[39m+     1[0m:[39m[48;2;24;38;30m [38;2;101;115;126m"""[38;2;101;115;126mAppConfig for the ``treatments`` app.[38;2;101;115;126m"""[K
[0m[48;2;40;67;43m[39m+     2[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206m__future__[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206mannotations[K
[0m[48;2;40;67;43m[39m+     3[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     4[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206mdjango[38;2;192;197;206m.[38;2;192;197;206mapps[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206mAppConfig[K
[0m[48;2;40;67;43m[39m+     5[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     6[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     7[0m:[39m[48;2;24;38;30m [38;2;180;142;173mclass[38;2;239;241;245m [38;2;235;203;139mTreatmentsConfig[38;2;239;241;245m([38;2;163;190;140mAppConfig[38;2;239;241;245m)[38;2;239;241;245m:[K
[0m[48;2;40;67;43m[39m+     8[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;101;115;126m"""[38;2;101;115;126mDavolash yozuvlari (Treatment) app configuration.[38;2;101;115;126m"""[K
[0m[48;2;40;67;43m[39m+     9[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    10[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;192;197;206mdefault_auto_field[38;2;192;197;206m [38;2;192;197;206m=[38;2;192;197;206m [38;2;192;197;206m"[38;2;163;190;140mdjango.db.models.BigAutoField[38;2;192;197;206m"[K
[0m[48;2;40;67;43m[39m+    11[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;192;197;206mname[38;2;192;197;206m [38;2;192;197;206m=[38;2;192;197;206m [38;2;192;197;206m"[38;2;163;190;140mapps.treatments[38;2;192;197;206m"[K
[0m[48;2;40;67;43m[39m+    12[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;192;197;206mlabel[38;2;192;197;206m [38;2;192;197;206m=[38;2;192;197;206m [38;2;192;197;206m"[38;2;163;190;140mtreatments[38;2;192;197;206m"[K
[0m[48;2;40;67;43m[39m+    13[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;192;197;206mverbose_name[38;2;192;197;206m [38;2;192;197;206m=[38;2;192;197;206m [38;2;192;197;206m"[38;2;163;190;140mTreatments[38;2;192;197;206m"[K
[0m[K
Creating: [38;5;141m/home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/apps/treatments/apps.py[0m
[38;5;244m - Completed in 0.1s[0m

I'll create the following file: [38;5;141m/home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/apps/treatments/models.py[0m[38;5;244m (using tool: write)[0m

[48;2;40;67;43m[39m+      1[0m:[39m[48;2;24;38;30m [38;2;101;115;126m"""[38;2;101;115;126mModels for the ``treatments`` app.[K
[0m[48;2;40;67;43m[39m+      2[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+      3[0m:[39m[48;2;24;38;30m [38;2;101;115;126mDesign decisions:[K
[0m[48;2;40;67;43m[39m+      4[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+      5[0m:[39m[48;2;24;38;30m [38;2;101;115;126m* Inherits :class:`apps.core.models.BaseModel` for the UUID pk, audit[K
[0m[48;2;40;67;43m[39m+      6[0m:[39m[48;2;24;38;30m [38;2;101;115;126m  timestamps, and ``is_active`` soft-flag.[K
[0m[48;2;40;67;43m[39m+      7[0m:[39m[48;2;24;38;30m [38;2;101;115;126m* All FKs use ``PROTECT`` (patient / doctor / department) to preserve[K
[0m[48;2;40;67;43m[39m+      8[0m:[39m[48;2;24;38;30m [38;2;101;115;126m  the audit trail. ``appointment`` uses ``SET_NULL`` so a treatment[K
[0m[48;2;40;67;43m[39m+      9[0m:[39m[48;2;24;38;30m [38;2;101;115;126m  can survive an appointment being removed (rare, but the clinical[K
[0m[48;2;40;67;43m[39m+     10[0m:[39m[48;2;24;38;30m [38;2;101;115;126m  record must not vanish). ``procedure_type`` uses ``SET_NULL`` for[K
[0m[48;2;40;67;43m[39m+     11[0m:[39m[48;2;24;38;30m [38;2;101;115;126m  the same reason.[K
[0m[48;2;40;67;43m[39m+     12[0m:[39m[48;2;24;38;30m [38;2;101;115;126m* ``price`` is a positive :class:`Decimal` at DB level.[K
[0m[48;2;40;67;43m[39m+     13[0m:[39m[48;2;24;38;30m [38;2;101;115;126m* ``payment_status`` and ``stage`` are small closed enums matching[K
[0m[48;2;40;67;43m[39m+     14[0m:[39m[48;2;24;38;30m [38;2;101;115;126m  PROJECT_BRIEF § "treatments app".[K
[0m[48;2;40;67;43m[39m+     15[0m:[39m[48;2;24;38;30m [38;2;101;115;126m* :mod:`simple_history` records every change (PROJECT_BRIEF §[K
[0m[48;2;40;67;43m[39m+     16[0m:[39m[48;2;24;38;30m [38;2;101;115;126m  "Constraints" — Treatment/Payment/Material must be audit-tracked).[K
[0m[48;2;40;67;43m[39m+     17[0m:[39m[48;2;24;38;30m [38;2;101;115;126m* :class:`TreatmentPhoto` stores the raw upload plus an optional[K
[0m[48;2;40;67;43m[39m+     18[0m:[39m[48;2;24;38;30m [38;2;101;115;126m  thumbnail path (populated by the T23 celery task). The[K
[0m[48;2;40;67;43m[39m+     19[0m:[39m[48;2;24;38;30m [38;2;101;115;126m  ``uploaded_at`` field is separate from ``created_at`` to match the[K
[0m[48;2;40;67;43m[39m+     20[0m:[39m[48;2;24;38;30m [38;2;101;115;126m  brief field-list literally.[K
[0m[48;2;40;67;43m[39m+     21[0m:[39m[48;2;24;38;30m [38;2;101;115;126m"""[K
[0m[48;2;40;67;43m[39m+     22[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206m__future__[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206mannotations[K
[0m[48;2;40;67;43m[39m+     23[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     24[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206mdecimal[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206mDecimal[K
[0m[48;2;40;67;43m[39m+     25[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     26[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206mdjango[38;2;192;197;206m.[38;2;192;197;206mconf[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206msettings[K
[0m[48;2;40;67;43m[39m+     27[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206mdjango[38;2;192;197;206m.[38;2;192;197;206mcore[38;2;192;197;206m.[38;2;192;197;206mvalidators[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206mMinValueValidator[K
[0m[48;2;40;67;43m[39m+     28[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206mdjango[38;2;192;197;206m.[38;2;192;197;206mdb[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206mmodels[K
[0m[48;2;40;67;43m[39m+     29[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206mdjango[38;2;192;197;206m.[38;2;192;197;206mutils[38;2;192;197;206m.[38;2;192;197;206mtranslation[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206mgettext_lazy[38;2;192;197;206m [38;2;180;142;173mas[38;2;192;197;206m [38;2;191;97;106m_[K
[0m[48;2;40;67;43m[39m+     30[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206msimple_history[38;2;192;197;206m.[38;2;192;197;206mmodels[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206mHistoricalRecords[K
[0m[48;2;40;67;43m[39m+     31[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     32[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206mapps[38;2;192;197;206m.[38;2;192;197;206mcore[38;2;192;197;206m.[38;2;192;197;206mmodels[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206mBaseModel[K
[0m[48;2;40;67;43m[39m+     33[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     34[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     35[0m:[39m[48;2;24;38;30m [38;2;101;115;126m#[38;2;101;115;126m ---------------------------------------------------------------------------[K
[0m[48;2;40;67;43m[39m+     36[0m:[39m[48;2;24;38;30m [38;2;101;115;126m# Choices[K
[0m[48;2;40;67;43m[39m+     37[0m:[39m[48;2;24;38;30m [38;2;101;115;126m# ---------------------------------------------------------------------------[K
[0m[48;2;40;67;43m[39m+     38[0m:[39m[48;2;24;38;30m [38;2;101;115;126mclass PaymentStatus(models.TextChoices):[K
[0m[48;2;40;67;43m[39m+     39[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    UNPAID = "unpaid", _("To'lanmagan")[K
[0m[48;2;40;67;43m[39m+     40[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    PARTIAL = "partial", _("Qisman to'langan")[K
[0m[48;2;40;67;43m[39m+     41[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    PAID = "paid", _("To'langan")[K
[0m[48;2;40;67;43m[39m+     42[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     43[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     44[0m:[39m[48;2;24;38;30m [38;2;101;115;126mclass TreatmentStage(models.TextChoices):[K
[0m[48;2;40;67;43m[39m+     45[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    IN_PROGRESS = "in_progress", _("Davom etmoqda")[K
[0m[48;2;40;67;43m[39m+     46[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    COMPLETED = "completed", _("Yakunlangan")[K
[0m[48;2;40;67;43m[39m+     47[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     48[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     49[0m:[39m[48;2;24;38;30m [38;2;101;115;126mclass PhotoType(models.TextChoices):[K
[0m[48;2;40;67;43m[39m+     50[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    BEFORE = "before", _("Davolashdan oldin")[K
[0m[48;2;40;67;43m[39m+     51[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    AFTER = "after", _("Davolashdan keyin")[K
[0m[48;2;40;67;43m[39m+     52[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    XRAY = "xray", _("Rentgen")[K
[0m[48;2;40;67;43m[39m+     53[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     54[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     55[0m:[39m[48;2;24;38;30m [38;2;101;115;126mdef _treatment_photo_upload_to(instance: "TreatmentPhoto", filename: str) -> str:[K
[0m[48;2;40;67;43m[39m+     56[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    """Store photos under ``treatments/<treatment_id>/<photo_type>/<filename>``."""[K
[0m[48;2;40;67;43m[39m+     57[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    tid = instance.treatment_id or "unknown"[K
[0m[48;2;40;67;43m[39m+     58[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    ptype = instance.photo_type or "misc"[K
[0m[48;2;40;67;43m[39m+     59[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    return f"treatments/{tid}/{ptype}/{filename}"[K
[0m[48;2;40;67;43m[39m+     60[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     61[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     62[0m:[39m[48;2;24;38;30m [38;2;101;115;126m# ---------------------------------------------------------------------------[K
[0m[48;2;40;67;43m[39m+     63[0m:[39m[48;2;24;38;30m [38;2;101;115;126m# Treatment[K
[0m[48;2;40;67;43m[39m+     64[0m:[39m[48;2;24;38;30m [38;2;101;115;126m# ---------------------------------------------------------------------------[K
[0m[48;2;40;67;43m[39m+     65[0m:[39m[48;2;24;38;30m [38;2;101;115;126mclass Treatment(BaseModel):[K
[0m[48;2;40;67;43m[39m+     66[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    """A single clinical treatment (davolash yozuvi)."""[K
[0m[48;2;40;67;43m[39m+     67[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     68[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    PaymentStatus = PaymentStatus  # convenience re-exports[K
[0m[48;2;40;67;43m[39m+     69[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    Stage = TreatmentStage[K
[0m[48;2;40;67;43m[39m+     70[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     71[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    appointment = models.ForeignKey([K
[0m[48;2;40;67;43m[39m+     72[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        "scheduling.Appointment",[K
[0m[48;2;40;67;43m[39m+     73[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        on_delete=models.SET_NULL,[K
[0m[48;2;40;67;43m[39m+     74[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        related_name="treatments",[K
[0m[48;2;40;67;43m[39m+     75[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        related_query_name="treatment",[K
[0m[48;2;40;67;43m[39m+     76[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        verbose_name=_("Navbat"),[K
[0m[48;2;40;67;43m[39m+     77[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        null=True,[K
[0m[48;2;40;67;43m[39m+     78[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        blank=True,[K
[0m[48;2;40;67;43m[39m+     79[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    )[K
[0m[48;2;40;67;43m[39m+     80[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    doctor = models.ForeignKey([K
[0m[48;2;40;67;43m[39m+     81[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        "doctors.DoctorProfile",[K
[0m[48;2;40;67;43m[39m+     82[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        on_delete=models.PROTECT,[K
[0m[48;2;40;67;43m[39m+     83[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        related_name="treatments",[K
[0m[48;2;40;67;43m[39m+     84[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        related_query_name="treatment",[K
[0m[48;2;40;67;43m[39m+     85[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        verbose_name=_("Shifokor"),[K
[0m[48;2;40;67;43m[39m+     86[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    )[K
[0m[48;2;40;67;43m[39m+     87[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    patient = models.ForeignKey([K
[0m[48;2;40;67;43m[39m+     88[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        "patients.Patient",[K
[0m[48;2;40;67;43m[39m+     89[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        on_delete=models.PROTECT,[K
[0m[48;2;40;67;43m[39m+     90[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        related_name="treatments",[K
[0m[48;2;40;67;43m[39m+     91[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        related_query_name="treatment",[K
[0m[48;2;40;67;43m[39m+     92[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        verbose_name=_("Bemor"),[K
[0m[48;2;40;67;43m[39m+     93[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    )[K
[0m[48;2;40;67;43m[39m+     94[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    department = models.ForeignKey([K
[0m[48;2;40;67;43m[39m+     95[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        "departments.Department",[K
[0m[48;2;40;67;43m[39m+     96[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        on_delete=models.PROTECT,[K
[0m[48;2;40;67;43m[39m+     97[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        related_name="treatments",[K
[0m[48;2;40;67;43m[39m+     98[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        related_query_name="treatment",[K
[0m[48;2;40;67;43m[39m+     99[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        verbose_name=_("Bo'lim"),[K
[0m[48;2;40;67;43m[39m+    100[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    )[K
[0m[48;2;40;67;43m[39m+    101[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    procedure_type = models.ForeignKey([K
[0m[48;2;40;67;43m[39m+    102[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        "doctors.ProcedureType",[K
[0m[48;2;40;67;43m[39m+    103[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        on_delete=models.SET_NULL,[K
[0m[48;2;40;67;43m[39m+    104[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        related_name="treatments",[K
[0m[48;2;40;67;43m[39m+    105[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        related_query_name="treatment",[K
[0m[48;2;40;67;43m[39m+    106[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        verbose_name=_("Muolaja turi"),[K
[0m[48;2;40;67;43m[39m+    107[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        null=True,[K
[0m[48;2;40;67;43m[39m+    108[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        blank=True,[K
[0m[48;2;40;67;43m[39m+    109[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    )[K
[0m[48;2;40;67;43m[39m+    110[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    diagnosis = models.CharField([K
[0m[48;2;40;67;43m[39m+    111[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        _("Tashxis"),[K
[0m[48;2;40;67;43m[39m+    112[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        max_length=500,[K
[0m[48;2;40;67;43m[39m+    113[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        blank=True,[K
[0m[48;2;40;67;43m[39m+    114[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        default="",[K
[0m[48;2;40;67;43m[39m+    115[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    )[K
[0m[48;2;40;67;43m[39m+    116[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    description = models.TextField([K
[0m[48;2;40;67;43m[39m+    117[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        _("Tavsif"),[K
[0m[48;2;40;67;43m[39m+    118[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        blank=True,[K
[0m[48;2;40;67;43m[39m+    119[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        default="",[K
[0m[48;2;40;67;43m[39m+    120[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    )[K
[0m[48;2;40;67;43m[39m+    121[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    price = models.DecimalField([K
[0m[48;2;40;67;43m[39m+    122[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        _("Narx"),[K
[0m[48;2;40;67;43m[39m+    123[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        max_digits=12,[K
[0m[48;2;40;67;43m[39m+    124[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        decimal_places=2,[K
[0m[48;2;40;67;43m[39m+    125[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        default=Decimal("0.00"),[K
[0m[48;2;40;67;43m[39m+    126[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        validators=[MinValueValidator(Decimal("0.00"))],[K
[0m[48;2;40;67;43m[39m+    127[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    )[K
[0m[48;2;40;67;43m[39m+    128[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    payment_status = models.CharField([K
[0m[48;2;40;67;43m[39m+    129[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        _("To'lov holati"),[K
[0m[48;2;40;67;43m[39m+    130[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        max_length=10,[K
[0m[48;2;40;67;43m[39m+    131[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        choices=PaymentStatus.choices,[K
[0m[48;2;40;67;43m[39m+    132[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        default=PaymentStatus.UNPAID,[K
[0m[48;2;40;67;43m[39m+    133[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    )[K
[0m[48;2;40;67;43m[39m+    134[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    stage = models.CharField([K
[0m[48;2;40;67;43m[39m+    135[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        _("Bosqichi"),[K
[0m[48;2;40;67;43m[39m+    136[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        max_length=20,[K
[0m[48;2;40;67;43m[39m+    137[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        choices=TreatmentStage.choices,[K
[0m[48;2;40;67;43m[39m+    138[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        default=TreatmentStage.IN_PROGRESS,[K
[0m[48;2;40;67;43m[39m+    139[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    )[K
[0m[48;2;40;67;43m[39m+    140[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    created_by = models.ForeignKey([K
[0m[48;2;40;67;43m[39m+    141[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        settings.AUTH_USER_MODEL,[K
[0m[48;2;40;67;43m[39m+    142[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        on_delete=models.PROTECT,[K
[0m[48;2;40;67;43m[39m+    143[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        related_name="treatments_created",[K
[0m[48;2;40;67;43m[39m+    144[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        related_query_name="treatment_created",[K
[0m[48;2;40;67;43m[39m+    145[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        verbose_name=_("Yaratgan foydalanuvchi"),[K
[0m[48;2;40;67;43m[39m+    146[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        null=True,[K
[0m[48;2;40;67;43m[39m+    147[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        blank=True,[K
[0m[48;2;40;67;43m[39m+    148[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    )[K
[0m[48;2;40;67;43m[39m+    149[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    150[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    history = HistoricalRecords([K
[0m[48;2;40;67;43m[39m+    151[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        inherit=True,[K
[0m[48;2;40;67;43m[39m+    152[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        table_name="treatments_treatment_history",[K
[0m[48;2;40;67;43m[39m+    153[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    )[K
[0m[48;2;40;67;43m[39m+    154[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    155[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    class Meta:[K
[0m[48;2;40;67;43m[39m+    156[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        verbose_name = _("Davolash")[K
[0m[48;2;40;67;43m[39m+    157[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        verbose_name_plural = _("Davolashlar")[K
[0m[48;2;40;67;43m[39m+    158[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        ordering = ["-created_at"][K
[0m[48;2;40;67;43m[39m+    159[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        constraints = [[K
[0m[48;2;40;67;43m[39m+    160[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            models.CheckConstraint([K
[0m[48;2;40;67;43m[39m+    161[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                check=models.Q(price__gte=0),[K
[0m[48;2;40;67;43m[39m+    162[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                name="treatments_treatment_price_non_negative",[K
[0m[48;2;40;67;43m[39m+    163[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            ),[K
[0m[48;2;40;67;43m[39m+    164[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        ][K
[0m[48;2;40;67;43m[39m+    165[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        indexes = [[K
[0m[48;2;40;67;43m[39m+    166[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            models.Index(fields=["patient", "-created_at"], name="tr_patient_idx"),[K
[0m[48;2;40;67;43m[39m+    167[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            models.Index(fields=["doctor", "-created_at"], name="tr_doctor_idx"),[K
[0m[48;2;40;67;43m[39m+    168[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            models.Index(fields=["payment_status"], name="tr_paystatus_idx"),[K
[0m[48;2;40;67;43m[39m+    169[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            models.Index(fields=["stage"], name="tr_stage_idx"),[K
[0m[48;2;40;67;43m[39m+    170[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        ][K
[0m[48;2;40;67;43m[39m+    171[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    172[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    def __str__(self) -> str:  # pragma: no cover - repr helper[K
[0m[48;2;40;67;43m[39m+    173[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        return f"Treatment({self.patient_id}, {self.diagnosis[:40]}, {self.stage})"[K
[0m[48;2;40;67;43m[39m+    174[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    175[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    @property[K
[0m[48;2;40;67;43m[39m+    176[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    def is_completed(self) -> bool:[K
[0m[48;2;40;67;43m[39m+    177[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        return self.stage == TreatmentStage.COMPLETED[K
[0m[48;2;40;67;43m[39m+    178[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    179[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    180[0m:[39m[48;2;24;38;30m [38;2;101;115;126m# ---------------------------------------------------------------------------[K
[0m[48;2;40;67;43m[39m+    181[0m:[39m[48;2;24;38;30m [38;2;101;115;126m# TreatmentPhoto[K
[0m[48;2;40;67;43m[39m+    182[0m:[39m[48;2;24;38;30m [38;2;101;115;126m# ---------------------------------------------------------------------------[K
[0m[48;2;40;67;43m[39m+    183[0m:[39m[48;2;24;38;30m [38;2;101;115;126mclass TreatmentPhoto(BaseModel):[K
[0m[48;2;40;67;43m[39m+    184[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    """Before / after / x-ray photo attached to a :class:`Treatment`."""[K
[0m[48;2;40;67;43m[39m+    185[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    186[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    PhotoType = PhotoType  # convenience re-export[K
[0m[48;2;40;67;43m[39m+    187[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    188[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    treatment = models.ForeignKey([K
[0m[48;2;40;67;43m[39m+    189[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        Treatment,[K
[0m[48;2;40;67;43m[39m+    190[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        on_delete=models.CASCADE,[K
[0m[48;2;40;67;43m[39m+    191[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        related_name="photos",[K
[0m[48;2;40;67;43m[39m+    192[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        related_query_name="photo",[K
[0m[48;2;40;67;43m[39m+    193[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        verbose_name=_("Davolash"),[K
[0m[48;2;40;67;43m[39m+    194[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    )[K
[0m[48;2;40;67;43m[39m+    195[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    photo_type = models.CharField([K
[0m[48;2;40;67;43m[39m+    196[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        _("Rasm turi"),[K
[0m[48;2;40;67;43m[39m+    197[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        max_length=10,[K
[0m[48;2;40;67;43m[39m+    198[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        choices=PhotoType.choices,[K
[0m[48;2;40;67;43m[39m+    199[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    )[K
[0m[48;2;40;67;43m[39m+    200[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    image = models.ImageField([K
[0m[48;2;40;67;43m[39m+    201[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        _("Rasm"),[K
[0m[48;2;40;67;43m[39m+    202[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        upload_to=_treatment_photo_upload_to,[K
[0m[48;2;40;67;43m[39m+    203[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        max_length=500,[K
[0m[48;2;40;67;43m[39m+    204[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    )[K
[0m[48;2;40;67;43m[39m+    205[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    thumbnail_path = models.CharField([K
[0m[48;2;40;67;43m[39m+    206[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        _("Thumbnail yo'li"),[K
[0m[48;2;40;67;43m[39m+    207[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        max_length=500,[K
[0m[48;2;40;67;43m[39m+    208[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        blank=True,[K
[0m[48;2;40;67;43m[39m+    209[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        default="",[K
[0m[48;2;40;67;43m[39m+    210[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        help_text=_([K
[0m[48;2;40;67;43m[39m+    211[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            "T23 (Celery task) tomonidan generatsiya qilinadigan kichraytirilgan "[K
[0m[48;2;40;67;43m[39m+    212[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            "rasm yo'li. Bo'sh qoldirilsa asosiy rasm ko'rsatiladi."[K
[0m[48;2;40;67;43m[39m+    213[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        ),[K
[0m[48;2;40;67;43m[39m+    214[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    )[K
[0m[48;2;40;67;43m[39m+    215[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    uploaded_at = models.DateTimeField([K
[0m[48;2;40;67;43m[39m+    216[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        _("Yuklangan sana"),[K
[0m[48;2;40;67;43m[39m+    217[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        auto_now_add=True,[K
[0m[48;2;40;67;43m[39m+    218[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    )[K
[0m[48;2;40;67;43m[39m+    219[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    uploaded_by = models.ForeignKey([K
[0m[48;2;40;67;43m[39m+    220[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        settings.AUTH_USER_MODEL,[K
[0m[48;2;40;67;43m[39m+    221[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        on_delete=models.PROTECT,[K
[0m[48;2;40;67;43m[39m+    222[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        related_name="treatment_photos_uploaded",[K
[0m[48;2;40;67;43m[39m+    223[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        verbose_name=_("Yuklagan foydalanuvchi"),[K
[0m[48;2;40;67;43m[39m+    224[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        null=True,[K
[0m[48;2;40;67;43m[39m+    225[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        blank=True,[K
[0m[48;2;40;67;43m[39m+    226[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    )[K
[0m[48;2;40;67;43m[39m+    227[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    caption = models.CharField([K
[0m[48;2;40;67;43m[39m+    228[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        _("Izoh"),[K
[0m[48;2;40;67;43m[39m+    229[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        max_length=255,[K
[0m[48;2;40;67;43m[39m+    230[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        blank=True,[K
[0m[48;2;40;67;43m[39m+    231[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        default="",[K
[0m[48;2;40;67;43m[39m+    232[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    )[K
[0m[48;2;40;67;43m[39m+    233[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    234[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    class Meta:[K
[0m[48;2;40;67;43m[39m+    235[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        verbose_name = _("Davolash rasmi")[K
[0m[48;2;40;67;43m[39m+    236[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        verbose_name_plural = _("Davolash rasmlari")[K
[0m[48;2;40;67;43m[39m+    237[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        ordering = ["-uploaded_at"][K
[0m[48;2;40;67;43m[39m+    238[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        indexes = [[K
[0m[48;2;40;67;43m[39m+    239[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            models.Index([K
[0m[48;2;40;67;43m[39m+    240[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                fields=["treatment", "photo_type"],[K
[0m[48;2;40;67;43m[39m+    241[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                name="tp_treatment_type_idx",[K
[0m[48;2;40;67;43m[39m+    242[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            ),[K
[0m[48;2;40;67;43m[39m+    243[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        ][K
[0m[48;2;40;67;43m[39m+    244[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    245[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    def __str__(self) -> str:  # pragma: no cover - repr helper[K
[0m[48;2;40;67;43m[39m+    246[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        return f"TreatmentPhoto({self.treatment_id}, {self.photo_type})"[K
[0m[48;2;40;67;43m[39m+    247[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    248[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    249[0m:[39m[48;2;24;38;30m [38;2;101;115;126m__all__ = [[K
[0m[48;2;40;67;43m[39m+    250[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    "Treatment",[K
[0m[48;2;40;67;43m[39m+    251[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    "TreatmentPhoto",[K
[0m[48;2;40;67;43m[39m+    252[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    "PaymentStatus",[K
[0m[48;2;40;67;43m[39m+    253[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    "TreatmentStage",[K
[0m[48;2;40;67;43m[39m+    254[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    "PhotoType",[K
[0m[48;2;40;67;43m[39m+    255[0m:[39m[48;2;24;38;30m [38;2;101;115;126m][K
[0m[K
Creating: [38;5;141m/home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/apps/treatments/models.py[0m
[38;5;244m - Completed in 0.1s[0m

I'll create the following file: [38;5;141m/home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/apps/treatments/selectors.py[0m[38;5;244m (using tool: write)[0m

[48;2;40;67;43m[39m+     1[0m:[39m[48;2;24;38;30m [38;2;101;115;126m"""[38;2;101;115;126mRead-side query helpers for the ``treatments`` app.[38;2;101;115;126m"""[K
[0m[48;2;40;67;43m[39m+     2[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206m__future__[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206mannotations[K
[0m[48;2;40;67;43m[39m+     3[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     4[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206mtyping[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206mAny[K
[0m[48;2;40;67;43m[39m+     5[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     6[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206mdjango[38;2;192;197;206m.[38;2;192;197;206mdb[38;2;192;197;206m.[38;2;192;197;206mmodels[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206mQ[38;2;192;197;206m,[38;2;192;197;206m [38;2;192;197;206mQuerySet[K
[0m[48;2;40;67;43m[39m+     7[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     8[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;180;142;173m.[38;2;192;197;206mmodels[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206mTreatment[38;2;192;197;206m,[38;2;192;197;206m [38;2;192;197;206mTreatmentPhoto[K
[0m[48;2;40;67;43m[39m+     9[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    10[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    11[0m:[39m[48;2;24;38;30m [38;2;180;142;173mdef[38;2;192;197;206m [38;2;143;161;179mall_treatments[38;2;192;197;206m([38;2;192;197;206m)[38;2;192;197;206m [38;2;192;197;206m->[38;2;192;197;206m [38;2;192;197;206mQuerySet[38;2;192;197;206m[[38;2;192;197;206mTreatment[38;2;192;197;206m][38;2;192;197;206m:[K
[0m[48;2;40;67;43m[39m+    12[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;101;115;126m"""[38;2;101;115;126mEvery treatment (soft-deleted included).[38;2;101;115;126m"""[K
[0m[48;2;40;67;43m[39m+    13[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;180;142;173mreturn[38;2;192;197;206m [38;2;192;197;206mTreatment[38;2;192;197;206m.[38;2;192;197;206mobjects[38;2;192;197;206m.[38;2;143;161;179mselect_related[38;2;192;197;206m([K
[0m[48;2;40;67;43m[39m+    14[0m:[39m[48;2;24;38;30m [38;2;192;197;206m        [38;2;192;197;206m"[38;2;163;190;140mdoctor[38;2;192;197;206m"[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+    15[0m:[39m[48;2;24;38;30m [38;2;192;197;206m        [38;2;192;197;206m"[38;2;163;190;140mdoctor__user[38;2;192;197;206m"[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+    16[0m:[39m[48;2;24;38;30m [38;2;192;197;206m        [38;2;192;197;206m"[38;2;163;190;140mpatient[38;2;192;197;206m"[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+    17[0m:[39m[48;2;24;38;30m [38;2;192;197;206m        [38;2;192;197;206m"[38;2;163;190;140mdepartment[38;2;192;197;206m"[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+    18[0m:[39m[48;2;24;38;30m [38;2;192;197;206m        [38;2;192;197;206m"[38;2;163;190;140mprocedure_type[38;2;192;197;206m"[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+    19[0m:[39m[48;2;24;38;30m [38;2;192;197;206m        [38;2;192;197;206m"[38;2;163;190;140mappointment[38;2;192;197;206m"[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+    20[0m:[39m[48;2;24;38;30m [38;2;192;197;206m        [38;2;192;197;206m"[38;2;163;190;140mcreated_by[38;2;192;197;206m"[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+    21[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;192;197;206m)[K
[0m[48;2;40;67;43m[39m+    22[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    23[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    24[0m:[39m[48;2;24;38;30m [38;2;180;142;173mdef[38;2;192;197;206m [38;2;143;161;179mactive_treatments[38;2;192;197;206m([38;2;192;197;206m)[38;2;192;197;206m [38;2;192;197;206m->[38;2;192;197;206m [38;2;192;197;206mQuerySet[38;2;192;197;206m[[38;2;192;197;206mTreatment[38;2;192;197;206m][38;2;192;197;206m:[K
[0m[48;2;40;67;43m[39m+    25[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;180;142;173mreturn[38;2;192;197;206m [38;2;143;161;179mall_treatments[38;2;192;197;206m([38;2;192;197;206m)[38;2;192;197;206m.[38;2;143;161;179mfilter[38;2;192;197;206m([38;2;191;97;106mis_active[38;2;192;197;206m=[38;2;208;135;112mTrue[38;2;192;197;206m)[K
[0m[48;2;40;67;43m[39m+    26[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    27[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    28[0m:[39m[48;2;24;38;30m [38;2;180;142;173mdef[38;2;192;197;206m [38;2;143;161;179mtreatment_by_id[38;2;192;197;206m([38;2;191;97;106mtreatment_id[38;2;192;197;206m:[38;2;192;197;206m [38;2;192;197;206mAny[38;2;192;197;206m)[38;2;192;197;206m [38;2;192;197;206m->[38;2;192;197;206m [38;2;192;197;206mTreatment[38;2;192;197;206m [38;2;192;197;206m|[38;2;192;197;206m [38;2;208;135;112mNone[38;2;192;197;206m:[K
[0m[48;2;40;67;43m[39m+    29[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;180;142;173mreturn[38;2;192;197;206m [38;2;143;161;179mall_treatments[38;2;192;197;206m([38;2;192;197;206m)[38;2;192;197;206m.[38;2;143;161;179mfilter[38;2;192;197;206m([38;2;191;97;106mpk[38;2;192;197;206m=[38;2;192;197;206mtreatment_id[38;2;192;197;206m)[38;2;192;197;206m.[38;2;143;161;179mfirst[38;2;192;197;206m([38;2;192;197;206m)[K
[0m[48;2;40;67;43m[39m+    30[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    31[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    32[0m:[39m[48;2;24;38;30m [38;2;180;142;173mdef[38;2;192;197;206m [38;2;143;161;179mtreatments_for_patient[38;2;192;197;206m([38;2;191;97;106mpatient_id[38;2;192;197;206m:[38;2;192;197;206m [38;2;192;197;206mAny[38;2;192;197;206m)[38;2;192;197;206m [38;2;192;197;206m->[38;2;192;197;206m [38;2;192;197;206mQuerySet[38;2;192;197;206m[[38;2;192;197;206mTreatment[38;2;192;197;206m][38;2;192;197;206m:[K
[0m[48;2;40;67;43m[39m+    33[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;180;142;173mreturn[38;2;192;197;206m [38;2;143;161;179mactive_treatments[38;2;192;197;206m([38;2;192;197;206m)[38;2;192;197;206m.[38;2;143;161;179mfilter[38;2;192;197;206m([38;2;191;97;106mpatient_id[38;2;192;197;206m=[38;2;192;197;206mpatient_id[38;2;192;197;206m)[38;2;192;197;206m.[38;2;143;161;179morder_by[38;2;192;197;206m([38;2;192;197;206m"[38;2;163;190;140m-created_at[38;2;192;197;206m"[38;2;192;197;206m)[K
[0m[48;2;40;67;43m[39m+    34[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    35[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    36[0m:[39m[48;2;24;38;30m [38;2;180;142;173mdef[38;2;192;197;206m [38;2;143;161;179mtreatments_for_doctor[38;2;192;197;206m([38;2;191;97;106mdoctor_id[38;2;192;197;206m:[38;2;192;197;206m [38;2;192;197;206mAny[38;2;192;197;206m)[38;2;192;197;206m [38;2;192;197;206m->[38;2;192;197;206m [38;2;192;197;206mQuerySet[38;2;192;197;206m[[38;2;192;197;206mTreatment[38;2;192;197;206m][38;2;192;197;206m:[K
[0m[48;2;40;67;43m[39m+    37[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;180;142;173mreturn[38;2;192;197;206m [38;2;143;161;179mactive_treatments[38;2;192;197;206m([38;2;192;197;206m)[38;2;192;197;206m.[38;2;143;161;179mfilter[38;2;192;197;206m([38;2;191;97;106mdoctor_id[38;2;192;197;206m=[38;2;192;197;206mdoctor_id[38;2;192;197;206m)[38;2;192;197;206m.[38;2;143;161;179morder_by[38;2;192;197;206m([38;2;192;197;206m"[38;2;163;190;140m-created_at[38;2;192;197;206m"[38;2;192;197;206m)[K
[0m[48;2;40;67;43m[39m+    38[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    39[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    40[0m:[39m[48;2;24;38;30m [38;2;180;142;173mdef[38;2;192;197;206m [38;2;143;161;179mfilter_treatments[38;2;192;197;206m([K
[0m[48;2;40;67;43m[39m+    41[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    *[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+    42[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;191;97;106mpatient_id[38;2;192;197;206m:[38;2;192;197;206m [38;2;192;197;206mAny[38;2;192;197;206m [38;2;192;197;206m=[38;2;192;197;206m [38;2;208;135;112mNone[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+    43[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;191;97;106mdoctor_id[38;2;192;197;206m:[38;2;192;197;206m [38;2;192;197;206mAny[38;2;192;197;206m [38;2;192;197;206m=[38;2;192;197;206m [38;2;208;135;112mNone[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+    44[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;191;97;106mdepartment_id[38;2;192;197;206m:[38;2;192;197;206m [38;2;192;197;206mAny[38;2;192;197;206m [38;2;192;197;206m=[38;2;192;197;206m [38;2;208;135;112mNone[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+    45[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;191;97;106mpayment_status[38;2;192;197;206m:[38;2;192;197;206m [38;2;192;197;206mstr[38;2;192;197;206m [38;2;192;197;206m|[38;2;192;197;206m [38;2;208;135;112mNone[38;2;192;197;206m [38;2;192;197;206m=[38;2;192;197;206m [38;2;208;135;112mNone[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+    46[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;191;97;106mstage[38;2;192;197;206m:[38;2;192;197;206m [38;2;192;197;206mstr[38;2;192;197;206m [38;2;192;197;206m|[38;2;192;197;206m [38;2;208;135;112mNone[38;2;192;197;206m [38;2;192;197;206m=[38;2;192;197;206m [38;2;208;135;112mNone[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+    47[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;191;97;106minclude_inactive[38;2;192;197;206m:[38;2;192;197;206m [38;2;192;197;206mbool[38;2;192;197;206m [38;2;192;197;206m=[38;2;192;197;206m [38;2;208;135;112mFalse[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+    48[0m:[39m[48;2;24;38;30m [38;2;192;197;206m)[38;2;192;197;206m [38;2;192;197;206m->[38;2;192;197;206m [38;2;192;197;206mQuerySet[38;2;192;197;206m[[38;2;192;197;206mTreatment[38;2;192;197;206m][38;2;192;197;206m:[K
[0m[48;2;40;67;43m[39m+    49[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;101;115;126m"""[38;2;101;115;126mCombined filter used by the list endpoint.[38;2;101;115;126m"""[K
[0m[48;2;40;67;43m[39m+    50[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;192;197;206mqs[38;2;192;197;206m [38;2;192;197;206m=[38;2;192;197;206m [38;2;143;161;179mall_treatments[38;2;192;197;206m([38;2;192;197;206m)[38;2;192;197;206m [38;2;180;142;173mif[38;2;192;197;206m [38;2;192;197;206minclude_inactive[38;2;192;197;206m [38;2;180;142;173melse[38;2;192;197;206m [38;2;143;161;179mactive_treatments[38;2;192;197;206m([38;2;192;197;206m)[K
[0m[48;2;40;67;43m[39m+    51[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;192;197;206mcondition[38;2;192;197;206m [38;2;192;197;206m=[38;2;192;197;206m [38;2;143;161;179mQ[38;2;192;197;206m([38;2;192;197;206m)[K
[0m[48;2;40;67;43m[39m+    52[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;180;142;173mif[38;2;192;197;206m [38;2;192;197;206mpatient_id[38;2;192;197;206m:[K
[0m[48;2;40;67;43m[39m+    53[0m:[39m[48;2;24;38;30m [38;2;192;197;206m        [38;2;192;197;206mcondition[38;2;192;197;206m [38;2;192;197;206m&=[38;2;192;197;206m [38;2;143;161;179mQ[38;2;192;197;206m([38;2;191;97;106mpatient_id[38;2;192;197;206m=[38;2;192;197;206mpatient_id[38;2;192;197;206m)[K
[0m[48;2;40;67;43m[39m+    54[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;180;142;173mif[38;2;192;197;206m [38;2;192;197;206mdoctor_id[38;2;192;197;206m:[K
[0m[48;2;40;67;43m[39m+    55[0m:[39m[48;2;24;38;30m [38;2;192;197;206m        [38;2;192;197;206mcondition[38;2;192;197;206m [38;2;192;197;206m&=[38;2;192;197;206m [38;2;143;161;179mQ[38;2;192;197;206m([38;2;191;97;106mdoctor_id[38;2;192;197;206m=[38;2;192;197;206mdoctor_id[38;2;192;197;206m)[K
[0m[48;2;40;67;43m[39m+    56[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;180;142;173mif[38;2;192;197;206m [38;2;192;197;206mdepartment_id[38;2;192;197;206m:[K
[0m[48;2;40;67;43m[39m+    57[0m:[39m[48;2;24;38;30m [38;2;192;197;206m        [38;2;192;197;206mcondition[38;2;192;197;206m [38;2;192;197;206m&=[38;2;192;197;206m [38;2;143;161;179mQ[38;2;192;197;206m([38;2;191;97;106mdepartment_id[38;2;192;197;206m=[38;2;192;197;206mdepartment_id[38;2;192;197;206m)[K
[0m[48;2;40;67;43m[39m+    58[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;180;142;173mif[38;2;192;197;206m [38;2;192;197;206mpayment_status[38;2;192;197;206m:[K
[0m[48;2;40;67;43m[39m+    59[0m:[39m[48;2;24;38;30m [38;2;192;197;206m        [38;2;192;197;206mcondition[38;2;192;197;206m [38;2;192;197;206m&=[38;2;192;197;206m [38;2;143;161;179mQ[38;2;192;197;206m([38;2;191;97;106mpayment_status[38;2;192;197;206m=[38;2;192;197;206mpayment_status[38;2;192;197;206m)[K
[0m[48;2;40;67;43m[39m+    60[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;180;142;173mif[38;2;192;197;206m [38;2;192;197;206mstage[38;2;192;197;206m:[K
[0m[48;2;40;67;43m[39m+    61[0m:[39m[48;2;24;38;30m [38;2;192;197;206m        [38;2;192;197;206mcondition[38;2;192;197;206m [38;2;192;197;206m&=[38;2;192;197;206m [38;2;143;161;179mQ[38;2;192;197;206m([38;2;191;97;106mstage[38;2;192;197;206m=[38;2;192;197;206mstage[38;2;192;197;206m)[K
[0m[48;2;40;67;43m[39m+    62[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;180;142;173mreturn[38;2;192;197;206m [38;2;192;197;206mqs[38;2;192;197;206m.[38;2;143;161;179mfilter[38;2;192;197;206m([38;2;192;197;206mcondition[38;2;192;197;206m)[38;2;192;197;206m.[38;2;143;161;179morder_by[38;2;192;197;206m([38;2;192;197;206m"[38;2;163;190;140m-created_at[38;2;192;197;206m"[38;2;192;197;206m)[K
[0m[48;2;40;67;43m[39m+    63[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    64[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    65[0m:[39m[48;2;24;38;30m [38;2;180;142;173mdef[38;2;192;197;206m [38;2;143;161;179mphotos_for_treatment[38;2;192;197;206m([38;2;191;97;106mtreatment_id[38;2;192;197;206m:[38;2;192;197;206m [38;2;192;197;206mAny[38;2;192;197;206m)[38;2;192;197;206m [38;2;192;197;206m->[38;2;192;197;206m [38;2;192;197;206mQuerySet[38;2;192;197;206m[[38;2;192;197;206mTreatmentPhoto[38;2;192;197;206m][38;2;192;197;206m:[K
[0m[48;2;40;67;43m[39m+    66[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;180;142;173mreturn[38;2;192;197;206m [38;2;192;197;206m([K
[0m[48;2;40;67;43m[39m+    67[0m:[39m[48;2;24;38;30m [38;2;192;197;206m        [38;2;192;197;206mTreatmentPhoto[38;2;192;197;206m.[38;2;192;197;206mobjects[38;2;192;197;206m.[38;2;143;161;179mfilter[38;2;192;197;206m([38;2;191;97;106mtreatment_id[38;2;192;197;206m=[38;2;192;197;206mtreatment_id[38;2;192;197;206m,[38;2;192;197;206m [38;2;191;97;106mis_active[38;2;192;197;206m=[38;2;208;135;112mTrue[38;2;192;197;206m)[K
[0m[48;2;40;67;43m[39m+    68[0m:[39m[48;2;24;38;30m [38;2;192;197;206m        [38;2;192;197;206m.[38;2;143;161;179mselect_related[38;2;192;197;206m([38;2;192;197;206m"[38;2;163;190;140muploaded_by[38;2;192;197;206m"[38;2;192;197;206m)[K
[0m[48;2;40;67;43m[39m+    69[0m:[39m[48;2;24;38;30m [38;2;192;197;206m        [38;2;192;197;206m.[38;2;143;161;179morder_by[38;2;192;197;206m([38;2;192;197;206m"[38;2;163;190;140m-uploaded_at[38;2;192;197;206m"[38;2;192;197;206m)[K
[0m[48;2;40;67;43m[39m+    70[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;192;197;206m)[K
[0m[48;2;40;67;43m[39m+    71[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    72[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    73[0m:[39m[48;2;24;38;30m [38;2;192;197;206m__all__[38;2;192;197;206m [38;2;192;197;206m=[38;2;192;197;206m [38;2;192;197;206m[[K
[0m[48;2;40;67;43m[39m+    74[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;192;197;206m"[38;2;163;190;140mall_treatments[38;2;192;197;206m"[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+    75[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;192;197;206m"[38;2;163;190;140mactive_treatments[38;2;192;197;206m"[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+    76[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;192;197;206m"[38;2;163;190;140mtreatment_by_id[38;2;192;197;206m"[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+    77[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;192;197;206m"[38;2;163;190;140mtreatments_for_patient[38;2;192;197;206m"[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+    78[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;192;197;206m"[38;2;163;190;140mtreatments_for_doctor[38;2;192;197;206m"[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+    79[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;192;197;206m"[38;2;163;190;140mfilter_treatments[38;2;192;197;206m"[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+    80[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;192;197;206m"[38;2;163;190;140mphotos_for_treatment[38;2;192;197;206m"[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+    81[0m:[39m[48;2;24;38;30m [38;2;192;197;206m][K
[0m[K
Creating: [38;5;141m/home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/apps/treatments/selectors.py[0m
[38;5;244m - Completed in 0.0s[0m

I'll create the following file: [38;5;141m/home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/apps/treatments/services.py[0m[38;5;244m (using tool: write)[0m

[48;2;40;67;43m[39m+      1[0m:[39m[48;2;24;38;30m [38;2;101;115;126m"""[38;2;101;115;126mWrite-side business logic for the ``treatments`` app.[K
[0m[48;2;40;67;43m[39m+      2[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+      3[0m:[39m[48;2;24;38;30m [38;2;101;115;126mRules enforced here (per PROJECT_BRIEF § "treatments app"):[K
[0m[48;2;40;67;43m[39m+      4[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+      5[0m:[39m[48;2;24;38;30m [38;2;101;115;126m* ``doctor.departments`` must include ``department`` (so a doctor can[K
[0m[48;2;40;67;43m[39m+      6[0m:[39m[48;2;24;38;30m [38;2;101;115;126m  only treat under a department they belong to).[K
[0m[48;2;40;67;43m[39m+      7[0m:[39m[48;2;24;38;30m [38;2;101;115;126m* ``procedure_type.department`` (if provided) must match the treatment[K
[0m[48;2;40;67;43m[39m+      8[0m:[39m[48;2;24;38;30m [38;2;101;115;126m  department — prevents mis-classified statistics.[K
[0m[48;2;40;67;43m[39m+      9[0m:[39m[48;2;24;38;30m [38;2;101;115;126m* ``appointment`` (if provided) must reference the same patient and[K
[0m[48;2;40;67;43m[39m+     10[0m:[39m[48;2;24;38;30m [38;2;101;115;126m  doctor — you can't attach a treatment to someone else's appointment.[K
[0m[48;2;40;67;43m[39m+     11[0m:[39m[48;2;24;38;30m [38;2;101;115;126m* ``price`` must be non-negative. Defaults to the procedure_type's[K
[0m[48;2;40;67;43m[39m+     12[0m:[39m[48;2;24;38;30m [38;2;101;115;126m  ``default_price`` when omitted.[K
[0m[48;2;40;67;43m[39m+     13[0m:[39m[48;2;24;38;30m [38;2;101;115;126m* Stage transitions: ``in_progress`` → ``completed`` only. Moving back[K
[0m[48;2;40;67;43m[39m+     14[0m:[39m[48;2;24;38;30m [38;2;101;115;126m  is not supported to keep the audit trail meaningful.[K
[0m[48;2;40;67;43m[39m+     15[0m:[39m[48;2;24;38;30m [38;2;101;115;126m"""[K
[0m[48;2;40;67;43m[39m+     16[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206m__future__[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206mannotations[K
[0m[48;2;40;67;43m[39m+     17[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     18[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206mdecimal[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206mDecimal[38;2;192;197;206m,[38;2;192;197;206m [38;2;192;197;206mInvalidOperation[K
[0m[48;2;40;67;43m[39m+     19[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206mtyping[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206mAny[K
[0m[48;2;40;67;43m[39m+     20[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     21[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206mdjango[38;2;192;197;206m.[38;2;192;197;206mcontrib[38;2;192;197;206m.[38;2;192;197;206mauth[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206mget_user_model[K
[0m[48;2;40;67;43m[39m+     22[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206mdjango[38;2;192;197;206m.[38;2;192;197;206mcore[38;2;192;197;206m.[38;2;192;197;206mexceptions[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206mValidationError[K
[0m[48;2;40;67;43m[39m+     23[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206mdjango[38;2;192;197;206m.[38;2;192;197;206mdb[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206mtransaction[K
[0m[48;2;40;67;43m[39m+     24[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     25[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206mapps[38;2;192;197;206m.[38;2;192;197;206mdepartments[38;2;192;197;206m.[38;2;192;197;206mmodels[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206mDepartment[K
[0m[48;2;40;67;43m[39m+     26[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206mapps[38;2;192;197;206m.[38;2;192;197;206mdoctors[38;2;192;197;206m.[38;2;192;197;206mmodels[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206mDoctorProfile[38;2;192;197;206m,[38;2;192;197;206m [38;2;192;197;206mProcedureType[K
[0m[48;2;40;67;43m[39m+     27[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206mapps[38;2;192;197;206m.[38;2;192;197;206mpatients[38;2;192;197;206m.[38;2;192;197;206mmodels[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206mPatient[K
[0m[48;2;40;67;43m[39m+     28[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206mapps[38;2;192;197;206m.[38;2;192;197;206mscheduling[38;2;192;197;206m.[38;2;192;197;206mmodels[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206mAppointment[K
[0m[48;2;40;67;43m[39m+     29[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     30[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;180;142;173m.[38;2;192;197;206mmodels[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206mPaymentStatus[38;2;192;197;206m,[38;2;192;197;206m [38;2;192;197;206mPhotoType[38;2;192;197;206m,[38;2;192;197;206m [38;2;192;197;206mTreatment[38;2;192;197;206m,[38;2;192;197;206m [38;2;192;197;206mTreatmentPhoto[38;2;192;197;206m,[38;2;192;197;206m [38;2;192;197;206mTreatmentStage[K
[0m[48;2;40;67;43m[39m+     31[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     32[0m:[39m[48;2;24;38;30m [38;2;192;197;206mUser[38;2;192;197;206m [38;2;192;197;206m=[38;2;192;197;206m [38;2;143;161;179mget_user_model[38;2;192;197;206m([38;2;192;197;206m)[K
[0m[48;2;40;67;43m[39m+     33[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     34[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     35[0m:[39m[48;2;24;38;30m [38;2;101;115;126m#[38;2;101;115;126m ---------------------------------------------------------------------------[K
[0m[48;2;40;67;43m[39m+     36[0m:[39m[48;2;24;38;30m [38;2;101;115;126m# Field cleaners[K
[0m[48;2;40;67;43m[39m+     37[0m:[39m[48;2;24;38;30m [38;2;101;115;126m# ---------------------------------------------------------------------------[K
[0m[48;2;40;67;43m[39m+     38[0m:[39m[48;2;24;38;30m [38;2;101;115;126mdef _clean_text(value: Any, *, max_length: int, field: str) -> str:[K
[0m[48;2;40;67;43m[39m+     39[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    if value is None:[K
[0m[48;2;40;67;43m[39m+     40[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        return ""[K
[0m[48;2;40;67;43m[39m+     41[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    text = str(value).strip()[K
[0m[48;2;40;67;43m[39m+     42[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    if len(text) > max_length:[K
[0m[48;2;40;67;43m[39m+     43[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        raise ValidationError([K
[0m[48;2;40;67;43m[39m+     44[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            {field: [f"Matn {max_length} belgidan uzun bo'lmasin."]}[K
[0m[48;2;40;67;43m[39m+     45[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        )[K
[0m[48;2;40;67;43m[39m+     46[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    return text[K
[0m[48;2;40;67;43m[39m+     47[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     48[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     49[0m:[39m[48;2;24;38;30m [38;2;101;115;126mdef _clean_price(value: Any, *, default: Decimal = Decimal("0.00")) -> Decimal:[K
[0m[48;2;40;67;43m[39m+     50[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    if value in (None, ""):[K
[0m[48;2;40;67;43m[39m+     51[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        return default[K
[0m[48;2;40;67;43m[39m+     52[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    try:[K
[0m[48;2;40;67;43m[39m+     53[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        price = Decimal(str(value))[K
[0m[48;2;40;67;43m[39m+     54[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    except (InvalidOperation, TypeError) as exc:[K
[0m[48;2;40;67;43m[39m+     55[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        raise ValidationError({"price": ["Narx raqam bo'lishi kerak."]}) from exc[K
[0m[48;2;40;67;43m[39m+     56[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    if price < 0:[K
[0m[48;2;40;67;43m[39m+     57[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        raise ValidationError({"price": ["Narx manfiy bo'lishi mumkin emas."]})[K
[0m[48;2;40;67;43m[39m+     58[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    # Normalise to 2dp so DB round-trips are stable in tests.[K
[0m[48;2;40;67;43m[39m+     59[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    return price.quantize(Decimal("0.01"))[K
[0m[48;2;40;67;43m[39m+     60[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     61[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     62[0m:[39m[48;2;24;38;30m [38;2;101;115;126mdef _clean_choice([K
[0m[48;2;40;67;43m[39m+     63[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    value: Any, *, choices: type, field: str, default: str | None = None[K
[0m[48;2;40;67;43m[39m+     64[0m:[39m[48;2;24;38;30m [38;2;101;115;126m) -> str:[K
[0m[48;2;40;67;43m[39m+     65[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    if value in (None, ""):[K
[0m[48;2;40;67;43m[39m+     66[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        if default is not None:[K
[0m[48;2;40;67;43m[39m+     67[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            return default[K
[0m[48;2;40;67;43m[39m+     68[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        raise ValidationError({field: [f"'{field}' majburiy."]})[K
[0m[48;2;40;67;43m[39m+     69[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    text = str(value).strip().lower()[K
[0m[48;2;40;67;43m[39m+     70[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    if text not in choices.values:[K
[0m[48;2;40;67;43m[39m+     71[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        raise ValidationError({field: [f"Noto'g'ri qiymat: {value!r}."]})[K
[0m[48;2;40;67;43m[39m+     72[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    return text[K
[0m[48;2;40;67;43m[39m+     73[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     74[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     75[0m:[39m[48;2;24;38;30m [38;2;101;115;126m# ---------------------------------------------------------------------------[K
[0m[48;2;40;67;43m[39m+     76[0m:[39m[48;2;24;38;30m [38;2;101;115;126m# Cross-model consistency[K
[0m[48;2;40;67;43m[39m+     77[0m:[39m[48;2;24;38;30m [38;2;101;115;126m# ---------------------------------------------------------------------------[K
[0m[48;2;40;67;43m[39m+     78[0m:[39m[48;2;24;38;30m [38;2;101;115;126mdef _resolve_doctor(doctor: Any) -> DoctorProfile:[K
[0m[48;2;40;67;43m[39m+     79[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    if isinstance(doctor, DoctorProfile):[K
[0m[48;2;40;67;43m[39m+     80[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        return doctor[K
[0m[48;2;40;67;43m[39m+     81[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    try:[K
[0m[48;2;40;67;43m[39m+     82[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        return DoctorProfile.objects.select_related("user").get(pk=doctor)[K
[0m[48;2;40;67;43m[39m+     83[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    except DoctorProfile.DoesNotExist as exc:[K
[0m[48;2;40;67;43m[39m+     84[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        raise ValidationError({"doctor": ["Shifokor topilmadi."]}) from exc[K
[0m[48;2;40;67;43m[39m+     85[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     86[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     87[0m:[39m[48;2;24;38;30m [38;2;101;115;126mdef _resolve_patient(patient: Any) -> Patient:[K
[0m[48;2;40;67;43m[39m+     88[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    if isinstance(patient, Patient):[K
[0m[48;2;40;67;43m[39m+     89[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        return patient[K
[0m[48;2;40;67;43m[39m+     90[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    try:[K
[0m[48;2;40;67;43m[39m+     91[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        return Patient.objects.get(pk=patient)[K
[0m[48;2;40;67;43m[39m+     92[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    except Patient.DoesNotExist as exc:[K
[0m[48;2;40;67;43m[39m+     93[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        raise ValidationError({"patient": ["Bemor topilmadi."]}) from exc[K
[0m[48;2;40;67;43m[39m+     94[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     95[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     96[0m:[39m[48;2;24;38;30m [38;2;101;115;126mdef _resolve_department(department: Any) -> Department:[K
[0m[48;2;40;67;43m[39m+     97[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    if isinstance(department, Department):[K
[0m[48;2;40;67;43m[39m+     98[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        return department[K
[0m[48;2;40;67;43m[39m+     99[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    try:[K
[0m[48;2;40;67;43m[39m+    100[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        return Department.objects.get(pk=department)[K
[0m[48;2;40;67;43m[39m+    101[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    except Department.DoesNotExist as exc:[K
[0m[48;2;40;67;43m[39m+    102[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        raise ValidationError({"department": ["Bo'lim topilmadi."]}) from exc[K
[0m[48;2;40;67;43m[39m+    103[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    104[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    105[0m:[39m[48;2;24;38;30m [38;2;101;115;126mdef _resolve_procedure_type(procedure_type: Any) -> ProcedureType | None:[K
[0m[48;2;40;67;43m[39m+    106[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    if procedure_type in (None, ""):[K
[0m[48;2;40;67;43m[39m+    107[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        return None[K
[0m[48;2;40;67;43m[39m+    108[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    if isinstance(procedure_type, ProcedureType):[K
[0m[48;2;40;67;43m[39m+    109[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        return procedure_type[K
[0m[48;2;40;67;43m[39m+    110[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    try:[K
[0m[48;2;40;67;43m[39m+    111[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        return ProcedureType.objects.select_related("department").get(pk=procedure_type)[K
[0m[48;2;40;67;43m[39m+    112[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    except ProcedureType.DoesNotExist as exc:[K
[0m[48;2;40;67;43m[39m+    113[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        raise ValidationError([K
[0m[48;2;40;67;43m[39m+    114[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            {"procedure_type": ["Muolaja turi topilmadi."]}[K
[0m[48;2;40;67;43m[39m+    115[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        ) from exc[K
[0m[48;2;40;67;43m[39m+    116[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    117[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    118[0m:[39m[48;2;24;38;30m [38;2;101;115;126mdef _resolve_appointment(appointment: Any) -> Appointment | None:[K
[0m[48;2;40;67;43m[39m+    119[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    if appointment in (None, ""):[K
[0m[48;2;40;67;43m[39m+    120[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        return None[K
[0m[48;2;40;67;43m[39m+    121[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    if isinstance(appointment, Appointment):[K
[0m[48;2;40;67;43m[39m+    122[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        return appointment[K
[0m[48;2;40;67;43m[39m+    123[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    try:[K
[0m[48;2;40;67;43m[39m+    124[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        return Appointment.objects.get(pk=appointment)[K
[0m[48;2;40;67;43m[39m+    125[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    except Appointment.DoesNotExist as exc:[K
[0m[48;2;40;67;43m[39m+    126[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        raise ValidationError([K
[0m[48;2;40;67;43m[39m+    127[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            {"appointment": ["Navbat topilmadi."]}[K
[0m[48;2;40;67;43m[39m+    128[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        ) from exc[K
[0m[48;2;40;67;43m[39m+    129[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    130[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    131[0m:[39m[48;2;24;38;30m [38;2;101;115;126mdef _assert_consistency([K
[0m[48;2;40;67;43m[39m+    132[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    *,[K
[0m[48;2;40;67;43m[39m+    133[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    doctor: DoctorProfile,[K
[0m[48;2;40;67;43m[39m+    134[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    patient: Patient,[K
[0m[48;2;40;67;43m[39m+    135[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    department: Department,[K
[0m[48;2;40;67;43m[39m+    136[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    procedure_type: ProcedureType | None,[K
[0m[48;2;40;67;43m[39m+    137[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    appointment: Appointment | None,[K
[0m[48;2;40;67;43m[39m+    138[0m:[39m[48;2;24;38;30m [38;2;101;115;126m) -> None:[K
[0m[48;2;40;67;43m[39m+    139[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    """Cross-object rules that can't be expressed as DB constraints."""[K
[0m[48;2;40;67;43m[39m+    140[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    # Doctor must belong to department.[K
[0m[48;2;40;67;43m[39m+    141[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    if not doctor.departments.filter(pk=department.pk).exists():[K
[0m[48;2;40;67;43m[39m+    142[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        raise ValidationError([K
[0m[48;2;40;67;43m[39m+    143[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            {"department": [[K
[0m[48;2;40;67;43m[39m+    144[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                "Bu shifokor tanlangan bo'limda ishlamaydi."[K
[0m[48;2;40;67;43m[39m+    145[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            ]}[K
[0m[48;2;40;67;43m[39m+    146[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        )[K
[0m[48;2;40;67;43m[39m+    147[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    148[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    # ProcedureType.department must match treatment.department.[K
[0m[48;2;40;67;43m[39m+    149[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    if procedure_type is not None and procedure_type.department_id != department.pk:[K
[0m[48;2;40;67;43m[39m+    150[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        raise ValidationError([K
[0m[48;2;40;67;43m[39m+    151[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            {"procedure_type": [[K
[0m[48;2;40;67;43m[39m+    152[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                "Muolaja turi tanlangan bo'limga tegishli emas."[K
[0m[48;2;40;67;43m[39m+    153[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            ]}[K
[0m[48;2;40;67;43m[39m+    154[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        )[K
[0m[48;2;40;67;43m[39m+    155[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    156[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    # Appointment.patient / .doctor must match.[K
[0m[48;2;40;67;43m[39m+    157[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    if appointment is not None:[K
[0m[48;2;40;67;43m[39m+    158[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        if appointment.patient_id != patient.pk:[K
[0m[48;2;40;67;43m[39m+    159[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            raise ValidationError([K
[0m[48;2;40;67;43m[39m+    160[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                {"appointment": [[K
[0m[48;2;40;67;43m[39m+    161[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                    "Navbat bemori ushbu davolanish bemori bilan mos kelmaydi."[K
[0m[48;2;40;67;43m[39m+    162[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                ]}[K
[0m[48;2;40;67;43m[39m+    163[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            )[K
[0m[48;2;40;67;43m[39m+    164[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        if appointment.doctor_id != doctor.pk:[K
[0m[48;2;40;67;43m[39m+    165[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            raise ValidationError([K
[0m[48;2;40;67;43m[39m+    166[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                {"appointment": [[K
[0m[48;2;40;67;43m[39m+    167[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                    "Navbat shifokori ushbu davolanish shifokori bilan mos kelmaydi."[K
[0m[48;2;40;67;43m[39m+    168[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                ]}[K
[0m[48;2;40;67;43m[39m+    169[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            )[K
[0m[48;2;40;67;43m[39m+    170[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    171[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    172[0m:[39m[48;2;24;38;30m [38;2;101;115;126m# ---------------------------------------------------------------------------[K
[0m[48;2;40;67;43m[39m+    173[0m:[39m[48;2;24;38;30m [38;2;101;115;126m# Public API — Treatment[K
[0m[48;2;40;67;43m[39m+    174[0m:[39m[48;2;24;38;30m [38;2;101;115;126m# ---------------------------------------------------------------------------[K
[0m[48;2;40;67;43m[39m+    175[0m:[39m[48;2;24;38;30m [38;2;101;115;126m@transaction.atomic[K
[0m[48;2;40;67;43m[39m+    176[0m:[39m[48;2;24;38;30m [38;2;101;115;126mdef create_treatment([K
[0m[48;2;40;67;43m[39m+    177[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    *,[K
[0m[48;2;40;67;43m[39m+    178[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    doctor: Any,[K
[0m[48;2;40;67;43m[39m+    179[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    patient: Any,[K
[0m[48;2;40;67;43m[39m+    180[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    department: Any,[K
[0m[48;2;40;67;43m[39m+    181[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    procedure_type: Any = None,[K
[0m[48;2;40;67;43m[39m+    182[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    appointment: Any = None,[K
[0m[48;2;40;67;43m[39m+    183[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    diagnosis: str = "",[K
[0m[48;2;40;67;43m[39m+    184[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    description: str = "",[K
[0m[48;2;40;67;43m[39m+    185[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    price: Any = None,[K
[0m[48;2;40;67;43m[39m+    186[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    payment_status: str = PaymentStatus.UNPAID,[K
[0m[48;2;40;67;43m[39m+    187[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    stage: str = TreatmentStage.IN_PROGRESS,[K
[0m[48;2;40;67;43m[39m+    188[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    created_by: Any = None,[K
[0m[48;2;40;67;43m[39m+    189[0m:[39m[48;2;24;38;30m [38;2;101;115;126m) -> Treatment:[K
[0m[48;2;40;67;43m[39m+    190[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    """Create a new treatment, enforcing cross-object consistency."""[K
[0m[48;2;40;67;43m[39m+    191[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    doctor_obj = _resolve_doctor(doctor)[K
[0m[48;2;40;67;43m[39m+    192[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    patient_obj = _resolve_patient(patient)[K
[0m[48;2;40;67;43m[39m+    193[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    department_obj = _resolve_department(department)[K
[0m[48;2;40;67;43m[39m+    194[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    procedure_obj = _resolve_procedure_type(procedure_type)[K
[0m[48;2;40;67;43m[39m+    195[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    appointment_obj = _resolve_appointment(appointment)[K
[0m[48;2;40;67;43m[39m+    196[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    197[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    _assert_consistency([K
[0m[48;2;40;67;43m[39m+    198[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        doctor=doctor_obj,[K
[0m[48;2;40;67;43m[39m+    199[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        patient=patient_obj,[K
[0m[48;2;40;67;43m[39m+    200[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        department=department_obj,[K
[0m[48;2;40;67;43m[39m+    201[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        procedure_type=procedure_obj,[K
[0m[48;2;40;67;43m[39m+    202[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        appointment=appointment_obj,[K
[0m[48;2;40;67;43m[39m+    203[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    )[K
[0m[48;2;40;67;43m[39m+    204[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    205[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    # Default price from procedure type when omitted.[K
[0m[48;2;40;67;43m[39m+    206[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    if price in (None, "") and procedure_obj is not None:[K
[0m[48;2;40;67;43m[39m+    207[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        resolved_price = Decimal(procedure_obj.default_price)[K
[0m[48;2;40;67;43m[39m+    208[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    else:[K
[0m[48;2;40;67;43m[39m+    209[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        resolved_price = _clean_price(price)[K
[0m[48;2;40;67;43m[39m+    210[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    211[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    return Treatment.objects.create([K
[0m[48;2;40;67;43m[39m+    212[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        doctor=doctor_obj,[K
[0m[48;2;40;67;43m[39m+    213[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        patient=patient_obj,[K
[0m[48;2;40;67;43m[39m+    214[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        department=department_obj,[K
[0m[48;2;40;67;43m[39m+    215[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        procedure_type=procedure_obj,[K
[0m[48;2;40;67;43m[39m+    216[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        appointment=appointment_obj,[K
[0m[48;2;40;67;43m[39m+    217[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        diagnosis=_clean_text(diagnosis, max_length=500, field="diagnosis"),[K
[0m[48;2;40;67;43m[39m+    218[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        description=_clean_text([K
[0m[48;2;40;67;43m[39m+    219[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            description, max_length=10_000, field="description"[K
[0m[48;2;40;67;43m[39m+    220[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        ),[K
[0m[48;2;40;67;43m[39m+    221[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        price=resolved_price,[K
[0m[48;2;40;67;43m[39m+    222[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        payment_status=_clean_choice([K
[0m[48;2;40;67;43m[39m+    223[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            payment_status,[K
[0m[48;2;40;67;43m[39m+    224[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            choices=PaymentStatus,[K
[0m[48;2;40;67;43m[39m+    225[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            field="payment_status",[K
[0m[48;2;40;67;43m[39m+    226[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            default=PaymentStatus.UNPAID,[K
[0m[48;2;40;67;43m[39m+    227[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        ),[K
[0m[48;2;40;67;43m[39m+    228[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        stage=_clean_choice([K
[0m[48;2;40;67;43m[39m+    229[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            stage,[K
[0m[48;2;40;67;43m[39m+    230[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            choices=TreatmentStage,[K
[0m[48;2;40;67;43m[39m+    231[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            field="stage",[K
[0m[48;2;40;67;43m[39m+    232[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            default=TreatmentStage.IN_PROGRESS,[K
[0m[48;2;40;67;43m[39m+    233[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        ),[K
[0m[48;2;40;67;43m[39m+    234[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        created_by=created_by if isinstance(created_by, User) else None,[K
[0m[48;2;40;67;43m[39m+    235[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        is_active=True,[K
[0m[48;2;40;67;43m[39m+    236[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    )[K
[0m[48;2;40;67;43m[39m+    237[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    238[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    239[0m:[39m[48;2;24;38;30m [38;2;101;115;126m@transaction.atomic[K
[0m[48;2;40;67;43m[39m+    240[0m:[39m[48;2;24;38;30m [38;2;101;115;126mdef update_treatment([K
[0m[48;2;40;67;43m[39m+    241[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    treatment: Treatment,[K
[0m[48;2;40;67;43m[39m+    242[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    *,[K
[0m[48;2;40;67;43m[39m+    243[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    diagnosis: str | None = None,[K
[0m[48;2;40;67;43m[39m+    244[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    description: str | None = None,[K
[0m[48;2;40;67;43m[39m+    245[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    price: Any = ...,[K
[0m[48;2;40;67;43m[39m+    246[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    payment_status: str | None = None,[K
[0m[48;2;40;67;43m[39m+    247[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    stage: str | None = None,[K
[0m[48;2;40;67;43m[39m+    248[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    procedure_type: Any = ...,[K
[0m[48;2;40;67;43m[39m+    249[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    is_active: bool | None = None,[K
[0m[48;2;40;67;43m[39m+    250[0m:[39m[48;2;24;38;30m [38;2;101;115;126m) -> Treatment:[K
[0m[48;2;40;67;43m[39m+    251[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    """Partial update; only kwargs that were passed are touched."""[K
[0m[48;2;40;67;43m[39m+    252[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    update_fields: list[str] = [][K
[0m[48;2;40;67;43m[39m+    253[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    254[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    if diagnosis is not None:[K
[0m[48;2;40;67;43m[39m+    255[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        treatment.diagnosis = _clean_text([K
[0m[48;2;40;67;43m[39m+    256[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            diagnosis, max_length=500, field="diagnosis"[K
[0m[48;2;40;67;43m[39m+    257[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        )[K
[0m[48;2;40;67;43m[39m+    258[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        update_fields.append("diagnosis")[K
[0m[48;2;40;67;43m[39m+    259[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    260[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    if description is not None:[K
[0m[48;2;40;67;43m[39m+    261[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        treatment.description = _clean_text([K
[0m[48;2;40;67;43m[39m+    262[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            description, max_length=10_000, field="description"[K
[0m[48;2;40;67;43m[39m+    263[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        )[K
[0m[48;2;40;67;43m[39m+    264[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        update_fields.append("description")[K
[0m[48;2;40;67;43m[39m+    265[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    266[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    if price is not ...:[K
[0m[48;2;40;67;43m[39m+    267[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        treatment.price = _clean_price(price, default=treatment.price)[K
[0m[48;2;40;67;43m[39m+    268[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        update_fields.append("price")[K
[0m[48;2;40;67;43m[39m+    269[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    270[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    if payment_status is not None:[K
[0m[48;2;40;67;43m[39m+    271[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        treatment.payment_status = _clean_choice([K
[0m[48;2;40;67;43m[39m+    272[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            payment_status, choices=PaymentStatus, field="payment_status"[K
[0m[48;2;40;67;43m[39m+    273[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        )[K
[0m[48;2;40;67;43m[39m+    274[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        update_fields.append("payment_status")[K
[0m[48;2;40;67;43m[39m+    275[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    276[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    if stage is not None:[K
[0m[48;2;40;67;43m[39m+    277[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        new_stage = _clean_choice([K
[0m[48;2;40;67;43m[39m+    278[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            stage, choices=TreatmentStage, field="stage"[K
[0m[48;2;40;67;43m[39m+    279[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        )[K
[0m[48;2;40;67;43m[39m+    280[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        # Prevent backwards transition completed → in_progress.[K
[0m[48;2;40;67;43m[39m+    281[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        if ([K
[0m[48;2;40;67;43m[39m+    282[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            treatment.stage == TreatmentStage.COMPLETED[K
[0m[48;2;40;67;43m[39m+    283[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            and new_stage == TreatmentStage.IN_PROGRESS[K
[0m[48;2;40;67;43m[39m+    284[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        ):[K
[0m[48;2;40;67;43m[39m+    285[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            raise ValidationError([K
[0m[48;2;40;67;43m[39m+    286[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                {"stage": [[K
[0m[48;2;40;67;43m[39m+    287[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                    "Yakunlangan davolashni qayta 'davom etmoqda' holatiga "[K
[0m[48;2;40;67;43m[39m+    288[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                    "o'tkazib bo'lmaydi."[K
[0m[48;2;40;67;43m[39m+    289[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                ]}[K
[0m[48;2;40;67;43m[39m+    290[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            )[K
[0m[48;2;40;67;43m[39m+    291[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        treatment.stage = new_stage[K
[0m[48;2;40;67;43m[39m+    292[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        update_fields.append("stage")[K
[0m[48;2;40;67;43m[39m+    293[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    294[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    if procedure_type is not ...:[K
[0m[48;2;40;67;43m[39m+    295[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        new_pt = _resolve_procedure_type(procedure_type)[K
[0m[48;2;40;67;43m[39m+    296[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        if new_pt is not None and new_pt.department_id != treatment.department_id:[K
[0m[48;2;40;67;43m[39m+    297[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            raise ValidationError([K
[0m[48;2;40;67;43m[39m+    298[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                {"procedure_type": [[K
[0m[48;2;40;67;43m[39m+    299[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                    "Muolaja turi tanlangan bo'limga tegishli emas."[K
[0m[48;2;40;67;43m[39m+    300[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                ]}[K
[0m[48;2;40;67;43m[39m+    301[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            )[K
[0m[48;2;40;67;43m[39m+    302[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        treatment.procedure_type = new_pt[K
[0m[48;2;40;67;43m[39m+    303[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        update_fields.append("procedure_type")[K
[0m[48;2;40;67;43m[39m+    304[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    305[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    if is_active is not None:[K
[0m[48;2;40;67;43m[39m+    306[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        treatment.is_active = bool(is_active)[K
[0m[48;2;40;67;43m[39m+    307[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        update_fields.append("is_active")[K
[0m[48;2;40;67;43m[39m+    308[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    309[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    if update_fields:[K
[0m[48;2;40;67;43m[39m+    310[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        treatment.save(update_fields=update_fields + ["updated_at"])[K
[0m[48;2;40;67;43m[39m+    311[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    return treatment[K
[0m[48;2;40;67;43m[39m+    312[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    313[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    314[0m:[39m[48;2;24;38;30m [38;2;101;115;126m@transaction.atomic[K
[0m[48;2;40;67;43m[39m+    315[0m:[39m[48;2;24;38;30m [38;2;101;115;126mdef soft_delete_treatment(treatment: Treatment) -> Treatment:[K
[0m[48;2;40;67;43m[39m+    316[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    if treatment.is_active:[K
[0m[48;2;40;67;43m[39m+    317[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        treatment.is_active = False[K
[0m[48;2;40;67;43m[39m+    318[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        treatment.save(update_fields=["is_active", "updated_at"])[K
[0m[48;2;40;67;43m[39m+    319[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    return treatment[K
[0m[48;2;40;67;43m[39m+    320[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    321[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    322[0m:[39m[48;2;24;38;30m [38;2;101;115;126m# ---------------------------------------------------------------------------[K
[0m[48;2;40;67;43m[39m+    323[0m:[39m[48;2;24;38;30m [38;2;101;115;126m# Public API — TreatmentPhoto[K
[0m[48;2;40;67;43m[39m+    324[0m:[39m[48;2;24;38;30m [38;2;101;115;126m# ---------------------------------------------------------------------------[K
[0m[48;2;40;67;43m[39m+    325[0m:[39m[48;2;24;38;30m [38;2;101;115;126m@transaction.atomic[K
[0m[48;2;40;67;43m[39m+    326[0m:[39m[48;2;24;38;30m [38;2;101;115;126mdef upload_treatment_photo([K
[0m[48;2;40;67;43m[39m+    327[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    treatment: Treatment,[K
[0m[48;2;40;67;43m[39m+    328[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    *,[K
[0m[48;2;40;67;43m[39m+    329[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    photo_type: str,[K
[0m[48;2;40;67;43m[39m+    330[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    image: Any,[K
[0m[48;2;40;67;43m[39m+    331[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    caption: str = "",[K
[0m[48;2;40;67;43m[39m+    332[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    uploaded_by: Any = None,[K
[0m[48;2;40;67;43m[39m+    333[0m:[39m[48;2;24;38;30m [38;2;101;115;126m) -> TreatmentPhoto:[K
[0m[48;2;40;67;43m[39m+    334[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    """Attach a before/after/x-ray photo to ``treatment``."""[K
[0m[48;2;40;67;43m[39m+    335[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    if image in (None, ""):[K
[0m[48;2;40;67;43m[39m+    336[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        raise ValidationError({"image": ["Rasm fayli majburiy."]})[K
[0m[48;2;40;67;43m[39m+    337[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    338[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    photo = TreatmentPhoto.objects.create([K
[0m[48;2;40;67;43m[39m+    339[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        treatment=treatment,[K
[0m[48;2;40;67;43m[39m+    340[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        photo_type=_clean_choice([K
[0m[48;2;40;67;43m[39m+    341[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            photo_type, choices=PhotoType, field="photo_type"[K
[0m[48;2;40;67;43m[39m+    342[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        ),[K
[0m[48;2;40;67;43m[39m+    343[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        image=image,[K
[0m[48;2;40;67;43m[39m+    344[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        caption=_clean_text(caption, max_length=255, field="caption"),[K
[0m[48;2;40;67;43m[39m+    345[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        uploaded_by=uploaded_by if isinstance(uploaded_by, User) else None,[K
[0m[48;2;40;67;43m[39m+    346[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        is_active=True,[K
[0m[48;2;40;67;43m[39m+    347[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    )[K
[0m[48;2;40;67;43m[39m+    348[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    return photo[K
[0m[48;2;40;67;43m[39m+    349[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    350[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    351[0m:[39m[48;2;24;38;30m [38;2;101;115;126m@transaction.atomic[K
[0m[48;2;40;67;43m[39m+    352[0m:[39m[48;2;24;38;30m [38;2;101;115;126mdef soft_delete_photo(photo: TreatmentPhoto) -> TreatmentPhoto:[K
[0m[48;2;40;67;43m[39m+    353[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    if photo.is_active:[K
[0m[48;2;40;67;43m[39m+    354[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        photo.is_active = False[K
[0m[48;2;40;67;43m[39m+    355[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        photo.save(update_fields=["is_active", "updated_at"])[K
[0m[48;2;40;67;43m[39m+    356[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    return photo[K
[0m[48;2;40;67;43m[39m+    357[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    358[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    359[0m:[39m[48;2;24;38;30m [38;2;101;115;126m__all__ = [[K
[0m[48;2;40;67;43m[39m+    360[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    "create_treatment",[K
[0m[48;2;40;67;43m[39m+    361[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    "update_treatment",[K
[0m[48;2;40;67;43m[39m+    362[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    "soft_delete_treatment",[K
[0m[48;2;40;67;43m[39m+    363[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    "upload_treatment_photo",[K
[0m[48;2;40;67;43m[39m+    364[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    "soft_delete_photo",[K
[0m[48;2;40;67;43m[39m+    365[0m:[39m[48;2;24;38;30m [38;2;101;115;126m][K
[0m[K
Creating: [38;5;141m/home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/apps/treatments/services.py[0m
[38;5;244m - Completed in 0.1s[0m

I'll create the following file: [38;5;141m/home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/apps/treatments/permissions.py[0m[38;5;244m (using tool: write)[0m

[48;2;40;67;43m[39m+     1[0m:[39m[48;2;24;38;30m [38;2;101;115;126m"""[38;2;101;115;126mView-layer permission classes for the ``treatments`` app.[K
[0m[48;2;40;67;43m[39m+     2[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     3[0m:[39m[48;2;24;38;30m [38;2;101;115;126mRules (PROJECT_BRIEF § "RBAC" — treatments row):[K
[0m[48;2;40;67;43m[39m+     4[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     5[0m:[39m[48;2;24;38;30m [38;2;101;115;126m* Read:[K
[0m[48;2;40;67;43m[39m+     6[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    - ``bosh_shifokor`` — always allowed.[K
[0m[48;2;40;67;43m[39m+     7[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    - ``doctor`` — allowed if ``treatment.doctor.user_id == user.id`` OR[K
[0m[48;2;40;67;43m[39m+     8[0m:[39m[48;2;24;38;30m [38;2;101;115;126m      ``doctor_profile.can_view_other_doctors == True``.[K
[0m[48;2;40;67;43m[39m+     9[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    - ``administrator`` — allowed for safe methods only (they see the[K
[0m[48;2;40;67;43m[39m+    10[0m:[39m[48;2;24;38;30m [38;2;101;115;126m      list to attach payments).[K
[0m[48;2;40;67;43m[39m+    11[0m:[39m[48;2;24;38;30m [38;2;101;115;126m* Write (POST / PATCH / DELETE / photo upload):[K
[0m[48;2;40;67;43m[39m+    12[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    - ``bosh_shifokor`` — always allowed.[K
[0m[48;2;40;67;43m[39m+    13[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    - ``doctor`` — allowed only on treatments they own.[K
[0m[48;2;40;67;43m[39m+    14[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    - ``administrator`` — never.[K
[0m[48;2;40;67;43m[39m+    15[0m:[39m[48;2;24;38;30m [38;2;101;115;126m"""[K
[0m[48;2;40;67;43m[39m+    16[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206m__future__[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206mannotations[K
[0m[48;2;40;67;43m[39m+    17[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    18[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206mtyping[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206mAny[K
[0m[48;2;40;67;43m[39m+    19[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    20[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206mrest_framework[38;2;192;197;206m.[38;2;192;197;206mpermissions[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206mBasePermission[K
[0m[48;2;40;67;43m[39m+    21[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206mrest_framework[38;2;192;197;206m.[38;2;192;197;206mrequest[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206mRequest[K
[0m[48;2;40;67;43m[39m+    22[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    23[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206mapps[38;2;192;197;206m.[38;2;192;197;206mcore[38;2;192;197;206m.[38;2;192;197;206mpermissions[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206m([K
[0m[48;2;40;67;43m[39m+    24[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;191;97;106mALL_ROLES[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+    25[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;191;97;106mROLE_ADMINISTRATOR[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+    26[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;191;97;106mROLE_BOSH_SHIFOKOR[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+    27[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;191;97;106mROLE_DOCTOR[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+    28[0m:[39m[48;2;24;38;30m [38;2;192;197;206m)[K
[0m[48;2;40;67;43m[39m+    29[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    30[0m:[39m[48;2;24;38;30m [38;2;191;97;106mSAFE_METHODS[38;2;192;197;206m [38;2;192;197;206m=[38;2;192;197;206m [38;2;192;197;206mfrozenset[38;2;192;197;206m([38;2;192;197;206m{[38;2;192;197;206m"[38;2;163;190;140mGET[38;2;192;197;206m"[38;2;192;197;206m,[38;2;192;197;206m [38;2;192;197;206m"[38;2;163;190;140mHEAD[38;2;192;197;206m"[38;2;192;197;206m,[38;2;192;197;206m [38;2;192;197;206m"[38;2;163;190;140mOPTIONS[38;2;192;197;206m"[38;2;192;197;206m}[38;2;192;197;206m)[K
[0m[48;2;40;67;43m[39m+    31[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    32[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    33[0m:[39m[48;2;24;38;30m [38;2;180;142;173mclass[38;2;239;241;245m [38;2;235;203;139mTreatmentPermission[38;2;239;241;245m([38;2;163;190;140mBasePermission[38;2;239;241;245m)[38;2;239;241;245m:[K
[0m[48;2;40;67;43m[39m+    34[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;101;115;126m"""[38;2;101;115;126mCombined view + object permission for the ``TreatmentViewSet``.[38;2;101;115;126m"""[K
[0m[48;2;40;67;43m[39m+    35[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    36[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;192;197;206mmessage[38;2;192;197;206m [38;2;192;197;206m=[38;2;192;197;206m [38;2;192;197;206m([K
[0m[48;2;40;67;43m[39m+    37[0m:[39m[48;2;24;38;30m [38;2;192;197;206m        [38;2;192;197;206m"[38;2;163;190;140mFaqat bosh shifokor yoki tegishli shifokor davolash yozuvini [38;2;192;197;206m"[K
[0m[48;2;40;67;43m[39m+    38[0m:[39m[48;2;24;38;30m [38;2;192;197;206m        [38;2;192;197;206m"[38;2;163;190;140myaratishi, tahrirlashi va o'chirishi mumkin.[38;2;192;197;206m"[K
[0m[48;2;40;67;43m[39m+    39[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;192;197;206m)[K
[0m[48;2;40;67;43m[39m+    40[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    41[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;101;115;126m#[38;2;101;115;126m ---- view level --------------------------------------------------------[K
[0m[48;2;40;67;43m[39m+    42[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    def has_permission(self, request: Request, view: Any) -> bool:  # noqa: D401[K
[0m[48;2;40;67;43m[39m+    43[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        user = getattr(request, "user", None)[K
[0m[48;2;40;67;43m[39m+    44[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        if user is None or not getattr(user, "is_authenticated", False):[K
[0m[48;2;40;67;43m[39m+    45[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            return False[K
[0m[48;2;40;67;43m[39m+    46[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        role = getattr(user, "role", None)[K
[0m[48;2;40;67;43m[39m+    47[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        if role not in ALL_ROLES:[K
[0m[48;2;40;67;43m[39m+    48[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            return False[K
[0m[48;2;40;67;43m[39m+    49[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        if request.method in SAFE_METHODS:[K
[0m[48;2;40;67;43m[39m+    50[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            return True[K
[0m[48;2;40;67;43m[39m+    51[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        # Writes: administrator excluded.[K
[0m[48;2;40;67;43m[39m+    52[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        return role in {ROLE_BOSH_SHIFOKOR, ROLE_DOCTOR}[K
[0m[48;2;40;67;43m[39m+    53[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    54[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    # ---- object level ------------------------------------------------------[K
[0m[48;2;40;67;43m[39m+    55[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    def has_object_permission(self, request: Request, view: Any, obj: Any) -> bool:[K
[0m[48;2;40;67;43m[39m+    56[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        user = request.user[K
[0m[48;2;40;67;43m[39m+    57[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        role = getattr(user, "role", None)[K
[0m[48;2;40;67;43m[39m+    58[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    59[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        if role == ROLE_BOSH_SHIFOKOR:[K
[0m[48;2;40;67;43m[39m+    60[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            return True[K
[0m[48;2;40;67;43m[39m+    61[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    62[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        # Resolve owner-doctor even when ``obj`` is a TreatmentPhoto.[K
[0m[48;2;40;67;43m[39m+    63[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        doctor = self._resolve_owner_doctor(obj)[K
[0m[48;2;40;67;43m[39m+    64[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    65[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        if role == ROLE_DOCTOR:[K
[0m[48;2;40;67;43m[39m+    66[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            if doctor is None:[K
[0m[48;2;40;67;43m[39m+    67[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                return False[K
[0m[48;2;40;67;43m[39m+    68[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            if doctor.user_id == user.id:[K
[0m[48;2;40;67;43m[39m+    69[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                return True[K
[0m[48;2;40;67;43m[39m+    70[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            if request.method in SAFE_METHODS:[K
[0m[48;2;40;67;43m[39m+    71[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                profile = getattr(user, "doctor_profile", None)[K
[0m[48;2;40;67;43m[39m+    72[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                return bool(getattr(profile, "can_view_other_doctors", False))[K
[0m[48;2;40;67;43m[39m+    73[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            return False[K
[0m[48;2;40;67;43m[39m+    74[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    75[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        if role == ROLE_ADMINISTRATOR:[K
[0m[48;2;40;67;43m[39m+    76[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            return request.method in SAFE_METHODS[K
[0m[48;2;40;67;43m[39m+    77[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    78[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        return False[K
[0m[48;2;40;67;43m[39m+    79[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    80[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    @staticmethod[K
[0m[48;2;40;67;43m[39m+    81[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    def _resolve_owner_doctor(obj: Any) -> Any:[K
[0m[48;2;40;67;43m[39m+    82[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        """Return the DoctorProfile owning ``obj`` (Treatment or TreatmentPhoto)."""[K
[0m[48;2;40;67;43m[39m+    83[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        if obj is None:[K
[0m[48;2;40;67;43m[39m+    84[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            return None[K
[0m[48;2;40;67;43m[39m+    85[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        # Treatment[K
[0m[48;2;40;67;43m[39m+    86[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        doctor = getattr(obj, "doctor", None)[K
[0m[48;2;40;67;43m[39m+    87[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        if doctor is not None:[K
[0m[48;2;40;67;43m[39m+    88[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            return doctor[K
[0m[48;2;40;67;43m[39m+    89[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        # TreatmentPhoto → treatment.doctor[K
[0m[48;2;40;67;43m[39m+    90[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        treatment = getattr(obj, "treatment", None)[K
[0m[48;2;40;67;43m[39m+    91[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        if treatment is not None:[K
[0m[48;2;40;67;43m[39m+    92[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            return getattr(treatment, "doctor", None)[K
[0m[48;2;40;67;43m[39m+    93[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        return None[K
[0m[48;2;40;67;43m[39m+    94[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    95[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    96[0m:[39m[48;2;24;38;30m [38;2;101;115;126m__all__ = ["TreatmentPermission", "SAFE_METHODS"][K
[0m[K
Creating: [38;5;141m/home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/apps/treatments/permissions.py[0m
[38;5;244m - Completed in 0.1s[0m

I'll create the following file: [38;5;141m/home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/apps/treatments/serializers.py[0m[38;5;244m (using tool: write)[0m

[48;2;40;67;43m[39m+      1[0m:[39m[48;2;24;38;30m [38;2;101;115;126m"""[38;2;101;115;126mDRF serializers for the ``treatments`` app.[K
[0m[48;2;40;67;43m[39m+      2[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+      3[0m:[39m[48;2;24;38;30m [38;2;101;115;126mResponse payloads are **camelCase** to match the frontend Treatment[K
[0m[48;2;40;67;43m[39m+      4[0m:[39m[48;2;24;38;30m [38;2;101;115;126minterface. Accepts snake_case *or* camelCase input.[K
[0m[48;2;40;67;43m[39m+      5[0m:[39m[48;2;24;38;30m [38;2;101;115;126m"""[K
[0m[48;2;40;67;43m[39m+      6[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206m__future__[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206mannotations[K
[0m[48;2;40;67;43m[39m+      7[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+      8[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206mtyping[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206mAny[K
[0m[48;2;40;67;43m[39m+      9[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     10[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206mdjango[38;2;192;197;206m.[38;2;192;197;206mcore[38;2;192;197;206m.[38;2;192;197;206mexceptions[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206mValidationError[38;2;192;197;206m [38;2;180;142;173mas[38;2;192;197;206m [38;2;192;197;206mDjangoValidationError[K
[0m[48;2;40;67;43m[39m+     11[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206mrest_framework[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206mserializers[K
[0m[48;2;40;67;43m[39m+     12[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     13[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;180;142;173m.[38;2;192;197;206mmodels[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206m([K
[0m[48;2;40;67;43m[39m+     14[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;192;197;206mPaymentStatus[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+     15[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;192;197;206mPhotoType[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+     16[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;192;197;206mTreatment[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+     17[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;192;197;206mTreatmentPhoto[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+     18[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;192;197;206mTreatmentStage[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+     19[0m:[39m[48;2;24;38;30m [38;2;192;197;206m)[K
[0m[48;2;40;67;43m[39m+     20[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;180;142;173m.[38;2;192;197;206mservices[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206m([K
[0m[48;2;40;67;43m[39m+     21[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;192;197;206mcreate_treatment[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+     22[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;192;197;206mupdate_treatment[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+     23[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;192;197;206mupload_treatment_photo[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+     24[0m:[39m[48;2;24;38;30m [38;2;192;197;206m)[K
[0m[48;2;40;67;43m[39m+     25[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     26[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     27[0m:[39m[48;2;24;38;30m [38;2;101;115;126m#[38;2;101;115;126m ---------------------------------------------------------------------------[K
[0m[48;2;40;67;43m[39m+     28[0m:[39m[48;2;24;38;30m [38;2;101;115;126m# Helpers[K
[0m[48;2;40;67;43m[39m+     29[0m:[39m[48;2;24;38;30m [38;2;101;115;126m# ---------------------------------------------------------------------------[K
[0m[48;2;40;67;43m[39m+     30[0m:[39m[48;2;24;38;30m [38;2;101;115;126mdef _camel_user(user: Any) -> dict[str, Any] | None:[K
[0m[48;2;40;67;43m[39m+     31[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    if user is None:[K
[0m[48;2;40;67;43m[39m+     32[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        return None[K
[0m[48;2;40;67;43m[39m+     33[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    return {[K
[0m[48;2;40;67;43m[39m+     34[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        "id": str(user.pk),[K
[0m[48;2;40;67;43m[39m+     35[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        "firstName": getattr(user, "first_name", "") or "",[K
[0m[48;2;40;67;43m[39m+     36[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        "lastName": getattr(user, "last_name", "") or "",[K
[0m[48;2;40;67;43m[39m+     37[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        "phoneNumber": getattr(user, "phone_number", "") or "",[K
[0m[48;2;40;67;43m[39m+     38[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    }[K
[0m[48;2;40;67;43m[39m+     39[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     40[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     41[0m:[39m[48;2;24;38;30m [38;2;101;115;126mdef _camel_doctor(doctor: Any) -> dict[str, Any] | None:[K
[0m[48;2;40;67;43m[39m+     42[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    if doctor is None:[K
[0m[48;2;40;67;43m[39m+     43[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        return None[K
[0m[48;2;40;67;43m[39m+     44[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    return {[K
[0m[48;2;40;67;43m[39m+     45[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        "id": str(doctor.pk),[K
[0m[48;2;40;67;43m[39m+     46[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        "user": _camel_user(getattr(doctor, "user", None)),[K
[0m[48;2;40;67;43m[39m+     47[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        "specialization": getattr(doctor, "specialization", "") or "",[K
[0m[48;2;40;67;43m[39m+     48[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    }[K
[0m[48;2;40;67;43m[39m+     49[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     50[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     51[0m:[39m[48;2;24;38;30m [38;2;101;115;126mdef _camel_patient(patient: Any) -> dict[str, Any] | None:[K
[0m[48;2;40;67;43m[39m+     52[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    if patient is None:[K
[0m[48;2;40;67;43m[39m+     53[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        return None[K
[0m[48;2;40;67;43m[39m+     54[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    return {[K
[0m[48;2;40;67;43m[39m+     55[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        "id": str(patient.pk),[K
[0m[48;2;40;67;43m[39m+     56[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        "firstName": getattr(patient, "first_name", "") or "",[K
[0m[48;2;40;67;43m[39m+     57[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        "lastName": getattr(patient, "last_name", "") or "",[K
[0m[48;2;40;67;43m[39m+     58[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        "phoneNumber": getattr(patient, "phone_number", "") or "",[K
[0m[48;2;40;67;43m[39m+     59[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        "fullName": getattr(patient, "full_name", "") or "",[K
[0m[48;2;40;67;43m[39m+     60[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    }[K
[0m[48;2;40;67;43m[39m+     61[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     62[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     63[0m:[39m[48;2;24;38;30m [38;2;101;115;126mdef _camel_department(department: Any) -> dict[str, Any] | None:[K
[0m[48;2;40;67;43m[39m+     64[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    if department is None:[K
[0m[48;2;40;67;43m[39m+     65[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        return None[K
[0m[48;2;40;67;43m[39m+     66[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    return {[K
[0m[48;2;40;67;43m[39m+     67[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        "id": str(department.pk),[K
[0m[48;2;40;67;43m[39m+     68[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        "name": getattr(department, "name", "") or "",[K
[0m[48;2;40;67;43m[39m+     69[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    }[K
[0m[48;2;40;67;43m[39m+     70[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     71[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     72[0m:[39m[48;2;24;38;30m [38;2;101;115;126mdef _camel_procedure(procedure: Any) -> dict[str, Any] | None:[K
[0m[48;2;40;67;43m[39m+     73[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    if procedure is None:[K
[0m[48;2;40;67;43m[39m+     74[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        return None[K
[0m[48;2;40;67;43m[39m+     75[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    return {[K
[0m[48;2;40;67;43m[39m+     76[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        "id": str(procedure.pk),[K
[0m[48;2;40;67;43m[39m+     77[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        "name": getattr(procedure, "name", "") or "",[K
[0m[48;2;40;67;43m[39m+     78[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        "defaultPrice": str(getattr(procedure, "default_price", "0.00")),[K
[0m[48;2;40;67;43m[39m+     79[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    }[K
[0m[48;2;40;67;43m[39m+     80[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     81[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     82[0m:[39m[48;2;24;38;30m [38;2;101;115;126m# ---------------------------------------------------------------------------[K
[0m[48;2;40;67;43m[39m+     83[0m:[39m[48;2;24;38;30m [38;2;101;115;126m# TreatmentPhotoSerializer[K
[0m[48;2;40;67;43m[39m+     84[0m:[39m[48;2;24;38;30m [38;2;101;115;126m# ---------------------------------------------------------------------------[K
[0m[48;2;40;67;43m[39m+     85[0m:[39m[48;2;24;38;30m [38;2;101;115;126mclass TreatmentPhotoSerializer(serializers.ModelSerializer):[K
[0m[48;2;40;67;43m[39m+     86[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    """Serializer for the ``/treatments/{id}/photos/`` action."""[K
[0m[48;2;40;67;43m[39m+     87[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     88[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    photo_type = serializers.ChoiceField(choices=PhotoType.choices)[K
[0m[48;2;40;67;43m[39m+     89[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    image = serializers.ImageField(required=True)[K
[0m[48;2;40;67;43m[39m+     90[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    caption = serializers.CharField([K
[0m[48;2;40;67;43m[39m+     91[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        max_length=255, allow_blank=True, required=False, default=""[K
[0m[48;2;40;67;43m[39m+     92[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    )[K
[0m[48;2;40;67;43m[39m+     93[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     94[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    class Meta:[K
[0m[48;2;40;67;43m[39m+     95[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        model = TreatmentPhoto[K
[0m[48;2;40;67;43m[39m+     96[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        fields = ("id", "photo_type", "image", "caption")[K
[0m[48;2;40;67;43m[39m+     97[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        read_only_fields = ("id",)[K
[0m[48;2;40;67;43m[39m+     98[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     99[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    _CAMEL_TO_SNAKE = {"photoType": "photo_type"}[K
[0m[48;2;40;67;43m[39m+    100[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    101[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    def to_internal_value(self, data: Any) -> dict[str, Any]:[K
[0m[48;2;40;67;43m[39m+    102[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        if hasattr(data, "getlist"):  # multipart[K
[0m[48;2;40;67;43m[39m+    103[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            new: dict[str, Any] = {}[K
[0m[48;2;40;67;43m[39m+    104[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            for key in list(data.keys()):[K
[0m[48;2;40;67;43m[39m+    105[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                snake = self._CAMEL_TO_SNAKE.get(key, key)[K
[0m[48;2;40;67;43m[39m+    106[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                new[snake] = data.get(key)[K
[0m[48;2;40;67;43m[39m+    107[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            data = new[K
[0m[48;2;40;67;43m[39m+    108[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        elif isinstance(data, dict):[K
[0m[48;2;40;67;43m[39m+    109[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            normalised = {**data}[K
[0m[48;2;40;67;43m[39m+    110[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            for camel, snake in self._CAMEL_TO_SNAKE.items():[K
[0m[48;2;40;67;43m[39m+    111[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                if camel in normalised and snake not in normalised:[K
[0m[48;2;40;67;43m[39m+    112[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                    normalised[snake] = normalised[camel][K
[0m[48;2;40;67;43m[39m+    113[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            data = normalised[K
[0m[48;2;40;67;43m[39m+    114[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        return super().to_internal_value(data)[K
[0m[48;2;40;67;43m[39m+    115[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    116[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    def to_representation(self, instance: TreatmentPhoto) -> dict[str, Any]:[K
[0m[48;2;40;67;43m[39m+    117[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        image_url = None[K
[0m[48;2;40;67;43m[39m+    118[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        if instance.image:[K
[0m[48;2;40;67;43m[39m+    119[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            try:[K
[0m[48;2;40;67;43m[39m+    120[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                image_url = instance.image.url[K
[0m[48;2;40;67;43m[39m+    121[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            except Exception:  # noqa: BLE001 - storage backend may raise[K
[0m[48;2;40;67;43m[39m+    122[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                image_url = str(instance.image)[K
[0m[48;2;40;67;43m[39m+    123[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        return {[K
[0m[48;2;40;67;43m[39m+    124[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            "id": str(instance.id),[K
[0m[48;2;40;67;43m[39m+    125[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            "treatmentId": str(instance.treatment_id),[K
[0m[48;2;40;67;43m[39m+    126[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            "photoType": instance.photo_type,[K
[0m[48;2;40;67;43m[39m+    127[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            "imageUrl": image_url,[K
[0m[48;2;40;67;43m[39m+    128[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            "thumbnailPath": instance.thumbnail_path or None,[K
[0m[48;2;40;67;43m[39m+    129[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            "caption": instance.caption or "",[K
[0m[48;2;40;67;43m[39m+    130[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            "uploadedAt": instance.uploaded_at.isoformat()[K
[0m[48;2;40;67;43m[39m+    131[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            if instance.uploaded_at[K
[0m[48;2;40;67;43m[39m+    132[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            else None,[K
[0m[48;2;40;67;43m[39m+    133[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            "uploadedBy": _camel_user(instance.uploaded_by),[K
[0m[48;2;40;67;43m[39m+    134[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            "isActive": instance.is_active,[K
[0m[48;2;40;67;43m[39m+    135[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        }[K
[0m[48;2;40;67;43m[39m+    136[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    137[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    138[0m:[39m[48;2;24;38;30m [38;2;101;115;126m# ---------------------------------------------------------------------------[K
[0m[48;2;40;67;43m[39m+    139[0m:[39m[48;2;24;38;30m [38;2;101;115;126m# TreatmentSerializer[K
[0m[48;2;40;67;43m[39m+    140[0m:[39m[48;2;24;38;30m [38;2;101;115;126m# ---------------------------------------------------------------------------[K
[0m[48;2;40;67;43m[39m+    141[0m:[39m[48;2;24;38;30m [38;2;101;115;126mclass TreatmentSerializer(serializers.ModelSerializer):[K
[0m[48;2;40;67;43m[39m+    142[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    """Read + write serializer for :class:`Treatment`."""[K
[0m[48;2;40;67;43m[39m+    143[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    144[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    doctor = serializers.UUIDField(required=False)[K
[0m[48;2;40;67;43m[39m+    145[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    patient = serializers.UUIDField(required=False)[K
[0m[48;2;40;67;43m[39m+    146[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    department = serializers.UUIDField(required=False)[K
[0m[48;2;40;67;43m[39m+    147[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    procedure_type = serializers.UUIDField(required=False, allow_null=True)[K
[0m[48;2;40;67;43m[39m+    148[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    appointment = serializers.UUIDField(required=False, allow_null=True)[K
[0m[48;2;40;67;43m[39m+    149[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    150[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    diagnosis = serializers.CharField([K
[0m[48;2;40;67;43m[39m+    151[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        max_length=500, allow_blank=True, required=False, default=""[K
[0m[48;2;40;67;43m[39m+    152[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    )[K
[0m[48;2;40;67;43m[39m+    153[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    description = serializers.CharField([K
[0m[48;2;40;67;43m[39m+    154[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        max_length=10_000, allow_blank=True, required=False, default=""[K
[0m[48;2;40;67;43m[39m+    155[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    )[K
[0m[48;2;40;67;43m[39m+    156[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    price = serializers.DecimalField([K
[0m[48;2;40;67;43m[39m+    157[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        max_digits=12, decimal_places=2, required=False, min_value=0[K
[0m[48;2;40;67;43m[39m+    158[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    )[K
[0m[48;2;40;67;43m[39m+    159[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    payment_status = serializers.ChoiceField([K
[0m[48;2;40;67;43m[39m+    160[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        choices=PaymentStatus.choices, required=False[K
[0m[48;2;40;67;43m[39m+    161[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    )[K
[0m[48;2;40;67;43m[39m+    162[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    stage = serializers.ChoiceField([K
[0m[48;2;40;67;43m[39m+    163[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        choices=TreatmentStage.choices, required=False[K
[0m[48;2;40;67;43m[39m+    164[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    )[K
[0m[48;2;40;67;43m[39m+    165[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    is_active = serializers.BooleanField(required=False)[K
[0m[48;2;40;67;43m[39m+    166[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    167[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    class Meta:[K
[0m[48;2;40;67;43m[39m+    168[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        model = Treatment[K
[0m[48;2;40;67;43m[39m+    169[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        fields = ([K
[0m[48;2;40;67;43m[39m+    170[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            "id",[K
[0m[48;2;40;67;43m[39m+    171[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            "doctor",[K
[0m[48;2;40;67;43m[39m+    172[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            "patient",[K
[0m[48;2;40;67;43m[39m+    173[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            "department",[K
[0m[48;2;40;67;43m[39m+    174[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            "procedure_type",[K
[0m[48;2;40;67;43m[39m+    175[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            "appointment",[K
[0m[48;2;40;67;43m[39m+    176[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            "diagnosis",[K
[0m[48;2;40;67;43m[39m+    177[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            "description",[K
[0m[48;2;40;67;43m[39m+    178[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            "price",[K
[0m[48;2;40;67;43m[39m+    179[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            "payment_status",[K
[0m[48;2;40;67;43m[39m+    180[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            "stage",[K
[0m[48;2;40;67;43m[39m+    181[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            "is_active",[K
[0m[48;2;40;67;43m[39m+    182[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        )[K
[0m[48;2;40;67;43m[39m+    183[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        read_only_fields = ("id",)[K
[0m[48;2;40;67;43m[39m+    184[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    185[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    _CAMEL_TO_SNAKE = {[K
[0m[48;2;40;67;43m[39m+    186[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        "procedureType": "procedure_type",[K
[0m[48;2;40;67;43m[39m+    187[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        "paymentStatus": "payment_status",[K
[0m[48;2;40;67;43m[39m+    188[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        "isActive": "is_active",[K
[0m[48;2;40;67;43m[39m+    189[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        "doctorId": "doctor",[K
[0m[48;2;40;67;43m[39m+    190[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        "patientId": "patient",[K
[0m[48;2;40;67;43m[39m+    191[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        "departmentId": "department",[K
[0m[48;2;40;67;43m[39m+    192[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        "appointmentId": "appointment",[K
[0m[48;2;40;67;43m[39m+    193[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        "procedureTypeId": "procedure_type",[K
[0m[48;2;40;67;43m[39m+    194[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    }[K
[0m[48;2;40;67;43m[39m+    195[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    196[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    def to_internal_value(self, data: Any) -> dict[str, Any]:[K
[0m[48;2;40;67;43m[39m+    197[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        if isinstance(data, dict):[K
[0m[48;2;40;67;43m[39m+    198[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            normalised = {**data}[K
[0m[48;2;40;67;43m[39m+    199[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            for camel, snake in self._CAMEL_TO_SNAKE.items():[K
[0m[48;2;40;67;43m[39m+    200[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                if camel in normalised and snake not in normalised:[K
[0m[48;2;40;67;43m[39m+    201[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                    normalised[snake] = normalised[camel][K
[0m[48;2;40;67;43m[39m+    202[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            data = normalised[K
[0m[48;2;40;67;43m[39m+    203[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        return super().to_internal_value(data)[K
[0m[48;2;40;67;43m[39m+    204[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    205[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    def to_representation(self, instance: Treatment) -> dict[str, Any]:[K
[0m[48;2;40;67;43m[39m+    206[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        photos = list(instance.photos.filter(is_active=True).order_by("-uploaded_at"))[K
[0m[48;2;40;67;43m[39m+    207[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        tooth_records: list[dict[str, Any]] = [][K
[0m[48;2;40;67;43m[39m+    208[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        # ToothRecord is added in T13 (odontogram app). Fetch defensively so[K
[0m[48;2;40;67;43m[39m+    209[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        # this serializer works even before that app exists.[K
[0m[48;2;40;67;43m[39m+    210[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        try:[K
[0m[48;2;40;67;43m[39m+    211[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            records_manager = instance.tooth_records  # type: ignore[attr-defined][K
[0m[48;2;40;67;43m[39m+    212[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        except Exception:  # noqa: BLE001[K
[0m[48;2;40;67;43m[39m+    213[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            records_manager = None[K
[0m[48;2;40;67;43m[39m+    214[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        if records_manager is not None:[K
[0m[48;2;40;67;43m[39m+    215[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            try:[K
[0m[48;2;40;67;43m[39m+    216[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                for rec in records_manager.all():[K
[0m[48;2;40;67;43m[39m+    217[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                    tooth_records.append([K
[0m[48;2;40;67;43m[39m+    218[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                        {[K
[0m[48;2;40;67;43m[39m+    219[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                            "id": str(rec.pk),[K
[0m[48;2;40;67;43m[39m+    220[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                            "toothNumber": rec.tooth_number,[K
[0m[48;2;40;67;43m[39m+    221[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                            "procedure": rec.procedure,[K
[0m[48;2;40;67;43m[39m+    222[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                            "status": rec.status,[K
[0m[48;2;40;67;43m[39m+    223[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                            "notes": rec.notes or "",[K
[0m[48;2;40;67;43m[39m+    224[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                        }[K
[0m[48;2;40;67;43m[39m+    225[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                    )[K
[0m[48;2;40;67;43m[39m+    226[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            except Exception:  # noqa: BLE001 - table may not exist yet[K
[0m[48;2;40;67;43m[39m+    227[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                tooth_records = [][K
[0m[48;2;40;67;43m[39m+    228[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    229[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        return {[K
[0m[48;2;40;67;43m[39m+    230[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            "id": str(instance.id),[K
[0m[48;2;40;67;43m[39m+    231[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            "appointmentId": str(instance.appointment_id)[K
[0m[48;2;40;67;43m[39m+    232[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            if instance.appointment_id[K
[0m[48;2;40;67;43m[39m+    233[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            else None,[K
[0m[48;2;40;67;43m[39m+    234[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            "appointment": _camel_appointment(instance.appointment),[K
[0m[48;2;40;67;43m[39m+    235[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            "doctorId": str(instance.doctor_id),[K
[0m[48;2;40;67;43m[39m+    236[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            "doctor": _camel_doctor(instance.doctor),[K
[0m[48;2;40;67;43m[39m+    237[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            "patientId": str(instance.patient_id),[K
[0m[48;2;40;67;43m[39m+    238[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            "patient": _camel_patient(instance.patient),[K
[0m[48;2;40;67;43m[39m+    239[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            "departmentId": str(instance.department_id),[K
[0m[48;2;40;67;43m[39m+    240[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            "department": _camel_department(instance.department),[K
[0m[48;2;40;67;43m[39m+    241[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            "procedureTypeId": str(instance.procedure_type_id)[K
[0m[48;2;40;67;43m[39m+    242[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            if instance.procedure_type_id[K
[0m[48;2;40;67;43m[39m+    243[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            else None,[K
[0m[48;2;40;67;43m[39m+    244[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            "procedureType": _camel_procedure(instance.procedure_type),[K
[0m[48;2;40;67;43m[39m+    245[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            "diagnosis": instance.diagnosis or "",[K
[0m[48;2;40;67;43m[39m+    246[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            "description": instance.description or "",[K
[0m[48;2;40;67;43m[39m+    247[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            "price": str(instance.price),[K
[0m[48;2;40;67;43m[39m+    248[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            "paymentStatus": instance.payment_status,[K
[0m[48;2;40;67;43m[39m+    249[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            "stage": instance.stage,[K
[0m[48;2;40;67;43m[39m+    250[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            "isActive": instance.is_active,[K
[0m[48;2;40;67;43m[39m+    251[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            "createdAt": instance.created_at.isoformat()[K
[0m[48;2;40;67;43m[39m+    252[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            if instance.created_at[K
[0m[48;2;40;67;43m[39m+    253[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            else None,[K
[0m[48;2;40;67;43m[39m+    254[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            "updatedAt": instance.updated_at.isoformat()[K
[0m[48;2;40;67;43m[39m+    255[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            if instance.updated_at[K
[0m[48;2;40;67;43m[39m+    256[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            else None,[K
[0m[48;2;40;67;43m[39m+    257[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            "createdBy": _camel_user(instance.created_by),[K
[0m[48;2;40;67;43m[39m+    258[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            "photos": [[K
[0m[48;2;40;67;43m[39m+    259[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                TreatmentPhotoSerializer(p, context=self.context).data[K
[0m[48;2;40;67;43m[39m+    260[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                for p in photos[K
[0m[48;2;40;67;43m[39m+    261[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            ],[K
[0m[48;2;40;67;43m[39m+    262[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            "toothRecords": tooth_records,[K
[0m[48;2;40;67;43m[39m+    263[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        }[K
[0m[48;2;40;67;43m[39m+    264[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    265[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    # ---- create / update via services --------------------------------------[K
[0m[48;2;40;67;43m[39m+    266[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    def create(self, validated_data: dict[str, Any]) -> Treatment:[K
[0m[48;2;40;67;43m[39m+    267[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        request = self.context.get("request")[K
[0m[48;2;40;67;43m[39m+    268[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        actor = getattr(request, "user", None) if request is not None else None[K
[0m[48;2;40;67;43m[39m+    269[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        try:[K
[0m[48;2;40;67;43m[39m+    270[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            return create_treatment([K
[0m[48;2;40;67;43m[39m+    271[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                doctor=validated_data["doctor"],[K
[0m[48;2;40;67;43m[39m+    272[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                patient=validated_data["patient"],[K
[0m[48;2;40;67;43m[39m+    273[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                department=validated_data["department"],[K
[0m[48;2;40;67;43m[39m+    274[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                procedure_type=validated_data.get("procedure_type"),[K
[0m[48;2;40;67;43m[39m+    275[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                appointment=validated_data.get("appointment"),[K
[0m[48;2;40;67;43m[39m+    276[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                diagnosis=validated_data.get("diagnosis", "") or "",[K
[0m[48;2;40;67;43m[39m+    277[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                description=validated_data.get("description", "") or "",[K
[0m[48;2;40;67;43m[39m+    278[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                price=validated_data.get("price"),[K
[0m[48;2;40;67;43m[39m+    279[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                payment_status=validated_data.get([K
[0m[48;2;40;67;43m[39m+    280[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                    "payment_status", PaymentStatus.UNPAID[K
[0m[48;2;40;67;43m[39m+    281[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                ),[K
[0m[48;2;40;67;43m[39m+    282[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                stage=validated_data.get("stage", TreatmentStage.IN_PROGRESS),[K
[0m[48;2;40;67;43m[39m+    283[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                created_by=actor,[K
[0m[48;2;40;67;43m[39m+    284[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            )[K
[0m[48;2;40;67;43m[39m+    285[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        except DjangoValidationError as exc:[K
[0m[48;2;40;67;43m[39m+    286[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            raise serializers.ValidationError([K
[0m[48;2;40;67;43m[39m+    287[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                exc.message_dict[K
[0m[48;2;40;67;43m[39m+    288[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                if hasattr(exc, "message_dict")[K
[0m[48;2;40;67;43m[39m+    289[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                else list(exc.messages)[K
[0m[48;2;40;67;43m[39m+    290[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            ) from exc[K
[0m[48;2;40;67;43m[39m+    291[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        except KeyError as exc:  # missing required field[K
[0m[48;2;40;67;43m[39m+    292[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            missing = exc.args[0] if exc.args else "field"[K
[0m[48;2;40;67;43m[39m+    293[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            raise serializers.ValidationError([K
[0m[48;2;40;67;43m[39m+    294[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                {missing: [f"'{missing}' majburiy."]}[K
[0m[48;2;40;67;43m[39m+    295[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            ) from exc[K
[0m[48;2;40;67;43m[39m+    296[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    297[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    def update([K
[0m[48;2;40;67;43m[39m+    298[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        self, instance: Treatment, validated_data: dict[str, Any][K
[0m[48;2;40;67;43m[39m+    299[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    ) -> Treatment:[K
[0m[48;2;40;67;43m[39m+    300[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        try:[K
[0m[48;2;40;67;43m[39m+    301[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            return update_treatment([K
[0m[48;2;40;67;43m[39m+    302[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                instance,[K
[0m[48;2;40;67;43m[39m+    303[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                diagnosis=validated_data.get("diagnosis"),[K
[0m[48;2;40;67;43m[39m+    304[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                description=validated_data.get("description"),[K
[0m[48;2;40;67;43m[39m+    305[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                price=validated_data["price"][K
[0m[48;2;40;67;43m[39m+    306[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                if "price" in validated_data[K
[0m[48;2;40;67;43m[39m+    307[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                else ...,[K
[0m[48;2;40;67;43m[39m+    308[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                payment_status=validated_data.get("payment_status"),[K
[0m[48;2;40;67;43m[39m+    309[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                stage=validated_data.get("stage"),[K
[0m[48;2;40;67;43m[39m+    310[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                procedure_type=validated_data["procedure_type"][K
[0m[48;2;40;67;43m[39m+    311[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                if "procedure_type" in validated_data[K
[0m[48;2;40;67;43m[39m+    312[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                else ...,[K
[0m[48;2;40;67;43m[39m+    313[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                is_active=validated_data.get("is_active"),[K
[0m[48;2;40;67;43m[39m+    314[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            )[K
[0m[48;2;40;67;43m[39m+    315[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        except DjangoValidationError as exc:[K
[0m[48;2;40;67;43m[39m+    316[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            raise serializers.ValidationError([K
[0m[48;2;40;67;43m[39m+    317[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                exc.message_dict[K
[0m[48;2;40;67;43m[39m+    318[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                if hasattr(exc, "message_dict")[K
[0m[48;2;40;67;43m[39m+    319[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                else list(exc.messages)[K
[0m[48;2;40;67;43m[39m+    320[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            ) from exc[K
[0m[48;2;40;67;43m[39m+    321[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    322[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    323[0m:[39m[48;2;24;38;30m [38;2;101;115;126mdef _camel_appointment(appointment: Any) -> dict[str, Any] | None:[K
[0m[48;2;40;67;43m[39m+    324[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    if appointment is None:[K
[0m[48;2;40;67;43m[39m+    325[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        return None[K
[0m[48;2;40;67;43m[39m+    326[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    return {[K
[0m[48;2;40;67;43m[39m+    327[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        "id": str(appointment.pk),[K
[0m[48;2;40;67;43m[39m+    328[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        "scheduledStart": appointment.scheduled_start.isoformat()[K
[0m[48;2;40;67;43m[39m+    329[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        if appointment.scheduled_start[K
[0m[48;2;40;67;43m[39m+    330[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        else None,[K
[0m[48;2;40;67;43m[39m+    331[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        "scheduledEnd": appointment.scheduled_end.isoformat()[K
[0m[48;2;40;67;43m[39m+    332[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        if appointment.scheduled_end[K
[0m[48;2;40;67;43m[39m+    333[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        else None,[K
[0m[48;2;40;67;43m[39m+    334[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        "status": appointment.status,[K
[0m[48;2;40;67;43m[39m+    335[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    }[K
[0m[48;2;40;67;43m[39m+    336[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    337[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    338[0m:[39m[48;2;24;38;30m [38;2;101;115;126mclass TreatmentPhotoUploadSerializer(serializers.Serializer):[K
[0m[48;2;40;67;43m[39m+    339[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    """Input serializer for the ``photos`` action."""[K
[0m[48;2;40;67;43m[39m+    340[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    341[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    photo_type = serializers.ChoiceField(choices=PhotoType.choices)[K
[0m[48;2;40;67;43m[39m+    342[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    image = serializers.ImageField(required=True)[K
[0m[48;2;40;67;43m[39m+    343[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    caption = serializers.CharField([K
[0m[48;2;40;67;43m[39m+    344[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        max_length=255, allow_blank=True, required=False, default=""[K
[0m[48;2;40;67;43m[39m+    345[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    )[K
[0m[48;2;40;67;43m[39m+    346[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    347[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    _CAMEL_TO_SNAKE = {"photoType": "photo_type"}[K
[0m[48;2;40;67;43m[39m+    348[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    349[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    def to_internal_value(self, data: Any) -> dict[str, Any]:[K
[0m[48;2;40;67;43m[39m+    350[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        if hasattr(data, "getlist"):[K
[0m[48;2;40;67;43m[39m+    351[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            new: dict[str, Any] = {}[K
[0m[48;2;40;67;43m[39m+    352[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            for key in list(data.keys()):[K
[0m[48;2;40;67;43m[39m+    353[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                snake = self._CAMEL_TO_SNAKE.get(key, key)[K
[0m[48;2;40;67;43m[39m+    354[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                new[snake] = data.get(key)[K
[0m[48;2;40;67;43m[39m+    355[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            data = new[K
[0m[48;2;40;67;43m[39m+    356[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        elif isinstance(data, dict):[K
[0m[48;2;40;67;43m[39m+    357[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            normalised = {**data}[K
[0m[48;2;40;67;43m[39m+    358[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            for camel, snake in self._CAMEL_TO_SNAKE.items():[K
[0m[48;2;40;67;43m[39m+    359[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                if camel in normalised and snake not in normalised:[K
[0m[48;2;40;67;43m[39m+    360[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                    normalised[snake] = normalised[camel][K
[0m[48;2;40;67;43m[39m+    361[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            data = normalised[K
[0m[48;2;40;67;43m[39m+    362[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        return super().to_internal_value(data)[K
[0m[48;2;40;67;43m[39m+    363[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    364[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    def create(self, validated_data: dict[str, Any]) -> TreatmentPhoto:[K
[0m[48;2;40;67;43m[39m+    365[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        request = self.context.get("request")[K
[0m[48;2;40;67;43m[39m+    366[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        treatment = self.context["treatment"][K
[0m[48;2;40;67;43m[39m+    367[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        actor = getattr(request, "user", None) if request is not None else None[K
[0m[48;2;40;67;43m[39m+    368[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        try:[K
[0m[48;2;40;67;43m[39m+    369[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            return upload_treatment_photo([K
[0m[48;2;40;67;43m[39m+    370[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                treatment,[K
[0m[48;2;40;67;43m[39m+    371[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                photo_type=validated_data["photo_type"],[K
[0m[48;2;40;67;43m[39m+    372[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                image=validated_data["image"],[K
[0m[48;2;40;67;43m[39m+    373[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                caption=validated_data.get("caption", "") or "",[K
[0m[48;2;40;67;43m[39m+    374[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                uploaded_by=actor,[K
[0m[48;2;40;67;43m[39m+    375[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            )[K
[0m[48;2;40;67;43m[39m+    376[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        except DjangoValidationError as exc:[K
[0m[48;2;40;67;43m[39m+    377[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            raise serializers.ValidationError([K
[0m[48;2;40;67;43m[39m+    378[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                exc.message_dict[K
[0m[48;2;40;67;43m[39m+    379[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                if hasattr(exc, "message_dict")[K
[0m[48;2;40;67;43m[39m+    380[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                else list(exc.messages)[K
[0m[48;2;40;67;43m[39m+    381[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            ) from exc[K
[0m[48;2;40;67;43m[39m+    382[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    383[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    384[0m:[39m[48;2;24;38;30m [38;2;101;115;126m__all__ = [[K
[0m[48;2;40;67;43m[39m+    385[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    "TreatmentSerializer",[K
[0m[48;2;40;67;43m[39m+    386[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    "TreatmentPhotoSerializer",[K
[0m[48;2;40;67;43m[39m+    387[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    "TreatmentPhotoUploadSerializer",[K
[0m[48;2;40;67;43m[39m+    388[0m:[39m[48;2;24;38;30m [38;2;101;115;126m][K
[0m[K
Creating: [38;5;141m/home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/apps/treatments/serializers.py[0m
[38;5;244m - Completed in 0.1s[0m

I'll create the following file: [38;5;141m/home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/apps/treatments/views.py[0m[38;5;244m (using tool: write)[0m

[48;2;40;67;43m[39m+      1[0m:[39m[48;2;24;38;30m [38;2;101;115;126m"""[38;2;101;115;126mHTTP orchestration for the ``treatments`` app.[K
[0m[48;2;40;67;43m[39m+      2[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+      3[0m:[39m[48;2;24;38;30m [38;2;101;115;126mEndpoints (PROJECT_BRIEF § "Treatments"):[K
[0m[48;2;40;67;43m[39m+      4[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+      5[0m:[39m[48;2;24;38;30m [38;2;101;115;126m* ``GET  /api/v1/treatments/``           — paginated list[K
[0m[48;2;40;67;43m[39m+      6[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    (filters: ``?patient=&doctor=&department=&payment_status=&stage=``).[K
[0m[48;2;40;67;43m[39m+      7[0m:[39m[48;2;24;38;30m [38;2;101;115;126m* ``POST /api/v1/treatments/``           — create (bosh_shifokor / doctor).[K
[0m[48;2;40;67;43m[39m+      8[0m:[39m[48;2;24;38;30m [38;2;101;115;126m* ``GET  /api/v1/treatments/{id}/``      — retrieve.[K
[0m[48;2;40;67;43m[39m+      9[0m:[39m[48;2;24;38;30m [38;2;101;115;126m* ``PATCH /api/v1/treatments/{id}/``     — partial update.[K
[0m[48;2;40;67;43m[39m+     10[0m:[39m[48;2;24;38;30m [38;2;101;115;126m* ``PUT  /api/v1/treatments/{id}/``      — full update.[K
[0m[48;2;40;67;43m[39m+     11[0m:[39m[48;2;24;38;30m [38;2;101;115;126m* ``DELETE /api/v1/treatments/{id}/``    — soft-delete.[K
[0m[48;2;40;67;43m[39m+     12[0m:[39m[48;2;24;38;30m [38;2;101;115;126m* ``POST /api/v1/treatments/{id}/photos/`` — upload photo (multipart).[K
[0m[48;2;40;67;43m[39m+     13[0m:[39m[48;2;24;38;30m [38;2;101;115;126m* ``GET  /api/v1/treatments/{id}/photos/`` — list photos.[K
[0m[48;2;40;67;43m[39m+     14[0m:[39m[48;2;24;38;30m [38;2;101;115;126m"""[K
[0m[48;2;40;67;43m[39m+     15[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206m__future__[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206mannotations[K
[0m[48;2;40;67;43m[39m+     16[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     17[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206mtyping[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206mAny[K
[0m[48;2;40;67;43m[39m+     18[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     19[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206mdjango_filters[38;2;192;197;206m.[38;2;192;197;206mrest_framework[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206mDjangoFilterBackend[K
[0m[48;2;40;67;43m[39m+     20[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206mdrf_spectacular[38;2;192;197;206m.[38;2;192;197;206mutils[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206mOpenApiParameter[38;2;192;197;206m,[38;2;192;197;206m [38;2;192;197;206mextend_schema[K
[0m[48;2;40;67;43m[39m+     21[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206mrest_framework[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206mfilters[38;2;192;197;206m,[38;2;192;197;206m [38;2;192;197;206mstatus[38;2;192;197;206m,[38;2;192;197;206m [38;2;192;197;206mviewsets[K
[0m[48;2;40;67;43m[39m+     22[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206mrest_framework[38;2;192;197;206m.[38;2;192;197;206mdecorators[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206maction[K
[0m[48;2;40;67;43m[39m+     23[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206mrest_framework[38;2;192;197;206m.[38;2;192;197;206mparsers[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206mFormParser[38;2;192;197;206m,[38;2;192;197;206m [38;2;192;197;206mJSONParser[38;2;192;197;206m,[38;2;192;197;206m [38;2;192;197;206mMultiPartParser[K
[0m[48;2;40;67;43m[39m+     24[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206mrest_framework[38;2;192;197;206m.[38;2;192;197;206mrequest[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206mRequest[K
[0m[48;2;40;67;43m[39m+     25[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206mrest_framework[38;2;192;197;206m.[38;2;192;197;206mresponse[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206mResponse[K
[0m[48;2;40;67;43m[39m+     26[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     27[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206mapps[38;2;192;197;206m.[38;2;192;197;206mcore[38;2;192;197;206m.[38;2;192;197;206mpermissions[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;191;97;106mROLE_DOCTOR[K
[0m[48;2;40;67;43m[39m+     28[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     29[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;180;142;173m.[38;2;192;197;206mmodels[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206mTreatment[K
[0m[48;2;40;67;43m[39m+     30[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;180;142;173m.[38;2;192;197;206mpermissions[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206mTreatmentPermission[K
[0m[48;2;40;67;43m[39m+     31[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;180;142;173m.[38;2;192;197;206mselectors[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206m([K
[0m[48;2;40;67;43m[39m+     32[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;192;197;206mactive_treatments[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+     33[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;192;197;206mall_treatments[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+     34[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;192;197;206mfilter_treatments[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+     35[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;192;197;206mphotos_for_treatment[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+     36[0m:[39m[48;2;24;38;30m [38;2;192;197;206m)[K
[0m[48;2;40;67;43m[39m+     37[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;180;142;173m.[38;2;192;197;206mserializers[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206m([K
[0m[48;2;40;67;43m[39m+     38[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;192;197;206mTreatmentPhotoSerializer[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+     39[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;192;197;206mTreatmentPhotoUploadSerializer[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+     40[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;192;197;206mTreatmentSerializer[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+     41[0m:[39m[48;2;24;38;30m [38;2;192;197;206m)[K
[0m[48;2;40;67;43m[39m+     42[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;180;142;173m.[38;2;192;197;206mservices[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206msoft_delete_treatment[K
[0m[48;2;40;67;43m[39m+     43[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     44[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     45[0m:[39m[48;2;24;38;30m [38;2;192;197;206m@[38;2;191;97;106mextend_schema[38;2;192;197;206m([38;2;191;97;106mtags[38;2;192;197;206m=[38;2;192;197;206m[[38;2;192;197;206m"[38;2;163;190;140mtreatments[38;2;192;197;206m"[38;2;192;197;206m][38;2;192;197;206m)[K
[0m[48;2;40;67;43m[39m+     46[0m:[39m[48;2;24;38;30m [38;2;180;142;173mclass[38;2;239;241;245m [38;2;235;203;139mTreatmentViewSet[38;2;239;241;245m([38;2;163;190;140mviewsets[38;2;163;190;140m.[38;2;163;190;140mModelViewSet[38;2;239;241;245m)[38;2;239;241;245m:[K
[0m[48;2;40;67;43m[39m+     47[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;101;115;126m"""[38;2;101;115;126mCRUD for :class:`Treatment` under ``/api/v1/treatments/``.[38;2;101;115;126m"""[K
[0m[48;2;40;67;43m[39m+     48[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     49[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;192;197;206mserializer_class[38;2;192;197;206m [38;2;192;197;206m=[38;2;192;197;206m [38;2;192;197;206mTreatmentSerializer[K
[0m[48;2;40;67;43m[39m+     50[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;192;197;206mpermission_classes[38;2;192;197;206m [38;2;192;197;206m=[38;2;192;197;206m [38;2;192;197;206m[[38;2;192;197;206mTreatmentPermission[38;2;192;197;206m][K
[0m[48;2;40;67;43m[39m+     51[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;192;197;206mfilter_backends[38;2;192;197;206m [38;2;192;197;206m=[38;2;192;197;206m [38;2;192;197;206m[[38;2;192;197;206mDjangoFilterBackend[38;2;192;197;206m,[38;2;192;197;206m [38;2;192;197;206mfilters[38;2;192;197;206m.[38;2;192;197;206mOrderingFilter[38;2;192;197;206m][K
[0m[48;2;40;67;43m[39m+     52[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;192;197;206mfilterset_fields[38;2;192;197;206m [38;2;192;197;206m=[38;2;192;197;206m [38;2;192;197;206m[[38;2;192;197;206m"[38;2;163;190;140mpayment_status[38;2;192;197;206m"[38;2;192;197;206m,[38;2;192;197;206m [38;2;192;197;206m"[38;2;163;190;140mstage[38;2;192;197;206m"[38;2;192;197;206m,[38;2;192;197;206m [38;2;192;197;206m"[38;2;163;190;140mdepartment[38;2;192;197;206m"[38;2;192;197;206m][K
[0m[48;2;40;67;43m[39m+     53[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;192;197;206mordering_fields[38;2;192;197;206m [38;2;192;197;206m=[38;2;192;197;206m [38;2;192;197;206m[[38;2;192;197;206m"[38;2;163;190;140mcreated_at[38;2;192;197;206m"[38;2;192;197;206m,[38;2;192;197;206m [38;2;192;197;206m"[38;2;163;190;140mprice[38;2;192;197;206m"[38;2;192;197;206m][K
[0m[48;2;40;67;43m[39m+     54[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;192;197;206mordering[38;2;192;197;206m [38;2;192;197;206m=[38;2;192;197;206m [38;2;192;197;206m[[38;2;192;197;206m"[38;2;163;190;140m-created_at[38;2;192;197;206m"[38;2;192;197;206m][K
[0m[48;2;40;67;43m[39m+     55[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;192;197;206mparser_classes[38;2;192;197;206m [38;2;192;197;206m=[38;2;192;197;206m [38;2;192;197;206m[[38;2;192;197;206mJSONParser[38;2;192;197;206m,[38;2;192;197;206m [38;2;192;197;206mMultiPartParser[38;2;192;197;206m,[38;2;192;197;206m [38;2;192;197;206mFormParser[38;2;192;197;206m][K
[0m[48;2;40;67;43m[39m+     56[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;192;197;206mlookup_field[38;2;192;197;206m [38;2;192;197;206m=[38;2;192;197;206m [38;2;192;197;206m"[38;2;163;190;140mpk[38;2;192;197;206m"[K
[0m[48;2;40;67;43m[39m+     57[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     58[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;101;115;126m#[38;2;101;115;126m ------------------------------------------------------------------[K
[0m[48;2;40;67;43m[39m+     59[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    # Queryset (respects role scoping)[K
[0m[48;2;40;67;43m[39m+     60[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    # ------------------------------------------------------------------[K
[0m[48;2;40;67;43m[39m+     61[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    def get_queryset(self):[K
[0m[48;2;40;67;43m[39m+     62[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        request: Request | None = getattr(self, "request", None)[K
[0m[48;2;40;67;43m[39m+     63[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        if request is None:[K
[0m[48;2;40;67;43m[39m+     64[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            return active_treatments()[K
[0m[48;2;40;67;43m[39m+     65[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     66[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        params = request.query_params[K
[0m[48;2;40;67;43m[39m+     67[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        include_inactive = str([K
[0m[48;2;40;67;43m[39m+     68[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            params.get("include_inactive", "")[K
[0m[48;2;40;67;43m[39m+     69[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        ).lower() in {"1", "true", "yes"}[K
[0m[48;2;40;67;43m[39m+     70[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        role = getattr(request.user, "role", None)[K
[0m[48;2;40;67;43m[39m+     71[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     72[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        qs = filter_treatments([K
[0m[48;2;40;67;43m[39m+     73[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            patient_id=params.get("patient"),[K
[0m[48;2;40;67;43m[39m+     74[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            doctor_id=params.get("doctor"),[K
[0m[48;2;40;67;43m[39m+     75[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            department_id=params.get("department"),[K
[0m[48;2;40;67;43m[39m+     76[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            payment_status=params.get("payment_status"),[K
[0m[48;2;40;67;43m[39m+     77[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            stage=params.get("stage"),[K
[0m[48;2;40;67;43m[39m+     78[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            include_inactive=(include_inactive and role == "bosh_shifokor"),[K
[0m[48;2;40;67;43m[39m+     79[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        )[K
[0m[48;2;40;67;43m[39m+     80[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     81[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        # Doctor scope: only own rows unless can_view_other_doctors.[K
[0m[48;2;40;67;43m[39m+     82[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        if role == ROLE_DOCTOR:[K
[0m[48;2;40;67;43m[39m+     83[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            profile = getattr(request.user, "doctor_profile", None)[K
[0m[48;2;40;67;43m[39m+     84[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            if not getattr(profile, "can_view_other_doctors", False):[K
[0m[48;2;40;67;43m[39m+     85[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                if profile is not None:[K
[0m[48;2;40;67;43m[39m+     86[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                    qs = qs.filter(doctor=profile)[K
[0m[48;2;40;67;43m[39m+     87[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                else:[K
[0m[48;2;40;67;43m[39m+     88[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                    qs = qs.none()[K
[0m[48;2;40;67;43m[39m+     89[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     90[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        return qs[K
[0m[48;2;40;67;43m[39m+     91[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     92[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    # ------------------------------------------------------------------[K
[0m[48;2;40;67;43m[39m+     93[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    # Schema tweaks[K
[0m[48;2;40;67;43m[39m+     94[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    # ------------------------------------------------------------------[K
[0m[48;2;40;67;43m[39m+     95[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    @extend_schema([K
[0m[48;2;40;67;43m[39m+     96[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        parameters=[[K
[0m[48;2;40;67;43m[39m+     97[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            OpenApiParameter([K
[0m[48;2;40;67;43m[39m+     98[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                name="patient",[K
[0m[48;2;40;67;43m[39m+     99[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                required=False,[K
[0m[48;2;40;67;43m[39m+    100[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                type=str,[K
[0m[48;2;40;67;43m[39m+    101[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                location=OpenApiParameter.QUERY,[K
[0m[48;2;40;67;43m[39m+    102[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                description="Filter by patient UUID.",[K
[0m[48;2;40;67;43m[39m+    103[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            ),[K
[0m[48;2;40;67;43m[39m+    104[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            OpenApiParameter([K
[0m[48;2;40;67;43m[39m+    105[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                name="doctor",[K
[0m[48;2;40;67;43m[39m+    106[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                required=False,[K
[0m[48;2;40;67;43m[39m+    107[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                type=str,[K
[0m[48;2;40;67;43m[39m+    108[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                location=OpenApiParameter.QUERY,[K
[0m[48;2;40;67;43m[39m+    109[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                description="Filter by doctor UUID.",[K
[0m[48;2;40;67;43m[39m+    110[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            ),[K
[0m[48;2;40;67;43m[39m+    111[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            OpenApiParameter([K
[0m[48;2;40;67;43m[39m+    112[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                name="department",[K
[0m[48;2;40;67;43m[39m+    113[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                required=False,[K
[0m[48;2;40;67;43m[39m+    114[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                type=str,[K
[0m[48;2;40;67;43m[39m+    115[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                location=OpenApiParameter.QUERY,[K
[0m[48;2;40;67;43m[39m+    116[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                description="Filter by department UUID.",[K
[0m[48;2;40;67;43m[39m+    117[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            ),[K
[0m[48;2;40;67;43m[39m+    118[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            OpenApiParameter([K
[0m[48;2;40;67;43m[39m+    119[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                name="payment_status",[K
[0m[48;2;40;67;43m[39m+    120[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                required=False,[K
[0m[48;2;40;67;43m[39m+    121[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                type=str,[K
[0m[48;2;40;67;43m[39m+    122[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                location=OpenApiParameter.QUERY,[K
[0m[48;2;40;67;43m[39m+    123[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                description="unpaid | partial | paid",[K
[0m[48;2;40;67;43m[39m+    124[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            ),[K
[0m[48;2;40;67;43m[39m+    125[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            OpenApiParameter([K
[0m[48;2;40;67;43m[39m+    126[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                name="stage",[K
[0m[48;2;40;67;43m[39m+    127[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                required=False,[K
[0m[48;2;40;67;43m[39m+    128[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                type=str,[K
[0m[48;2;40;67;43m[39m+    129[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                location=OpenApiParameter.QUERY,[K
[0m[48;2;40;67;43m[39m+    130[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                description="in_progress | completed",[K
[0m[48;2;40;67;43m[39m+    131[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            ),[K
[0m[48;2;40;67;43m[39m+    132[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        ][K
[0m[48;2;40;67;43m[39m+    133[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    )[K
[0m[48;2;40;67;43m[39m+    134[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    def list(self, request: Request, *args: Any, **kwargs: Any) -> Response:[K
[0m[48;2;40;67;43m[39m+    135[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        return super().list(request, *args, **kwargs)[K
[0m[48;2;40;67;43m[39m+    136[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    137[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    # ------------------------------------------------------------------[K
[0m[48;2;40;67;43m[39m+    138[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    # Soft-delete[K
[0m[48;2;40;67;43m[39m+    139[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    # ------------------------------------------------------------------[K
[0m[48;2;40;67;43m[39m+    140[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    def destroy(self, request: Request, *args: Any, **kwargs: Any) -> Response:[K
[0m[48;2;40;67;43m[39m+    141[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        treatment: Treatment = self.get_object()[K
[0m[48;2;40;67;43m[39m+    142[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        soft_delete_treatment(treatment)[K
[0m[48;2;40;67;43m[39m+    143[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        return Response(status=status.HTTP_204_NO_CONTENT)[K
[0m[48;2;40;67;43m[39m+    144[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    145[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    # ------------------------------------------------------------------[K
[0m[48;2;40;67;43m[39m+    146[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    # /treatments/{id}/photos/  (GET list, POST upload)[K
[0m[48;2;40;67;43m[39m+    147[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    # ------------------------------------------------------------------[K
[0m[48;2;40;67;43m[39m+    148[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    @extend_schema([K
[0m[48;2;40;67;43m[39m+    149[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        summary="Photos for a treatment",[K
[0m[48;2;40;67;43m[39m+    150[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        responses={200: TreatmentPhotoSerializer(many=True)},[K
[0m[48;2;40;67;43m[39m+    151[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    )[K
[0m[48;2;40;67;43m[39m+    152[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    @action([K
[0m[48;2;40;67;43m[39m+    153[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        detail=True,[K
[0m[48;2;40;67;43m[39m+    154[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        methods=["get", "post"],[K
[0m[48;2;40;67;43m[39m+    155[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        url_path="photos",[K
[0m[48;2;40;67;43m[39m+    156[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        parser_classes=[MultiPartParser, FormParser, JSONParser],[K
[0m[48;2;40;67;43m[39m+    157[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    )[K
[0m[48;2;40;67;43m[39m+    158[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    def photos(self, request: Request, pk: str | None = None) -> Response:[K
[0m[48;2;40;67;43m[39m+    159[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        treatment: Treatment = self.get_object()[K
[0m[48;2;40;67;43m[39m+    160[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        if request.method.lower() == "get":[K
[0m[48;2;40;67;43m[39m+    161[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            photos_qs = photos_for_treatment(treatment.pk)[K
[0m[48;2;40;67;43m[39m+    162[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            data = TreatmentPhotoSerializer([K
[0m[48;2;40;67;43m[39m+    163[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                photos_qs, many=True, context={"request": request}[K
[0m[48;2;40;67;43m[39m+    164[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            ).data[K
[0m[48;2;40;67;43m[39m+    165[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            return Response(data, status=status.HTTP_200_OK)[K
[0m[48;2;40;67;43m[39m+    166[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    167[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        # POST — upload[K
[0m[48;2;40;67;43m[39m+    168[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        # Re-check write permission for this specific object.[K
[0m[48;2;40;67;43m[39m+    169[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        if not TreatmentPermission().has_object_permission(request, self, treatment):[K
[0m[48;2;40;67;43m[39m+    170[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            return Response([K
[0m[48;2;40;67;43m[39m+    171[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                {[K
[0m[48;2;40;67;43m[39m+    172[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                    "error": {[K
[0m[48;2;40;67;43m[39m+    173[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                        "code": "PERMISSION_DENIED",[K
[0m[48;2;40;67;43m[39m+    174[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                        "message": ([K
[0m[48;2;40;67;43m[39m+    175[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                            "Sizda bu davolashga rasm biriktirish uchun ruxsat yo'q."[K
[0m[48;2;40;67;43m[39m+    176[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                        ),[K
[0m[48;2;40;67;43m[39m+    177[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                        "details": {},[K
[0m[48;2;40;67;43m[39m+    178[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                    }[K
[0m[48;2;40;67;43m[39m+    179[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                },[K
[0m[48;2;40;67;43m[39m+    180[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                status=status.HTTP_403_FORBIDDEN,[K
[0m[48;2;40;67;43m[39m+    181[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            )[K
[0m[48;2;40;67;43m[39m+    182[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        serializer = TreatmentPhotoUploadSerializer([K
[0m[48;2;40;67;43m[39m+    183[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            data=request.data,[K
[0m[48;2;40;67;43m[39m+    184[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            context={"request": request, "treatment": treatment},[K
[0m[48;2;40;67;43m[39m+    185[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        )[K
[0m[48;2;40;67;43m[39m+    186[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        serializer.is_valid(raise_exception=True)[K
[0m[48;2;40;67;43m[39m+    187[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        photo = serializer.save()[K
[0m[48;2;40;67;43m[39m+    188[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        out = TreatmentPhotoSerializer(photo, context={"request": request}).data[K
[0m[48;2;40;67;43m[39m+    189[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        return Response(out, status=status.HTTP_201_CREATED)[K
[0m[48;2;40;67;43m[39m+    190[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    191[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    # ------------------------------------------------------------------[K
[0m[48;2;40;67;43m[39m+    192[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    # /treatments/{id}/tooth-records/  (added in T13 — stub only)[K
[0m[48;2;40;67;43m[39m+    193[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    # ------------------------------------------------------------------[K
[0m[48;2;40;67;43m[39m+    194[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    @extend_schema([K
[0m[48;2;40;67;43m[39m+    195[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        summary="Tooth records for a treatment (odontogram)",[K
[0m[48;2;40;67;43m[39m+    196[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        responses={200: dict, 501: dict},[K
[0m[48;2;40;67;43m[39m+    197[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    )[K
[0m[48;2;40;67;43m[39m+    198[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    @action(detail=True, methods=["get", "post"], url_path="tooth-records")[K
[0m[48;2;40;67;43m[39m+    199[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    def tooth_records(self, request: Request, pk: str | None = None) -> Response:[K
[0m[48;2;40;67;43m[39m+    200[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        """List or create tooth records.[K
[0m[48;2;40;67;43m[39m+    201[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    202[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        The write side is implemented by the odontogram app (T13). The[K
[0m[48;2;40;67;43m[39m+    203[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        read side is done here defensively so this endpoint returns a[K
[0m[48;2;40;67;43m[39m+    204[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        stable shape today.[K
[0m[48;2;40;67;43m[39m+    205[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        """[K
[0m[48;2;40;67;43m[39m+    206[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        treatment: Treatment = self.get_object()[K
[0m[48;2;40;67;43m[39m+    207[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        try:[K
[0m[48;2;40;67;43m[39m+    208[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            manager = treatment.tooth_records  # type: ignore[attr-defined][K
[0m[48;2;40;67;43m[39m+    209[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        except Exception:  # noqa: BLE001[K
[0m[48;2;40;67;43m[39m+    210[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            manager = None[K
[0m[48;2;40;67;43m[39m+    211[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    212[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        if request.method.lower() == "get":[K
[0m[48;2;40;67;43m[39m+    213[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            records: list[dict[str, Any]] = [][K
[0m[48;2;40;67;43m[39m+    214[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            if manager is not None:[K
[0m[48;2;40;67;43m[39m+    215[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                try:[K
[0m[48;2;40;67;43m[39m+    216[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                    for rec in manager.all():[K
[0m[48;2;40;67;43m[39m+    217[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                        records.append([K
[0m[48;2;40;67;43m[39m+    218[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                            {[K
[0m[48;2;40;67;43m[39m+    219[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                                "id": str(rec.pk),[K
[0m[48;2;40;67;43m[39m+    220[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                                "toothNumber": rec.tooth_number,[K
[0m[48;2;40;67;43m[39m+    221[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                                "procedure": rec.procedure,[K
[0m[48;2;40;67;43m[39m+    222[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                                "status": rec.status,[K
[0m[48;2;40;67;43m[39m+    223[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                                "notes": rec.notes or "",[K
[0m[48;2;40;67;43m[39m+    224[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                            }[K
[0m[48;2;40;67;43m[39m+    225[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                        )[K
[0m[48;2;40;67;43m[39m+    226[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                except Exception:  # noqa: BLE001 - table may not exist yet[K
[0m[48;2;40;67;43m[39m+    227[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                    records = [][K
[0m[48;2;40;67;43m[39m+    228[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            return Response(records, status=status.HTTP_200_OK)[K
[0m[48;2;40;67;43m[39m+    229[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    230[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        # POST — delegate to odontogram service if available.[K
[0m[48;2;40;67;43m[39m+    231[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        try:[K
[0m[48;2;40;67;43m[39m+    232[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            from apps.odontogram.services import (  # type: ignore[import-not-found][K
[0m[48;2;40;67;43m[39m+    233[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                create_tooth_record,[K
[0m[48;2;40;67;43m[39m+    234[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            )[K
[0m[48;2;40;67;43m[39m+    235[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        except ImportError:[K
[0m[48;2;40;67;43m[39m+    236[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            return Response([K
[0m[48;2;40;67;43m[39m+    237[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                {[K
[0m[48;2;40;67;43m[39m+    238[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                    "error": {[K
[0m[48;2;40;67;43m[39m+    239[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                        "code": "NOT_IMPLEMENTED",[K
[0m[48;2;40;67;43m[39m+    240[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                        "message": ([K
[0m[48;2;40;67;43m[39m+    241[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                            "Odontogram moduli hali o'rnatilmagan (T13)."[K
[0m[48;2;40;67;43m[39m+    242[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                        ),[K
[0m[48;2;40;67;43m[39m+    243[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                        "details": {},[K
[0m[48;2;40;67;43m[39m+    244[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                    }[K
[0m[48;2;40;67;43m[39m+    245[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                },[K
[0m[48;2;40;67;43m[39m+    246[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                status=status.HTTP_501_NOT_IMPLEMENTED,[K
[0m[48;2;40;67;43m[39m+    247[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            )[K
[0m[48;2;40;67;43m[39m+    248[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    249[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        payload = request.data if isinstance(request.data, dict) else {}[K
[0m[48;2;40;67;43m[39m+    250[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        try:[K
[0m[48;2;40;67;43m[39m+    251[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            rec = create_tooth_record([K
[0m[48;2;40;67;43m[39m+    252[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                treatment=treatment,[K
[0m[48;2;40;67;43m[39m+    253[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                tooth_number=payload.get("toothNumber", payload.get("tooth_number")),[K
[0m[48;2;40;67;43m[39m+    254[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                procedure=payload.get("procedure"),[K
[0m[48;2;40;67;43m[39m+    255[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                status_value=payload.get("status"),[K
[0m[48;2;40;67;43m[39m+    256[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                notes=payload.get("notes", "") or "",[K
[0m[48;2;40;67;43m[39m+    257[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            )[K
[0m[48;2;40;67;43m[39m+    258[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        except Exception as exc:  # noqa: BLE001 - relay as validation error[K
[0m[48;2;40;67;43m[39m+    259[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            return Response([K
[0m[48;2;40;67;43m[39m+    260[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                {[K
[0m[48;2;40;67;43m[39m+    261[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                    "error": {[K
[0m[48;2;40;67;43m[39m+    262[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                        "code": "VALIDATION_ERROR",[K
[0m[48;2;40;67;43m[39m+    263[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                        "message": str(exc),[K
[0m[48;2;40;67;43m[39m+    264[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                        "details": {},[K
[0m[48;2;40;67;43m[39m+    265[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                    }[K
[0m[48;2;40;67;43m[39m+    266[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                },[K
[0m[48;2;40;67;43m[39m+    267[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                status=status.HTTP_400_BAD_REQUEST,[K
[0m[48;2;40;67;43m[39m+    268[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            )[K
[0m[48;2;40;67;43m[39m+    269[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        return Response([K
[0m[48;2;40;67;43m[39m+    270[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            {[K
[0m[48;2;40;67;43m[39m+    271[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                "id": str(rec.pk),[K
[0m[48;2;40;67;43m[39m+    272[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                "toothNumber": rec.tooth_number,[K
[0m[48;2;40;67;43m[39m+    273[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                "procedure": rec.procedure,[K
[0m[48;2;40;67;43m[39m+    274[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                "status": rec.status,[K
[0m[48;2;40;67;43m[39m+    275[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                "notes": rec.notes or "",[K
[0m[48;2;40;67;43m[39m+    276[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            },[K
[0m[48;2;40;67;43m[39m+    277[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            status=status.HTTP_201_CREATED,[K
[0m[48;2;40;67;43m[39m+    278[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        )[K
[0m[48;2;40;67;43m[39m+    279[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    280[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    281[0m:[39m[48;2;24;38;30m [38;2;101;115;126m__all__ = ["TreatmentViewSet"][K
[0m[48;2;40;67;43m[39m+    282[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    283[0m:[39m[48;2;24;38;30m [38;2;101;115;126m# Silence "unused" lint on the import kept for typing / test compatibility.[K
[0m[48;2;40;67;43m[39m+    284[0m:[39m[48;2;24;38;30m [38;2;101;115;126m_ = all_treatments[K
[0m[K
Creating: [38;5;141m/home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/apps/treatments/views.py[0m
[38;5;244m - Completed in 0.1s[0m

I'll create the following file: [38;5;141m/home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/apps/treatments/urls.py[0m[38;5;244m (using tool: write)[0m

[48;2;40;67;43m[39m+     1[0m:[39m[48;2;24;38;30m [38;2;101;115;126m"""[38;2;101;115;126mURL routes for the ``treatments`` app under ``/api/v1/treatments/``.[38;2;101;115;126m"""[K
[0m[48;2;40;67;43m[39m+     2[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206m__future__[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206mannotations[K
[0m[48;2;40;67;43m[39m+     3[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     4[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206mrest_framework[38;2;192;197;206m.[38;2;192;197;206mrouters[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206mDefaultRouter[K
[0m[48;2;40;67;43m[39m+     5[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     6[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;180;142;173m.[38;2;192;197;206mviews[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206mTreatmentViewSet[K
[0m[48;2;40;67;43m[39m+     7[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     8[0m:[39m[48;2;24;38;30m [38;2;192;197;206mapp_name[38;2;192;197;206m [38;2;192;197;206m=[38;2;192;197;206m [38;2;192;197;206m"[38;2;163;190;140mtreatments[38;2;192;197;206m"[K
[0m[48;2;40;67;43m[39m+     9[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    10[0m:[39m[48;2;24;38;30m [38;2;192;197;206mrouter[38;2;192;197;206m [38;2;192;197;206m=[38;2;192;197;206m [38;2;143;161;179mDefaultRouter[38;2;192;197;206m([38;2;192;197;206m)[K
[0m[48;2;40;67;43m[39m+    11[0m:[39m[48;2;24;38;30m [38;2;192;197;206mrouter[38;2;192;197;206m.[38;2;143;161;179mregister[38;2;192;197;206m([38;2;180;142;173mr[38;2;192;197;206m"[38;2;192;197;206m"[38;2;192;197;206m,[38;2;192;197;206m [38;2;192;197;206mTreatmentViewSet[38;2;192;197;206m,[38;2;192;197;206m [38;2;191;97;106mbasename[38;2;192;197;206m=[38;2;192;197;206m"[38;2;163;190;140mtreatment[38;2;192;197;206m"[38;2;192;197;206m)[K
[0m[48;2;40;67;43m[39m+    12[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    13[0m:[39m[48;2;24;38;30m [38;2;192;197;206murlpatterns[38;2;192;197;206m [38;2;192;197;206m=[38;2;192;197;206m [38;2;192;197;206mrouter[38;2;192;197;206m.[38;2;192;197;206murls[K
[0m[K
Creating: [38;5;141m/home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/apps/treatments/urls.py[0m
[38;5;244m - Completed in 0.0s[0m

I'll create the following file: [38;5;141m/home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/apps/treatments/admin.py[0m[38;5;244m (using tool: write)[0m

[48;2;40;67;43m[39m+     1[0m:[39m[48;2;24;38;30m [38;2;101;115;126m"""[38;2;101;115;126mDjango admin for the treatments app.[38;2;101;115;126m"""[K
[0m[48;2;40;67;43m[39m+     2[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206m__future__[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206mannotations[K
[0m[48;2;40;67;43m[39m+     3[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     4[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206mdjango[38;2;192;197;206m.[38;2;192;197;206mcontrib[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206madmin[K
[0m[48;2;40;67;43m[39m+     5[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206msimple_history[38;2;192;197;206m.[38;2;192;197;206madmin[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206mSimpleHistoryAdmin[K
[0m[48;2;40;67;43m[39m+     6[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     7[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;180;142;173m.[38;2;192;197;206mmodels[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206mTreatment[38;2;192;197;206m,[38;2;192;197;206m [38;2;192;197;206mTreatmentPhoto[K
[0m[48;2;40;67;43m[39m+     8[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     9[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    10[0m:[39m[48;2;24;38;30m [38;2;192;197;206m@[38;2;192;197;206madmin[38;2;192;197;206m.[38;2;191;97;106mregister[38;2;192;197;206m([38;2;192;197;206mTreatment[38;2;192;197;206m)[K
[0m[48;2;40;67;43m[39m+    11[0m:[39m[48;2;24;38;30m [38;2;180;142;173mclass[38;2;239;241;245m [38;2;235;203;139mTreatmentAdmin[38;2;239;241;245m([38;2;163;190;140mSimpleHistoryAdmin[38;2;239;241;245m)[38;2;239;241;245m:[K
[0m[48;2;40;67;43m[39m+    12[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;192;197;206mlist_display[38;2;192;197;206m [38;2;192;197;206m=[38;2;192;197;206m [38;2;192;197;206m([K
[0m[48;2;40;67;43m[39m+    13[0m:[39m[48;2;24;38;30m [38;2;192;197;206m        [38;2;192;197;206m"[38;2;163;190;140mid[38;2;192;197;206m"[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+    14[0m:[39m[48;2;24;38;30m [38;2;192;197;206m        [38;2;192;197;206m"[38;2;163;190;140mpatient[38;2;192;197;206m"[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+    15[0m:[39m[48;2;24;38;30m [38;2;192;197;206m        [38;2;192;197;206m"[38;2;163;190;140mdoctor[38;2;192;197;206m"[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+    16[0m:[39m[48;2;24;38;30m [38;2;192;197;206m        [38;2;192;197;206m"[38;2;163;190;140mdepartment[38;2;192;197;206m"[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+    17[0m:[39m[48;2;24;38;30m [38;2;192;197;206m        [38;2;192;197;206m"[38;2;163;190;140mprice[38;2;192;197;206m"[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+    18[0m:[39m[48;2;24;38;30m [38;2;192;197;206m        [38;2;192;197;206m"[38;2;163;190;140mpayment_status[38;2;192;197;206m"[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+    19[0m:[39m[48;2;24;38;30m [38;2;192;197;206m        [38;2;192;197;206m"[38;2;163;190;140mstage[38;2;192;197;206m"[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+    20[0m:[39m[48;2;24;38;30m [38;2;192;197;206m        [38;2;192;197;206m"[38;2;163;190;140mis_active[38;2;192;197;206m"[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+    21[0m:[39m[48;2;24;38;30m [38;2;192;197;206m        [38;2;192;197;206m"[38;2;163;190;140mcreated_at[38;2;192;197;206m"[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+    22[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;192;197;206m)[K
[0m[48;2;40;67;43m[39m+    23[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;192;197;206mlist_filter[38;2;192;197;206m [38;2;192;197;206m=[38;2;192;197;206m [38;2;192;197;206m([38;2;192;197;206m"[38;2;163;190;140mpayment_status[38;2;192;197;206m"[38;2;192;197;206m,[38;2;192;197;206m [38;2;192;197;206m"[38;2;163;190;140mstage[38;2;192;197;206m"[38;2;192;197;206m,[38;2;192;197;206m [38;2;192;197;206m"[38;2;163;190;140mdepartment[38;2;192;197;206m"[38;2;192;197;206m,[38;2;192;197;206m [38;2;192;197;206m"[38;2;163;190;140mis_active[38;2;192;197;206m"[38;2;192;197;206m)[K
[0m[48;2;40;67;43m[39m+    24[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;192;197;206msearch_fields[38;2;192;197;206m [38;2;192;197;206m=[38;2;192;197;206m [38;2;192;197;206m([K
[0m[48;2;40;67;43m[39m+    25[0m:[39m[48;2;24;38;30m [38;2;192;197;206m        [38;2;192;197;206m"[38;2;163;190;140mdiagnosis[38;2;192;197;206m"[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+    26[0m:[39m[48;2;24;38;30m [38;2;192;197;206m        [38;2;192;197;206m"[38;2;163;190;140mdescription[38;2;192;197;206m"[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+    27[0m:[39m[48;2;24;38;30m [38;2;192;197;206m        [38;2;192;197;206m"[38;2;163;190;140mpatient__first_name[38;2;192;197;206m"[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+    28[0m:[39m[48;2;24;38;30m [38;2;192;197;206m        [38;2;192;197;206m"[38;2;163;190;140mpatient__last_name[38;2;192;197;206m"[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+    29[0m:[39m[48;2;24;38;30m [38;2;192;197;206m        [38;2;192;197;206m"[38;2;163;190;140mpatient__phone_number[38;2;192;197;206m"[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+    30[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;192;197;206m)[K
[0m[48;2;40;67;43m[39m+    31[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;192;197;206mautocomplete_fields[38;2;192;197;206m [38;2;192;197;206m=[38;2;192;197;206m [38;2;192;197;206m([38;2;192;197;206m"[38;2;163;190;140mappointment[38;2;192;197;206m"[38;2;192;197;206m,[38;2;192;197;206m [38;2;192;197;206m"[38;2;163;190;140mdoctor[38;2;192;197;206m"[38;2;192;197;206m,[38;2;192;197;206m [38;2;192;197;206m"[38;2;163;190;140mpatient[38;2;192;197;206m"[38;2;192;197;206m,[38;2;192;197;206m [38;2;192;197;206m"[38;2;163;190;140mdepartment[38;2;192;197;206m"[38;2;192;197;206m)[K
[0m[48;2;40;67;43m[39m+    32[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;192;197;206mreadonly_fields[38;2;192;197;206m [38;2;192;197;206m=[38;2;192;197;206m [38;2;192;197;206m([38;2;192;197;206m"[38;2;163;190;140mcreated_at[38;2;192;197;206m"[38;2;192;197;206m,[38;2;192;197;206m [38;2;192;197;206m"[38;2;163;190;140mupdated_at[38;2;192;197;206m"[38;2;192;197;206m)[K
[0m[48;2;40;67;43m[39m+    33[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;192;197;206mordering[38;2;192;197;206m [38;2;192;197;206m=[38;2;192;197;206m [38;2;192;197;206m([38;2;192;197;206m"[38;2;163;190;140m-created_at[38;2;192;197;206m"[38;2;192;197;206m,[38;2;192;197;206m)[K
[0m[48;2;40;67;43m[39m+    34[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    35[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    36[0m:[39m[48;2;24;38;30m [38;2;192;197;206m@[38;2;192;197;206madmin[38;2;192;197;206m.[38;2;191;97;106mregister[38;2;192;197;206m([38;2;192;197;206mTreatmentPhoto[38;2;192;197;206m)[K
[0m[48;2;40;67;43m[39m+    37[0m:[39m[48;2;24;38;30m [38;2;180;142;173mclass[38;2;239;241;245m [38;2;235;203;139mTreatmentPhotoAdmin[38;2;239;241;245m([38;2;163;190;140madmin[38;2;163;190;140m.[38;2;163;190;140mModelAdmin[38;2;239;241;245m)[38;2;239;241;245m:[K
[0m[48;2;40;67;43m[39m+    38[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;192;197;206mlist_display[38;2;192;197;206m [38;2;192;197;206m=[38;2;192;197;206m [38;2;192;197;206m([K
[0m[48;2;40;67;43m[39m+    39[0m:[39m[48;2;24;38;30m [38;2;192;197;206m        [38;2;192;197;206m"[38;2;163;190;140mid[38;2;192;197;206m"[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+    40[0m:[39m[48;2;24;38;30m [38;2;192;197;206m        [38;2;192;197;206m"[38;2;163;190;140mtreatment[38;2;192;197;206m"[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+    41[0m:[39m[48;2;24;38;30m [38;2;192;197;206m        [38;2;192;197;206m"[38;2;163;190;140mphoto_type[38;2;192;197;206m"[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+    42[0m:[39m[48;2;24;38;30m [38;2;192;197;206m        [38;2;192;197;206m"[38;2;163;190;140muploaded_at[38;2;192;197;206m"[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+    43[0m:[39m[48;2;24;38;30m [38;2;192;197;206m        [38;2;192;197;206m"[38;2;163;190;140muploaded_by[38;2;192;197;206m"[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+    44[0m:[39m[48;2;24;38;30m [38;2;192;197;206m        [38;2;192;197;206m"[38;2;163;190;140mis_active[38;2;192;197;206m"[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+    45[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;192;197;206m)[K
[0m[48;2;40;67;43m[39m+    46[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;192;197;206mlist_filter[38;2;192;197;206m [38;2;192;197;206m=[38;2;192;197;206m [38;2;192;197;206m([38;2;192;197;206m"[38;2;163;190;140mphoto_type[38;2;192;197;206m"[38;2;192;197;206m,[38;2;192;197;206m [38;2;192;197;206m"[38;2;163;190;140mis_active[38;2;192;197;206m"[38;2;192;197;206m)[K
[0m[48;2;40;67;43m[39m+    47[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;192;197;206mautocomplete_fields[38;2;192;197;206m [38;2;192;197;206m=[38;2;192;197;206m [38;2;192;197;206m([38;2;192;197;206m"[38;2;163;190;140mtreatment[38;2;192;197;206m"[38;2;192;197;206m,[38;2;192;197;206m)[K
[0m[48;2;40;67;43m[39m+    48[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;192;197;206mreadonly_fields[38;2;192;197;206m [38;2;192;197;206m=[38;2;192;197;206m [38;2;192;197;206m([38;2;192;197;206m"[38;2;163;190;140muploaded_at[38;2;192;197;206m"[38;2;192;197;206m,[38;2;192;197;206m [38;2;192;197;206m"[38;2;163;190;140mcreated_at[38;2;192;197;206m"[38;2;192;197;206m,[38;2;192;197;206m [38;2;192;197;206m"[38;2;163;190;140mupdated_at[38;2;192;197;206m"[38;2;192;197;206m)[K
[0m[48;2;40;67;43m[39m+    49[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;192;197;206mordering[38;2;192;197;206m [38;2;192;197;206m=[38;2;192;197;206m [38;2;192;197;206m([38;2;192;197;206m"[38;2;163;190;140m-uploaded_at[38;2;192;197;206m"[38;2;192;197;206m,[38;2;192;197;206m)[K
[0m[K
Creating: [38;5;141m/home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/apps/treatments/admin.py[0m
[38;5;244m - Completed in 0.0s[0m

I'll create the following file: [38;5;141m/home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/apps/treatments/migrations/__init__.py[0m[38;5;244m (using tool: write)[0m

[48;2;40;67;43m[39m+    1[0m:[39m[48;2;24;38;30m [38;2;101;115;126m"""[38;2;101;115;126mMigrations package for the ``treatments`` app.[38;2;101;115;126m"""[K
[0m[K
Creating: [38;5;141m/home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/apps/treatments/migrations/__init__.py[0m
[38;5;244m - Completed in 0.0s[0m

[38;5;141m> [0mNow register the app in settings, add its route to urls, and generate migrations.[0m[0m
I'll modify the following file: [38;5;141mdentacrm/backend/config/settings/base.py[0m[38;5;244m (using tool: write)[0m

[48;2;43;48;59m[39m  119, 119[0m:[39m[48;2;43;48;59m [38;2;192;197;206m    [38;2;192;197;206m"[38;2;163;190;140mapps.patients[38;2;192;197;206m"[38;2;192;197;206m,[K
[0m[48;2;43;48;59m[39m  120, 120[0m:[39m[48;2;43;48;59m [38;2;192;197;206m    [38;2;192;197;206m"[38;2;163;190;140mapps.scheduling[38;2;192;197;206m"[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+      121[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;192;197;206m"[38;2;163;190;140mapps.treatments[38;2;192;197;206m"[38;2;192;197;206m,[K
[0m[48;2;43;48;59m[39m  121, 122[0m:[39m[48;2;43;48;59m [38;2;43;48;59m][K
[0m[K
Updating: [38;5;141mdentacrm/backend/config/settings/base.py[0m
[38;5;244m - Completed in 0.1s[0m

I'll modify the following file: [38;5;141mdentacrm/backend/config/urls.py[0m[38;5;244m (using tool: write)[0m

[48;2;43;48;59m[39m  40, 40[0m:[39m[48;2;43;48;59m [38;2;192;197;206m    [38;2;143;161;179mpath[38;2;192;197;206m([38;2;192;197;206m"[38;2;163;190;140mappointments/[38;2;192;197;206m"[38;2;192;197;206m,[38;2;192;197;206m [38;2;143;161;179minclude[38;2;192;197;206m([38;2;192;197;206m"[38;2;163;190;140mapps.scheduling.urls[38;2;192;197;206m"[38;2;192;197;206m,[38;2;192;197;206m [38;2;191;97;106mnamespace[38;2;192;197;206m=[38;2;192;197;206m"[38;2;163;190;140mscheduling[38;2;192;197;206m"[38;2;192;197;206m)[38;2;192;197;206m)[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+     41[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;143;161;179mpath[38;2;192;197;206m([38;2;192;197;206m"[38;2;163;190;140mtreatments/[38;2;192;197;206m"[38;2;192;197;206m,[38;2;192;197;206m [38;2;143;161;179minclude[38;2;192;197;206m([38;2;192;197;206m"[38;2;163;190;140mapps.treatments.urls[38;2;192;197;206m"[38;2;192;197;206m,[38;2;192;197;206m [38;2;191;97;106mnamespace[38;2;192;197;206m=[38;2;192;197;206m"[38;2;163;190;140mtreatments[38;2;192;197;206m"[38;2;192;197;206m)[38;2;192;197;206m)[38;2;192;197;206m,[K
[0m[48;2;43;48;59m[39m  41, 42[0m:[39m[48;2;43;48;59m [38;2;43;48;59m][K
[0m[K
Updating: [38;5;141mdentacrm/backend/config/urls.py[0m
[38;5;244m - Completed in 0.1s[0m

I will run the following command: [38;5;141m.venv/bin/python manage.py makemigrations treatments 2>&1 | tail -40[0m (in [38;5;141mdentacrm/backend[0m)[38;5;244m (using tool: shell)[0m
Purpose: Generate migrations for treatments app

/home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/.venv/lib/python3.12/site-packages/rest_framework/fields.py:992: UserWarning: min_value should be a Decimal instance.
  warnings.warn("min_value should be a Decimal instance.")
Migrations for 'treatments':
  apps/treatments/migrations/0001_initial.py
    - Create model HistoricalTreatment
    - Create model Treatment
    - Create model TreatmentPhoto
    - Create index tr_patient_idx on field(s) patient, -created_at of model treatment
    - Create index tr_doctor_idx on field(s) doctor, -created_at of model treatment
    - Create index tr_paystatus_idx on field(s) payment_status of model treatment
    - Create index tr_stage_idx on field(s) stage of model treatment
    - Create constraint treatments_treatment_price_non_negative on model treatment
    - Create index tp_treatment_type_idx on field(s) treatment, photo_type of model treatmentphoto
[38;5;244m - Completed in 2.113s[0m

[38;5;141m> [0mFix the DecimalField min_value warning while migrations are still fresh.[0m[0m
I'll modify the following file: [38;5;141mdentacrm/backend/apps/treatments/serializers.py[0m[38;5;244m (using tool: write)[0m

[48;2;43;48;59m[39m  156, 156[0m:[39m[48;2;43;48;59m [38;2;192;197;206m    [38;2;192;197;206mprice[38;2;192;197;206m [38;2;192;197;206m=[38;2;192;197;206m [38;2;192;197;206mserializers[38;2;192;197;206m.[38;2;143;161;179mDecimalField[38;2;192;197;206m([K
[0m[48;2;79;40;40m[39m- 157     [0m:[39m[48;2;36;25;28m [38;2;192;197;206m        [38;2;191;97;106mmax_digits[38;2;192;197;206m=[38;2;208;135;112m12[38;2;192;197;206m,[38;2;192;197;206m [38;2;191;97;106mdecimal_places[38;2;192;197;206m=[38;2;208;135;112m2[38;2;192;197;206m,[38;2;192;197;206m [38;2;191;97;106mrequired[38;2;192;197;206m=[38;2;208;135;112mFalse[38;2;192;197;206m,[38;2;192;197;206m [38;2;191;97;106mmin_value[38;2;192;197;206m=[38;2;208;135;112m0[K
[0m[48;2;40;67;43m[39m+      157[0m:[39m[48;2;24;38;30m [38;2;192;197;206m        [38;2;191;97;106mmax_digits[38;2;192;197;206m=[38;2;208;135;112m12[38;2;192;197;206m,[38;2;192;197;206m [38;2;191;97;106mdecimal_places[38;2;192;197;206m=[38;2;208;135;112m2[38;2;192;197;206m,[38;2;192;197;206m [38;2;191;97;106mrequired[38;2;192;197;206m=[38;2;208;135;112mFalse[38;2;192;197;206m,[38;2;192;197;206m [38;2;191;97;106mmin_value[38;2;192;197;206m=[38;2;143;161;179mDecimal[38;2;192;197;206m([38;2;192;197;206m"[38;2;163;190;140m0[38;2;192;197;206m"[38;2;192;197;206m)[K
[0m[48;2;43;48;59m[39m  158, 158[0m:[39m[48;2;43;48;59m [38;2;192;197;206m    [38;2;192;197;206m)[K
[0m[K
Updating: [38;5;141mdentacrm/backend/apps/treatments/serializers.py[0m
[38;5;244m - Completed in 0.1s[0m

I'll modify the following file: [38;5;141mdentacrm/backend/apps/treatments/serializers.py[0m[38;5;244m (using tool: write)[0m

[48;2;43;48;59m[39m   8,  8[0m:[39m[48;2;43;48;59m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206mtyping[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206mAny[K
[0m[48;2;43;48;59m[39m   9,  9[0m:[39m[48;2;43;48;59m [K
[0m[48;2;43;48;59m[39m  10, 10[0m:[39m[48;2;43;48;59m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206mdjango[38;2;192;197;206m.[38;2;192;197;206mcore[38;2;192;197;206m.[38;2;192;197;206mexceptions[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206mValidationError[38;2;192;197;206m [38;2;180;142;173mas[38;2;192;197;206m [38;2;192;197;206mDjangoValidationError[K
[0m[48;2;43;48;59m[39m  11, 11[0m:[39m[48;2;43;48;59m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206mrest_framework[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206mserializers[K
[0m[48;2;43;48;59m[39m  12, 12[0m:[39m[48;2;43;48;59m [K
[0m[48;2;43;48;59m[39m  13, 13[0m:[39m[48;2;43;48;59m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;180;142;173m.[38;2;192;197;206mmodels[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206m([K
[0m[48;2;43;48;59m[39m  14, 14[0m:[39m[48;2;43;48;59m [38;2;192;197;206m    [38;2;192;197;206mPaymentStatus[38;2;192;197;206m,[K
[0m[48;2;43;48;59m[39m  15, 15[0m:[39m[48;2;43;48;59m [38;2;192;197;206m    [38;2;192;197;206mPhotoType[38;2;192;197;206m,[K
[0m[48;2;43;48;59m[39m  16, 16[0m:[39m[48;2;43;48;59m [38;2;192;197;206m    [38;2;192;197;206mTreatment[38;2;192;197;206m,[K
[0m[48;2;43;48;59m[39m  17, 17[0m:[39m[48;2;43;48;59m [38;2;192;197;206m    [38;2;192;197;206mTreatmentPhoto[38;2;192;197;206m,[K
[0m[48;2;43;48;59m[39m  18, 18[0m:[39m[48;2;43;48;59m [38;2;192;197;206m    [38;2;192;197;206mTreatmentStage[38;2;192;197;206m,[K
[0m[48;2;43;48;59m[39m  19, 19[0m:[39m[48;2;43;48;59m [38;2;192;197;206m)[K
[0m[48;2;79;40;40m[39m- 20    [0m:[39m[48;2;36;25;28m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;180;142;173m.[38;2;192;197;206mservices[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206m([K
[0m[48;2;79;40;40m[39m- 21    [0m:[39m[48;2;36;25;28m [38;2;192;197;206m    [38;2;192;197;206mcreate_treatment[38;2;192;197;206m,[K
[0m[48;2;79;40;40m[39m- 22    [0m:[39m[48;2;36;25;28m [38;2;192;197;206m    [38;2;192;197;206mupdate_treatment[38;2;192;197;206m,[K
[0m[48;2;79;40;40m[39m- 23    [0m:[39m[48;2;36;25;28m [38;2;192;197;206m    [38;2;192;197;206mupload_treatment_photo[38;2;192;197;206m,[K
[0m[48;2;79;40;40m[39m- 24    [0m:[39m[48;2;36;25;28m [38;2;192;197;206m)[K
[0m[K
Updating: [38;5;141mdentacrm/backend/apps/treatments/serializers.py[0m
[38;5;244m - Completed in 0.1s[0m

I'll modify the following file: [38;5;141mdentacrm/backend/apps/treatments/serializers.py[0m[38;5;244m (using tool: write)[0m

[48;2;43;48;59m[39m   8,  8[0m:[39m[48;2;43;48;59m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206mtyping[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206mAny[K
[0m[48;2;43;48;59m[39m   9,  9[0m:[39m[48;2;43;48;59m [K
[0m[48;2;40;67;43m[39m+     10[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206mdecimal[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206mDecimal[K
[0m[48;2;40;67;43m[39m+     11[0m:[39m[48;2;24;38;30m [K
[0m[48;2;43;48;59m[39m  10, 12[0m:[39m[48;2;43;48;59m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206mdjango[38;2;192;197;206m.[38;2;192;197;206mcore[38;2;192;197;206m.[38;2;192;197;206mexceptions[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206mValidationError[38;2;192;197;206m [38;2;180;142;173mas[38;2;192;197;206m [38;2;192;197;206mDjangoValidationError[K
[0m[48;2;43;48;59m[39m  11, 13[0m:[39m[48;2;43;48;59m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206mrest_framework[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206mserializers[K
[0m[48;2;43;48;59m[39m  12, 14[0m:[39m[48;2;43;48;59m [K
[0m[48;2;43;48;59m[39m  13, 15[0m:[39m[48;2;43;48;59m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;180;142;173m.[38;2;192;197;206mmodels[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206m([K
[0m[48;2;43;48;59m[39m  14, 16[0m:[39m[48;2;43;48;59m [38;2;192;197;206m    [38;2;192;197;206mPaymentStatus[38;2;192;197;206m,[K
[0m[48;2;43;48;59m[39m  15, 17[0m:[39m[48;2;43;48;59m [38;2;192;197;206m    [38;2;192;197;206mPhotoType[38;2;192;197;206m,[K
[0m[48;2;43;48;59m[39m  16, 18[0m:[39m[48;2;43;48;59m [38;2;192;197;206m    [38;2;192;197;206mTreatment[38;2;192;197;206m,[K
[0m[48;2;43;48;59m[39m  17, 19[0m:[39m[48;2;43;48;59m [38;2;192;197;206m    [38;2;192;197;206mTreatmentPhoto[38;2;192;197;206m,[K
[0m[48;2;43;48;59m[39m  18, 20[0m:[39m[48;2;43;48;59m [38;2;192;197;206m    [38;2;192;197;206mTreatmentStage[38;2;192;197;206m,[K
[0m[48;2;43;48;59m[39m  19, 21[0m:[39m[48;2;43;48;59m [38;2;192;197;206m)[K
[0m[48;2;40;67;43m[39m+     22[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;180;142;173m.[38;2;192;197;206mservices[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206m([K
[0m[48;2;40;67;43m[39m+     23[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;192;197;206mcreate_treatment[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+     24[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;192;197;206mupdate_treatment[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+     25[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;192;197;206mupload_treatment_photo[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+     26[0m:[39m[48;2;24;38;30m [38;2;192;197;206m)[K
[0m[K
Updating: [38;5;141mdentacrm/backend/apps/treatments/serializers.py[0m
[38;5;244m - Completed in 0.1s[0m

I will run the following command: [38;5;141m.venv/bin/python manage.py check 2>&1 | tail -20[0m (in [38;5;141mdentacrm/backend[0m)[38;5;244m (using tool: shell)[0m
Purpose: Run Django system checks

System check identified no issues (0 silenced).
[38;5;244m - Completed in 1.836s[0m

I will run the following command: [38;5;141m.venv/bin/python manage.py migrate 2>&1 | tail -20[0m (in [38;5;141mdentacrm/backend[0m)[38;5;244m (using tool: shell)[0m
Purpose: Apply migrations

Operations to perform:
  Apply all migrations: accounts, admin, auth, contenttypes, departments, django_celery_beat, django_celery_results, doctors, patients, scheduling, sessions, token_blacklist, treatments
Running migrations:
  Applying treatments.0001_initial... OK
[38;5;244m - Completed in 2.729s[0m

[38;5;141m> [0mNow write tests for the treatments app.[0m[0m
Reading file: [38;5;141m/home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/tests/test_scheduling.py[0m, from line [38;5;141m1[0m to [38;5;141m100[0m[38;5;244m (using tool: read)[0m
[38;5;10m ✓ [0mSuccessfully read [38;5;244m2780 bytes[0m from /home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/tests/test_scheduling.py
[38;5;244m - Completed in 0.0s[0m

Reading file: [38;5;141m/home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/tests/test_scheduling.py[0m, from line [38;5;141m100[0m to [38;5;141m250[0m[38;5;244m (using tool: read)[0m
[38;5;10m ✓ [0mSuccessfully read [38;5;244m4137 bytes[0m from /home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/tests/test_scheduling.py
[38;5;244m - Completed in 0.0s[0m

I'll create the following file: [38;5;141m/home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/tests/test_treatments.py[0m[38;5;244m (using tool: write)[0m

[48;2;40;67;43m[39m+      1[0m:[39m[48;2;24;38;30m [38;2;101;115;126m"""[38;2;101;115;126mTests for the ``treatments`` app (T12).[K
[0m[48;2;40;67;43m[39m+      2[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+      3[0m:[39m[48;2;24;38;30m [38;2;101;115;126mCovers PROJECT_BRIEF acceptance criteria:[K
[0m[48;2;40;67;43m[39m+      4[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+      5[0m:[39m[48;2;24;38;30m [38;2;101;115;126m* #6 CRUD — list, create, retrieve, update, soft-delete.[K
[0m[48;2;40;67;43m[39m+      6[0m:[39m[48;2;24;38;30m [38;2;101;115;126m* #4 RBAC — bosh_shifokor writes anywhere; doctor writes own; admin[K
[0m[48;2;40;67;43m[39m+      7[0m:[39m[48;2;24;38;30m [38;2;101;115;126m  reads only; anonymous rejected.[K
[0m[48;2;40;67;43m[39m+      8[0m:[39m[48;2;24;38;30m [38;2;101;115;126m* #12 Photo upload — before/after/xray, multipart request.[K
[0m[48;2;40;67;43m[39m+      9[0m:[39m[48;2;24;38;30m [38;2;101;115;126m* Standard error envelope + camelCase serialisation.[K
[0m[48;2;40;67;43m[39m+     10[0m:[39m[48;2;24;38;30m [38;2;101;115;126m* Filters — ``?patient=&doctor=&department=&payment_status=&stage=``.[K
[0m[48;2;40;67;43m[39m+     11[0m:[39m[48;2;24;38;30m [38;2;101;115;126m* Service consistency — appointment/patient/doctor must match; doctor[K
[0m[48;2;40;67;43m[39m+     12[0m:[39m[48;2;24;38;30m [38;2;101;115;126m  must belong to department.[K
[0m[48;2;40;67;43m[39m+     13[0m:[39m[48;2;24;38;30m [38;2;101;115;126m* Stage transition — completed cannot revert to in_progress.[K
[0m[48;2;40;67;43m[39m+     14[0m:[39m[48;2;24;38;30m [38;2;101;115;126m"""[K
[0m[48;2;40;67;43m[39m+     15[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206m__future__[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206mannotations[K
[0m[48;2;40;67;43m[39m+     16[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     17[0m:[39m[48;2;24;38;30m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206mio[K
[0m[48;2;40;67;43m[39m+     18[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206mdatetime[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206mdatetime[38;2;192;197;206m,[38;2;192;197;206m [38;2;192;197;206mtime[38;2;192;197;206m,[38;2;192;197;206m [38;2;192;197;206mtimedelta[K
[0m[48;2;40;67;43m[39m+     19[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206mdecimal[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206mDecimal[K
[0m[48;2;40;67;43m[39m+     20[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     21[0m:[39m[48;2;24;38;30m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206mpytest[K
[0m[48;2;40;67;43m[39m+     22[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206mdjango[38;2;192;197;206m.[38;2;192;197;206mcontrib[38;2;192;197;206m.[38;2;192;197;206mauth[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206mget_user_model[K
[0m[48;2;40;67;43m[39m+     23[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206mdjango[38;2;192;197;206m.[38;2;192;197;206mcore[38;2;192;197;206m.[38;2;192;197;206mexceptions[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206mValidationError[K
[0m[48;2;40;67;43m[39m+     24[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206mdjango[38;2;192;197;206m.[38;2;192;197;206mcore[38;2;192;197;206m.[38;2;192;197;206mfiles[38;2;192;197;206m.[38;2;192;197;206muploadedfile[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206mSimpleUploadedFile[K
[0m[48;2;40;67;43m[39m+     25[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206mdjango[38;2;192;197;206m.[38;2;192;197;206mutils[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206mtimezone[K
[0m[48;2;40;67;43m[39m+     26[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206mPIL[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206mImage[K
[0m[48;2;40;67;43m[39m+     27[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206mrest_framework[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206mstatus[K
[0m[48;2;40;67;43m[39m+     28[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206mrest_framework[38;2;192;197;206m.[38;2;192;197;206mtest[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206mAPIClient[K
[0m[48;2;40;67;43m[39m+     29[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     30[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206mapps[38;2;192;197;206m.[38;2;192;197;206mdepartments[38;2;192;197;206m.[38;2;192;197;206mmodels[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206mDepartment[K
[0m[48;2;40;67;43m[39m+     31[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206mapps[38;2;192;197;206m.[38;2;192;197;206mdoctors[38;2;192;197;206m.[38;2;192;197;206mmodels[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206m([K
[0m[48;2;40;67;43m[39m+     32[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;192;197;206mCommissionBasis[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+     33[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;192;197;206mDoctorProfile[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+     34[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;192;197;206mProcedureType[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+     35[0m:[39m[48;2;24;38;30m [38;2;192;197;206m)[K
[0m[48;2;40;67;43m[39m+     36[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206mapps[38;2;192;197;206m.[38;2;192;197;206mpatients[38;2;192;197;206m.[38;2;192;197;206mservices[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206mcreate_patient[K
[0m[48;2;40;67;43m[39m+     37[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206mapps[38;2;192;197;206m.[38;2;192;197;206mscheduling[38;2;192;197;206m.[38;2;192;197;206mservices[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206mcreate_appointment[K
[0m[48;2;40;67;43m[39m+     38[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206mapps[38;2;192;197;206m.[38;2;192;197;206mtreatments[38;2;192;197;206m.[38;2;192;197;206mmodels[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206m([K
[0m[48;2;40;67;43m[39m+     39[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;192;197;206mPaymentStatus[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+     40[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;192;197;206mPhotoType[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+     41[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;192;197;206mTreatment[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+     42[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;192;197;206mTreatmentPhoto[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+     43[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;192;197;206mTreatmentStage[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+     44[0m:[39m[48;2;24;38;30m [38;2;192;197;206m)[K
[0m[48;2;40;67;43m[39m+     45[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206mapps[38;2;192;197;206m.[38;2;192;197;206mtreatments[38;2;192;197;206m.[38;2;192;197;206mselectors[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206m([K
[0m[48;2;40;67;43m[39m+     46[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;192;197;206mactive_treatments[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+     47[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;192;197;206mfilter_treatments[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+     48[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;192;197;206mphotos_for_treatment[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+     49[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;192;197;206mtreatments_for_doctor[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+     50[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;192;197;206mtreatments_for_patient[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+     51[0m:[39m[48;2;24;38;30m [38;2;192;197;206m)[K
[0m[48;2;40;67;43m[39m+     52[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206mapps[38;2;192;197;206m.[38;2;192;197;206mtreatments[38;2;192;197;206m.[38;2;192;197;206mservices[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206m([K
[0m[48;2;40;67;43m[39m+     53[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;192;197;206mcreate_treatment[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+     54[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;192;197;206msoft_delete_treatment[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+     55[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;192;197;206mupdate_treatment[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+     56[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;192;197;206mupload_treatment_photo[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+     57[0m:[39m[48;2;24;38;30m [38;2;192;197;206m)[K
[0m[48;2;40;67;43m[39m+     58[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     59[0m:[39m[48;2;24;38;30m [38;2;192;197;206mpytestmark[38;2;192;197;206m [38;2;192;197;206m=[38;2;192;197;206m [38;2;192;197;206mpytest[38;2;192;197;206m.[38;2;192;197;206mmark[38;2;192;197;206m.[38;2;192;197;206mdjango_db[K
[0m[48;2;40;67;43m[39m+     60[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     61[0m:[39m[48;2;24;38;30m [38;2;192;197;206mUser[38;2;192;197;206m [38;2;192;197;206m=[38;2;192;197;206m [38;2;143;161;179mget_user_model[38;2;192;197;206m([38;2;192;197;206m)[K
[0m[48;2;40;67;43m[39m+     62[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     63[0m:[39m[48;2;24;38;30m [38;2;191;97;106mLIST_URL[38;2;192;197;206m [38;2;192;197;206m=[38;2;192;197;206m [38;2;192;197;206m"[38;2;163;190;140m/api/v1/treatments/[38;2;192;197;206m"[K
[0m[48;2;40;67;43m[39m+     64[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     65[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     66[0m:[39m[48;2;24;38;30m [38;2;101;115;126m#[38;2;101;115;126m ===========================================================================[K
[0m[48;2;40;67;43m[39m+     67[0m:[39m[48;2;24;38;30m [38;2;101;115;126m# Fixtures[K
[0m[48;2;40;67;43m[39m+     68[0m:[39m[48;2;24;38;30m [38;2;101;115;126m# ===========================================================================[K
[0m[48;2;40;67;43m[39m+     69[0m:[39m[48;2;24;38;30m [38;2;101;115;126m@pytest.fixture[K
[0m[48;2;40;67;43m[39m+     70[0m:[39m[48;2;24;38;30m [38;2;101;115;126mdef head_doctor():[K
[0m[48;2;40;67;43m[39m+     71[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    return User.objects.create_user([K
[0m[48;2;40;67;43m[39m+     72[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        phone_number="+998900000001",[K
[0m[48;2;40;67;43m[39m+     73[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        password="StrongPass!123",[K
[0m[48;2;40;67;43m[39m+     74[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        first_name="Bosh",[K
[0m[48;2;40;67;43m[39m+     75[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        last_name="Shifokor",[K
[0m[48;2;40;67;43m[39m+     76[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        role=User.Role.BOSH_SHIFOKOR,[K
[0m[48;2;40;67;43m[39m+     77[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    )[K
[0m[48;2;40;67;43m[39m+     78[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     79[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     80[0m:[39m[48;2;24;38;30m [38;2;101;115;126m@pytest.fixture[K
[0m[48;2;40;67;43m[39m+     81[0m:[39m[48;2;24;38;30m [38;2;101;115;126mdef administrator():[K
[0m[48;2;40;67;43m[39m+     82[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    return User.objects.create_user([K
[0m[48;2;40;67;43m[39m+     83[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        phone_number="+998900000002",[K
[0m[48;2;40;67;43m[39m+     84[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        password="StrongPass!123",[K
[0m[48;2;40;67;43m[39m+     85[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        first_name="Adm",[K
[0m[48;2;40;67;43m[39m+     86[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        last_name="In",[K
[0m[48;2;40;67;43m[39m+     87[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        role=User.Role.ADMINISTRATOR,[K
[0m[48;2;40;67;43m[39m+     88[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    )[K
[0m[48;2;40;67;43m[39m+     89[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     90[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     91[0m:[39m[48;2;24;38;30m [38;2;101;115;126m@pytest.fixture[K
[0m[48;2;40;67;43m[39m+     92[0m:[39m[48;2;24;38;30m [38;2;101;115;126mdef doctor_user():[K
[0m[48;2;40;67;43m[39m+     93[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    return User.objects.create_user([K
[0m[48;2;40;67;43m[39m+     94[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        phone_number="+998900000003",[K
[0m[48;2;40;67;43m[39m+     95[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        password="StrongPass!123",[K
[0m[48;2;40;67;43m[39m+     96[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        first_name="Doc",[K
[0m[48;2;40;67;43m[39m+     97[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        last_name="Tor",[K
[0m[48;2;40;67;43m[39m+     98[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        role=User.Role.DOCTOR,[K
[0m[48;2;40;67;43m[39m+     99[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    )[K
[0m[48;2;40;67;43m[39m+    100[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    101[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    102[0m:[39m[48;2;24;38;30m [38;2;101;115;126m@pytest.fixture[K
[0m[48;2;40;67;43m[39m+    103[0m:[39m[48;2;24;38;30m [38;2;101;115;126mdef other_doctor_user():[K
[0m[48;2;40;67;43m[39m+    104[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    return User.objects.create_user([K
[0m[48;2;40;67;43m[39m+    105[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        phone_number="+998900000004",[K
[0m[48;2;40;67;43m[39m+    106[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        password="StrongPass!123",[K
[0m[48;2;40;67;43m[39m+    107[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        first_name="Other",[K
[0m[48;2;40;67;43m[39m+    108[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        last_name="Doc",[K
[0m[48;2;40;67;43m[39m+    109[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        role=User.Role.DOCTOR,[K
[0m[48;2;40;67;43m[39m+    110[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    )[K
[0m[48;2;40;67;43m[39m+    111[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    112[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    113[0m:[39m[48;2;24;38;30m [38;2;101;115;126m@pytest.fixture[K
[0m[48;2;40;67;43m[39m+    114[0m:[39m[48;2;24;38;30m [38;2;101;115;126mdef department(head_doctor):[K
[0m[48;2;40;67;43m[39m+    115[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    return Department.objects.create([K
[0m[48;2;40;67;43m[39m+    116[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        name="Terapiya", description="Test", created_by=head_doctor[K
[0m[48;2;40;67;43m[39m+    117[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    )[K
[0m[48;2;40;67;43m[39m+    118[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    119[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    120[0m:[39m[48;2;24;38;30m [38;2;101;115;126m@pytest.fixture[K
[0m[48;2;40;67;43m[39m+    121[0m:[39m[48;2;24;38;30m [38;2;101;115;126mdef second_department(head_doctor):[K
[0m[48;2;40;67;43m[39m+    122[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    return Department.objects.create([K
[0m[48;2;40;67;43m[39m+    123[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        name="Ortopediya", description="Test 2", created_by=head_doctor[K
[0m[48;2;40;67;43m[39m+    124[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    )[K
[0m[48;2;40;67;43m[39m+    125[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    126[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    127[0m:[39m[48;2;24;38;30m [38;2;101;115;126m@pytest.fixture[K
[0m[48;2;40;67;43m[39m+    128[0m:[39m[48;2;24;38;30m [38;2;101;115;126mdef doctor(doctor_user, department):[K
[0m[48;2;40;67;43m[39m+    129[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    profile = DoctorProfile.objects.create([K
[0m[48;2;40;67;43m[39m+    130[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        user=doctor_user,[K
[0m[48;2;40;67;43m[39m+    131[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        specialization="Terapevt",[K
[0m[48;2;40;67;43m[39m+    132[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        commission_basis=CommissionBasis.FROM_TOTAL,[K
[0m[48;2;40;67;43m[39m+    133[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        default_commission_rate=Decimal("30.00"),[K
[0m[48;2;40;67;43m[39m+    134[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    )[K
[0m[48;2;40;67;43m[39m+    135[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    profile.departments.add(department)[K
[0m[48;2;40;67;43m[39m+    136[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    return profile[K
[0m[48;2;40;67;43m[39m+    137[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    138[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    139[0m:[39m[48;2;24;38;30m [38;2;101;115;126m@pytest.fixture[K
[0m[48;2;40;67;43m[39m+    140[0m:[39m[48;2;24;38;30m [38;2;101;115;126mdef other_doctor(other_doctor_user, department):[K
[0m[48;2;40;67;43m[39m+    141[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    profile = DoctorProfile.objects.create([K
[0m[48;2;40;67;43m[39m+    142[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        user=other_doctor_user,[K
[0m[48;2;40;67;43m[39m+    143[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        specialization="Boshqa",[K
[0m[48;2;40;67;43m[39m+    144[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        commission_basis=CommissionBasis.FROM_TOTAL,[K
[0m[48;2;40;67;43m[39m+    145[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        default_commission_rate=Decimal("30.00"),[K
[0m[48;2;40;67;43m[39m+    146[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    )[K
[0m[48;2;40;67;43m[39m+    147[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    profile.departments.add(department)[K
[0m[48;2;40;67;43m[39m+    148[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    return profile[K
[0m[48;2;40;67;43m[39m+    149[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    150[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    151[0m:[39m[48;2;24;38;30m [38;2;101;115;126m@pytest.fixture[K
[0m[48;2;40;67;43m[39m+    152[0m:[39m[48;2;24;38;30m [38;2;101;115;126mdef procedure_type(department):[K
[0m[48;2;40;67;43m[39m+    153[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    return ProcedureType.objects.create([K
[0m[48;2;40;67;43m[39m+    154[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        name="Plomba",[K
[0m[48;2;40;67;43m[39m+    155[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        department=department,[K
[0m[48;2;40;67;43m[39m+    156[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        default_duration_minutes=30,[K
[0m[48;2;40;67;43m[39m+    157[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        default_price=Decimal("100000.00"),[K
[0m[48;2;40;67;43m[39m+    158[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    )[K
[0m[48;2;40;67;43m[39m+    159[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    160[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    161[0m:[39m[48;2;24;38;30m [38;2;101;115;126m@pytest.fixture[K
[0m[48;2;40;67;43m[39m+    162[0m:[39m[48;2;24;38;30m [38;2;101;115;126mdef other_procedure_type(second_department):[K
[0m[48;2;40;67;43m[39m+    163[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    return ProcedureType.objects.create([K
[0m[48;2;40;67;43m[39m+    164[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        name="Koronka",[K
[0m[48;2;40;67;43m[39m+    165[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        department=second_department,[K
[0m[48;2;40;67;43m[39m+    166[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        default_duration_minutes=60,[K
[0m[48;2;40;67;43m[39m+    167[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        default_price=Decimal("500000.00"),[K
[0m[48;2;40;67;43m[39m+    168[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    )[K
[0m[48;2;40;67;43m[39m+    169[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    170[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    171[0m:[39m[48;2;24;38;30m [38;2;101;115;126m@pytest.fixture[K
[0m[48;2;40;67;43m[39m+    172[0m:[39m[48;2;24;38;30m [38;2;101;115;126mdef patient(administrator):[K
[0m[48;2;40;67;43m[39m+    173[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    return create_patient([K
[0m[48;2;40;67;43m[39m+    174[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        first_name="Ali",[K
[0m[48;2;40;67;43m[39m+    175[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        last_name="Valiyev",[K
[0m[48;2;40;67;43m[39m+    176[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        phone_number="+998901111111",[K
[0m[48;2;40;67;43m[39m+    177[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        created_by=administrator,[K
[0m[48;2;40;67;43m[39m+    178[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    )[K
[0m[48;2;40;67;43m[39m+    179[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    180[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    181[0m:[39m[48;2;24;38;30m [38;2;101;115;126m@pytest.fixture[K
[0m[48;2;40;67;43m[39m+    182[0m:[39m[48;2;24;38;30m [38;2;101;115;126mdef another_patient(administrator):[K
[0m[48;2;40;67;43m[39m+    183[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    return create_patient([K
[0m[48;2;40;67;43m[39m+    184[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        first_name="Bek",[K
[0m[48;2;40;67;43m[39m+    185[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        last_name="Karimov",[K
[0m[48;2;40;67;43m[39m+    186[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        phone_number="+998902222222",[K
[0m[48;2;40;67;43m[39m+    187[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        created_by=administrator,[K
[0m[48;2;40;67;43m[39m+    188[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    )[K
[0m[48;2;40;67;43m[39m+    189[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    190[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    191[0m:[39m[48;2;24;38;30m [38;2;101;115;126m@pytest.fixture[K
[0m[48;2;40;67;43m[39m+    192[0m:[39m[48;2;24;38;30m [38;2;101;115;126mdef appointment(patient, doctor, department, procedure_type, administrator):[K
[0m[48;2;40;67;43m[39m+    193[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    tz = timezone.get_current_timezone()[K
[0m[48;2;40;67;43m[39m+    194[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    start = timezone.make_aware([K
[0m[48;2;40;67;43m[39m+    195[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        datetime.combine([K
[0m[48;2;40;67;43m[39m+    196[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            timezone.localdate() + timedelta(days=1), time(10, 0)[K
[0m[48;2;40;67;43m[39m+    197[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        ),[K
[0m[48;2;40;67;43m[39m+    198[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        tz,[K
[0m[48;2;40;67;43m[39m+    199[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    )[K
[0m[48;2;40;67;43m[39m+    200[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    end = start + timedelta(minutes=30)[K
[0m[48;2;40;67;43m[39m+    201[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    return create_appointment([K
[0m[48;2;40;67;43m[39m+    202[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        patient=patient,[K
[0m[48;2;40;67;43m[39m+    203[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        doctor=doctor,[K
[0m[48;2;40;67;43m[39m+    204[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        department=department,[K
[0m[48;2;40;67;43m[39m+    205[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        procedure_type=procedure_type,[K
[0m[48;2;40;67;43m[39m+    206[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        scheduled_start=start,[K
[0m[48;2;40;67;43m[39m+    207[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        scheduled_end=end,[K
[0m[48;2;40;67;43m[39m+    208[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        created_by=administrator,[K
[0m[48;2;40;67;43m[39m+    209[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    )[K
[0m[48;2;40;67;43m[39m+    210[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    211[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    212[0m:[39m[48;2;24;38;30m [38;2;101;115;126m@pytest.fixture[K
[0m[48;2;40;67;43m[39m+    213[0m:[39m[48;2;24;38;30m [38;2;101;115;126mdef api_client():[K
[0m[48;2;40;67;43m[39m+    214[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    return APIClient()[K
[0m[48;2;40;67;43m[39m+    215[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    216[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    217[0m:[39m[48;2;24;38;30m [38;2;101;115;126mdef _auth(client: APIClient, user) -> APIClient:[K
[0m[48;2;40;67;43m[39m+    218[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    client.force_authenticate(user=user)[K
[0m[48;2;40;67;43m[39m+    219[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    return client[K
[0m[48;2;40;67;43m[39m+    220[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    221[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    222[0m:[39m[48;2;24;38;30m [38;2;101;115;126mdef _make_png(name: str = "before.png") -> SimpleUploadedFile:[K
[0m[48;2;40;67;43m[39m+    223[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    buf = io.BytesIO()[K
[0m[48;2;40;67;43m[39m+    224[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    Image.new("RGB", (10, 10), color=(255, 0, 0)).save(buf, format="PNG")[K
[0m[48;2;40;67;43m[39m+    225[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    buf.seek(0)[K
[0m[48;2;40;67;43m[39m+    226[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    return SimpleUploadedFile(name, buf.read(), content_type="image/png")[K
[0m[48;2;40;67;43m[39m+    227[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    228[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    229[0m:[39m[48;2;24;38;30m [38;2;101;115;126m# ===========================================================================[K
[0m[48;2;40;67;43m[39m+    230[0m:[39m[48;2;24;38;30m [38;2;101;115;126m# Service layer — create_treatment[K
[0m[48;2;40;67;43m[39m+    231[0m:[39m[48;2;24;38;30m [38;2;101;115;126m# ===========================================================================[K
[0m[48;2;40;67;43m[39m+    232[0m:[39m[48;2;24;38;30m [38;2;101;115;126mdef test_create_treatment_happy_path([K
[0m[48;2;40;67;43m[39m+    233[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    doctor, patient, department, procedure_type, head_doctor[K
[0m[48;2;40;67;43m[39m+    234[0m:[39m[48;2;24;38;30m [38;2;101;115;126m):[K
[0m[48;2;40;67;43m[39m+    235[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    tr = create_treatment([K
[0m[48;2;40;67;43m[39m+    236[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        doctor=doctor,[K
[0m[48;2;40;67;43m[39m+    237[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        patient=patient,[K
[0m[48;2;40;67;43m[39m+    238[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        department=department,[K
[0m[48;2;40;67;43m[39m+    239[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        procedure_type=procedure_type,[K
[0m[48;2;40;67;43m[39m+    240[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        diagnosis="Karies",[K
[0m[48;2;40;67;43m[39m+    241[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        description="Muolaja o'tkazildi",[K
[0m[48;2;40;67;43m[39m+    242[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        created_by=head_doctor,[K
[0m[48;2;40;67;43m[39m+    243[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    )[K
[0m[48;2;40;67;43m[39m+    244[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    assert tr.pk is not None[K
[0m[48;2;40;67;43m[39m+    245[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    assert tr.doctor == doctor[K
[0m[48;2;40;67;43m[39m+    246[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    assert tr.patient == patient[K
[0m[48;2;40;67;43m[39m+    247[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    assert tr.department == department[K
[0m[48;2;40;67;43m[39m+    248[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    assert tr.procedure_type == procedure_type[K
[0m[48;2;40;67;43m[39m+    249[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    # Price defaults from procedure_type.[K
[0m[48;2;40;67;43m[39m+    250[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    assert tr.price == Decimal("100000.00")[K
[0m[48;2;40;67;43m[39m+    251[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    assert tr.payment_status == PaymentStatus.UNPAID[K
[0m[48;2;40;67;43m[39m+    252[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    assert tr.stage == TreatmentStage.IN_PROGRESS[K
[0m[48;2;40;67;43m[39m+    253[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    assert tr.is_active is True[K
[0m[48;2;40;67;43m[39m+    254[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    255[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    256[0m:[39m[48;2;24;38;30m [38;2;101;115;126mdef test_create_treatment_explicit_price(doctor, patient, department, head_doctor):[K
[0m[48;2;40;67;43m[39m+    257[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    tr = create_treatment([K
[0m[48;2;40;67;43m[39m+    258[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        doctor=doctor,[K
[0m[48;2;40;67;43m[39m+    259[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        patient=patient,[K
[0m[48;2;40;67;43m[39m+    260[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        department=department,[K
[0m[48;2;40;67;43m[39m+    261[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        price="250000.5",[K
[0m[48;2;40;67;43m[39m+    262[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        created_by=head_doctor,[K
[0m[48;2;40;67;43m[39m+    263[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    )[K
[0m[48;2;40;67;43m[39m+    264[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    assert tr.price == Decimal("250000.50")[K
[0m[48;2;40;67;43m[39m+    265[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    266[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    267[0m:[39m[48;2;24;38;30m [38;2;101;115;126mdef test_create_treatment_rejects_negative_price([K
[0m[48;2;40;67;43m[39m+    268[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    doctor, patient, department, head_doctor[K
[0m[48;2;40;67;43m[39m+    269[0m:[39m[48;2;24;38;30m [38;2;101;115;126m):[K
[0m[48;2;40;67;43m[39m+    270[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    with pytest.raises(ValidationError):[K
[0m[48;2;40;67;43m[39m+    271[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        create_treatment([K
[0m[48;2;40;67;43m[39m+    272[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            doctor=doctor,[K
[0m[48;2;40;67;43m[39m+    273[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            patient=patient,[K
[0m[48;2;40;67;43m[39m+    274[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            department=department,[K
[0m[48;2;40;67;43m[39m+    275[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            price="-1",[K
[0m[48;2;40;67;43m[39m+    276[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            created_by=head_doctor,[K
[0m[48;2;40;67;43m[39m+    277[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        )[K
[0m[48;2;40;67;43m[39m+    278[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    279[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    280[0m:[39m[48;2;24;38;30m [38;2;101;115;126mdef test_create_treatment_rejects_department_doctor_mismatch([K
[0m[48;2;40;67;43m[39m+    281[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    doctor, patient, second_department, head_doctor[K
[0m[48;2;40;67;43m[39m+    282[0m:[39m[48;2;24;38;30m [38;2;101;115;126m):[K
[0m[48;2;40;67;43m[39m+    283[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    # ``doctor`` fixture belongs only to ``department`` (Terapiya), not[K
[0m[48;2;40;67;43m[39m+    284[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    # to ``second_department`` (Ortopediya).[K
[0m[48;2;40;67;43m[39m+    285[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    with pytest.raises(ValidationError) as exc:[K
[0m[48;2;40;67;43m[39m+    286[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        create_treatment([K
[0m[48;2;40;67;43m[39m+    287[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            doctor=doctor,[K
[0m[48;2;40;67;43m[39m+    288[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            patient=patient,[K
[0m[48;2;40;67;43m[39m+    289[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            department=second_department,[K
[0m[48;2;40;67;43m[39m+    290[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            created_by=head_doctor,[K
[0m[48;2;40;67;43m[39m+    291[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        )[K
[0m[48;2;40;67;43m[39m+    292[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    assert "department" in str(exc.value.message_dict)[K
[0m[48;2;40;67;43m[39m+    293[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    294[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    295[0m:[39m[48;2;24;38;30m [38;2;101;115;126mdef test_create_treatment_rejects_procedure_type_department_mismatch([K
[0m[48;2;40;67;43m[39m+    296[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    doctor, patient, department, other_procedure_type, head_doctor[K
[0m[48;2;40;67;43m[39m+    297[0m:[39m[48;2;24;38;30m [38;2;101;115;126m):[K
[0m[48;2;40;67;43m[39m+    298[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    # ``other_procedure_type`` belongs to ``second_department``.[K
[0m[48;2;40;67;43m[39m+    299[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    with pytest.raises(ValidationError) as exc:[K
[0m[48;2;40;67;43m[39m+    300[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        create_treatment([K
[0m[48;2;40;67;43m[39m+    301[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            doctor=doctor,[K
[0m[48;2;40;67;43m[39m+    302[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            patient=patient,[K
[0m[48;2;40;67;43m[39m+    303[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            department=department,[K
[0m[48;2;40;67;43m[39m+    304[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            procedure_type=other_procedure_type,[K
[0m[48;2;40;67;43m[39m+    305[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            created_by=head_doctor,[K
[0m[48;2;40;67;43m[39m+    306[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        )[K
[0m[48;2;40;67;43m[39m+    307[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    assert "procedure_type" in str(exc.value.message_dict)[K
[0m[48;2;40;67;43m[39m+    308[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    309[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    310[0m:[39m[48;2;24;38;30m [38;2;101;115;126mdef test_create_treatment_rejects_appointment_patient_mismatch([K
[0m[48;2;40;67;43m[39m+    311[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    doctor, patient, another_patient, department, appointment, head_doctor[K
[0m[48;2;40;67;43m[39m+    312[0m:[39m[48;2;24;38;30m [38;2;101;115;126m):[K
[0m[48;2;40;67;43m[39m+    313[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    with pytest.raises(ValidationError) as exc:[K
[0m[48;2;40;67;43m[39m+    314[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        create_treatment([K
[0m[48;2;40;67;43m[39m+    315[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            doctor=doctor,[K
[0m[48;2;40;67;43m[39m+    316[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            patient=another_patient,[K
[0m[48;2;40;67;43m[39m+    317[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            department=department,[K
[0m[48;2;40;67;43m[39m+    318[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            appointment=appointment,[K
[0m[48;2;40;67;43m[39m+    319[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            created_by=head_doctor,[K
[0m[48;2;40;67;43m[39m+    320[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        )[K
[0m[48;2;40;67;43m[39m+    321[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    assert "appointment" in str(exc.value.message_dict)[K
[0m[48;2;40;67;43m[39m+    322[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    323[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    324[0m:[39m[48;2;24;38;30m [38;2;101;115;126mdef test_create_treatment_rejects_appointment_doctor_mismatch([K
[0m[48;2;40;67;43m[39m+    325[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    doctor, other_doctor, patient, department, appointment, head_doctor[K
[0m[48;2;40;67;43m[39m+    326[0m:[39m[48;2;24;38;30m [38;2;101;115;126m):[K
[0m[48;2;40;67;43m[39m+    327[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    with pytest.raises(ValidationError) as exc:[K
[0m[48;2;40;67;43m[39m+    328[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        create_treatment([K
[0m[48;2;40;67;43m[39m+    329[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            doctor=other_doctor,[K
[0m[48;2;40;67;43m[39m+    330[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            patient=patient,[K
[0m[48;2;40;67;43m[39m+    331[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            department=department,[K
[0m[48;2;40;67;43m[39m+    332[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            appointment=appointment,[K
[0m[48;2;40;67;43m[39m+    333[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            created_by=head_doctor,[K
[0m[48;2;40;67;43m[39m+    334[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        )[K
[0m[48;2;40;67;43m[39m+    335[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    assert "appointment" in str(exc.value.message_dict)[K
[0m[48;2;40;67;43m[39m+    336[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    337[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    338[0m:[39m[48;2;24;38;30m [38;2;101;115;126mdef test_create_treatment_with_appointment_ok([K
[0m[48;2;40;67;43m[39m+    339[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    doctor, patient, department, procedure_type, appointment, head_doctor[K
[0m[48;2;40;67;43m[39m+    340[0m:[39m[48;2;24;38;30m [38;2;101;115;126m):[K
[0m[48;2;40;67;43m[39m+    341[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    tr = create_treatment([K
[0m[48;2;40;67;43m[39m+    342[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        doctor=doctor,[K
[0m[48;2;40;67;43m[39m+    343[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        patient=patient,[K
[0m[48;2;40;67;43m[39m+    344[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        department=department,[K
[0m[48;2;40;67;43m[39m+    345[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        procedure_type=procedure_type,[K
[0m[48;2;40;67;43m[39m+    346[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        appointment=appointment,[K
[0m[48;2;40;67;43m[39m+    347[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        created_by=head_doctor,[K
[0m[48;2;40;67;43m[39m+    348[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    )[K
[0m[48;2;40;67;43m[39m+    349[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    assert tr.appointment_id == appointment.pk[K
[0m[48;2;40;67;43m[39m+    350[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    351[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    352[0m:[39m[48;2;24;38;30m [38;2;101;115;126m# ===========================================================================[K
[0m[48;2;40;67;43m[39m+    353[0m:[39m[48;2;24;38;30m [38;2;101;115;126m# Service layer — update_treatment[K
[0m[48;2;40;67;43m[39m+    354[0m:[39m[48;2;24;38;30m [38;2;101;115;126m# ===========================================================================[K
[0m[48;2;40;67;43m[39m+    355[0m:[39m[48;2;24;38;30m [38;2;101;115;126mdef test_update_treatment_partial(doctor, patient, department, head_doctor):[K
[0m[48;2;40;67;43m[39m+    356[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    tr = create_treatment([K
[0m[48;2;40;67;43m[39m+    357[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        doctor=doctor,[K
[0m[48;2;40;67;43m[39m+    358[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        patient=patient,[K
[0m[48;2;40;67;43m[39m+    359[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        department=department,[K
[0m[48;2;40;67;43m[39m+    360[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        created_by=head_doctor,[K
[0m[48;2;40;67;43m[39m+    361[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    )[K
[0m[48;2;40;67;43m[39m+    362[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    updated = update_treatment([K
[0m[48;2;40;67;43m[39m+    363[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        tr,[K
[0m[48;2;40;67;43m[39m+    364[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        diagnosis="Yangi tashxis",[K
[0m[48;2;40;67;43m[39m+    365[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        price="777000.00",[K
[0m[48;2;40;67;43m[39m+    366[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        payment_status=PaymentStatus.PARTIAL,[K
[0m[48;2;40;67;43m[39m+    367[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    )[K
[0m[48;2;40;67;43m[39m+    368[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    updated.refresh_from_db()[K
[0m[48;2;40;67;43m[39m+    369[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    assert updated.diagnosis == "Yangi tashxis"[K
[0m[48;2;40;67;43m[39m+    370[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    assert updated.price == Decimal("777000.00")[K
[0m[48;2;40;67;43m[39m+    371[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    assert updated.payment_status == PaymentStatus.PARTIAL[K
[0m[48;2;40;67;43m[39m+    372[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    # stage was not touched.[K
[0m[48;2;40;67;43m[39m+    373[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    assert updated.stage == TreatmentStage.IN_PROGRESS[K
[0m[48;2;40;67;43m[39m+    374[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    375[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    376[0m:[39m[48;2;24;38;30m [38;2;101;115;126mdef test_update_treatment_stage_forward_ok([K
[0m[48;2;40;67;43m[39m+    377[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    doctor, patient, department, head_doctor[K
[0m[48;2;40;67;43m[39m+    378[0m:[39m[48;2;24;38;30m [38;2;101;115;126m):[K
[0m[48;2;40;67;43m[39m+    379[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    tr = create_treatment([K
[0m[48;2;40;67;43m[39m+    380[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        doctor=doctor,[K
[0m[48;2;40;67;43m[39m+    381[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        patient=patient,[K
[0m[48;2;40;67;43m[39m+    382[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        department=department,[K
[0m[48;2;40;67;43m[39m+    383[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        created_by=head_doctor,[K
[0m[48;2;40;67;43m[39m+    384[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    )[K
[0m[48;2;40;67;43m[39m+    385[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    updated = update_treatment(tr, stage=TreatmentStage.COMPLETED)[K
[0m[48;2;40;67;43m[39m+    386[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    updated.refresh_from_db()[K
[0m[48;2;40;67;43m[39m+    387[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    assert updated.stage == TreatmentStage.COMPLETED[K
[0m[48;2;40;67;43m[39m+    388[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    389[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    390[0m:[39m[48;2;24;38;30m [38;2;101;115;126mdef test_update_treatment_stage_backward_rejected([K
[0m[48;2;40;67;43m[39m+    391[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    doctor, patient, department, head_doctor[K
[0m[48;2;40;67;43m[39m+    392[0m:[39m[48;2;24;38;30m [38;2;101;115;126m):[K
[0m[48;2;40;67;43m[39m+    393[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    tr = create_treatment([K
[0m[48;2;40;67;43m[39m+    394[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        doctor=doctor,[K
[0m[48;2;40;67;43m[39m+    395[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        patient=patient,[K
[0m[48;2;40;67;43m[39m+    396[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        department=department,[K
[0m[48;2;40;67;43m[39m+    397[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        stage=TreatmentStage.COMPLETED,[K
[0m[48;2;40;67;43m[39m+    398[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        created_by=head_doctor,[K
[0m[48;2;40;67;43m[39m+    399[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    )[K
[0m[48;2;40;67;43m[39m+    400[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    with pytest.raises(ValidationError):[K
[0m[48;2;40;67;43m[39m+    401[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        update_treatment(tr, stage=TreatmentStage.IN_PROGRESS)[K
[0m[48;2;40;67;43m[39m+    402[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    403[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    404[0m:[39m[48;2;24;38;30m [38;2;101;115;126mdef test_soft_delete_treatment(doctor, patient, department, head_doctor):[K
[0m[48;2;40;67;43m[39m+    405[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    tr = create_treatment([K
[0m[48;2;40;67;43m[39m+    406[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        doctor=doctor,[K
[0m[48;2;40;67;43m[39m+    407[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        patient=patient,[K
[0m[48;2;40;67;43m[39m+    408[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        department=department,[K
[0m[48;2;40;67;43m[39m+    409[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        created_by=head_doctor,[K
[0m[48;2;40;67;43m[39m+    410[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    )[K
[0m[48;2;40;67;43m[39m+    411[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    assert tr.is_active is True[K
[0m[48;2;40;67;43m[39m+    412[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    soft_delete_treatment(tr)[K
[0m[48;2;40;67;43m[39m+    413[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    tr.refresh_from_db()[K
[0m[48;2;40;67;43m[39m+    414[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    assert tr.is_active is False[K
[0m[48;2;40;67;43m[39m+    415[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    416[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    417[0m:[39m[48;2;24;38;30m [38;2;101;115;126m# ===========================================================================[K
[0m[48;2;40;67;43m[39m+    418[0m:[39m[48;2;24;38;30m [38;2;101;115;126m# Selectors[K
[0m[48;2;40;67;43m[39m+    419[0m:[39m[48;2;24;38;30m [38;2;101;115;126m# ===========================================================================[K
[0m[48;2;40;67;43m[39m+    420[0m:[39m[48;2;24;38;30m [38;2;101;115;126mdef test_selectors_filter(doctor, other_doctor, patient, department, head_doctor):[K
[0m[48;2;40;67;43m[39m+    421[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    tr1 = create_treatment([K
[0m[48;2;40;67;43m[39m+    422[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        doctor=doctor,[K
[0m[48;2;40;67;43m[39m+    423[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        patient=patient,[K
[0m[48;2;40;67;43m[39m+    424[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        department=department,[K
[0m[48;2;40;67;43m[39m+    425[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        created_by=head_doctor,[K
[0m[48;2;40;67;43m[39m+    426[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    )[K
[0m[48;2;40;67;43m[39m+    427[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    tr2 = create_treatment([K
[0m[48;2;40;67;43m[39m+    428[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        doctor=other_doctor,[K
[0m[48;2;40;67;43m[39m+    429[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        patient=patient,[K
[0m[48;2;40;67;43m[39m+    430[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        department=department,[K
[0m[48;2;40;67;43m[39m+    431[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        stage=TreatmentStage.COMPLETED,[K
[0m[48;2;40;67;43m[39m+    432[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        created_by=head_doctor,[K
[0m[48;2;40;67;43m[39m+    433[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    )[K
[0m[48;2;40;67;43m[39m+    434[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    435[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    assert active_treatments().count() == 2[K
[0m[48;2;40;67;43m[39m+    436[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    assert treatments_for_patient(patient.pk).count() == 2[K
[0m[48;2;40;67;43m[39m+    437[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    assert treatments_for_doctor(doctor.pk).count() == 1[K
[0m[48;2;40;67;43m[39m+    438[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    assert treatments_for_doctor(doctor.pk).first() == tr1[K
[0m[48;2;40;67;43m[39m+    439[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    assert ([K
[0m[48;2;40;67;43m[39m+    440[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        filter_treatments(stage=TreatmentStage.COMPLETED).first() == tr2[K
[0m[48;2;40;67;43m[39m+    441[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    )[K
[0m[48;2;40;67;43m[39m+    442[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    assert filter_treatments(doctor_id=doctor.pk).count() == 1[K
[0m[48;2;40;67;43m[39m+    443[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    444[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    445[0m:[39m[48;2;24;38;30m [38;2;101;115;126m# ===========================================================================[K
[0m[48;2;40;67;43m[39m+    446[0m:[39m[48;2;24;38;30m [38;2;101;115;126m# API — RBAC[K
[0m[48;2;40;67;43m[39m+    447[0m:[39m[48;2;24;38;30m [38;2;101;115;126m# ===========================================================================[K
[0m[48;2;40;67;43m[39m+    448[0m:[39m[48;2;24;38;30m [38;2;101;115;126mdef test_list_requires_auth(api_client):[K
[0m[48;2;40;67;43m[39m+    449[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    resp = api_client.get(LIST_URL)[K
[0m[48;2;40;67;43m[39m+    450[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    assert resp.status_code == status.HTTP_401_UNAUTHORIZED[K
[0m[48;2;40;67;43m[39m+    451[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    452[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    453[0m:[39m[48;2;24;38;30m [38;2;101;115;126mdef test_head_doctor_can_list_all([K
[0m[48;2;40;67;43m[39m+    454[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    api_client, head_doctor, doctor, other_doctor, patient, department[K
[0m[48;2;40;67;43m[39m+    455[0m:[39m[48;2;24;38;30m [38;2;101;115;126m):[K
[0m[48;2;40;67;43m[39m+    456[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    create_treatment([K
[0m[48;2;40;67;43m[39m+    457[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        doctor=doctor, patient=patient, department=department,[K
[0m[48;2;40;67;43m[39m+    458[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        created_by=head_doctor,[K
[0m[48;2;40;67;43m[39m+    459[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    )[K
[0m[48;2;40;67;43m[39m+    460[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    create_treatment([K
[0m[48;2;40;67;43m[39m+    461[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        doctor=other_doctor, patient=patient, department=department,[K
[0m[48;2;40;67;43m[39m+    462[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        created_by=head_doctor,[K
[0m[48;2;40;67;43m[39m+    463[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    )[K
[0m[48;2;40;67;43m[39m+    464[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    resp = _auth(api_client, head_doctor).get(LIST_URL)[K
[0m[48;2;40;67;43m[39m+    465[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    assert resp.status_code == status.HTTP_200_OK[K
[0m[48;2;40;67;43m[39m+    466[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    data = resp.json()[K
[0m[48;2;40;67;43m[39m+    467[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    assert set(data.keys()) >= {"count", "results"}[K
[0m[48;2;40;67;43m[39m+    468[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    assert data["count"] == 2[K
[0m[48;2;40;67;43m[39m+    469[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    470[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    471[0m:[39m[48;2;24;38;30m [38;2;101;115;126mdef test_doctor_sees_only_own_by_default([K
[0m[48;2;40;67;43m[39m+    472[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    api_client, doctor_user, doctor, other_doctor, patient, department, head_doctor[K
[0m[48;2;40;67;43m[39m+    473[0m:[39m[48;2;24;38;30m [38;2;101;115;126m):[K
[0m[48;2;40;67;43m[39m+    474[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    my_tr = create_treatment([K
[0m[48;2;40;67;43m[39m+    475[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        doctor=doctor, patient=patient, department=department,[K
[0m[48;2;40;67;43m[39m+    476[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        created_by=head_doctor,[K
[0m[48;2;40;67;43m[39m+    477[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    )[K
[0m[48;2;40;67;43m[39m+    478[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    create_treatment([K
[0m[48;2;40;67;43m[39m+    479[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        doctor=other_doctor, patient=patient, department=department,[K
[0m[48;2;40;67;43m[39m+    480[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        created_by=head_doctor,[K
[0m[48;2;40;67;43m[39m+    481[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    )[K
[0m[48;2;40;67;43m[39m+    482[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    resp = _auth(api_client, doctor_user).get(LIST_URL)[K
[0m[48;2;40;67;43m[39m+    483[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    assert resp.status_code == status.HTTP_200_OK[K
[0m[48;2;40;67;43m[39m+    484[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    data = resp.json()[K
[0m[48;2;40;67;43m[39m+    485[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    ids = [row["id"] for row in data["results"]][K
[0m[48;2;40;67;43m[39m+    486[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    assert ids == [str(my_tr.pk)][K
[0m[48;2;40;67;43m[39m+    487[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    488[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    489[0m:[39m[48;2;24;38;30m [38;2;101;115;126mdef test_doctor_with_flag_sees_all([K
[0m[48;2;40;67;43m[39m+    490[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    api_client, doctor_user, doctor, other_doctor, patient, department, head_doctor[K
[0m[48;2;40;67;43m[39m+    491[0m:[39m[48;2;24;38;30m [38;2;101;115;126m):[K
[0m[48;2;40;67;43m[39m+    492[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    doctor.can_view_other_doctors = True[K
[0m[48;2;40;67;43m[39m+    493[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    doctor.save(update_fields=["can_view_other_doctors"])[K
[0m[48;2;40;67;43m[39m+    494[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    495[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    create_treatment([K
[0m[48;2;40;67;43m[39m+    496[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        doctor=doctor, patient=patient, department=department,[K
[0m[48;2;40;67;43m[39m+    497[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        created_by=head_doctor,[K
[0m[48;2;40;67;43m[39m+    498[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    )[K
[0m[48;2;40;67;43m[39m+    499[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    create_treatment([K
[0m[48;2;40;67;43m[39m+    500[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        doctor=other_doctor, patient=patient, department=department,[K
[0m[48;2;40;67;43m[39m+    501[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        created_by=head_doctor,[K
[0m[48;2;40;67;43m[39m+    502[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    )[K
[0m[48;2;40;67;43m[39m+    503[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    resp = _auth(api_client, doctor_user).get(LIST_URL)[K
[0m[48;2;40;67;43m[39m+    504[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    assert resp.status_code == status.HTTP_200_OK[K
[0m[48;2;40;67;43m[39m+    505[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    assert resp.json()["count"] == 2[K
[0m[48;2;40;67;43m[39m+    506[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    507[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    508[0m:[39m[48;2;24;38;30m [38;2;101;115;126mdef test_administrator_can_read_but_not_write([K
[0m[48;2;40;67;43m[39m+    509[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    api_client, administrator, doctor, patient, department, head_doctor[K
[0m[48;2;40;67;43m[39m+    510[0m:[39m[48;2;24;38;30m [38;2;101;115;126m):[K
[0m[48;2;40;67;43m[39m+    511[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    tr = create_treatment([K
[0m[48;2;40;67;43m[39m+    512[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        doctor=doctor, patient=patient, department=department,[K
[0m[48;2;40;67;43m[39m+    513[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        created_by=head_doctor,[K
[0m[48;2;40;67;43m[39m+    514[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    )[K
[0m[48;2;40;67;43m[39m+    515[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    client = _auth(api_client, administrator)[K
[0m[48;2;40;67;43m[39m+    516[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    517[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    resp = client.get(LIST_URL)[K
[0m[48;2;40;67;43m[39m+    518[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    assert resp.status_code == status.HTTP_200_OK[K
[0m[48;2;40;67;43m[39m+    519[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    520[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    resp = client.post([K
[0m[48;2;40;67;43m[39m+    521[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        LIST_URL,[K
[0m[48;2;40;67;43m[39m+    522[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        data={[K
[0m[48;2;40;67;43m[39m+    523[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            "doctor": str(doctor.pk),[K
[0m[48;2;40;67;43m[39m+    524[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            "patient": str(patient.pk),[K
[0m[48;2;40;67;43m[39m+    525[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            "department": str(department.pk),[K
[0m[48;2;40;67;43m[39m+    526[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        },[K
[0m[48;2;40;67;43m[39m+    527[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        format="json",[K
[0m[48;2;40;67;43m[39m+    528[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    )[K
[0m[48;2;40;67;43m[39m+    529[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    assert resp.status_code == status.HTTP_403_FORBIDDEN[K
[0m[48;2;40;67;43m[39m+    530[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    531[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    resp = client.patch([K
[0m[48;2;40;67;43m[39m+    532[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        f"{LIST_URL}{tr.pk}/",[K
[0m[48;2;40;67;43m[39m+    533[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        data={"diagnosis": "hack"},[K
[0m[48;2;40;67;43m[39m+    534[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        format="json",[K
[0m[48;2;40;67;43m[39m+    535[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    )[K
[0m[48;2;40;67;43m[39m+    536[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    assert resp.status_code == status.HTTP_403_FORBIDDEN[K
[0m[48;2;40;67;43m[39m+    537[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    538[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    539[0m:[39m[48;2;24;38;30m [38;2;101;115;126m# ===========================================================================[K
[0m[48;2;40;67;43m[39m+    540[0m:[39m[48;2;24;38;30m [38;2;101;115;126m# API — CRUD[K
[0m[48;2;40;67;43m[39m+    541[0m:[39m[48;2;24;38;30m [38;2;101;115;126m# ===========================================================================[K
[0m[48;2;40;67;43m[39m+    542[0m:[39m[48;2;24;38;30m [38;2;101;115;126mdef test_create_via_api_head_doctor([K
[0m[48;2;40;67;43m[39m+    543[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    api_client, head_doctor, doctor, patient, department, procedure_type[K
[0m[48;2;40;67;43m[39m+    544[0m:[39m[48;2;24;38;30m [38;2;101;115;126m):[K
[0m[48;2;40;67;43m[39m+    545[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    payload = {[K
[0m[48;2;40;67;43m[39m+    546[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        "doctor": str(doctor.pk),[K
[0m[48;2;40;67;43m[39m+    547[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        "patient": str(patient.pk),[K
[0m[48;2;40;67;43m[39m+    548[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        "department": str(department.pk),[K
[0m[48;2;40;67;43m[39m+    549[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        "procedureType": str(procedure_type.pk),[K
[0m[48;2;40;67;43m[39m+    550[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        "diagnosis": "Karies",[K
[0m[48;2;40;67;43m[39m+    551[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        "description": "Plomba qo'yildi",[K
[0m[48;2;40;67;43m[39m+    552[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        "price": "150000.00",[K
[0m[48;2;40;67;43m[39m+    553[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    }[K
[0m[48;2;40;67;43m[39m+    554[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    resp = _auth(api_client, head_doctor).post(LIST_URL, data=payload, format="json")[K
[0m[48;2;40;67;43m[39m+    555[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    assert resp.status_code == status.HTTP_201_CREATED, resp.content[K
[0m[48;2;40;67;43m[39m+    556[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    data = resp.json()[K
[0m[48;2;40;67;43m[39m+    557[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    assert data["diagnosis"] == "Karies"[K
[0m[48;2;40;67;43m[39m+    558[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    assert data["price"] == "150000.00"[K
[0m[48;2;40;67;43m[39m+    559[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    assert data["paymentStatus"] == "unpaid"[K
[0m[48;2;40;67;43m[39m+    560[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    assert data["stage"] == "in_progress"[K
[0m[48;2;40;67;43m[39m+    561[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    # Camel-case relations present.[K
[0m[48;2;40;67;43m[39m+    562[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    assert data["doctor"]["id"] == str(doctor.pk)[K
[0m[48;2;40;67;43m[39m+    563[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    assert data["patient"]["id"] == str(patient.pk)[K
[0m[48;2;40;67;43m[39m+    564[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    assert data["department"]["id"] == str(department.pk)[K
[0m[48;2;40;67;43m[39m+    565[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    assert Treatment.objects.count() == 1[K
[0m[48;2;40;67;43m[39m+    566[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    567[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    568[0m:[39m[48;2;24;38;30m [38;2;101;115;126mdef test_create_via_api_validation_error_shape([K
[0m[48;2;40;67;43m[39m+    569[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    api_client, head_doctor, doctor, patient, second_department[K
[0m[48;2;40;67;43m[39m+    570[0m:[39m[48;2;24;38;30m [38;2;101;115;126m):[K
[0m[48;2;40;67;43m[39m+    571[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    """Standard error envelope on validation failure."""[K
[0m[48;2;40;67;43m[39m+    572[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    payload = {[K
[0m[48;2;40;67;43m[39m+    573[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        "doctor": str(doctor.pk),[K
[0m[48;2;40;67;43m[39m+    574[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        "patient": str(patient.pk),[K
[0m[48;2;40;67;43m[39m+    575[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        "department": str(second_department.pk),  # doctor not in this dept[K
[0m[48;2;40;67;43m[39m+    576[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    }[K
[0m[48;2;40;67;43m[39m+    577[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    resp = _auth(api_client, head_doctor).post(LIST_URL, data=payload, format="json")[K
[0m[48;2;40;67;43m[39m+    578[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    assert resp.status_code == status.HTTP_400_BAD_REQUEST[K
[0m[48;2;40;67;43m[39m+    579[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    body = resp.json()[K
[0m[48;2;40;67;43m[39m+    580[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    assert "error" in body[K
[0m[48;2;40;67;43m[39m+    581[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    assert body["error"]["code"] == "VALIDATION_ERROR"[K
[0m[48;2;40;67;43m[39m+    582[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    583[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    584[0m:[39m[48;2;24;38;30m [38;2;101;115;126mdef test_retrieve_via_api([K
[0m[48;2;40;67;43m[39m+    585[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    api_client, head_doctor, doctor, patient, department[K
[0m[48;2;40;67;43m[39m+    586[0m:[39m[48;2;24;38;30m [38;2;101;115;126m):[K
[0m[48;2;40;67;43m[39m+    587[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    tr = create_treatment([K
[0m[48;2;40;67;43m[39m+    588[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        doctor=doctor, patient=patient, department=department,[K
[0m[48;2;40;67;43m[39m+    589[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        created_by=head_doctor,[K
[0m[48;2;40;67;43m[39m+    590[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    )[K
[0m[48;2;40;67;43m[39m+    591[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    resp = _auth(api_client, head_doctor).get(f"{LIST_URL}{tr.pk}/")[K
[0m[48;2;40;67;43m[39m+    592[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    assert resp.status_code == status.HTTP_200_OK[K
[0m[48;2;40;67;43m[39m+    593[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    data = resp.json()[K
[0m[48;2;40;67;43m[39m+    594[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    assert data["id"] == str(tr.pk)[K
[0m[48;2;40;67;43m[39m+    595[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    assert "photos" in data[K
[0m[48;2;40;67;43m[39m+    596[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    assert "toothRecords" in data[K
[0m[48;2;40;67;43m[39m+    597[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    598[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    599[0m:[39m[48;2;24;38;30m [38;2;101;115;126mdef test_patch_via_api([K
[0m[48;2;40;67;43m[39m+    600[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    api_client, head_doctor, doctor, patient, department[K
[0m[48;2;40;67;43m[39m+    601[0m:[39m[48;2;24;38;30m [38;2;101;115;126m):[K
[0m[48;2;40;67;43m[39m+    602[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    tr = create_treatment([K
[0m[48;2;40;67;43m[39m+    603[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        doctor=doctor, patient=patient, department=department,[K
[0m[48;2;40;67;43m[39m+    604[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        created_by=head_doctor,[K
[0m[48;2;40;67;43m[39m+    605[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    )[K
[0m[48;2;40;67;43m[39m+    606[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    resp = _auth(api_client, head_doctor).patch([K
[0m[48;2;40;67;43m[39m+    607[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        f"{LIST_URL}{tr.pk}/",[K
[0m[48;2;40;67;43m[39m+    608[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        data={"diagnosis": "Yangi", "paymentStatus": "paid"},[K
[0m[48;2;40;67;43m[39m+    609[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        format="json",[K
[0m[48;2;40;67;43m[39m+    610[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    )[K
[0m[48;2;40;67;43m[39m+    611[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    assert resp.status_code == status.HTTP_200_OK, resp.content[K
[0m[48;2;40;67;43m[39m+    612[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    tr.refresh_from_db()[K
[0m[48;2;40;67;43m[39m+    613[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    assert tr.diagnosis == "Yangi"[K
[0m[48;2;40;67;43m[39m+    614[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    assert tr.payment_status == PaymentStatus.PAID[K
[0m[48;2;40;67;43m[39m+    615[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    616[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    617[0m:[39m[48;2;24;38;30m [38;2;101;115;126mdef test_doctor_cannot_patch_other_doctors_treatment([K
[0m[48;2;40;67;43m[39m+    618[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    api_client, doctor_user, doctor, other_doctor, patient, department, head_doctor[K
[0m[48;2;40;67;43m[39m+    619[0m:[39m[48;2;24;38;30m [38;2;101;115;126m):[K
[0m[48;2;40;67;43m[39m+    620[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    tr = create_treatment([K
[0m[48;2;40;67;43m[39m+    621[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        doctor=other_doctor, patient=patient, department=department,[K
[0m[48;2;40;67;43m[39m+    622[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        created_by=head_doctor,[K
[0m[48;2;40;67;43m[39m+    623[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    )[K
[0m[48;2;40;67;43m[39m+    624[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    resp = _auth(api_client, doctor_user).patch([K
[0m[48;2;40;67;43m[39m+    625[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        f"{LIST_URL}{tr.pk}/",[K
[0m[48;2;40;67;43m[39m+    626[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        data={"diagnosis": "hack"},[K
[0m[48;2;40;67;43m[39m+    627[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        format="json",[K
[0m[48;2;40;67;43m[39m+    628[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    )[K
[0m[48;2;40;67;43m[39m+    629[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    assert resp.status_code in ([K
[0m[48;2;40;67;43m[39m+    630[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        status.HTTP_403_FORBIDDEN,[K
[0m[48;2;40;67;43m[39m+    631[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        status.HTTP_404_NOT_FOUND,[K
[0m[48;2;40;67;43m[39m+    632[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    )[K
[0m[48;2;40;67;43m[39m+    633[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    634[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    635[0m:[39m[48;2;24;38;30m [38;2;101;115;126mdef test_soft_delete_via_api([K
[0m[48;2;40;67;43m[39m+    636[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    api_client, head_doctor, doctor, patient, department[K
[0m[48;2;40;67;43m[39m+    637[0m:[39m[48;2;24;38;30m [38;2;101;115;126m):[K
[0m[48;2;40;67;43m[39m+    638[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    tr = create_treatment([K
[0m[48;2;40;67;43m[39m+    639[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        doctor=doctor, patient=patient, department=department,[K
[0m[48;2;40;67;43m[39m+    640[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        created_by=head_doctor,[K
[0m[48;2;40;67;43m[39m+    641[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    )[K
[0m[48;2;40;67;43m[39m+    642[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    resp = _auth(api_client, head_doctor).delete(f"{LIST_URL}{tr.pk}/")[K
[0m[48;2;40;67;43m[39m+    643[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    assert resp.status_code == status.HTTP_204_NO_CONTENT[K
[0m[48;2;40;67;43m[39m+    644[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    tr.refresh_from_db()[K
[0m[48;2;40;67;43m[39m+    645[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    assert tr.is_active is False[K
[0m[48;2;40;67;43m[39m+    646[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    647[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    648[0m:[39m[48;2;24;38;30m [38;2;101;115;126m# ===========================================================================[K
[0m[48;2;40;67;43m[39m+    649[0m:[39m[48;2;24;38;30m [38;2;101;115;126m# API — filters[K
[0m[48;2;40;67;43m[39m+    650[0m:[39m[48;2;24;38;30m [38;2;101;115;126m# ===========================================================================[K
[0m[48;2;40;67;43m[39m+    651[0m:[39m[48;2;24;38;30m [38;2;101;115;126mdef test_filter_by_patient_and_stage([K
[0m[48;2;40;67;43m[39m+    652[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    api_client, head_doctor, doctor, patient, another_patient, department[K
[0m[48;2;40;67;43m[39m+    653[0m:[39m[48;2;24;38;30m [38;2;101;115;126m):[K
[0m[48;2;40;67;43m[39m+    654[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    create_treatment([K
[0m[48;2;40;67;43m[39m+    655[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        doctor=doctor, patient=patient, department=department,[K
[0m[48;2;40;67;43m[39m+    656[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        created_by=head_doctor,[K
[0m[48;2;40;67;43m[39m+    657[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    )[K
[0m[48;2;40;67;43m[39m+    658[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    create_treatment([K
[0m[48;2;40;67;43m[39m+    659[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        doctor=doctor, patient=another_patient, department=department,[K
[0m[48;2;40;67;43m[39m+    660[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        stage=TreatmentStage.COMPLETED,[K
[0m[48;2;40;67;43m[39m+    661[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        created_by=head_doctor,[K
[0m[48;2;40;67;43m[39m+    662[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    )[K
[0m[48;2;40;67;43m[39m+    663[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    client = _auth(api_client, head_doctor)[K
[0m[48;2;40;67;43m[39m+    664[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    665[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    resp = client.get(f"{LIST_URL}?patient={patient.pk}")[K
[0m[48;2;40;67;43m[39m+    666[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    assert resp.status_code == status.HTTP_200_OK[K
[0m[48;2;40;67;43m[39m+    667[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    assert resp.json()["count"] == 1[K
[0m[48;2;40;67;43m[39m+    668[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    669[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    resp = client.get(f"{LIST_URL}?stage=completed")[K
[0m[48;2;40;67;43m[39m+    670[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    assert resp.status_code == status.HTTP_200_OK[K
[0m[48;2;40;67;43m[39m+    671[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    assert resp.json()["count"] == 1[K
[0m[48;2;40;67;43m[39m+    672[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    673[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    resp = client.get(f"{LIST_URL}?doctor={doctor.pk}&stage=in_progress")[K
[0m[48;2;40;67;43m[39m+    674[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    assert resp.status_code == status.HTTP_200_OK[K
[0m[48;2;40;67;43m[39m+    675[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    assert resp.json()["count"] == 1[K
[0m[48;2;40;67;43m[39m+    676[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    677[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    678[0m:[39m[48;2;24;38;30m [38;2;101;115;126m# ===========================================================================[K
[0m[48;2;40;67;43m[39m+    679[0m:[39m[48;2;24;38;30m [38;2;101;115;126m# API — photos[K
[0m[48;2;40;67;43m[39m+    680[0m:[39m[48;2;24;38;30m [38;2;101;115;126m# ===========================================================================[K
[0m[48;2;40;67;43m[39m+    681[0m:[39m[48;2;24;38;30m [38;2;101;115;126mdef test_photo_upload_and_list([K
[0m[48;2;40;67;43m[39m+    682[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    api_client, head_doctor, doctor, patient, department[K
[0m[48;2;40;67;43m[39m+    683[0m:[39m[48;2;24;38;30m [38;2;101;115;126m):[K
[0m[48;2;40;67;43m[39m+    684[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    tr = create_treatment([K
[0m[48;2;40;67;43m[39m+    685[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        doctor=doctor, patient=patient, department=department,[K
[0m[48;2;40;67;43m[39m+    686[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        created_by=head_doctor,[K
[0m[48;2;40;67;43m[39m+    687[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    )[K
[0m[48;2;40;67;43m[39m+    688[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    client = _auth(api_client, head_doctor)[K
[0m[48;2;40;67;43m[39m+    689[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    690[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    upload = _make_png("before.png")[K
[0m[48;2;40;67;43m[39m+    691[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    resp = client.post([K
[0m[48;2;40;67;43m[39m+    692[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        f"{LIST_URL}{tr.pk}/photos/",[K
[0m[48;2;40;67;43m[39m+    693[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        data={[K
[0m[48;2;40;67;43m[39m+    694[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            "photoType": PhotoType.BEFORE,[K
[0m[48;2;40;67;43m[39m+    695[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            "image": upload,[K
[0m[48;2;40;67;43m[39m+    696[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            "caption": "birinchi",[K
[0m[48;2;40;67;43m[39m+    697[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        },[K
[0m[48;2;40;67;43m[39m+    698[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        format="multipart",[K
[0m[48;2;40;67;43m[39m+    699[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    )[K
[0m[48;2;40;67;43m[39m+    700[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    assert resp.status_code == status.HTTP_201_CREATED, resp.content[K
[0m[48;2;40;67;43m[39m+    701[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    body = resp.json()[K
[0m[48;2;40;67;43m[39m+    702[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    assert body["photoType"] == "before"[K
[0m[48;2;40;67;43m[39m+    703[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    assert body["caption"] == "birinchi"[K
[0m[48;2;40;67;43m[39m+    704[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    assert body["imageUrl"] is not None[K
[0m[48;2;40;67;43m[39m+    705[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    706[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    resp = client.get(f"{LIST_URL}{tr.pk}/photos/")[K
[0m[48;2;40;67;43m[39m+    707[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    assert resp.status_code == status.HTTP_200_OK[K
[0m[48;2;40;67;43m[39m+    708[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    data = resp.json()[K
[0m[48;2;40;67;43m[39m+    709[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    assert isinstance(data, list)[K
[0m[48;2;40;67;43m[39m+    710[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    assert len(data) == 1[K
[0m[48;2;40;67;43m[39m+    711[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    assert data[0]["photoType"] == "before"[K
[0m[48;2;40;67;43m[39m+    712[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    713[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    714[0m:[39m[48;2;24;38;30m [38;2;101;115;126mdef test_photo_upload_permission_administrator_forbidden([K
[0m[48;2;40;67;43m[39m+    715[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    api_client, administrator, doctor, patient, department, head_doctor[K
[0m[48;2;40;67;43m[39m+    716[0m:[39m[48;2;24;38;30m [38;2;101;115;126m):[K
[0m[48;2;40;67;43m[39m+    717[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    tr = create_treatment([K
[0m[48;2;40;67;43m[39m+    718[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        doctor=doctor, patient=patient, department=department,[K
[0m[48;2;40;67;43m[39m+    719[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        created_by=head_doctor,[K
[0m[48;2;40;67;43m[39m+    720[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    )[K
[0m[48;2;40;67;43m[39m+    721[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    upload = _make_png()[K
[0m[48;2;40;67;43m[39m+    722[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    resp = _auth(api_client, administrator).post([K
[0m[48;2;40;67;43m[39m+    723[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        f"{LIST_URL}{tr.pk}/photos/",[K
[0m[48;2;40;67;43m[39m+    724[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        data={"photoType": PhotoType.AFTER, "image": upload},[K
[0m[48;2;40;67;43m[39m+    725[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        format="multipart",[K
[0m[48;2;40;67;43m[39m+    726[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    )[K
[0m[48;2;40;67;43m[39m+    727[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    assert resp.status_code == status.HTTP_403_FORBIDDEN[K
[0m[48;2;40;67;43m[39m+    728[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    729[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    730[0m:[39m[48;2;24;38;30m [38;2;101;115;126mdef test_photo_service_direct(doctor, patient, department, head_doctor):[K
[0m[48;2;40;67;43m[39m+    731[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    tr = create_treatment([K
[0m[48;2;40;67;43m[39m+    732[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        doctor=doctor, patient=patient, department=department,[K
[0m[48;2;40;67;43m[39m+    733[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        created_by=head_doctor,[K
[0m[48;2;40;67;43m[39m+    734[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    )[K
[0m[48;2;40;67;43m[39m+    735[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    photo = upload_treatment_photo([K
[0m[48;2;40;67;43m[39m+    736[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        tr,[K
[0m[48;2;40;67;43m[39m+    737[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        photo_type=PhotoType.XRAY,[K
[0m[48;2;40;67;43m[39m+    738[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        image=_make_png("x.png"),[K
[0m[48;2;40;67;43m[39m+    739[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        caption="xray view",[K
[0m[48;2;40;67;43m[39m+    740[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        uploaded_by=head_doctor,[K
[0m[48;2;40;67;43m[39m+    741[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    )[K
[0m[48;2;40;67;43m[39m+    742[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    assert isinstance(photo, TreatmentPhoto)[K
[0m[48;2;40;67;43m[39m+    743[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    assert photo.photo_type == PhotoType.XRAY[K
[0m[48;2;40;67;43m[39m+    744[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    assert photos_for_treatment(tr.pk).count() == 1[K
[0m[48;2;40;67;43m[39m+    745[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    746[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    747[0m:[39m[48;2;24;38;30m [38;2;101;115;126mdef test_tooth_records_stub_returns_501_when_odontogram_missing([K
[0m[48;2;40;67;43m[39m+    748[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    api_client, head_doctor, doctor, patient, department[K
[0m[48;2;40;67;43m[39m+    749[0m:[39m[48;2;24;38;30m [38;2;101;115;126m):[K
[0m[48;2;40;67;43m[39m+    750[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    tr = create_treatment([K
[0m[48;2;40;67;43m[39m+    751[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        doctor=doctor, patient=patient, department=department,[K
[0m[48;2;40;67;43m[39m+    752[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        created_by=head_doctor,[K
[0m[48;2;40;67;43m[39m+    753[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    )[K
[0m[48;2;40;67;43m[39m+    754[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    client = _auth(api_client, head_doctor)[K
[0m[48;2;40;67;43m[39m+    755[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    756[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    # GET always works (returns empty list before T13).[K
[0m[48;2;40;67;43m[39m+    757[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    resp = client.get(f"{LIST_URL}{tr.pk}/tooth-records/")[K
[0m[48;2;40;67;43m[39m+    758[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    assert resp.status_code == status.HTTP_200_OK[K
[0m[48;2;40;67;43m[39m+    759[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    assert isinstance(resp.json(), list)[K
[0m[48;2;40;67;43m[39m+    760[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    761[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    # POST returns 501 or 201 depending on whether odontogram (T13) is[K
[0m[48;2;40;67;43m[39m+    762[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    # installed. We only assert one of those two.[K
[0m[48;2;40;67;43m[39m+    763[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    resp = client.post([K
[0m[48;2;40;67;43m[39m+    764[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        f"{LIST_URL}{tr.pk}/tooth-records/",[K
[0m[48;2;40;67;43m[39m+    765[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        data={"toothNumber": 11, "procedure": "filling", "status": "treated"},[K
[0m[48;2;40;67;43m[39m+    766[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        format="json",[K
[0m[48;2;40;67;43m[39m+    767[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    )[K
[0m[48;2;40;67;43m[39m+    768[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    assert resp.status_code in ([K
[0m[48;2;40;67;43m[39m+    769[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        status.HTTP_201_CREATED,[K
[0m[48;2;40;67;43m[39m+    770[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        status.HTTP_501_NOT_IMPLEMENTED,[K
[0m[48;2;40;67;43m[39m+    771[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        status.HTTP_400_BAD_REQUEST,[K
[0m[48;2;40;67;43m[39m+    772[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    )[K
[0m[K
Creating: [38;5;141m/home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/tests/test_treatments.py[0m
[38;5;244m - Completed in 0.1s[0m

I will run the following command: [38;5;141m.venv/bin/python -m pytest tests/test_treatments.py -q --tb=short 2>&1 | tail -60[0m (in [38;5;141mdentacrm/backend[0m)[38;5;244m (using tool: shell)[0m
Purpose: Run treatments tests

.............................                                            [100%]
29 passed in 31.48s
[38;5;244m - Completed in 33.422s[0m

[38;5;141m> [0mAll 29 treatments tests pass. Now let me verify no regression on the full suite.[0m[0m
I will run the following command: [38;5;141m.venv/bin/python -m pytest -q --tb=short 2>&1 | tail -15[0m (in [38;5;141mdentacrm/backend[0m)[38;5;244m (using tool: shell)[0m
Purpose: Run full backend test suite

........................................................................ [ 40%]
........................................................................ [ 80%]
...................................                                      [100%]
179 passed in 113.57s (0:01:53)
[38;5;244m - Completed in 115.698s[0m

[38;5;141m> [0mAll 179 tests pass (150 previous + 29 new). Let me also verify migrations are clean and run linting.[0m[0m
I will run the following command: [38;5;141m.venv/bin/python manage.py makemigrations --check --dry-run 2>&1 | tail -10 && .venv/bin/ruff check apps/treatments 2>&1 | tail -20[0m (in [38;5;141mdentacrm/backend[0m)[38;5;244m (using tool: shell)[0m
Purpose: Verify no missing migrations + lint check

No changes detected
18 | |     Treatment,
19 | |     TreatmentPhoto,
20 | |     TreatmentStage,
21 | | )
22 | | from .services import (
23 | |     create_treatment,
24 | |     update_treatment,
25 | |     upload_treatment_photo,
26 | | )
27 | | 
28 | | 
29 | | # ---------------------------------------------------------------------------
   | |_^ I001
30 |   # Helpers
31 |   # ---------------------------------------------------------------------------
   |
   = help: Organize imports

Found 2 errors.
[*] 2 fixable with the `--fix` option.
[38;5;244m - Completed in 2.267s[0m

I will run the following command: [38;5;141m.venv/bin/ruff check apps/treatments --fix 2>&1 | tail -10 && .venv/bin/ruff check apps/treatments 2>&1 | tail -5[0m (in [38;5;141mdentacrm/backend[0m)[38;5;244m (using tool: shell)[0m
Purpose: Auto-fix ruff import issues

Found 2 errors (2 fixed, 0 remaining).
All checks passed!
[38;5;244m - Completed in 0.68s[0m

I will run the following command: [38;5;141m.venv/bin/ruff check tests/test_treatments.py 2>&1 | tail -20[0m (in [38;5;141mdentacrm/backend[0m)[38;5;244m (using tool: shell)[0m
Purpose: Ruff check on tests

All checks passed!
[38;5;244m - Completed in 0.36s[0m

I will run the following command: [38;5;141m.venv/bin/python -m pytest tests/test_treatments.py -q --tb=short 2>&1 | tail -5[0m (in [38;5;141mdentacrm/backend[0m)[38;5;244m (using tool: shell)[0m
Purpose: Final treatments test re-run after ruff fixes

.............................                                            [100%]
29 passed in 36.12s
[38;5;244m - Completed in 38.196s[0m

[38;5;141m> [0mTask 12 (treatments app) is complete. Here's the summary:[0m[0m
[0m[0m
[1mImplemented (Phase 3, Task 12 — treatments app):[22m[0m[0m
- [38;5;10mapps/treatments/models.py[0m: [38;5;10mTreatment[0m (appointment/doctor/patient/department/procedure_type FKs, diagnosis, description, price with non-negative CheckConstraint, payment_status enum, stage enum, simple_history audit) + [38;5;10mTreatmentPhoto[0m (treatment FK, photo_type before/after/xray, ImageField, thumbnail_path, uploaded_at, caption).[0m[0m
- [38;5;10mapps/treatments/services.py[0m: [38;5;10mcreate_treatment[0m, [38;5;10mupdate_treatment[0m (enforces doctor ∈ department, procedure_type.department match, appointment patient/doctor match, no completed→in_progress rollback), [38;5;10msoft_delete_treatment[0m, [38;5;10mupload_treatment_photo[0m, [38;5;10msoft_delete_photo[0m.[0m[0m
- [38;5;10mapps/treatments/selectors.py[0m: [38;5;10mactive_treatments[0m, [38;5;10mfilter_treatments[0m (patient/doctor/department/payment_status/stage), [38;5;10mtreatments_for_patient/doctor[0m, [38;5;10mphotos_for_treatment[0m.[0m[0m
- [38;5;10mapps/treatments/permissions.py[0m: [38;5;10mTreatmentPermission[0m — bosh_shifokor full; doctor own-only (+opt-in view others); administrator read-only.[0m[0m
- [38;5;10mapps/treatments/serializers.py[0m: [38;5;10mTreatmentSerializer[0m (camelCase output, snake+camel input, nested doctor/patient/department/photos/toothRecords), [38;5;10mTreatmentPhotoSerializer[0m, [38;5;10mTreatmentPhotoUploadSerializer[0m (multipart).[0m[0m
- [38;5;10mapps/treatments/views.py[0m: [38;5;10mTreatmentViewSet[0m with list/retrieve/create/update/soft-delete, [38;5;10m@action photos[0m (GET list, POST multipart upload), [38;5;10m@action tooth-records[0m (GET list, POST delegates to future odontogram app, returns 501 if missing).[0m[0m
- Registered in [38;5;10mLOCAL_APPS[0m, wired [38;5;10m/api/v1/treatments/[0m in [38;5;10mconfig/urls.py[0m, admin with [38;5;10mSimpleHistoryAdmin[0m, migration [38;5;10m0001_initial[0m (Treatment + HistoricalTreatment + TreatmentPhoto).[0m[0m
- [38;5;10mtests/test_treatments.py[0m: 29 tests covering services (happy path, validation, cross-object consistency, stage transitions), selectors, RBAC (anonymous/head/doctor own/doctor with flag/admin read-only), CRUD via API, filters, multipart photo upload + list, error envelope shape.[0m[0m
[0m[0m
[1mVerification:[22m[0m[0m
- [38;5;10mpython manage.py check[0m — no issues[0m[0m
- [38;5;10mpython manage.py makemigrations --check --dry-run[0m — no changes detected[0m[0m
- [38;5;10mpython manage.py migrate[0m — treatments.0001_initial applied[0m[0m
- [38;5;10mruff check apps/treatments tests/test_treatments.py[0m — all checks passed[0m[0m
- [38;5;10mpytest[0m — 179 passed (150 previous + 29 new)[0m[0m
[0m[0m
[1mjson
[0m[38;5;10m{
  "state": "needs_review",
  "summary": "Implemented Phase 3 Task 12 — treatments app (Treatment + TreatmentPhoto): models with FKs to appointment/doctor/patient/department/procedure_type, non-negative price CheckConstraint, simple_history audit, payment_status/stage enums; services enforcing doctor-department, procedure-type-department, appointment patient/doctor consistency and forward-only stage transitions; RBAC permissions (bosh_shifokor full / doctor own-only with opt-in view-others / administrator read-only); DRF ViewSet with CRUD + photos multipart upload action + tooth-records stub that defers to a future odontogram app (501 when missing); camelCase serialisation. Registered app in settings, wired /api/v1/treatments/ URL, generated & applied initial migration. Added 29 pytest tests. Full test suite: 179 passed.",
  "files_changed": [
    "dentacrm/backend/apps/treatments/__init__.py",
    "dentacrm/backend/apps/treatments/apps.py",
    "dentacrm/backend/apps/treatments/models.py",
    "dentacrm/backend/apps/treatments/selectors.py",
    "dentacrm/backend/apps/treatments/services.py",
    "dentacrm/backend/apps/treatments/permissions.py",
    "dentacrm/backend/apps/treatments/serializers.py",
    "dentacrm/backend/apps/treatments/views.py",
    "dentacrm/backend/apps/treatments/urls.py",
    "dentacrm/backend/apps/treatments/admin.py",
    "dentacrm/backend/apps/treatments/migrations/__init__.py",
    "dentacrm/backend/apps/treatments/migrations/0001_initial.py",
    "dentacrm/backend/config/settings/base.py",
    "dentacrm/backend/config/urls.py",
    "dentacrm/backend/tests/test_treatments.py"
  ],
  "verification": "python manage.py check → no issues; makemigrations --check --dry-run → no changes; migrate → treatments.0001_initial applied; ruff check apps/treatments tests/test_treatments.py → all checks passed; pytest tests/test_treatments.py → 29 passed; pytest (full suite) → 179 passed in 113s.",
  "next_suggested_task": "Task 13 — odontogram app (ToothRecord model with FDI 11-48 validation, treatment FK, procedure/status enums; write side accessed via /treatments/{id}/tooth-records/ POST which is already wired to auto-detect the app). After that: Task 14 prescriptions app, Task 15 inventory app (Material + MaterialUsage signals for stock auto-decrement + low_stock alerts).",
  "blockers": []
}
[0m
```

## STDERR
```text
[32mAll tools are now trusted ([0m[31m![0m[32m). Kiro will execute tools without asking for confirmation.[0m
Agents can sometimes do unexpected things so understand the risks.

Learn more at [38;5;141mhttps://kiro.dev/docs/cli/chat/security/#using-tools-trust-all-safely[0m



[38;5;252m[0m[?25l[?25l[0m[0m[?25l[0m[?25l[0m[0m[?25l[0m[?25l[0m[0m[?25l[0m[?25l[0m[0m[?25l[0m[?25l[0m[0m[?25l[0m[?25l[0m[0m[?25l[0m[?25l[0m[0m[?25l[0m[?25l[0m[0m[?25l[0m[?25l[0m[0m[?25l[0m[?25l[0m[0m[?25l[0m[?25l[0m[0m[?25l[0m[?25l[0m[0m[?25l[0m[?25l[0m[0m[?25l[0m[?25l[0m[0m[?25l[0m[?25l[0m[0m[?25l[0m[?25l[0m[0m[?25l[0m[?25l[0m[0m[?25l[0m[?25l[0m[0m[?25l[0m[?25l[0m[0m[?25l[0m[?25l[0m[0m[?25l[0m[?25l[0m[0m[?25l[0m[?25l[0m[0m[?25l[0m[?25l[0m[0m[?25l[0m[?25l[0m[0m[?25l[0m[?25l[0m[0m[?25l[0m[?25l[0m[0m[?25l[0m[?25l[0m[0m[?25l[0m[?25l[0m[0m[?25l[0m[?25l[0m[0m[?25l[0m[?25l[0m[0m[?25l[0m[?25l[0m[0m[?25l[0m[?25l[0m[0m[?25l[0m[?25l[0m[0m[?25l[0m[?25l[0m[0m[?25l[0m[?25l[0m[0m[?25l[0m[0m[0m
[38;5;8m
 ▸ Credits: 27.45 • Time: 10m 58s

[0m[1G[0m[0m[?25h
```