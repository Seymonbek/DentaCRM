# kiro-builder

returncode: 0
seconds: 1471.58
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
?? dentacrm/backend/apps/odontogram/
?? dentacrm/backend/apps/patients/
?? dentacrm/backend/apps/scheduling/
?? dentacrm/backend/apps/treatments/
?? dentacrm/backend/tests/test_accounts.py
?? dentacrm/backend/tests/test_core.py
?? dentacrm/backend/tests/test_departments.py
?? dentacrm/backend/tests/test_doctors.py
?? dentacrm/backend/tests/test_odontogram.py
?? dentacrm/backend/tests/test_patients.py
?? dentacrm/backend/tests/test_scheduling.py
?? dentacrm/backend/tests/test_treatments.py
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
 dentacrm/backend/config/settings/base.py | 22 +++++++++---
 dentacrm/backend/config/urls.py          | 14 +++++++-
 dentacrm/frontend/.dockerignore          | 15 +++++----
 dentacrm/frontend/Dockerfile             | 24 ++++----------
 dentacrm/frontend/README.md              | 40 +++++++++++++++++++---
 dentacrm/frontend/package.json           | 57 +++++++++++++++++++++++++++++---
 dentacrm/frontend/placeholder-server.mjs | 43 ------------------------
 7 files changed, 134 insertions(+), 81 deletions(-)

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
Reading directory: [38;5;141m/home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm[0m[38;5;244m (using tool: read, max depth: 3, max entries: 1000, excluding: defaults)[0m
[38;5;10m ✓ [0mSuccessfully read directory [38;5;141m/home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm[0m [38;5;244m(289 entries)[0m
[38;5;244m - Completed in 0.18s[0m

Batch fs_read operation with [38;5;141m3[0m operations[38;5;244m (using tool: read)[0m

↱ Operation 1: Reading file: [38;5;141m/home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/config/settings/base.py[0m, all lines
↱ Operation 2: Reading file: [38;5;141m/home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/config/urls.py[0m, all lines
↱ Operation 3: Reading file: [38;5;141m/home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/requirements/base.txt[0m, all lines
[38;5;10m ✓ [0mSuccessfully read [38;5;244m15715 bytes[0m from /home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/config/settings/base.py

[38;5;10m ✓ [0mSuccessfully read [38;5;244m2685 bytes[0m from /home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/config/urls.py

[38;5;10m ✓ [0mSuccessfully read [38;5;244m1298 bytes[0m from /home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/requirements/base.txt

 ⋮ 

[38;5;244m- [0mSummary: 3 operations processed, 3 successful, 0 failed
[38;5;244m - Completed in 0.0s[0m

[38;5;141m> [0mNow let me quickly verify current state runs and check what's next:[0m[0m
[0m[0m
I will run the following command: [38;5;141mls -la[0m (in [38;5;141mdentacrm/backend/apps[0m)[38;5;244m (using tool: shell)[0m

Batch fs_read operation with [38;5;141m2[0m operations[38;5;244m (using tool: read)[0m

↱ Operation 1: Reading file: [38;5;141m/home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/apps/treatments/models.py[0m, all lines
↱ Operation 2: Reading file: [38;5;141m/home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/apps/odontogram/models.py[0m, all linestotal 48
drwxrwxr-x 11 seymonbek seymonbek 4096 Jul  4 15:10 .
drwxrwxr-x 10 seymonbek seymonbek 4096 Jul  4 15:13 ..
drwxrwxr-x  4 seymonbek seymonbek 4096 Jul  4 14:04 accounts
drwxrwxr-x  3 seymonbek seymonbek 4096 Jul  4 14:01 core
drwxrwxr-x  4 seymonbek seymonbek 4096 Jul  4 14:22 departments
drwxrwxr-x  4 seymonbek seymonbek 4096 Jul  4 14:30 doctors
-rw-rw-r--  1 seymonbek seymonbek  169 Jul  4 13:49 __init__.py
drwxrwxr-x  4 seymonbek seymonbek 4096 Jul  4 15:13 odontogram
drwxrwxr-x  4 seymonbek seymonbek 4096 Jul  4 14:39 patients
drwxrwxr-x  2 seymonbek seymonbek 4096 Jul  4 14:01 __pycache__
drwxrwxr-x  4 seymonbek seymonbek 4096 Jul  4 14:50 scheduling
drwxrwxr-x  4 seymonbek seymonbek 4096 Jul  4 15:03 treatments
[38;5;244m - Completed in 0.12s[0m


[38;5;10m ✓ [0mSuccessfully read [38;5;244m7999 bytes[0m from /home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/apps/treatments/models.py

[38;5;10m ✓ [0mSuccessfully read [38;5;244m5439 bytes[0m from /home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/apps/odontogram/models.py

 ⋮ 

[38;5;244m- [0mSummary: 2 operations processed, 2 successful, 0 failed
[38;5;244m - Completed in 0.0s[0m

I will run the following command: [38;5;141msource .venv/bin/activate && python -m pytest --tb=no -q 2>&1 | tail -30[0m (in [38;5;141mdentacrm/backend[0m)[38;5;244m (using tool: shell)[0m

........................................................................ [ 31%]
........................................................................ [ 62%]
........................................................................ [ 94%]
.............                                                            [100%]
229 passed in 177.53s (0:02:57)
[38;5;244m - Completed in 179.691s[0m

[38;5;141m> [0mAll 229 tests pass. Now I need to continue with [1mPhase 3, Task 14: prescriptions app[22m. Let me examine the existing app structure to match the pattern:[0m[0m
Batch fs_read operation with [38;5;141m6[0m operations[38;5;244m (using tool: read)[0m

↱ Operation 1: Reading file: [38;5;141m/home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/apps/treatments/__init__.py[0m, all lines
↱ Operation 2: Reading file: [38;5;141m/home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/apps/treatments/apps.py[0m, all lines
↱ Operation 3: Reading file: [38;5;141m/home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/apps/treatments/urls.py[0m, all lines
↱ Operation 4: Reading file: [38;5;141m/home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/apps/treatments/views.py[0m, all lines
↱ Operation 5: Reading file: [38;5;141m/home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/apps/treatments/services.py[0m, all lines
↱ Operation 6: Reading file: [38;5;141m/home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/apps/treatments/permissions.py[0m, all lines
[38;5;10m ✓ [0mSuccessfully read [38;5;244m894 bytes[0m from /home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/apps/treatments/__init__.py

[38;5;10m ✓ [0mSuccessfully read [38;5;244m354 bytes[0m from /home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/apps/treatments/apps.py

[38;5;10m ✓ [0mSuccessfully read [38;5;244m335 bytes[0m from /home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/apps/treatments/urls.py

[38;5;10m ✓ [0mSuccessfully read [38;5;244m10158 bytes[0m from /home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/apps/treatments/views.py

[38;5;10m ✓ [0mSuccessfully read [38;5;244m12202 bytes[0m from /home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/apps/treatments/services.py

[38;5;10m ✓ [0mSuccessfully read [38;5;244m3253 bytes[0m from /home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/apps/treatments/permissions.py

 ⋮ 

[38;5;244m- [0mSummary: 6 operations processed, 6 successful, 0 failed
[38;5;244m - Completed in 0.1s[0m

Batch fs_read operation with [38;5;141m5[0m operations[38;5;244m (using tool: read)[0m

↱ Operation 1: Reading file: [38;5;141m/home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/apps/core/permissions.py[0m, all lines
↱ Operation 2: Reading file: [38;5;141m/home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/apps/core/pagination.py[0m, all lines
↱ Operation 3: Reading file: [38;5;141m/home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/apps/core/exceptions.py[0m, all lines
↱ Operation 4: Reading file: [38;5;141m/home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/apps/treatments/selectors.py[0m, all lines
↱ Operation 5: Reading file: [38;5;141m/home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/apps/treatments/serializers.py[0m, all lines
[38;5;10m ✓ [0mSuccessfully read [38;5;244m6566 bytes[0m from /home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/apps/core/permissions.py

[38;5;10m ✓ [0mSuccessfully read [38;5;244m1256 bytes[0m from /home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/apps/core/pagination.py

[38;5;10m ✓ [0mSuccessfully read [38;5;244m5341 bytes[0m from /home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/apps/core/exceptions.py

[38;5;10m ✓ [0mSuccessfully read [38;5;244m2260 bytes[0m from /home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/apps/treatments/selectors.py

[38;5;10m ✓ [0mSuccessfully read [38;5;244m14446 bytes[0m from /home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/apps/treatments/serializers.py

 ⋮ 

[38;5;244m- [0mSummary: 5 operations processed, 5 successful, 0 failed
[38;5;244m - Completed in 0.1s[0m

[38;5;141m> [0mNow I have a clear picture of the pattern. Let me build the [1mprescriptions[22m app:[0m[0m
I'll create the following file: [38;5;141m/home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/apps/prescriptions/__init__.py[0m[38;5;244m (using tool: write)[0m

[48;2;40;67;43m[39m+     1[0m:[39m[48;2;24;38;30m [38;2;101;115;126m"""[38;2;101;115;126mPrescriptions app — retseptlar va shablonlar.[K
[0m[48;2;40;67;43m[39m+     2[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     3[0m:[39m[48;2;24;38;30m [38;2;101;115;126mModels (PROJECT_BRIEF § "prescriptions app"):[K
[0m[48;2;40;67;43m[39m+     4[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     5[0m:[39m[48;2;24;38;30m [38;2;101;115;126m* :class:`PrescriptionTemplate` — reusable retsept shabloni (name +[K
[0m[48;2;40;67;43m[39m+     6[0m:[39m[48;2;24;38;30m [38;2;101;115;126m  content). Created by ``bosh_shifokor`` or ``doctor``; anyone with[K
[0m[48;2;40;67;43m[39m+     7[0m:[39m[48;2;24;38;30m [38;2;101;115;126m  clinical write access can list them.[K
[0m[48;2;40;67;43m[39m+     8[0m:[39m[48;2;24;38;30m [38;2;101;115;126m* :class:`Prescription` — an individual retsept issued for a[K
[0m[48;2;40;67;43m[39m+     9[0m:[39m[48;2;24;38;30m [38;2;101;115;126m  :class:`apps.treatments.Treatment`. May be based on a template but[K
[0m[48;2;40;67;43m[39m+    10[0m:[39m[48;2;24;38;30m [38;2;101;115;126m  ``content`` is always stored verbatim so template changes never[K
[0m[48;2;40;67;43m[39m+    11[0m:[39m[48;2;24;38;30m [38;2;101;115;126m  rewrite history. ``sent_to_telegram_at`` is set by the send-service[K
[0m[48;2;40;67;43m[39m+    12[0m:[39m[48;2;24;38;30m [38;2;101;115;126m  once the patient (or a mock, in dev) receives the message.[K
[0m[48;2;40;67;43m[39m+    13[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    14[0m:[39m[48;2;24;38;30m [38;2;101;115;126mEndpoints (PROJECT_BRIEF § "Prescriptions"):[K
[0m[48;2;40;67;43m[39m+    15[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    16[0m:[39m[48;2;24;38;30m [38;2;101;115;126m* ``GET  /api/v1/prescription-templates/``[K
[0m[48;2;40;67;43m[39m+    17[0m:[39m[48;2;24;38;30m [38;2;101;115;126m* ``POST /api/v1/prescription-templates/``[K
[0m[48;2;40;67;43m[39m+    18[0m:[39m[48;2;24;38;30m [38;2;101;115;126m* ``GET  /api/v1/prescription-templates/{id}/``[K
[0m[48;2;40;67;43m[39m+    19[0m:[39m[48;2;24;38;30m [38;2;101;115;126m* ``PATCH /api/v1/prescription-templates/{id}/``[K
[0m[48;2;40;67;43m[39m+    20[0m:[39m[48;2;24;38;30m [38;2;101;115;126m* ``DELETE /api/v1/prescription-templates/{id}/``[K
[0m[48;2;40;67;43m[39m+    21[0m:[39m[48;2;24;38;30m [38;2;101;115;126m* ``GET  /api/v1/prescriptions/`` (filters: ``?treatment=&patient=``)[K
[0m[48;2;40;67;43m[39m+    22[0m:[39m[48;2;24;38;30m [38;2;101;115;126m* ``GET  /api/v1/prescriptions/{id}/``[K
[0m[48;2;40;67;43m[39m+    23[0m:[39m[48;2;24;38;30m [38;2;101;115;126m* ``POST /api/v1/treatments/{id}/prescription/`` — create+send.[K
[0m[48;2;40;67;43m[39m+    24[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    25[0m:[39m[48;2;24;38;30m [38;2;101;115;126mRBAC (PROJECT_BRIEF § "RBAC" — clinical write):[K
[0m[48;2;40;67;43m[39m+    26[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    27[0m:[39m[48;2;24;38;30m [38;2;101;115;126m* Read/list: ``bosh_shifokor``, ``doctor`` (own by default),[K
[0m[48;2;40;67;43m[39m+    28[0m:[39m[48;2;24;38;30m [38;2;101;115;126m  ``administrator`` (read-only, to see what to hand out).[K
[0m[48;2;40;67;43m[39m+    29[0m:[39m[48;2;24;38;30m [38;2;101;115;126m* Write / send: ``bosh_shifokor`` and the treatment's ``doctor``.[K
[0m[48;2;40;67;43m[39m+    30[0m:[39m[48;2;24;38;30m [38;2;101;115;126m"""[K
[0m[48;2;40;67;43m[39m+    31[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    32[0m:[39m[48;2;24;38;30m [38;2;192;197;206mdefault_app_config[38;2;192;197;206m [38;2;192;197;206m=[38;2;192;197;206m [38;2;192;197;206m"[38;2;163;190;140mapps.prescriptions.apps.PrescriptionsConfig[38;2;192;197;206m"[K
[0m[K
Creating: [38;5;141m/home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/apps/prescriptions/__init__.py[0m
[38;5;244m - Completed in 0.1s[0m

I'll create the following file: [38;5;141m/home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/apps/prescriptions/apps.py[0m[38;5;244m (using tool: write)[0m

[48;2;40;67;43m[39m+     1[0m:[39m[48;2;24;38;30m [38;2;101;115;126m"""[38;2;101;115;126mAppConfig for the ``prescriptions`` app.[38;2;101;115;126m"""[K
[0m[48;2;40;67;43m[39m+     2[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206m__future__[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206mannotations[K
[0m[48;2;40;67;43m[39m+     3[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     4[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206mdjango[38;2;192;197;206m.[38;2;192;197;206mapps[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206mAppConfig[K
[0m[48;2;40;67;43m[39m+     5[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     6[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     7[0m:[39m[48;2;24;38;30m [38;2;180;142;173mclass[38;2;239;241;245m [38;2;235;203;139mPrescriptionsConfig[38;2;239;241;245m([38;2;163;190;140mAppConfig[38;2;239;241;245m)[38;2;239;241;245m:[K
[0m[48;2;40;67;43m[39m+     8[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;101;115;126m"""[38;2;101;115;126mRetseptlar (Prescription) app configuration.[38;2;101;115;126m"""[K
[0m[48;2;40;67;43m[39m+     9[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    10[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;192;197;206mdefault_auto_field[38;2;192;197;206m [38;2;192;197;206m=[38;2;192;197;206m [38;2;192;197;206m"[38;2;163;190;140mdjango.db.models.BigAutoField[38;2;192;197;206m"[K
[0m[48;2;40;67;43m[39m+    11[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;192;197;206mname[38;2;192;197;206m [38;2;192;197;206m=[38;2;192;197;206m [38;2;192;197;206m"[38;2;163;190;140mapps.prescriptions[38;2;192;197;206m"[K
[0m[48;2;40;67;43m[39m+    12[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;192;197;206mlabel[38;2;192;197;206m [38;2;192;197;206m=[38;2;192;197;206m [38;2;192;197;206m"[38;2;163;190;140mprescriptions[38;2;192;197;206m"[K
[0m[48;2;40;67;43m[39m+    13[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;192;197;206mverbose_name[38;2;192;197;206m [38;2;192;197;206m=[38;2;192;197;206m [38;2;192;197;206m"[38;2;163;190;140mPrescriptions[38;2;192;197;206m"[K
[0m[K
Creating: [38;5;141m/home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/apps/prescriptions/apps.py[0m
[38;5;244m - Completed in 0.0s[0m

I'll create the following file: [38;5;141m/home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/apps/prescriptions/models.py[0m[38;5;244m (using tool: write)[0m

[48;2;40;67;43m[39m+      1[0m:[39m[48;2;24;38;30m [38;2;101;115;126m"""[38;2;101;115;126mModels for the ``prescriptions`` app.[K
[0m[48;2;40;67;43m[39m+      2[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+      3[0m:[39m[48;2;24;38;30m [38;2;101;115;126mDesign notes:[K
[0m[48;2;40;67;43m[39m+      4[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+      5[0m:[39m[48;2;24;38;30m [38;2;101;115;126m* Both models inherit :class:`apps.core.models.BaseModel` for UUID pk,[K
[0m[48;2;40;67;43m[39m+      6[0m:[39m[48;2;24;38;30m [38;2;101;115;126m  ``created_at`` / ``updated_at`` / ``is_active``.[K
[0m[48;2;40;67;43m[39m+      7[0m:[39m[48;2;24;38;30m [38;2;101;115;126m* :class:`Prescription` records ``content`` verbatim rather than[K
[0m[48;2;40;67;43m[39m+      8[0m:[39m[48;2;24;38;30m [38;2;101;115;126m  linking dynamically to the template body — a retsept that has been[K
[0m[48;2;40;67;43m[39m+      9[0m:[39m[48;2;24;38;30m [38;2;101;115;126m  handed to a patient must not silently change if the template is[K
[0m[48;2;40;67;43m[39m+     10[0m:[39m[48;2;24;38;30m [38;2;101;115;126m  edited later.[K
[0m[48;2;40;67;43m[39m+     11[0m:[39m[48;2;24;38;30m [38;2;101;115;126m* ``sent_to_telegram_at`` is nullable; ``None`` means "not yet sent".[K
[0m[48;2;40;67;43m[39m+     12[0m:[39m[48;2;24;38;30m [38;2;101;115;126m* :class:`PrescriptionTemplate.name` is unique per-created_by so[K
[0m[48;2;40;67;43m[39m+     13[0m:[39m[48;2;24;38;30m [38;2;101;115;126m  a doctor can freely reuse names another doctor already picked.[K
[0m[48;2;40;67;43m[39m+     14[0m:[39m[48;2;24;38;30m [38;2;101;115;126m"""[K
[0m[48;2;40;67;43m[39m+     15[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206m__future__[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206mannotations[K
[0m[48;2;40;67;43m[39m+     16[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     17[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206mdjango[38;2;192;197;206m.[38;2;192;197;206mconf[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206msettings[K
[0m[48;2;40;67;43m[39m+     18[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206mdjango[38;2;192;197;206m.[38;2;192;197;206mdb[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206mmodels[K
[0m[48;2;40;67;43m[39m+     19[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206mdjango[38;2;192;197;206m.[38;2;192;197;206mutils[38;2;192;197;206m.[38;2;192;197;206mtranslation[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206mgettext_lazy[38;2;192;197;206m [38;2;180;142;173mas[38;2;192;197;206m [38;2;191;97;106m_[K
[0m[48;2;40;67;43m[39m+     20[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     21[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206mapps[38;2;192;197;206m.[38;2;192;197;206mcore[38;2;192;197;206m.[38;2;192;197;206mmodels[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206mBaseModel[K
[0m[48;2;40;67;43m[39m+     22[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     23[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     24[0m:[39m[48;2;24;38;30m [38;2;101;115;126m#[38;2;101;115;126m ---------------------------------------------------------------------------[K
[0m[48;2;40;67;43m[39m+     25[0m:[39m[48;2;24;38;30m [38;2;101;115;126m# PrescriptionTemplate[K
[0m[48;2;40;67;43m[39m+     26[0m:[39m[48;2;24;38;30m [38;2;101;115;126m# ---------------------------------------------------------------------------[K
[0m[48;2;40;67;43m[39m+     27[0m:[39m[48;2;24;38;30m [38;2;101;115;126mclass PrescriptionTemplate(BaseModel):[K
[0m[48;2;40;67;43m[39m+     28[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    """Reusable retsept shabloni."""[K
[0m[48;2;40;67;43m[39m+     29[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     30[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    name = models.CharField([K
[0m[48;2;40;67;43m[39m+     31[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        _("Nomi"),[K
[0m[48;2;40;67;43m[39m+     32[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        max_length=200,[K
[0m[48;2;40;67;43m[39m+     33[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    )[K
[0m[48;2;40;67;43m[39m+     34[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    content = models.TextField([K
[0m[48;2;40;67;43m[39m+     35[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        _("Matn"),[K
[0m[48;2;40;67;43m[39m+     36[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        help_text=_([K
[0m[48;2;40;67;43m[39m+     37[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            "Retsept matni. Placeholderlar (masalan {patient_name}) qo'llab-"[K
[0m[48;2;40;67;43m[39m+     38[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            "quvvatlanadi va yaratish vaqtida almashtiriladi."[K
[0m[48;2;40;67;43m[39m+     39[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        ),[K
[0m[48;2;40;67;43m[39m+     40[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    )[K
[0m[48;2;40;67;43m[39m+     41[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    created_by = models.ForeignKey([K
[0m[48;2;40;67;43m[39m+     42[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        settings.AUTH_USER_MODEL,[K
[0m[48;2;40;67;43m[39m+     43[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        on_delete=models.PROTECT,[K
[0m[48;2;40;67;43m[39m+     44[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        related_name="prescription_templates",[K
[0m[48;2;40;67;43m[39m+     45[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        related_query_name="prescription_template",[K
[0m[48;2;40;67;43m[39m+     46[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        verbose_name=_("Yaratgan foydalanuvchi"),[K
[0m[48;2;40;67;43m[39m+     47[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        null=True,[K
[0m[48;2;40;67;43m[39m+     48[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        blank=True,[K
[0m[48;2;40;67;43m[39m+     49[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    )[K
[0m[48;2;40;67;43m[39m+     50[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     51[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    class Meta:[K
[0m[48;2;40;67;43m[39m+     52[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        verbose_name = _("Retsept shabloni")[K
[0m[48;2;40;67;43m[39m+     53[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        verbose_name_plural = _("Retsept shablonlari")[K
[0m[48;2;40;67;43m[39m+     54[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        ordering = ["name"][K
[0m[48;2;40;67;43m[39m+     55[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        constraints = [[K
[0m[48;2;40;67;43m[39m+     56[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            models.UniqueConstraint([K
[0m[48;2;40;67;43m[39m+     57[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                fields=["created_by", "name"],[K
[0m[48;2;40;67;43m[39m+     58[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                name="prescriptions_template_unique_name_per_owner",[K
[0m[48;2;40;67;43m[39m+     59[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            ),[K
[0m[48;2;40;67;43m[39m+     60[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        ][K
[0m[48;2;40;67;43m[39m+     61[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        indexes = [[K
[0m[48;2;40;67;43m[39m+     62[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            models.Index(fields=["name"], name="pr_tpl_name_idx"),[K
[0m[48;2;40;67;43m[39m+     63[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        ][K
[0m[48;2;40;67;43m[39m+     64[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     65[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    def __str__(self) -> str:  # pragma: no cover - repr helper[K
[0m[48;2;40;67;43m[39m+     66[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        return f"PrescriptionTemplate({self.name})"[K
[0m[48;2;40;67;43m[39m+     67[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     68[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     69[0m:[39m[48;2;24;38;30m [38;2;101;115;126m# ---------------------------------------------------------------------------[K
[0m[48;2;40;67;43m[39m+     70[0m:[39m[48;2;24;38;30m [38;2;101;115;126m# Prescription[K
[0m[48;2;40;67;43m[39m+     71[0m:[39m[48;2;24;38;30m [38;2;101;115;126m# ---------------------------------------------------------------------------[K
[0m[48;2;40;67;43m[39m+     72[0m:[39m[48;2;24;38;30m [38;2;101;115;126mclass Prescription(BaseModel):[K
[0m[48;2;40;67;43m[39m+     73[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    """A single retsept issued for a :class:`treatments.Treatment`."""[K
[0m[48;2;40;67;43m[39m+     74[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     75[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    treatment = models.ForeignKey([K
[0m[48;2;40;67;43m[39m+     76[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        "treatments.Treatment",[K
[0m[48;2;40;67;43m[39m+     77[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        on_delete=models.CASCADE,[K
[0m[48;2;40;67;43m[39m+     78[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        related_name="prescriptions",[K
[0m[48;2;40;67;43m[39m+     79[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        related_query_name="prescription",[K
[0m[48;2;40;67;43m[39m+     80[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        verbose_name=_("Davolash"),[K
[0m[48;2;40;67;43m[39m+     81[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    )[K
[0m[48;2;40;67;43m[39m+     82[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    template = models.ForeignKey([K
[0m[48;2;40;67;43m[39m+     83[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        PrescriptionTemplate,[K
[0m[48;2;40;67;43m[39m+     84[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        on_delete=models.SET_NULL,[K
[0m[48;2;40;67;43m[39m+     85[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        related_name="prescriptions",[K
[0m[48;2;40;67;43m[39m+     86[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        related_query_name="prescription",[K
[0m[48;2;40;67;43m[39m+     87[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        verbose_name=_("Shablon"),[K
[0m[48;2;40;67;43m[39m+     88[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        null=True,[K
[0m[48;2;40;67;43m[39m+     89[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        blank=True,[K
[0m[48;2;40;67;43m[39m+     90[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    )[K
[0m[48;2;40;67;43m[39m+     91[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    content = models.TextField([K
[0m[48;2;40;67;43m[39m+     92[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        _("Matn"),[K
[0m[48;2;40;67;43m[39m+     93[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        help_text=_([K
[0m[48;2;40;67;43m[39m+     94[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            "Retsept matni — patientga yuboriladigan yakuniy versiya. "[K
[0m[48;2;40;67;43m[39m+     95[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            "Shablondan olingan bo'lsa ham, bu yerda mustaqil saqlanadi."[K
[0m[48;2;40;67;43m[39m+     96[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        ),[K
[0m[48;2;40;67;43m[39m+     97[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    )[K
[0m[48;2;40;67;43m[39m+     98[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    sent_to_telegram_at = models.DateTimeField([K
[0m[48;2;40;67;43m[39m+     99[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        _("Telegram ga yuborilgan sana"),[K
[0m[48;2;40;67;43m[39m+    100[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        null=True,[K
[0m[48;2;40;67;43m[39m+    101[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        blank=True,[K
[0m[48;2;40;67;43m[39m+    102[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    )[K
[0m[48;2;40;67;43m[39m+    103[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    created_by = models.ForeignKey([K
[0m[48;2;40;67;43m[39m+    104[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        settings.AUTH_USER_MODEL,[K
[0m[48;2;40;67;43m[39m+    105[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        on_delete=models.PROTECT,[K
[0m[48;2;40;67;43m[39m+    106[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        related_name="prescriptions_created",[K
[0m[48;2;40;67;43m[39m+    107[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        related_query_name="prescription_created",[K
[0m[48;2;40;67;43m[39m+    108[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        verbose_name=_("Yaratgan foydalanuvchi"),[K
[0m[48;2;40;67;43m[39m+    109[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        null=True,[K
[0m[48;2;40;67;43m[39m+    110[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        blank=True,[K
[0m[48;2;40;67;43m[39m+    111[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    )[K
[0m[48;2;40;67;43m[39m+    112[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    113[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    class Meta:[K
[0m[48;2;40;67;43m[39m+    114[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        verbose_name = _("Retsept")[K
[0m[48;2;40;67;43m[39m+    115[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        verbose_name_plural = _("Retseptlar")[K
[0m[48;2;40;67;43m[39m+    116[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        ordering = ["-created_at"][K
[0m[48;2;40;67;43m[39m+    117[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        indexes = [[K
[0m[48;2;40;67;43m[39m+    118[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            models.Index(fields=["treatment", "-created_at"], name="pr_tr_idx"),[K
[0m[48;2;40;67;43m[39m+    119[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            models.Index(fields=["sent_to_telegram_at"], name="pr_sent_idx"),[K
[0m[48;2;40;67;43m[39m+    120[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        ][K
[0m[48;2;40;67;43m[39m+    121[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    122[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    def __str__(self) -> str:  # pragma: no cover - repr helper[K
[0m[48;2;40;67;43m[39m+    123[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        return f"Prescription(treatment={self.treatment_id})"[K
[0m[48;2;40;67;43m[39m+    124[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    125[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    @property[K
[0m[48;2;40;67;43m[39m+    126[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    def is_sent(self) -> bool:[K
[0m[48;2;40;67;43m[39m+    127[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        return self.sent_to_telegram_at is not None[K
[0m[48;2;40;67;43m[39m+    128[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    129[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    130[0m:[39m[48;2;24;38;30m [38;2;101;115;126m__all__ = [[K
[0m[48;2;40;67;43m[39m+    131[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    "PrescriptionTemplate",[K
[0m[48;2;40;67;43m[39m+    132[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    "Prescription",[K
[0m[48;2;40;67;43m[39m+    133[0m:[39m[48;2;24;38;30m [38;2;101;115;126m][K
[0m[K
Creating: [38;5;141m/home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/apps/prescriptions/models.py[0m
[38;5;244m - Completed in 0.1s[0m

I'll create the following file: [38;5;141m/home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/apps/prescriptions/selectors.py[0m[38;5;244m (using tool: write)[0m

[48;2;40;67;43m[39m+      1[0m:[39m[48;2;24;38;30m [38;2;101;115;126m"""[38;2;101;115;126mRead-side query helpers for the ``prescriptions`` app.[38;2;101;115;126m"""[K
[0m[48;2;40;67;43m[39m+      2[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206m__future__[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206mannotations[K
[0m[48;2;40;67;43m[39m+      3[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+      4[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206mtyping[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206mAny[K
[0m[48;2;40;67;43m[39m+      5[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+      6[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206mdjango[38;2;192;197;206m.[38;2;192;197;206mdb[38;2;192;197;206m.[38;2;192;197;206mmodels[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206mQ[38;2;192;197;206m,[38;2;192;197;206m [38;2;192;197;206mQuerySet[K
[0m[48;2;40;67;43m[39m+      7[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+      8[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;180;142;173m.[38;2;192;197;206mmodels[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206mPrescription[38;2;192;197;206m,[38;2;192;197;206m [38;2;192;197;206mPrescriptionTemplate[K
[0m[48;2;40;67;43m[39m+      9[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     10[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     11[0m:[39m[48;2;24;38;30m [38;2;101;115;126m#[38;2;101;115;126m ---------------------------------------------------------------------------[K
[0m[48;2;40;67;43m[39m+     12[0m:[39m[48;2;24;38;30m [38;2;101;115;126m# Templates[K
[0m[48;2;40;67;43m[39m+     13[0m:[39m[48;2;24;38;30m [38;2;101;115;126m# ---------------------------------------------------------------------------[K
[0m[48;2;40;67;43m[39m+     14[0m:[39m[48;2;24;38;30m [38;2;101;115;126mdef all_templates() -> QuerySet[PrescriptionTemplate]:[K
[0m[48;2;40;67;43m[39m+     15[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    return PrescriptionTemplate.objects.select_related("created_by")[K
[0m[48;2;40;67;43m[39m+     16[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     17[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     18[0m:[39m[48;2;24;38;30m [38;2;101;115;126mdef active_templates() -> QuerySet[PrescriptionTemplate]:[K
[0m[48;2;40;67;43m[39m+     19[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    return all_templates().filter(is_active=True)[K
[0m[48;2;40;67;43m[39m+     20[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     21[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     22[0m:[39m[48;2;24;38;30m [38;2;101;115;126mdef template_by_id(template_id: Any) -> PrescriptionTemplate | None:[K
[0m[48;2;40;67;43m[39m+     23[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    return all_templates().filter(pk=template_id).first()[K
[0m[48;2;40;67;43m[39m+     24[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     25[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     26[0m:[39m[48;2;24;38;30m [38;2;101;115;126mdef templates_for_user(user_id: Any) -> QuerySet[PrescriptionTemplate]:[K
[0m[48;2;40;67;43m[39m+     27[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    """Templates visible to a specific user (own + shared).[K
[0m[48;2;40;67;43m[39m+     28[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     29[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    In DentaCRM every template is shared across the clinic — we return[K
[0m[48;2;40;67;43m[39m+     30[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    all active templates ordered so the user's own show first.[K
[0m[48;2;40;67;43m[39m+     31[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    """[K
[0m[48;2;40;67;43m[39m+     32[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    qs = active_templates()[K
[0m[48;2;40;67;43m[39m+     33[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    if user_id is None:[K
[0m[48;2;40;67;43m[39m+     34[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        return qs.order_by("name")[K
[0m[48;2;40;67;43m[39m+     35[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    return qs.order_by([K
[0m[48;2;40;67;43m[39m+     36[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        # Own templates first (created_by == user_id → 0), then others.[K
[0m[48;2;40;67;43m[39m+     37[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        models_case_own(user_id),[K
[0m[48;2;40;67;43m[39m+     38[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        "name",[K
[0m[48;2;40;67;43m[39m+     39[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    )[K
[0m[48;2;40;67;43m[39m+     40[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     41[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     42[0m:[39m[48;2;24;38;30m [38;2;101;115;126mdef models_case_own(user_id: Any):  # helper factored out for testability[K
[0m[48;2;40;67;43m[39m+     43[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    from django.db.models import Case, IntegerField, Value, When[K
[0m[48;2;40;67;43m[39m+     44[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     45[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    return Case([K
[0m[48;2;40;67;43m[39m+     46[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        When(created_by_id=user_id, then=Value(0)),[K
[0m[48;2;40;67;43m[39m+     47[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        default=Value(1),[K
[0m[48;2;40;67;43m[39m+     48[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        output_field=IntegerField(),[K
[0m[48;2;40;67;43m[39m+     49[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    )[K
[0m[48;2;40;67;43m[39m+     50[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     51[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     52[0m:[39m[48;2;24;38;30m [38;2;101;115;126m# ---------------------------------------------------------------------------[K
[0m[48;2;40;67;43m[39m+     53[0m:[39m[48;2;24;38;30m [38;2;101;115;126m# Prescriptions[K
[0m[48;2;40;67;43m[39m+     54[0m:[39m[48;2;24;38;30m [38;2;101;115;126m# ---------------------------------------------------------------------------[K
[0m[48;2;40;67;43m[39m+     55[0m:[39m[48;2;24;38;30m [38;2;101;115;126mdef all_prescriptions() -> QuerySet[Prescription]:[K
[0m[48;2;40;67;43m[39m+     56[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    return Prescription.objects.select_related([K
[0m[48;2;40;67;43m[39m+     57[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        "treatment",[K
[0m[48;2;40;67;43m[39m+     58[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        "treatment__patient",[K
[0m[48;2;40;67;43m[39m+     59[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        "treatment__doctor",[K
[0m[48;2;40;67;43m[39m+     60[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        "treatment__doctor__user",[K
[0m[48;2;40;67;43m[39m+     61[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        "template",[K
[0m[48;2;40;67;43m[39m+     62[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        "created_by",[K
[0m[48;2;40;67;43m[39m+     63[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    )[K
[0m[48;2;40;67;43m[39m+     64[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     65[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     66[0m:[39m[48;2;24;38;30m [38;2;101;115;126mdef active_prescriptions() -> QuerySet[Prescription]:[K
[0m[48;2;40;67;43m[39m+     67[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    return all_prescriptions().filter(is_active=True)[K
[0m[48;2;40;67;43m[39m+     68[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     69[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     70[0m:[39m[48;2;24;38;30m [38;2;101;115;126mdef prescription_by_id(prescription_id: Any) -> Prescription | None:[K
[0m[48;2;40;67;43m[39m+     71[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    return all_prescriptions().filter(pk=prescription_id).first()[K
[0m[48;2;40;67;43m[39m+     72[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     73[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     74[0m:[39m[48;2;24;38;30m [38;2;101;115;126mdef prescriptions_for_treatment(treatment_id: Any) -> QuerySet[Prescription]:[K
[0m[48;2;40;67;43m[39m+     75[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    return ([K
[0m[48;2;40;67;43m[39m+     76[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        active_prescriptions()[K
[0m[48;2;40;67;43m[39m+     77[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        .filter(treatment_id=treatment_id)[K
[0m[48;2;40;67;43m[39m+     78[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        .order_by("-created_at")[K
[0m[48;2;40;67;43m[39m+     79[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    )[K
[0m[48;2;40;67;43m[39m+     80[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     81[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     82[0m:[39m[48;2;24;38;30m [38;2;101;115;126mdef prescriptions_for_patient(patient_id: Any) -> QuerySet[Prescription]:[K
[0m[48;2;40;67;43m[39m+     83[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    return ([K
[0m[48;2;40;67;43m[39m+     84[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        active_prescriptions()[K
[0m[48;2;40;67;43m[39m+     85[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        .filter(treatment__patient_id=patient_id)[K
[0m[48;2;40;67;43m[39m+     86[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        .order_by("-created_at")[K
[0m[48;2;40;67;43m[39m+     87[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    )[K
[0m[48;2;40;67;43m[39m+     88[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     89[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     90[0m:[39m[48;2;24;38;30m [38;2;101;115;126mdef filter_prescriptions([K
[0m[48;2;40;67;43m[39m+     91[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    *,[K
[0m[48;2;40;67;43m[39m+     92[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    treatment_id: Any = None,[K
[0m[48;2;40;67;43m[39m+     93[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    patient_id: Any = None,[K
[0m[48;2;40;67;43m[39m+     94[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    doctor_id: Any = None,[K
[0m[48;2;40;67;43m[39m+     95[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    is_sent: bool | None = None,[K
[0m[48;2;40;67;43m[39m+     96[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    include_inactive: bool = False,[K
[0m[48;2;40;67;43m[39m+     97[0m:[39m[48;2;24;38;30m [38;2;101;115;126m) -> QuerySet[Prescription]:[K
[0m[48;2;40;67;43m[39m+     98[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    qs = all_prescriptions() if include_inactive else active_prescriptions()[K
[0m[48;2;40;67;43m[39m+     99[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    condition = Q()[K
[0m[48;2;40;67;43m[39m+    100[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    if treatment_id:[K
[0m[48;2;40;67;43m[39m+    101[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        condition &= Q(treatment_id=treatment_id)[K
[0m[48;2;40;67;43m[39m+    102[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    if patient_id:[K
[0m[48;2;40;67;43m[39m+    103[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        condition &= Q(treatment__patient_id=patient_id)[K
[0m[48;2;40;67;43m[39m+    104[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    if doctor_id:[K
[0m[48;2;40;67;43m[39m+    105[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        condition &= Q(treatment__doctor_id=doctor_id)[K
[0m[48;2;40;67;43m[39m+    106[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    if is_sent is True:[K
[0m[48;2;40;67;43m[39m+    107[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        condition &= Q(sent_to_telegram_at__isnull=False)[K
[0m[48;2;40;67;43m[39m+    108[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    elif is_sent is False:[K
[0m[48;2;40;67;43m[39m+    109[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        condition &= Q(sent_to_telegram_at__isnull=True)[K
[0m[48;2;40;67;43m[39m+    110[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    return qs.filter(condition).order_by("-created_at")[K
[0m[48;2;40;67;43m[39m+    111[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    112[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    113[0m:[39m[48;2;24;38;30m [38;2;101;115;126m__all__ = [[K
[0m[48;2;40;67;43m[39m+    114[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    "all_templates",[K
[0m[48;2;40;67;43m[39m+    115[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    "active_templates",[K
[0m[48;2;40;67;43m[39m+    116[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    "template_by_id",[K
[0m[48;2;40;67;43m[39m+    117[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    "templates_for_user",[K
[0m[48;2;40;67;43m[39m+    118[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    "all_prescriptions",[K
[0m[48;2;40;67;43m[39m+    119[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    "active_prescriptions",[K
[0m[48;2;40;67;43m[39m+    120[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    "prescription_by_id",[K
[0m[48;2;40;67;43m[39m+    121[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    "prescriptions_for_treatment",[K
[0m[48;2;40;67;43m[39m+    122[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    "prescriptions_for_patient",[K
[0m[48;2;40;67;43m[39m+    123[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    "filter_prescriptions",[K
[0m[48;2;40;67;43m[39m+    124[0m:[39m[48;2;24;38;30m [38;2;101;115;126m][K
[0m[K
Creating: [38;5;141m/home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/apps/prescriptions/selectors.py[0m
[38;5;244m - Completed in 0.1s[0m

I'll create the following file: [38;5;141m/home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/apps/prescriptions/services.py[0m[38;5;244m (using tool: write)[0m

[48;2;40;67;43m[39m+      1[0m:[39m[48;2;24;38;30m [38;2;101;115;126m"""[38;2;101;115;126mWrite-side business logic for the ``prescriptions`` app.[K
[0m[48;2;40;67;43m[39m+      2[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+      3[0m:[39m[48;2;24;38;30m [38;2;101;115;126mTwo public services:[K
[0m[48;2;40;67;43m[39m+      4[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+      5[0m:[39m[48;2;24;38;30m [38;2;101;115;126m* :func:`create_prescription_template` / :func:`update_prescription_template`[K
[0m[48;2;40;67;43m[39m+      6[0m:[39m[48;2;24;38;30m [38;2;101;115;126m  — CRUD for reusable shablonlar.[K
[0m[48;2;40;67;43m[39m+      7[0m:[39m[48;2;24;38;30m [38;2;101;115;126m* :func:`create_prescription_for_treatment` — issue a retsept for a[K
[0m[48;2;40;67;43m[39m+      8[0m:[39m[48;2;24;38;30m [38;2;101;115;126m  treatment. Handles placeholder substitution and, if[K
[0m[48;2;40;67;43m[39m+      9[0m:[39m[48;2;24;38;30m [38;2;101;115;126m  :func:`send_prescription_via_telegram` is available (T22 telegram_bot[K
[0m[48;2;40;67;43m[39m+     10[0m:[39m[48;2;24;38;30m [38;2;101;115;126m  app), attempts to deliver it. In dev the sender falls back to a[K
[0m[48;2;40;67;43m[39m+     11[0m:[39m[48;2;24;38;30m [38;2;101;115;126m  no-op mock so the endpoint always returns 201.[K
[0m[48;2;40;67;43m[39m+     12[0m:[39m[48;2;24;38;30m [38;2;101;115;126m"""[K
[0m[48;2;40;67;43m[39m+     13[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206m__future__[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206mannotations[K
[0m[48;2;40;67;43m[39m+     14[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     15[0m:[39m[48;2;24;38;30m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206mlogging[K
[0m[48;2;40;67;43m[39m+     16[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206mtyping[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206mAny[K
[0m[48;2;40;67;43m[39m+     17[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     18[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206mdjango[38;2;192;197;206m.[38;2;192;197;206mcontrib[38;2;192;197;206m.[38;2;192;197;206mauth[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206mget_user_model[K
[0m[48;2;40;67;43m[39m+     19[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206mdjango[38;2;192;197;206m.[38;2;192;197;206mcore[38;2;192;197;206m.[38;2;192;197;206mexceptions[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206mValidationError[K
[0m[48;2;40;67;43m[39m+     20[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206mdjango[38;2;192;197;206m.[38;2;192;197;206mdb[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206mtransaction[K
[0m[48;2;40;67;43m[39m+     21[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206mdjango[38;2;192;197;206m.[38;2;192;197;206mutils[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206mtimezone[K
[0m[48;2;40;67;43m[39m+     22[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     23[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206mapps[38;2;192;197;206m.[38;2;192;197;206mtreatments[38;2;192;197;206m.[38;2;192;197;206mmodels[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206mTreatment[K
[0m[48;2;40;67;43m[39m+     24[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     25[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;180;142;173m.[38;2;192;197;206mmodels[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206mPrescription[38;2;192;197;206m,[38;2;192;197;206m [38;2;192;197;206mPrescriptionTemplate[K
[0m[48;2;40;67;43m[39m+     26[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     27[0m:[39m[48;2;24;38;30m [38;2;192;197;206mlogger[38;2;192;197;206m [38;2;192;197;206m=[38;2;192;197;206m [38;2;192;197;206mlogging[38;2;192;197;206m.[38;2;143;161;179mgetLogger[38;2;192;197;206m([38;2;192;197;206m__name__[38;2;192;197;206m)[K
[0m[48;2;40;67;43m[39m+     28[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     29[0m:[39m[48;2;24;38;30m [38;2;192;197;206mUser[38;2;192;197;206m [38;2;192;197;206m=[38;2;192;197;206m [38;2;143;161;179mget_user_model[38;2;192;197;206m([38;2;192;197;206m)[K
[0m[48;2;40;67;43m[39m+     30[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     31[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     32[0m:[39m[48;2;24;38;30m [38;2;101;115;126m#[38;2;101;115;126m ---------------------------------------------------------------------------[K
[0m[48;2;40;67;43m[39m+     33[0m:[39m[48;2;24;38;30m [38;2;101;115;126m# Field cleaners[K
[0m[48;2;40;67;43m[39m+     34[0m:[39m[48;2;24;38;30m [38;2;101;115;126m# ---------------------------------------------------------------------------[K
[0m[48;2;40;67;43m[39m+     35[0m:[39m[48;2;24;38;30m [38;2;101;115;126mdef _clean_text(value: Any, *, max_length: int, field: str, required: bool = True) -> str:[K
[0m[48;2;40;67;43m[39m+     36[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    if value in (None, ""):[K
[0m[48;2;40;67;43m[39m+     37[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        if required:[K
[0m[48;2;40;67;43m[39m+     38[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            raise ValidationError({field: [f"'{field}' majburiy."]})[K
[0m[48;2;40;67;43m[39m+     39[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        return ""[K
[0m[48;2;40;67;43m[39m+     40[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    text = str(value).strip()[K
[0m[48;2;40;67;43m[39m+     41[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    if not text and required:[K
[0m[48;2;40;67;43m[39m+     42[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        raise ValidationError({field: [f"'{field}' bo'sh bo'lishi mumkin emas."]})[K
[0m[48;2;40;67;43m[39m+     43[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    if len(text) > max_length:[K
[0m[48;2;40;67;43m[39m+     44[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        raise ValidationError([K
[0m[48;2;40;67;43m[39m+     45[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            {field: [f"Matn {max_length} belgidan uzun bo'lmasin."]}[K
[0m[48;2;40;67;43m[39m+     46[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        )[K
[0m[48;2;40;67;43m[39m+     47[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    return text[K
[0m[48;2;40;67;43m[39m+     48[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     49[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     50[0m:[39m[48;2;24;38;30m [38;2;101;115;126m# ---------------------------------------------------------------------------[K
[0m[48;2;40;67;43m[39m+     51[0m:[39m[48;2;24;38;30m [38;2;101;115;126m# Template services[K
[0m[48;2;40;67;43m[39m+     52[0m:[39m[48;2;24;38;30m [38;2;101;115;126m# ---------------------------------------------------------------------------[K
[0m[48;2;40;67;43m[39m+     53[0m:[39m[48;2;24;38;30m [38;2;101;115;126m@transaction.atomic[K
[0m[48;2;40;67;43m[39m+     54[0m:[39m[48;2;24;38;30m [38;2;101;115;126mdef create_prescription_template([K
[0m[48;2;40;67;43m[39m+     55[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    *,[K
[0m[48;2;40;67;43m[39m+     56[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    name: str,[K
[0m[48;2;40;67;43m[39m+     57[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    content: str,[K
[0m[48;2;40;67;43m[39m+     58[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    created_by: Any = None,[K
[0m[48;2;40;67;43m[39m+     59[0m:[39m[48;2;24;38;30m [38;2;101;115;126m) -> PrescriptionTemplate:[K
[0m[48;2;40;67;43m[39m+     60[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    clean_name = _clean_text(name, max_length=200, field="name")[K
[0m[48;2;40;67;43m[39m+     61[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    clean_content = _clean_text(content, max_length=20_000, field="content")[K
[0m[48;2;40;67;43m[39m+     62[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     63[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    owner = created_by if isinstance(created_by, User) else None[K
[0m[48;2;40;67;43m[39m+     64[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     65[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    if PrescriptionTemplate.objects.filter([K
[0m[48;2;40;67;43m[39m+     66[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        created_by=owner, name=clean_name, is_active=True[K
[0m[48;2;40;67;43m[39m+     67[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    ).exists():[K
[0m[48;2;40;67;43m[39m+     68[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        raise ValidationError([K
[0m[48;2;40;67;43m[39m+     69[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            {"name": ["Sizda shu nomdagi shablon allaqachon mavjud."]}[K
[0m[48;2;40;67;43m[39m+     70[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        )[K
[0m[48;2;40;67;43m[39m+     71[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     72[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    return PrescriptionTemplate.objects.create([K
[0m[48;2;40;67;43m[39m+     73[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        name=clean_name,[K
[0m[48;2;40;67;43m[39m+     74[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        content=clean_content,[K
[0m[48;2;40;67;43m[39m+     75[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        created_by=owner,[K
[0m[48;2;40;67;43m[39m+     76[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        is_active=True,[K
[0m[48;2;40;67;43m[39m+     77[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    )[K
[0m[48;2;40;67;43m[39m+     78[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     79[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     80[0m:[39m[48;2;24;38;30m [38;2;101;115;126m@transaction.atomic[K
[0m[48;2;40;67;43m[39m+     81[0m:[39m[48;2;24;38;30m [38;2;101;115;126mdef update_prescription_template([K
[0m[48;2;40;67;43m[39m+     82[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    template: PrescriptionTemplate,[K
[0m[48;2;40;67;43m[39m+     83[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    *,[K
[0m[48;2;40;67;43m[39m+     84[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    name: str | None = None,[K
[0m[48;2;40;67;43m[39m+     85[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    content: str | None = None,[K
[0m[48;2;40;67;43m[39m+     86[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    is_active: bool | None = None,[K
[0m[48;2;40;67;43m[39m+     87[0m:[39m[48;2;24;38;30m [38;2;101;115;126m) -> PrescriptionTemplate:[K
[0m[48;2;40;67;43m[39m+     88[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    update_fields: list[str] = [][K
[0m[48;2;40;67;43m[39m+     89[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     90[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    if name is not None:[K
[0m[48;2;40;67;43m[39m+     91[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        new_name = _clean_text(name, max_length=200, field="name")[K
[0m[48;2;40;67;43m[39m+     92[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        if new_name != template.name and PrescriptionTemplate.objects.filter([K
[0m[48;2;40;67;43m[39m+     93[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            created_by=template.created_by, name=new_name, is_active=True[K
[0m[48;2;40;67;43m[39m+     94[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        ).exclude(pk=template.pk).exists():[K
[0m[48;2;40;67;43m[39m+     95[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            raise ValidationError([K
[0m[48;2;40;67;43m[39m+     96[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                {"name": ["Sizda shu nomdagi shablon allaqachon mavjud."]}[K
[0m[48;2;40;67;43m[39m+     97[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            )[K
[0m[48;2;40;67;43m[39m+     98[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        template.name = new_name[K
[0m[48;2;40;67;43m[39m+     99[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        update_fields.append("name")[K
[0m[48;2;40;67;43m[39m+    100[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    101[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    if content is not None:[K
[0m[48;2;40;67;43m[39m+    102[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        template.content = _clean_text([K
[0m[48;2;40;67;43m[39m+    103[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            content, max_length=20_000, field="content"[K
[0m[48;2;40;67;43m[39m+    104[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        )[K
[0m[48;2;40;67;43m[39m+    105[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        update_fields.append("content")[K
[0m[48;2;40;67;43m[39m+    106[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    107[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    if is_active is not None:[K
[0m[48;2;40;67;43m[39m+    108[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        template.is_active = bool(is_active)[K
[0m[48;2;40;67;43m[39m+    109[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        update_fields.append("is_active")[K
[0m[48;2;40;67;43m[39m+    110[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    111[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    if update_fields:[K
[0m[48;2;40;67;43m[39m+    112[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        template.save(update_fields=update_fields + ["updated_at"])[K
[0m[48;2;40;67;43m[39m+    113[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    return template[K
[0m[48;2;40;67;43m[39m+    114[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    115[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    116[0m:[39m[48;2;24;38;30m [38;2;101;115;126m@transaction.atomic[K
[0m[48;2;40;67;43m[39m+    117[0m:[39m[48;2;24;38;30m [38;2;101;115;126mdef soft_delete_template(template: PrescriptionTemplate) -> PrescriptionTemplate:[K
[0m[48;2;40;67;43m[39m+    118[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    if template.is_active:[K
[0m[48;2;40;67;43m[39m+    119[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        template.is_active = False[K
[0m[48;2;40;67;43m[39m+    120[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        template.save(update_fields=["is_active", "updated_at"])[K
[0m[48;2;40;67;43m[39m+    121[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    return template[K
[0m[48;2;40;67;43m[39m+    122[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    123[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    124[0m:[39m[48;2;24;38;30m [38;2;101;115;126m# ---------------------------------------------------------------------------[K
[0m[48;2;40;67;43m[39m+    125[0m:[39m[48;2;24;38;30m [38;2;101;115;126m# Prescription services[K
[0m[48;2;40;67;43m[39m+    126[0m:[39m[48;2;24;38;30m [38;2;101;115;126m# ---------------------------------------------------------------------------[K
[0m[48;2;40;67;43m[39m+    127[0m:[39m[48;2;24;38;30m [38;2;101;115;126mdef _substitute_placeholders(text: str, treatment: Treatment) -> str:[K
[0m[48;2;40;67;43m[39m+    128[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    """Replace {patient_name}, {doctor_name}, {diagnosis} in ``text``."""[K
[0m[48;2;40;67;43m[39m+    129[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    patient = treatment.patient[K
[0m[48;2;40;67;43m[39m+    130[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    doctor = treatment.doctor[K
[0m[48;2;40;67;43m[39m+    131[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    doctor_user = getattr(doctor, "user", None)[K
[0m[48;2;40;67;43m[39m+    132[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    133[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    patient_name = ([K
[0m[48;2;40;67;43m[39m+    134[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        f"{getattr(patient, 'first_name', '') or ''} "[K
[0m[48;2;40;67;43m[39m+    135[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        f"{getattr(patient, 'last_name', '') or ''}"[K
[0m[48;2;40;67;43m[39m+    136[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    ).strip()[K
[0m[48;2;40;67;43m[39m+    137[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    doctor_name = ([K
[0m[48;2;40;67;43m[39m+    138[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        f"{getattr(doctor_user, 'first_name', '') or ''} "[K
[0m[48;2;40;67;43m[39m+    139[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        f"{getattr(doctor_user, 'last_name', '') or ''}"[K
[0m[48;2;40;67;43m[39m+    140[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    ).strip()[K
[0m[48;2;40;67;43m[39m+    141[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    142[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    replacements = {[K
[0m[48;2;40;67;43m[39m+    143[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        "{patient_name}": patient_name or "Bemor",[K
[0m[48;2;40;67;43m[39m+    144[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        "{doctor_name}": doctor_name or "Shifokor",[K
[0m[48;2;40;67;43m[39m+    145[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        "{diagnosis}": treatment.diagnosis or "",[K
[0m[48;2;40;67;43m[39m+    146[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    }[K
[0m[48;2;40;67;43m[39m+    147[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    for placeholder, value in replacements.items():[K
[0m[48;2;40;67;43m[39m+    148[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        text = text.replace(placeholder, value)[K
[0m[48;2;40;67;43m[39m+    149[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    return text[K
[0m[48;2;40;67;43m[39m+    150[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    151[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    152[0m:[39m[48;2;24;38;30m [38;2;101;115;126mdef _send_via_telegram(prescription: Prescription) -> bool:[K
[0m[48;2;40;67;43m[39m+    153[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    """Attempt to deliver ``prescription`` through Telegram.[K
[0m[48;2;40;67;43m[39m+    154[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    155[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    Import is deferred so the prescriptions app doesn't depend on the[K
[0m[48;2;40;67;43m[39m+    156[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    telegram_bot app existing (it comes online in T22). If the[K
[0m[48;2;40;67;43m[39m+    157[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    telegram_bot sender is missing OR the patient has no[K
[0m[48;2;40;67;43m[39m+    158[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    ``telegram_chat_id`` we return ``False`` and the caller records[K
[0m[48;2;40;67;43m[39m+    159[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    ``sent_to_telegram_at`` accordingly.[K
[0m[48;2;40;67;43m[39m+    160[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    161[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    In dev / test the real bot is stubbed, so this function is safe to[K
[0m[48;2;40;67;43m[39m+    162[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    call from any environment.[K
[0m[48;2;40;67;43m[39m+    163[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    """[K
[0m[48;2;40;67;43m[39m+    164[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    treatment = prescription.treatment[K
[0m[48;2;40;67;43m[39m+    165[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    patient = treatment.patient[K
[0m[48;2;40;67;43m[39m+    166[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    chat_id = getattr(patient, "telegram_chat_id", None)[K
[0m[48;2;40;67;43m[39m+    167[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    if not chat_id:[K
[0m[48;2;40;67;43m[39m+    168[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        return False[K
[0m[48;2;40;67;43m[39m+    169[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    170[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    try:[K
[0m[48;2;40;67;43m[39m+    171[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        from apps.telegram_bot.services import send_prescription  # type: ignore[import-not-found][K
[0m[48;2;40;67;43m[39m+    172[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    except Exception:  # noqa: BLE001 - app not installed yet[K
[0m[48;2;40;67;43m[39m+    173[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        logger.info([K
[0m[48;2;40;67;43m[39m+    174[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            "telegram_bot app not available; skipping delivery for %s",[K
[0m[48;2;40;67;43m[39m+    175[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            prescription.pk,[K
[0m[48;2;40;67;43m[39m+    176[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        )[K
[0m[48;2;40;67;43m[39m+    177[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        return False[K
[0m[48;2;40;67;43m[39m+    178[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    179[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    try:[K
[0m[48;2;40;67;43m[39m+    180[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        send_prescription(chat_id=chat_id, content=prescription.content)[K
[0m[48;2;40;67;43m[39m+    181[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    except Exception:  # noqa: BLE001 - never surface bot errors to caller[K
[0m[48;2;40;67;43m[39m+    182[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        logger.exception("Telegram delivery failed for prescription %s", prescription.pk)[K
[0m[48;2;40;67;43m[39m+    183[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        return False[K
[0m[48;2;40;67;43m[39m+    184[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    return True[K
[0m[48;2;40;67;43m[39m+    185[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    186[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    187[0m:[39m[48;2;24;38;30m [38;2;101;115;126m@transaction.atomic[K
[0m[48;2;40;67;43m[39m+    188[0m:[39m[48;2;24;38;30m [38;2;101;115;126mdef create_prescription_for_treatment([K
[0m[48;2;40;67;43m[39m+    189[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    *,[K
[0m[48;2;40;67;43m[39m+    190[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    treatment: Treatment,[K
[0m[48;2;40;67;43m[39m+    191[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    template: PrescriptionTemplate | Any = None,[K
[0m[48;2;40;67;43m[39m+    192[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    content: str | None = None,[K
[0m[48;2;40;67;43m[39m+    193[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    created_by: Any = None,[K
[0m[48;2;40;67;43m[39m+    194[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    send: bool = True,[K
[0m[48;2;40;67;43m[39m+    195[0m:[39m[48;2;24;38;30m [38;2;101;115;126m) -> Prescription:[K
[0m[48;2;40;67;43m[39m+    196[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    """Create a retsept for ``treatment`` and (optionally) send via Telegram.[K
[0m[48;2;40;67;43m[39m+    197[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    198[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    * If ``content`` is given it is used verbatim (after placeholder[K
[0m[48;2;40;67;43m[39m+    199[0m:[39m[48;2;24;38;30m [38;2;101;115;126m      substitution).[K
[0m[48;2;40;67;43m[39m+    200[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    * Otherwise ``template.content`` is used. Passing neither raises[K
[0m[48;2;40;67;43m[39m+    201[0m:[39m[48;2;24;38;30m [38;2;101;115;126m      :class:`ValidationError`.[K
[0m[48;2;40;67;43m[39m+    202[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    * ``sent_to_telegram_at`` is set only when the send actually[K
[0m[48;2;40;67;43m[39m+    203[0m:[39m[48;2;24;38;30m [38;2;101;115;126m      succeeds; a missing bot or missing chat_id leaves it ``None``[K
[0m[48;2;40;67;43m[39m+    204[0m:[39m[48;2;24;38;30m [38;2;101;115;126m      but the retsept is still stored.[K
[0m[48;2;40;67;43m[39m+    205[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    """[K
[0m[48;2;40;67;43m[39m+    206[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    if template is not None and not isinstance(template, PrescriptionTemplate):[K
[0m[48;2;40;67;43m[39m+    207[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        try:[K
[0m[48;2;40;67;43m[39m+    208[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            template = PrescriptionTemplate.objects.get(pk=template, is_active=True)[K
[0m[48;2;40;67;43m[39m+    209[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        except PrescriptionTemplate.DoesNotExist as exc:[K
[0m[48;2;40;67;43m[39m+    210[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            raise ValidationError({"template": ["Shablon topilmadi."]}) from exc[K
[0m[48;2;40;67;43m[39m+    211[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    212[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    raw_content = content if content not in (None, "") else ([K
[0m[48;2;40;67;43m[39m+    213[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        template.content if template is not None else None[K
[0m[48;2;40;67;43m[39m+    214[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    )[K
[0m[48;2;40;67;43m[39m+    215[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    if not raw_content:[K
[0m[48;2;40;67;43m[39m+    216[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        raise ValidationError([K
[0m[48;2;40;67;43m[39m+    217[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            {"content": ["'content' yoki 'template' kiritilishi shart."]}[K
[0m[48;2;40;67;43m[39m+    218[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        )[K
[0m[48;2;40;67;43m[39m+    219[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    220[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    final_content = _substitute_placeholders([K
[0m[48;2;40;67;43m[39m+    221[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        _clean_text(raw_content, max_length=20_000, field="content"),[K
[0m[48;2;40;67;43m[39m+    222[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        treatment,[K
[0m[48;2;40;67;43m[39m+    223[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    )[K
[0m[48;2;40;67;43m[39m+    224[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    225[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    owner = created_by if isinstance(created_by, User) else None[K
[0m[48;2;40;67;43m[39m+    226[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    227[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    prescription = Prescription.objects.create([K
[0m[48;2;40;67;43m[39m+    228[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        treatment=treatment,[K
[0m[48;2;40;67;43m[39m+    229[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        template=template,[K
[0m[48;2;40;67;43m[39m+    230[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        content=final_content,[K
[0m[48;2;40;67;43m[39m+    231[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        sent_to_telegram_at=None,[K
[0m[48;2;40;67;43m[39m+    232[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        created_by=owner,[K
[0m[48;2;40;67;43m[39m+    233[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        is_active=True,[K
[0m[48;2;40;67;43m[39m+    234[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    )[K
[0m[48;2;40;67;43m[39m+    235[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    236[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    if send and _send_via_telegram(prescription):[K
[0m[48;2;40;67;43m[39m+    237[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        prescription.sent_to_telegram_at = timezone.now()[K
[0m[48;2;40;67;43m[39m+    238[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        prescription.save([K
[0m[48;2;40;67;43m[39m+    239[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            update_fields=["sent_to_telegram_at", "updated_at"][K
[0m[48;2;40;67;43m[39m+    240[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        )[K
[0m[48;2;40;67;43m[39m+    241[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    242[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    return prescription[K
[0m[48;2;40;67;43m[39m+    243[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    244[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    245[0m:[39m[48;2;24;38;30m [38;2;101;115;126m@transaction.atomic[K
[0m[48;2;40;67;43m[39m+    246[0m:[39m[48;2;24;38;30m [38;2;101;115;126mdef mark_prescription_sent(prescription: Prescription) -> Prescription:[K
[0m[48;2;40;67;43m[39m+    247[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    """Manually flag a retsept as sent (used by admin actions / retries)."""[K
[0m[48;2;40;67;43m[39m+    248[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    if prescription.sent_to_telegram_at is None:[K
[0m[48;2;40;67;43m[39m+    249[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        prescription.sent_to_telegram_at = timezone.now()[K
[0m[48;2;40;67;43m[39m+    250[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        prescription.save([K
[0m[48;2;40;67;43m[39m+    251[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            update_fields=["sent_to_telegram_at", "updated_at"][K
[0m[48;2;40;67;43m[39m+    252[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        )[K
[0m[48;2;40;67;43m[39m+    253[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    return prescription[K
[0m[48;2;40;67;43m[39m+    254[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    255[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    256[0m:[39m[48;2;24;38;30m [38;2;101;115;126m@transaction.atomic[K
[0m[48;2;40;67;43m[39m+    257[0m:[39m[48;2;24;38;30m [38;2;101;115;126mdef soft_delete_prescription(prescription: Prescription) -> Prescription:[K
[0m[48;2;40;67;43m[39m+    258[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    if prescription.is_active:[K
[0m[48;2;40;67;43m[39m+    259[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        prescription.is_active = False[K
[0m[48;2;40;67;43m[39m+    260[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        prescription.save(update_fields=["is_active", "updated_at"])[K
[0m[48;2;40;67;43m[39m+    261[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    return prescription[K
[0m[48;2;40;67;43m[39m+    262[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    263[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    264[0m:[39m[48;2;24;38;30m [38;2;101;115;126m__all__ = [[K
[0m[48;2;40;67;43m[39m+    265[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    "create_prescription_template",[K
[0m[48;2;40;67;43m[39m+    266[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    "update_prescription_template",[K
[0m[48;2;40;67;43m[39m+    267[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    "soft_delete_template",[K
[0m[48;2;40;67;43m[39m+    268[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    "create_prescription_for_treatment",[K
[0m[48;2;40;67;43m[39m+    269[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    "mark_prescription_sent",[K
[0m[48;2;40;67;43m[39m+    270[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    "soft_delete_prescription",[K
[0m[48;2;40;67;43m[39m+    271[0m:[39m[48;2;24;38;30m [38;2;101;115;126m][K
[0m[K
Creating: [38;5;141m/home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/apps/prescriptions/services.py[0m
[38;5;244m - Completed in 0.0s[0m

I'll create the following file: [38;5;141m/home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/apps/prescriptions/permissions.py[0m[38;5;244m (using tool: write)[0m

[48;2;40;67;43m[39m+      1[0m:[39m[48;2;24;38;30m [38;2;101;115;126m"""[38;2;101;115;126mPermission classes for the ``prescriptions`` app.[K
[0m[48;2;40;67;43m[39m+      2[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+      3[0m:[39m[48;2;24;38;30m [38;2;101;115;126mRules (PROJECT_BRIEF § "RBAC"):[K
[0m[48;2;40;67;43m[39m+      4[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+      5[0m:[39m[48;2;24;38;30m [38;2;101;115;126m* Templates (list/read/write):[K
[0m[48;2;40;67;43m[39m+      6[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    - ``bosh_shifokor`` — full CRUD.[K
[0m[48;2;40;67;43m[39m+      7[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    - ``doctor`` — full CRUD, own templates only for delete/update.[K
[0m[48;2;40;67;43m[39m+      8[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    - ``administrator`` — read-only.[K
[0m[48;2;40;67;43m[39m+      9[0m:[39m[48;2;24;38;30m [38;2;101;115;126m* Prescriptions (issued retseptlar):[K
[0m[48;2;40;67;43m[39m+     10[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    - ``bosh_shifokor`` — full access.[K
[0m[48;2;40;67;43m[39m+     11[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    - ``doctor`` — own treatments only (unless can_view_other_doctors).[K
[0m[48;2;40;67;43m[39m+     12[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    - ``administrator`` — read-only.[K
[0m[48;2;40;67;43m[39m+     13[0m:[39m[48;2;24;38;30m [38;2;101;115;126m"""[K
[0m[48;2;40;67;43m[39m+     14[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206m__future__[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206mannotations[K
[0m[48;2;40;67;43m[39m+     15[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     16[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206mtyping[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206mAny[K
[0m[48;2;40;67;43m[39m+     17[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     18[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206mrest_framework[38;2;192;197;206m.[38;2;192;197;206mpermissions[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206mBasePermission[K
[0m[48;2;40;67;43m[39m+     19[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206mrest_framework[38;2;192;197;206m.[38;2;192;197;206mrequest[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206mRequest[K
[0m[48;2;40;67;43m[39m+     20[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     21[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206mapps[38;2;192;197;206m.[38;2;192;197;206mcore[38;2;192;197;206m.[38;2;192;197;206mpermissions[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206m([K
[0m[48;2;40;67;43m[39m+     22[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;191;97;106mALL_ROLES[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+     23[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;191;97;106mROLE_ADMINISTRATOR[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+     24[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;191;97;106mROLE_BOSH_SHIFOKOR[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+     25[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;191;97;106mROLE_DOCTOR[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+     26[0m:[39m[48;2;24;38;30m [38;2;192;197;206m)[K
[0m[48;2;40;67;43m[39m+     27[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     28[0m:[39m[48;2;24;38;30m [38;2;191;97;106mSAFE_METHODS[38;2;192;197;206m [38;2;192;197;206m=[38;2;192;197;206m [38;2;192;197;206mfrozenset[38;2;192;197;206m([38;2;192;197;206m{[38;2;192;197;206m"[38;2;163;190;140mGET[38;2;192;197;206m"[38;2;192;197;206m,[38;2;192;197;206m [38;2;192;197;206m"[38;2;163;190;140mHEAD[38;2;192;197;206m"[38;2;192;197;206m,[38;2;192;197;206m [38;2;192;197;206m"[38;2;163;190;140mOPTIONS[38;2;192;197;206m"[38;2;192;197;206m}[38;2;192;197;206m)[K
[0m[48;2;40;67;43m[39m+     29[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     30[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     31[0m:[39m[48;2;24;38;30m [38;2;180;142;173mclass[38;2;239;241;245m [38;2;235;203;139mPrescriptionTemplatePermission[38;2;239;241;245m([38;2;163;190;140mBasePermission[38;2;239;241;245m)[38;2;239;241;245m:[K
[0m[48;2;40;67;43m[39m+     32[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;101;115;126m"""[38;2;101;115;126mPermission for the ``PrescriptionTemplateViewSet``.[38;2;101;115;126m"""[K
[0m[48;2;40;67;43m[39m+     33[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     34[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;192;197;206mmessage[38;2;192;197;206m [38;2;192;197;206m=[38;2;192;197;206m [38;2;192;197;206m([K
[0m[48;2;40;67;43m[39m+     35[0m:[39m[48;2;24;38;30m [38;2;192;197;206m        [38;2;192;197;206m"[38;2;163;190;140mFaqat bosh shifokor va shifokor retsept shablonlarini [38;2;192;197;206m"[K
[0m[48;2;40;67;43m[39m+     36[0m:[39m[48;2;24;38;30m [38;2;192;197;206m        [38;2;192;197;206m"[38;2;163;190;140myaratishi/tahrirlashi mumkin.[38;2;192;197;206m"[K
[0m[48;2;40;67;43m[39m+     37[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;192;197;206m)[K
[0m[48;2;40;67;43m[39m+     38[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     39[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;180;142;173mdef[38;2;192;197;206m [38;2;143;161;179mhas_permission[38;2;192;197;206m([38;2;191;97;106mself[38;2;192;197;206m,[38;2;192;197;206m [38;2;191;97;106mrequest[38;2;192;197;206m:[38;2;192;197;206m [38;2;192;197;206mRequest[38;2;192;197;206m,[38;2;192;197;206m [38;2;191;97;106mview[38;2;192;197;206m:[38;2;192;197;206m [38;2;192;197;206mAny[38;2;192;197;206m)[38;2;192;197;206m [38;2;192;197;206m->[38;2;192;197;206m [38;2;192;197;206mbool[38;2;192;197;206m:[K
[0m[48;2;40;67;43m[39m+     40[0m:[39m[48;2;24;38;30m [38;2;192;197;206m        [38;2;192;197;206muser[38;2;192;197;206m [38;2;192;197;206m=[38;2;192;197;206m [38;2;150;181;180mgetattr[38;2;192;197;206m([38;2;192;197;206mrequest[38;2;192;197;206m,[38;2;192;197;206m [38;2;192;197;206m"[38;2;163;190;140muser[38;2;192;197;206m"[38;2;192;197;206m,[38;2;192;197;206m [38;2;208;135;112mNone[38;2;192;197;206m)[K
[0m[48;2;40;67;43m[39m+     41[0m:[39m[48;2;24;38;30m [38;2;192;197;206m        [38;2;180;142;173mif[38;2;192;197;206m [38;2;192;197;206muser[38;2;192;197;206m [38;2;192;197;206mis[38;2;192;197;206m [38;2;208;135;112mNone[38;2;192;197;206m [38;2;192;197;206mor[38;2;192;197;206m [38;2;192;197;206mnot[38;2;192;197;206m [38;2;150;181;180mgetattr[38;2;192;197;206m([38;2;192;197;206muser[38;2;192;197;206m,[38;2;192;197;206m [38;2;192;197;206m"[38;2;163;190;140mis_authenticated[38;2;192;197;206m"[38;2;192;197;206m,[38;2;192;197;206m [38;2;208;135;112mFalse[38;2;192;197;206m)[38;2;192;197;206m:[K
[0m[48;2;40;67;43m[39m+     42[0m:[39m[48;2;24;38;30m [38;2;192;197;206m            [38;2;180;142;173mreturn[38;2;192;197;206m [38;2;208;135;112mFalse[K
[0m[48;2;40;67;43m[39m+     43[0m:[39m[48;2;24;38;30m [38;2;192;197;206m        [38;2;192;197;206mrole[38;2;192;197;206m [38;2;192;197;206m=[38;2;192;197;206m [38;2;150;181;180mgetattr[38;2;192;197;206m([38;2;192;197;206muser[38;2;192;197;206m,[38;2;192;197;206m [38;2;192;197;206m"[38;2;163;190;140mrole[38;2;192;197;206m"[38;2;192;197;206m,[38;2;192;197;206m [38;2;208;135;112mNone[38;2;192;197;206m)[K
[0m[48;2;40;67;43m[39m+     44[0m:[39m[48;2;24;38;30m [38;2;192;197;206m        [38;2;180;142;173mif[38;2;192;197;206m [38;2;192;197;206mrole[38;2;192;197;206m [38;2;192;197;206mnot[38;2;192;197;206m [38;2;192;197;206min[38;2;192;197;206m [38;2;191;97;106mALL_ROLES[38;2;192;197;206m:[K
[0m[48;2;40;67;43m[39m+     45[0m:[39m[48;2;24;38;30m [38;2;192;197;206m            [38;2;180;142;173mreturn[38;2;192;197;206m [38;2;208;135;112mFalse[K
[0m[48;2;40;67;43m[39m+     46[0m:[39m[48;2;24;38;30m [38;2;192;197;206m        [38;2;180;142;173mif[38;2;192;197;206m [38;2;192;197;206mrequest[38;2;192;197;206m.[38;2;192;197;206mmethod[38;2;192;197;206m [38;2;192;197;206min[38;2;192;197;206m [38;2;191;97;106mSAFE_METHODS[38;2;192;197;206m:[K
[0m[48;2;40;67;43m[39m+     47[0m:[39m[48;2;24;38;30m [38;2;192;197;206m            [38;2;180;142;173mreturn[38;2;192;197;206m [38;2;208;135;112mTrue[K
[0m[48;2;40;67;43m[39m+     48[0m:[39m[48;2;24;38;30m [38;2;192;197;206m        [38;2;101;115;126m#[38;2;101;115;126m Writes: administrator excluded.[K
[0m[48;2;40;67;43m[39m+     49[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        return role in {ROLE_BOSH_SHIFOKOR, ROLE_DOCTOR}[K
[0m[48;2;40;67;43m[39m+     50[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     51[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    def has_object_permission(self, request: Request, view: Any, obj: Any) -> bool:[K
[0m[48;2;40;67;43m[39m+     52[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        user = request.user[K
[0m[48;2;40;67;43m[39m+     53[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        role = getattr(user, "role", None)[K
[0m[48;2;40;67;43m[39m+     54[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     55[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        if role == ROLE_BOSH_SHIFOKOR:[K
[0m[48;2;40;67;43m[39m+     56[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            return True[K
[0m[48;2;40;67;43m[39m+     57[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     58[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        if request.method in SAFE_METHODS:[K
[0m[48;2;40;67;43m[39m+     59[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            return role in ALL_ROLES[K
[0m[48;2;40;67;43m[39m+     60[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     61[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        # Writes: doctor may modify only own templates.[K
[0m[48;2;40;67;43m[39m+     62[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        if role == ROLE_DOCTOR:[K
[0m[48;2;40;67;43m[39m+     63[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            return getattr(obj, "created_by_id", None) == getattr(user, "id", None)[K
[0m[48;2;40;67;43m[39m+     64[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     65[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        return False[K
[0m[48;2;40;67;43m[39m+     66[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     67[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     68[0m:[39m[48;2;24;38;30m [38;2;101;115;126mclass PrescriptionPermission(BasePermission):[K
[0m[48;2;40;67;43m[39m+     69[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    """Permission for the ``PrescriptionViewSet`` and the create-on-treatment action."""[K
[0m[48;2;40;67;43m[39m+     70[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     71[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    message = ([K
[0m[48;2;40;67;43m[39m+     72[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        "Faqat bosh shifokor yoki tegishli shifokor retsept berishi mumkin."[K
[0m[48;2;40;67;43m[39m+     73[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    )[K
[0m[48;2;40;67;43m[39m+     74[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     75[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    def has_permission(self, request: Request, view: Any) -> bool:[K
[0m[48;2;40;67;43m[39m+     76[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        user = getattr(request, "user", None)[K
[0m[48;2;40;67;43m[39m+     77[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        if user is None or not getattr(user, "is_authenticated", False):[K
[0m[48;2;40;67;43m[39m+     78[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            return False[K
[0m[48;2;40;67;43m[39m+     79[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        role = getattr(user, "role", None)[K
[0m[48;2;40;67;43m[39m+     80[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        if role not in ALL_ROLES:[K
[0m[48;2;40;67;43m[39m+     81[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            return False[K
[0m[48;2;40;67;43m[39m+     82[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        if request.method in SAFE_METHODS:[K
[0m[48;2;40;67;43m[39m+     83[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            return True[K
[0m[48;2;40;67;43m[39m+     84[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        # Writes: administrator excluded.[K
[0m[48;2;40;67;43m[39m+     85[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        return role in {ROLE_BOSH_SHIFOKOR, ROLE_DOCTOR}[K
[0m[48;2;40;67;43m[39m+     86[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     87[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    def has_object_permission(self, request: Request, view: Any, obj: Any) -> bool:[K
[0m[48;2;40;67;43m[39m+     88[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        user = request.user[K
[0m[48;2;40;67;43m[39m+     89[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        role = getattr(user, "role", None)[K
[0m[48;2;40;67;43m[39m+     90[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     91[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        if role == ROLE_BOSH_SHIFOKOR:[K
[0m[48;2;40;67;43m[39m+     92[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            return True[K
[0m[48;2;40;67;43m[39m+     93[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     94[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        doctor = self._resolve_owner_doctor(obj)[K
[0m[48;2;40;67;43m[39m+     95[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     96[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        if role == ROLE_DOCTOR:[K
[0m[48;2;40;67;43m[39m+     97[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            if doctor is None:[K
[0m[48;2;40;67;43m[39m+     98[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                return False[K
[0m[48;2;40;67;43m[39m+     99[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            if getattr(doctor, "user_id", None) == getattr(user, "id", None):[K
[0m[48;2;40;67;43m[39m+    100[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                return True[K
[0m[48;2;40;67;43m[39m+    101[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            if request.method in SAFE_METHODS:[K
[0m[48;2;40;67;43m[39m+    102[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                profile = getattr(user, "doctor_profile", None)[K
[0m[48;2;40;67;43m[39m+    103[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                return bool(getattr(profile, "can_view_other_doctors", False))[K
[0m[48;2;40;67;43m[39m+    104[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            return False[K
[0m[48;2;40;67;43m[39m+    105[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    106[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        if role == ROLE_ADMINISTRATOR:[K
[0m[48;2;40;67;43m[39m+    107[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            return request.method in SAFE_METHODS[K
[0m[48;2;40;67;43m[39m+    108[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    109[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        return False[K
[0m[48;2;40;67;43m[39m+    110[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    111[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    @staticmethod[K
[0m[48;2;40;67;43m[39m+    112[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    def _resolve_owner_doctor(obj: Any) -> Any:[K
[0m[48;2;40;67;43m[39m+    113[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        """Return the DoctorProfile owning ``obj`` (Prescription or Treatment)."""[K
[0m[48;2;40;67;43m[39m+    114[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        if obj is None:[K
[0m[48;2;40;67;43m[39m+    115[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            return None[K
[0m[48;2;40;67;43m[39m+    116[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        # Direct Treatment[K
[0m[48;2;40;67;43m[39m+    117[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        doctor = getattr(obj, "doctor", None)[K
[0m[48;2;40;67;43m[39m+    118[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        if doctor is not None and hasattr(doctor, "user_id"):[K
[0m[48;2;40;67;43m[39m+    119[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            return doctor[K
[0m[48;2;40;67;43m[39m+    120[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        # Prescription → treatment.doctor[K
[0m[48;2;40;67;43m[39m+    121[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        treatment = getattr(obj, "treatment", None)[K
[0m[48;2;40;67;43m[39m+    122[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        if treatment is not None:[K
[0m[48;2;40;67;43m[39m+    123[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            return getattr(treatment, "doctor", None)[K
[0m[48;2;40;67;43m[39m+    124[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        return None[K
[0m[48;2;40;67;43m[39m+    125[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    126[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    127[0m:[39m[48;2;24;38;30m [38;2;101;115;126m__all__ = [[K
[0m[48;2;40;67;43m[39m+    128[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    "PrescriptionTemplatePermission",[K
[0m[48;2;40;67;43m[39m+    129[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    "PrescriptionPermission",[K
[0m[48;2;40;67;43m[39m+    130[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    "SAFE_METHODS",[K
[0m[48;2;40;67;43m[39m+    131[0m:[39m[48;2;24;38;30m [38;2;101;115;126m][K
[0m[K
Creating: [38;5;141m/home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/apps/prescriptions/permissions.py[0m
[38;5;244m - Completed in 0.0s[0m

I'll create the following file: [38;5;141m/home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/apps/prescriptions/serializers.py[0m[38;5;244m (using tool: write)[0m

[48;2;40;67;43m[39m+      1[0m:[39m[48;2;24;38;30m [38;2;101;115;126m"""[38;2;101;115;126mDRF serializers for the ``prescriptions`` app.[K
[0m[48;2;40;67;43m[39m+      2[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+      3[0m:[39m[48;2;24;38;30m [38;2;101;115;126mResponse payloads are camelCase to match the frontend. Input accepts[K
[0m[48;2;40;67;43m[39m+      4[0m:[39m[48;2;24;38;30m [38;2;101;115;126meither snake_case or camelCase.[K
[0m[48;2;40;67;43m[39m+      5[0m:[39m[48;2;24;38;30m [38;2;101;115;126m"""[K
[0m[48;2;40;67;43m[39m+      6[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206m__future__[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206mannotations[K
[0m[48;2;40;67;43m[39m+      7[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+      8[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206mtyping[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206mAny[K
[0m[48;2;40;67;43m[39m+      9[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     10[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206mdjango[38;2;192;197;206m.[38;2;192;197;206mcore[38;2;192;197;206m.[38;2;192;197;206mexceptions[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206mValidationError[38;2;192;197;206m [38;2;180;142;173mas[38;2;192;197;206m [38;2;192;197;206mDjangoValidationError[K
[0m[48;2;40;67;43m[39m+     11[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206mrest_framework[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206mserializers[K
[0m[48;2;40;67;43m[39m+     12[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     13[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;180;142;173m.[38;2;192;197;206mmodels[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206mPrescription[38;2;192;197;206m,[38;2;192;197;206m [38;2;192;197;206mPrescriptionTemplate[K
[0m[48;2;40;67;43m[39m+     14[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;180;142;173m.[38;2;192;197;206mservices[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206m([K
[0m[48;2;40;67;43m[39m+     15[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;192;197;206mcreate_prescription_for_treatment[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+     16[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;192;197;206mcreate_prescription_template[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+     17[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;192;197;206mupdate_prescription_template[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+     18[0m:[39m[48;2;24;38;30m [38;2;192;197;206m)[K
[0m[48;2;40;67;43m[39m+     19[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     20[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     21[0m:[39m[48;2;24;38;30m [38;2;180;142;173mdef[38;2;192;197;206m [38;2;143;161;179m_camel_user[38;2;192;197;206m([38;2;191;97;106muser[38;2;192;197;206m:[38;2;192;197;206m [38;2;192;197;206mAny[38;2;192;197;206m)[38;2;192;197;206m [38;2;192;197;206m->[38;2;192;197;206m [38;2;192;197;206mdict[38;2;192;197;206m[[38;2;192;197;206mstr[38;2;192;197;206m, [38;2;192;197;206mAny[38;2;192;197;206m][38;2;192;197;206m [38;2;192;197;206m|[38;2;192;197;206m [38;2;208;135;112mNone[38;2;192;197;206m:[K
[0m[48;2;40;67;43m[39m+     22[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;180;142;173mif[38;2;192;197;206m [38;2;192;197;206muser[38;2;192;197;206m [38;2;192;197;206mis[38;2;192;197;206m [38;2;208;135;112mNone[38;2;192;197;206m:[K
[0m[48;2;40;67;43m[39m+     23[0m:[39m[48;2;24;38;30m [38;2;192;197;206m        [38;2;180;142;173mreturn[38;2;192;197;206m [38;2;208;135;112mNone[K
[0m[48;2;40;67;43m[39m+     24[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;180;142;173mreturn[38;2;192;197;206m [38;2;192;197;206m{[K
[0m[48;2;40;67;43m[39m+     25[0m:[39m[48;2;24;38;30m [38;2;192;197;206m        [38;2;192;197;206m"[38;2;163;190;140mid[38;2;192;197;206m"[38;2;192;197;206m:[38;2;192;197;206m [38;2;192;197;206mstr[38;2;192;197;206m([38;2;192;197;206muser[38;2;192;197;206m.[38;2;192;197;206mpk[38;2;192;197;206m)[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+     26[0m:[39m[48;2;24;38;30m [38;2;192;197;206m        [38;2;192;197;206m"[38;2;163;190;140mfirstName[38;2;192;197;206m"[38;2;192;197;206m:[38;2;192;197;206m [38;2;150;181;180mgetattr[38;2;192;197;206m([38;2;192;197;206muser[38;2;192;197;206m,[38;2;192;197;206m [38;2;192;197;206m"[38;2;163;190;140mfirst_name[38;2;192;197;206m"[38;2;192;197;206m,[38;2;192;197;206m [38;2;192;197;206m"[38;2;192;197;206m"[38;2;192;197;206m)[38;2;192;197;206m [38;2;192;197;206mor[38;2;192;197;206m [38;2;192;197;206m"[38;2;192;197;206m"[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+     27[0m:[39m[48;2;24;38;30m [38;2;192;197;206m        [38;2;192;197;206m"[38;2;163;190;140mlastName[38;2;192;197;206m"[38;2;192;197;206m:[38;2;192;197;206m [38;2;150;181;180mgetattr[38;2;192;197;206m([38;2;192;197;206muser[38;2;192;197;206m,[38;2;192;197;206m [38;2;192;197;206m"[38;2;163;190;140mlast_name[38;2;192;197;206m"[38;2;192;197;206m,[38;2;192;197;206m [38;2;192;197;206m"[38;2;192;197;206m"[38;2;192;197;206m)[38;2;192;197;206m [38;2;192;197;206mor[38;2;192;197;206m [38;2;192;197;206m"[38;2;192;197;206m"[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+     28[0m:[39m[48;2;24;38;30m [38;2;192;197;206m        [38;2;192;197;206m"[38;2;163;190;140mphoneNumber[38;2;192;197;206m"[38;2;192;197;206m:[38;2;192;197;206m [38;2;150;181;180mgetattr[38;2;192;197;206m([38;2;192;197;206muser[38;2;192;197;206m,[38;2;192;197;206m [38;2;192;197;206m"[38;2;163;190;140mphone_number[38;2;192;197;206m"[38;2;192;197;206m,[38;2;192;197;206m [38;2;192;197;206m"[38;2;192;197;206m"[38;2;192;197;206m)[38;2;192;197;206m [38;2;192;197;206mor[38;2;192;197;206m [38;2;192;197;206m"[38;2;192;197;206m"[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+     29[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;192;197;206m}[K
[0m[48;2;40;67;43m[39m+     30[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     31[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     32[0m:[39m[48;2;24;38;30m [38;2;180;142;173mdef[38;2;192;197;206m [38;2;143;161;179m_camel_patient[38;2;192;197;206m([38;2;191;97;106mpatient[38;2;192;197;206m:[38;2;192;197;206m [38;2;192;197;206mAny[38;2;192;197;206m)[38;2;192;197;206m [38;2;192;197;206m->[38;2;192;197;206m [38;2;192;197;206mdict[38;2;192;197;206m[[38;2;192;197;206mstr[38;2;192;197;206m, [38;2;192;197;206mAny[38;2;192;197;206m][38;2;192;197;206m [38;2;192;197;206m|[38;2;192;197;206m [38;2;208;135;112mNone[38;2;192;197;206m:[K
[0m[48;2;40;67;43m[39m+     33[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;180;142;173mif[38;2;192;197;206m [38;2;192;197;206mpatient[38;2;192;197;206m [38;2;192;197;206mis[38;2;192;197;206m [38;2;208;135;112mNone[38;2;192;197;206m:[K
[0m[48;2;40;67;43m[39m+     34[0m:[39m[48;2;24;38;30m [38;2;192;197;206m        [38;2;180;142;173mreturn[38;2;192;197;206m [38;2;208;135;112mNone[K
[0m[48;2;40;67;43m[39m+     35[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;180;142;173mreturn[38;2;192;197;206m [38;2;192;197;206m{[K
[0m[48;2;40;67;43m[39m+     36[0m:[39m[48;2;24;38;30m [38;2;192;197;206m        [38;2;192;197;206m"[38;2;163;190;140mid[38;2;192;197;206m"[38;2;192;197;206m:[38;2;192;197;206m [38;2;192;197;206mstr[38;2;192;197;206m([38;2;192;197;206mpatient[38;2;192;197;206m.[38;2;192;197;206mpk[38;2;192;197;206m)[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+     37[0m:[39m[48;2;24;38;30m [38;2;192;197;206m        [38;2;192;197;206m"[38;2;163;190;140mfirstName[38;2;192;197;206m"[38;2;192;197;206m:[38;2;192;197;206m [38;2;150;181;180mgetattr[38;2;192;197;206m([38;2;192;197;206mpatient[38;2;192;197;206m,[38;2;192;197;206m [38;2;192;197;206m"[38;2;163;190;140mfirst_name[38;2;192;197;206m"[38;2;192;197;206m,[38;2;192;197;206m [38;2;192;197;206m"[38;2;192;197;206m"[38;2;192;197;206m)[38;2;192;197;206m [38;2;192;197;206mor[38;2;192;197;206m [38;2;192;197;206m"[38;2;192;197;206m"[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+     38[0m:[39m[48;2;24;38;30m [38;2;192;197;206m        [38;2;192;197;206m"[38;2;163;190;140mlastName[38;2;192;197;206m"[38;2;192;197;206m:[38;2;192;197;206m [38;2;150;181;180mgetattr[38;2;192;197;206m([38;2;192;197;206mpatient[38;2;192;197;206m,[38;2;192;197;206m [38;2;192;197;206m"[38;2;163;190;140mlast_name[38;2;192;197;206m"[38;2;192;197;206m,[38;2;192;197;206m [38;2;192;197;206m"[38;2;192;197;206m"[38;2;192;197;206m)[38;2;192;197;206m [38;2;192;197;206mor[38;2;192;197;206m [38;2;192;197;206m"[38;2;192;197;206m"[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+     39[0m:[39m[48;2;24;38;30m [38;2;192;197;206m        [38;2;192;197;206m"[38;2;163;190;140mphoneNumber[38;2;192;197;206m"[38;2;192;197;206m:[38;2;192;197;206m [38;2;150;181;180mgetattr[38;2;192;197;206m([38;2;192;197;206mpatient[38;2;192;197;206m,[38;2;192;197;206m [38;2;192;197;206m"[38;2;163;190;140mphone_number[38;2;192;197;206m"[38;2;192;197;206m,[38;2;192;197;206m [38;2;192;197;206m"[38;2;192;197;206m"[38;2;192;197;206m)[38;2;192;197;206m [38;2;192;197;206mor[38;2;192;197;206m [38;2;192;197;206m"[38;2;192;197;206m"[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+     40[0m:[39m[48;2;24;38;30m [38;2;192;197;206m        [38;2;192;197;206m"[38;2;163;190;140mtelegramChatId[38;2;192;197;206m"[38;2;192;197;206m:[38;2;192;197;206m [38;2;150;181;180mgetattr[38;2;192;197;206m([38;2;192;197;206mpatient[38;2;192;197;206m,[38;2;192;197;206m [38;2;192;197;206m"[38;2;163;190;140mtelegram_chat_id[38;2;192;197;206m"[38;2;192;197;206m,[38;2;192;197;206m [38;2;208;135;112mNone[38;2;192;197;206m)[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+     41[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;192;197;206m}[K
[0m[48;2;40;67;43m[39m+     42[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     43[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     44[0m:[39m[48;2;24;38;30m [38;2;180;142;173mdef[38;2;192;197;206m [38;2;143;161;179m_camel_treatment_brief[38;2;192;197;206m([38;2;191;97;106mtreatment[38;2;192;197;206m:[38;2;192;197;206m [38;2;192;197;206mAny[38;2;192;197;206m)[38;2;192;197;206m [38;2;192;197;206m->[38;2;192;197;206m [38;2;192;197;206mdict[38;2;192;197;206m[[38;2;192;197;206mstr[38;2;192;197;206m, [38;2;192;197;206mAny[38;2;192;197;206m][38;2;192;197;206m [38;2;192;197;206m|[38;2;192;197;206m [38;2;208;135;112mNone[38;2;192;197;206m:[K
[0m[48;2;40;67;43m[39m+     45[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;180;142;173mif[38;2;192;197;206m [38;2;192;197;206mtreatment[38;2;192;197;206m [38;2;192;197;206mis[38;2;192;197;206m [38;2;208;135;112mNone[38;2;192;197;206m:[K
[0m[48;2;40;67;43m[39m+     46[0m:[39m[48;2;24;38;30m [38;2;192;197;206m        [38;2;180;142;173mreturn[38;2;192;197;206m [38;2;208;135;112mNone[K
[0m[48;2;40;67;43m[39m+     47[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;180;142;173mreturn[38;2;192;197;206m [38;2;192;197;206m{[K
[0m[48;2;40;67;43m[39m+     48[0m:[39m[48;2;24;38;30m [38;2;192;197;206m        [38;2;192;197;206m"[38;2;163;190;140mid[38;2;192;197;206m"[38;2;192;197;206m:[38;2;192;197;206m [38;2;192;197;206mstr[38;2;192;197;206m([38;2;192;197;206mtreatment[38;2;192;197;206m.[38;2;192;197;206mpk[38;2;192;197;206m)[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+     49[0m:[39m[48;2;24;38;30m [38;2;192;197;206m        [38;2;192;197;206m"[38;2;163;190;140mdiagnosis[38;2;192;197;206m"[38;2;192;197;206m:[38;2;192;197;206m [38;2;150;181;180mgetattr[38;2;192;197;206m([38;2;192;197;206mtreatment[38;2;192;197;206m,[38;2;192;197;206m [38;2;192;197;206m"[38;2;163;190;140mdiagnosis[38;2;192;197;206m"[38;2;192;197;206m,[38;2;192;197;206m [38;2;192;197;206m"[38;2;192;197;206m"[38;2;192;197;206m)[38;2;192;197;206m [38;2;192;197;206mor[38;2;192;197;206m [38;2;192;197;206m"[38;2;192;197;206m"[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+     50[0m:[39m[48;2;24;38;30m [38;2;192;197;206m        [38;2;192;197;206m"[38;2;163;190;140mpatient[38;2;192;197;206m"[38;2;192;197;206m:[38;2;192;197;206m [38;2;143;161;179m_camel_patient[38;2;192;197;206m([38;2;150;181;180mgetattr[38;2;192;197;206m([38;2;192;197;206mtreatment[38;2;192;197;206m,[38;2;192;197;206m [38;2;192;197;206m"[38;2;163;190;140mpatient[38;2;192;197;206m"[38;2;192;197;206m,[38;2;192;197;206m [38;2;208;135;112mNone[38;2;192;197;206m)[38;2;192;197;206m)[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+     51[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;192;197;206m}[K
[0m[48;2;40;67;43m[39m+     52[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     53[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     54[0m:[39m[48;2;24;38;30m [38;2;101;115;126m#[38;2;101;115;126m ---------------------------------------------------------------------------[K
[0m[48;2;40;67;43m[39m+     55[0m:[39m[48;2;24;38;30m [38;2;101;115;126m# PrescriptionTemplateSerializer[K
[0m[48;2;40;67;43m[39m+     56[0m:[39m[48;2;24;38;30m [38;2;101;115;126m# ---------------------------------------------------------------------------[K
[0m[48;2;40;67;43m[39m+     57[0m:[39m[48;2;24;38;30m [38;2;101;115;126mclass PrescriptionTemplateSerializer(serializers.ModelSerializer):[K
[0m[48;2;40;67;43m[39m+     58[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    """CRUD serializer for :class:`PrescriptionTemplate`."""[K
[0m[48;2;40;67;43m[39m+     59[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     60[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    name = serializers.CharField(max_length=200)[K
[0m[48;2;40;67;43m[39m+     61[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    content = serializers.CharField(max_length=20_000)[K
[0m[48;2;40;67;43m[39m+     62[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    is_active = serializers.BooleanField(required=False)[K
[0m[48;2;40;67;43m[39m+     63[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     64[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    class Meta:[K
[0m[48;2;40;67;43m[39m+     65[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        model = PrescriptionTemplate[K
[0m[48;2;40;67;43m[39m+     66[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        fields = ("id", "name", "content", "is_active")[K
[0m[48;2;40;67;43m[39m+     67[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        read_only_fields = ("id",)[K
[0m[48;2;40;67;43m[39m+     68[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     69[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    _CAMEL_TO_SNAKE = {"isActive": "is_active"}[K
[0m[48;2;40;67;43m[39m+     70[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     71[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    def to_internal_value(self, data: Any) -> dict[str, Any]:[K
[0m[48;2;40;67;43m[39m+     72[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        if isinstance(data, dict):[K
[0m[48;2;40;67;43m[39m+     73[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            normalised = {**data}[K
[0m[48;2;40;67;43m[39m+     74[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            for camel, snake in self._CAMEL_TO_SNAKE.items():[K
[0m[48;2;40;67;43m[39m+     75[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                if camel in normalised and snake not in normalised:[K
[0m[48;2;40;67;43m[39m+     76[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                    normalised[snake] = normalised[camel][K
[0m[48;2;40;67;43m[39m+     77[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            data = normalised[K
[0m[48;2;40;67;43m[39m+     78[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        return super().to_internal_value(data)[K
[0m[48;2;40;67;43m[39m+     79[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     80[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    def to_representation(self, instance: PrescriptionTemplate) -> dict[str, Any]:[K
[0m[48;2;40;67;43m[39m+     81[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        return {[K
[0m[48;2;40;67;43m[39m+     82[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            "id": str(instance.id),[K
[0m[48;2;40;67;43m[39m+     83[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            "name": instance.name,[K
[0m[48;2;40;67;43m[39m+     84[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            "content": instance.content,[K
[0m[48;2;40;67;43m[39m+     85[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            "isActive": instance.is_active,[K
[0m[48;2;40;67;43m[39m+     86[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            "createdBy": _camel_user(instance.created_by),[K
[0m[48;2;40;67;43m[39m+     87[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            "createdAt": instance.created_at.isoformat()[K
[0m[48;2;40;67;43m[39m+     88[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            if instance.created_at[K
[0m[48;2;40;67;43m[39m+     89[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            else None,[K
[0m[48;2;40;67;43m[39m+     90[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            "updatedAt": instance.updated_at.isoformat()[K
[0m[48;2;40;67;43m[39m+     91[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            if instance.updated_at[K
[0m[48;2;40;67;43m[39m+     92[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            else None,[K
[0m[48;2;40;67;43m[39m+     93[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        }[K
[0m[48;2;40;67;43m[39m+     94[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     95[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    def create(self, validated_data: dict[str, Any]) -> PrescriptionTemplate:[K
[0m[48;2;40;67;43m[39m+     96[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        request = self.context.get("request")[K
[0m[48;2;40;67;43m[39m+     97[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        actor = getattr(request, "user", None) if request is not None else None[K
[0m[48;2;40;67;43m[39m+     98[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        try:[K
[0m[48;2;40;67;43m[39m+     99[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            return create_prescription_template([K
[0m[48;2;40;67;43m[39m+    100[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                name=validated_data["name"],[K
[0m[48;2;40;67;43m[39m+    101[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                content=validated_data["content"],[K
[0m[48;2;40;67;43m[39m+    102[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                created_by=actor,[K
[0m[48;2;40;67;43m[39m+    103[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            )[K
[0m[48;2;40;67;43m[39m+    104[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        except DjangoValidationError as exc:[K
[0m[48;2;40;67;43m[39m+    105[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            raise serializers.ValidationError([K
[0m[48;2;40;67;43m[39m+    106[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                exc.message_dict[K
[0m[48;2;40;67;43m[39m+    107[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                if hasattr(exc, "message_dict")[K
[0m[48;2;40;67;43m[39m+    108[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                else list(exc.messages)[K
[0m[48;2;40;67;43m[39m+    109[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            ) from exc[K
[0m[48;2;40;67;43m[39m+    110[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    111[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    def update([K
[0m[48;2;40;67;43m[39m+    112[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        self,[K
[0m[48;2;40;67;43m[39m+    113[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        instance: PrescriptionTemplate,[K
[0m[48;2;40;67;43m[39m+    114[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        validated_data: dict[str, Any],[K
[0m[48;2;40;67;43m[39m+    115[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    ) -> PrescriptionTemplate:[K
[0m[48;2;40;67;43m[39m+    116[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        try:[K
[0m[48;2;40;67;43m[39m+    117[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            return update_prescription_template([K
[0m[48;2;40;67;43m[39m+    118[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                instance,[K
[0m[48;2;40;67;43m[39m+    119[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                name=validated_data.get("name"),[K
[0m[48;2;40;67;43m[39m+    120[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                content=validated_data.get("content"),[K
[0m[48;2;40;67;43m[39m+    121[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                is_active=validated_data.get("is_active"),[K
[0m[48;2;40;67;43m[39m+    122[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            )[K
[0m[48;2;40;67;43m[39m+    123[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        except DjangoValidationError as exc:[K
[0m[48;2;40;67;43m[39m+    124[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            raise serializers.ValidationError([K
[0m[48;2;40;67;43m[39m+    125[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                exc.message_dict[K
[0m[48;2;40;67;43m[39m+    126[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                if hasattr(exc, "message_dict")[K
[0m[48;2;40;67;43m[39m+    127[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                else list(exc.messages)[K
[0m[48;2;40;67;43m[39m+    128[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            ) from exc[K
[0m[48;2;40;67;43m[39m+    129[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    130[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    131[0m:[39m[48;2;24;38;30m [38;2;101;115;126m# ---------------------------------------------------------------------------[K
[0m[48;2;40;67;43m[39m+    132[0m:[39m[48;2;24;38;30m [38;2;101;115;126m# PrescriptionSerializer (read-only via viewset; issue uses the input one)[K
[0m[48;2;40;67;43m[39m+    133[0m:[39m[48;2;24;38;30m [38;2;101;115;126m# ---------------------------------------------------------------------------[K
[0m[48;2;40;67;43m[39m+    134[0m:[39m[48;2;24;38;30m [38;2;101;115;126mclass PrescriptionSerializer(serializers.ModelSerializer):[K
[0m[48;2;40;67;43m[39m+    135[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    """Read serializer for :class:`Prescription`."""[K
[0m[48;2;40;67;43m[39m+    136[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    137[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    class Meta:[K
[0m[48;2;40;67;43m[39m+    138[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        model = Prescription[K
[0m[48;2;40;67;43m[39m+    139[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        fields = ("id", "content", "sent_to_telegram_at", "is_active")[K
[0m[48;2;40;67;43m[39m+    140[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        read_only_fields = fields[K
[0m[48;2;40;67;43m[39m+    141[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    142[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    def to_representation(self, instance: Prescription) -> dict[str, Any]:[K
[0m[48;2;40;67;43m[39m+    143[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        return {[K
[0m[48;2;40;67;43m[39m+    144[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            "id": str(instance.id),[K
[0m[48;2;40;67;43m[39m+    145[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            "treatmentId": str(instance.treatment_id),[K
[0m[48;2;40;67;43m[39m+    146[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            "treatment": _camel_treatment_brief(instance.treatment),[K
[0m[48;2;40;67;43m[39m+    147[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            "templateId": str(instance.template_id) if instance.template_id else None,[K
[0m[48;2;40;67;43m[39m+    148[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            "templateName": getattr(instance.template, "name", None)[K
[0m[48;2;40;67;43m[39m+    149[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            if instance.template[K
[0m[48;2;40;67;43m[39m+    150[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            else None,[K
[0m[48;2;40;67;43m[39m+    151[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            "content": instance.content,[K
[0m[48;2;40;67;43m[39m+    152[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            "sentToTelegramAt": instance.sent_to_telegram_at.isoformat()[K
[0m[48;2;40;67;43m[39m+    153[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            if instance.sent_to_telegram_at[K
[0m[48;2;40;67;43m[39m+    154[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            else None,[K
[0m[48;2;40;67;43m[39m+    155[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            "isSent": instance.sent_to_telegram_at is not None,[K
[0m[48;2;40;67;43m[39m+    156[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            "isActive": instance.is_active,[K
[0m[48;2;40;67;43m[39m+    157[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            "createdAt": instance.created_at.isoformat()[K
[0m[48;2;40;67;43m[39m+    158[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            if instance.created_at[K
[0m[48;2;40;67;43m[39m+    159[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            else None,[K
[0m[48;2;40;67;43m[39m+    160[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            "createdBy": _camel_user(instance.created_by),[K
[0m[48;2;40;67;43m[39m+    161[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        }[K
[0m[48;2;40;67;43m[39m+    162[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    163[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    164[0m:[39m[48;2;24;38;30m [38;2;101;115;126m# ---------------------------------------------------------------------------[K
[0m[48;2;40;67;43m[39m+    165[0m:[39m[48;2;24;38;30m [38;2;101;115;126m# Prescription issue-on-treatment input serializer[K
[0m[48;2;40;67;43m[39m+    166[0m:[39m[48;2;24;38;30m [38;2;101;115;126m# ---------------------------------------------------------------------------[K
[0m[48;2;40;67;43m[39m+    167[0m:[39m[48;2;24;38;30m [38;2;101;115;126mclass IssuePrescriptionSerializer(serializers.Serializer):[K
[0m[48;2;40;67;43m[39m+    168[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    """Input for ``POST /treatments/{id}/prescription/``."""[K
[0m[48;2;40;67;43m[39m+    169[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    170[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    template = serializers.UUIDField(required=False, allow_null=True)[K
[0m[48;2;40;67;43m[39m+    171[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    content = serializers.CharField([K
[0m[48;2;40;67;43m[39m+    172[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        max_length=20_000, required=False, allow_blank=True[K
[0m[48;2;40;67;43m[39m+    173[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    )[K
[0m[48;2;40;67;43m[39m+    174[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    send = serializers.BooleanField(required=False, default=True)[K
[0m[48;2;40;67;43m[39m+    175[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    176[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    _CAMEL_TO_SNAKE = {[K
[0m[48;2;40;67;43m[39m+    177[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        "templateId": "template",[K
[0m[48;2;40;67;43m[39m+    178[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    }[K
[0m[48;2;40;67;43m[39m+    179[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    180[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    def to_internal_value(self, data: Any) -> dict[str, Any]:[K
[0m[48;2;40;67;43m[39m+    181[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        if isinstance(data, dict):[K
[0m[48;2;40;67;43m[39m+    182[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            normalised = {**data}[K
[0m[48;2;40;67;43m[39m+    183[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            for camel, snake in self._CAMEL_TO_SNAKE.items():[K
[0m[48;2;40;67;43m[39m+    184[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                if camel in normalised and snake not in normalised:[K
[0m[48;2;40;67;43m[39m+    185[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                    normalised[snake] = normalised[camel][K
[0m[48;2;40;67;43m[39m+    186[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            data = normalised[K
[0m[48;2;40;67;43m[39m+    187[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        return super().to_internal_value(data)[K
[0m[48;2;40;67;43m[39m+    188[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    189[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    def validate(self, attrs: dict[str, Any]) -> dict[str, Any]:[K
[0m[48;2;40;67;43m[39m+    190[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        if not attrs.get("template") and not (attrs.get("content") or "").strip():[K
[0m[48;2;40;67;43m[39m+    191[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            raise serializers.ValidationError([K
[0m[48;2;40;67;43m[39m+    192[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                {"content": ["'content' yoki 'template' kiritilishi shart."]}[K
[0m[48;2;40;67;43m[39m+    193[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            )[K
[0m[48;2;40;67;43m[39m+    194[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        return attrs[K
[0m[48;2;40;67;43m[39m+    195[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    196[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    def create(self, validated_data: dict[str, Any]) -> Prescription:[K
[0m[48;2;40;67;43m[39m+    197[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        request = self.context.get("request")[K
[0m[48;2;40;67;43m[39m+    198[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        treatment = self.context["treatment"][K
[0m[48;2;40;67;43m[39m+    199[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        actor = getattr(request, "user", None) if request is not None else None[K
[0m[48;2;40;67;43m[39m+    200[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        try:[K
[0m[48;2;40;67;43m[39m+    201[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            return create_prescription_for_treatment([K
[0m[48;2;40;67;43m[39m+    202[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                treatment=treatment,[K
[0m[48;2;40;67;43m[39m+    203[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                template=validated_data.get("template"),[K
[0m[48;2;40;67;43m[39m+    204[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                content=validated_data.get("content") or None,[K
[0m[48;2;40;67;43m[39m+    205[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                created_by=actor,[K
[0m[48;2;40;67;43m[39m+    206[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                send=bool(validated_data.get("send", True)),[K
[0m[48;2;40;67;43m[39m+    207[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            )[K
[0m[48;2;40;67;43m[39m+    208[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        except DjangoValidationError as exc:[K
[0m[48;2;40;67;43m[39m+    209[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            raise serializers.ValidationError([K
[0m[48;2;40;67;43m[39m+    210[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                exc.message_dict[K
[0m[48;2;40;67;43m[39m+    211[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                if hasattr(exc, "message_dict")[K
[0m[48;2;40;67;43m[39m+    212[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                else list(exc.messages)[K
[0m[48;2;40;67;43m[39m+    213[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            ) from exc[K
[0m[48;2;40;67;43m[39m+    214[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    215[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    216[0m:[39m[48;2;24;38;30m [38;2;101;115;126m__all__ = [[K
[0m[48;2;40;67;43m[39m+    217[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    "PrescriptionTemplateSerializer",[K
[0m[48;2;40;67;43m[39m+    218[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    "PrescriptionSerializer",[K
[0m[48;2;40;67;43m[39m+    219[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    "IssuePrescriptionSerializer",[K
[0m[48;2;40;67;43m[39m+    220[0m:[39m[48;2;24;38;30m [38;2;101;115;126m][K
[0m[K
Creating: [38;5;141m/home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/apps/prescriptions/serializers.py[0m
[38;5;244m - Completed in 0.1s[0m

I'll create the following file: [38;5;141m/home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/apps/prescriptions/views.py[0m[38;5;244m (using tool: write)[0m

[48;2;40;67;43m[39m+      1[0m:[39m[48;2;24;38;30m [38;2;101;115;126m"""[38;2;101;115;126mHTTP orchestration for the ``prescriptions`` app.[K
[0m[48;2;40;67;43m[39m+      2[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+      3[0m:[39m[48;2;24;38;30m [38;2;101;115;126mEndpoints:[K
[0m[48;2;40;67;43m[39m+      4[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+      5[0m:[39m[48;2;24;38;30m [38;2;101;115;126m* ``/api/v1/prescription-templates/``      — CRUD on PrescriptionTemplate.[K
[0m[48;2;40;67;43m[39m+      6[0m:[39m[48;2;24;38;30m [38;2;101;115;126m* ``/api/v1/prescriptions/``               — read-only listing / detail[K
[0m[48;2;40;67;43m[39m+      7[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    (filters: ``?treatment=&patient=&doctor=&is_sent=``).[K
[0m[48;2;40;67;43m[39m+      8[0m:[39m[48;2;24;38;30m [38;2;101;115;126m* ``/api/v1/treatments/{id}/prescription/`` — action wired via the[K
[0m[48;2;40;67;43m[39m+      9[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    treatments viewset (see ``apps/treatments/views.py``). This module[K
[0m[48;2;40;67;43m[39m+     10[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    exposes the ``IssuePrescriptionActionView`` used by that route[K
[0m[48;2;40;67;43m[39m+     11[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    alias.[K
[0m[48;2;40;67;43m[39m+     12[0m:[39m[48;2;24;38;30m [38;2;101;115;126m"""[K
[0m[48;2;40;67;43m[39m+     13[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206m__future__[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206mannotations[K
[0m[48;2;40;67;43m[39m+     14[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     15[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206mtyping[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206mAny[K
[0m[48;2;40;67;43m[39m+     16[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     17[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206mdjango_filters[38;2;192;197;206m.[38;2;192;197;206mrest_framework[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206mDjangoFilterBackend[K
[0m[48;2;40;67;43m[39m+     18[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206mdrf_spectacular[38;2;192;197;206m.[38;2;192;197;206mutils[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206mOpenApiParameter[38;2;192;197;206m,[38;2;192;197;206m [38;2;192;197;206mextend_schema[K
[0m[48;2;40;67;43m[39m+     19[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206mrest_framework[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206mfilters[38;2;192;197;206m,[38;2;192;197;206m [38;2;192;197;206mstatus[38;2;192;197;206m,[38;2;192;197;206m [38;2;192;197;206mviewsets[K
[0m[48;2;40;67;43m[39m+     20[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206mrest_framework[38;2;192;197;206m.[38;2;192;197;206mdecorators[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206maction[K
[0m[48;2;40;67;43m[39m+     21[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206mrest_framework[38;2;192;197;206m.[38;2;192;197;206mgenerics[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206mget_object_or_404[K
[0m[48;2;40;67;43m[39m+     22[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206mrest_framework[38;2;192;197;206m.[38;2;192;197;206mrequest[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206mRequest[K
[0m[48;2;40;67;43m[39m+     23[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206mrest_framework[38;2;192;197;206m.[38;2;192;197;206mresponse[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206mResponse[K
[0m[48;2;40;67;43m[39m+     24[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206mrest_framework[38;2;192;197;206m.[38;2;192;197;206mviews[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206mAPIView[K
[0m[48;2;40;67;43m[39m+     25[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     26[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206mapps[38;2;192;197;206m.[38;2;192;197;206mcore[38;2;192;197;206m.[38;2;192;197;206mpermissions[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;191;97;106mROLE_DOCTOR[K
[0m[48;2;40;67;43m[39m+     27[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206mapps[38;2;192;197;206m.[38;2;192;197;206mtreatments[38;2;192;197;206m.[38;2;192;197;206mmodels[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206mTreatment[K
[0m[48;2;40;67;43m[39m+     28[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206mapps[38;2;192;197;206m.[38;2;192;197;206mtreatments[38;2;192;197;206m.[38;2;192;197;206mpermissions[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206mTreatmentPermission[K
[0m[48;2;40;67;43m[39m+     29[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     30[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;180;142;173m.[38;2;192;197;206mmodels[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206mPrescription[38;2;192;197;206m,[38;2;192;197;206m [38;2;192;197;206mPrescriptionTemplate[K
[0m[48;2;40;67;43m[39m+     31[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;180;142;173m.[38;2;192;197;206mpermissions[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206mPrescriptionPermission[38;2;192;197;206m,[38;2;192;197;206m [38;2;192;197;206mPrescriptionTemplatePermission[K
[0m[48;2;40;67;43m[39m+     32[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;180;142;173m.[38;2;192;197;206mselectors[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206m([K
[0m[48;2;40;67;43m[39m+     33[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;192;197;206mactive_templates[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+     34[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;192;197;206mfilter_prescriptions[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+     35[0m:[39m[48;2;24;38;30m [38;2;192;197;206m)[K
[0m[48;2;40;67;43m[39m+     36[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;180;142;173m.[38;2;192;197;206mserializers[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206m([K
[0m[48;2;40;67;43m[39m+     37[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;192;197;206mIssuePrescriptionSerializer[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+     38[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;192;197;206mPrescriptionSerializer[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+     39[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;192;197;206mPrescriptionTemplateSerializer[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+     40[0m:[39m[48;2;24;38;30m [38;2;192;197;206m)[K
[0m[48;2;40;67;43m[39m+     41[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;180;142;173m.[38;2;192;197;206mservices[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206msoft_delete_prescription[38;2;192;197;206m,[38;2;192;197;206m [38;2;192;197;206msoft_delete_template[K
[0m[48;2;40;67;43m[39m+     42[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     43[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     44[0m:[39m[48;2;24;38;30m [38;2;101;115;126m#[38;2;101;115;126m ---------------------------------------------------------------------------[K
[0m[48;2;40;67;43m[39m+     45[0m:[39m[48;2;24;38;30m [38;2;101;115;126m# PrescriptionTemplateViewSet[K
[0m[48;2;40;67;43m[39m+     46[0m:[39m[48;2;24;38;30m [38;2;101;115;126m# ---------------------------------------------------------------------------[K
[0m[48;2;40;67;43m[39m+     47[0m:[39m[48;2;24;38;30m [38;2;101;115;126m@extend_schema(tags=["prescriptions"])[K
[0m[48;2;40;67;43m[39m+     48[0m:[39m[48;2;24;38;30m [38;2;101;115;126mclass PrescriptionTemplateViewSet(viewsets.ModelViewSet):[K
[0m[48;2;40;67;43m[39m+     49[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    """CRUD for :class:`PrescriptionTemplate`."""[K
[0m[48;2;40;67;43m[39m+     50[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     51[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    serializer_class = PrescriptionTemplateSerializer[K
[0m[48;2;40;67;43m[39m+     52[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    permission_classes = [PrescriptionTemplatePermission][K
[0m[48;2;40;67;43m[39m+     53[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter][K
[0m[48;2;40;67;43m[39m+     54[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    search_fields = ["name", "content"][K
[0m[48;2;40;67;43m[39m+     55[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    ordering_fields = ["name", "created_at"][K
[0m[48;2;40;67;43m[39m+     56[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    ordering = ["name"][K
[0m[48;2;40;67;43m[39m+     57[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    lookup_field = "pk"[K
[0m[48;2;40;67;43m[39m+     58[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     59[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    def get_queryset(self):[K
[0m[48;2;40;67;43m[39m+     60[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        request: Request | None = getattr(self, "request", None)[K
[0m[48;2;40;67;43m[39m+     61[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        if request is None:[K
[0m[48;2;40;67;43m[39m+     62[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            return active_templates()[K
[0m[48;2;40;67;43m[39m+     63[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        params = request.query_params[K
[0m[48;2;40;67;43m[39m+     64[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        include_inactive = str(params.get("include_inactive", "")).lower() in {[K
[0m[48;2;40;67;43m[39m+     65[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            "1",[K
[0m[48;2;40;67;43m[39m+     66[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            "true",[K
[0m[48;2;40;67;43m[39m+     67[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            "yes",[K
[0m[48;2;40;67;43m[39m+     68[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        }[K
[0m[48;2;40;67;43m[39m+     69[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        role = getattr(request.user, "role", None)[K
[0m[48;2;40;67;43m[39m+     70[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        if include_inactive and role == "bosh_shifokor":[K
[0m[48;2;40;67;43m[39m+     71[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            from .selectors import all_templates[K
[0m[48;2;40;67;43m[39m+     72[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     73[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            return all_templates()[K
[0m[48;2;40;67;43m[39m+     74[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        return active_templates()[K
[0m[48;2;40;67;43m[39m+     75[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     76[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    def destroy(self, request: Request, *args: Any, **kwargs: Any) -> Response:[K
[0m[48;2;40;67;43m[39m+     77[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        template: PrescriptionTemplate = self.get_object()[K
[0m[48;2;40;67;43m[39m+     78[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        soft_delete_template(template)[K
[0m[48;2;40;67;43m[39m+     79[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        return Response(status=status.HTTP_204_NO_CONTENT)[K
[0m[48;2;40;67;43m[39m+     80[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     81[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     82[0m:[39m[48;2;24;38;30m [38;2;101;115;126m# ---------------------------------------------------------------------------[K
[0m[48;2;40;67;43m[39m+     83[0m:[39m[48;2;24;38;30m [38;2;101;115;126m# PrescriptionViewSet (read-only + soft delete)[K
[0m[48;2;40;67;43m[39m+     84[0m:[39m[48;2;24;38;30m [38;2;101;115;126m# ---------------------------------------------------------------------------[K
[0m[48;2;40;67;43m[39m+     85[0m:[39m[48;2;24;38;30m [38;2;101;115;126m@extend_schema(tags=["prescriptions"])[K
[0m[48;2;40;67;43m[39m+     86[0m:[39m[48;2;24;38;30m [38;2;101;115;126mclass PrescriptionViewSet(viewsets.ModelViewSet):[K
[0m[48;2;40;67;43m[39m+     87[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    """List / retrieve / soft-delete for :class:`Prescription`.[K
[0m[48;2;40;67;43m[39m+     88[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     89[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    Retseptlar are created via the dedicated action on[K
[0m[48;2;40;67;43m[39m+     90[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    ``/treatments/{id}/prescription/`` (see[K
[0m[48;2;40;67;43m[39m+     91[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    :class:`IssuePrescriptionActionView`) — this viewset intentionally[K
[0m[48;2;40;67;43m[39m+     92[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    does **not** expose a naked ``POST /prescriptions/`` because every[K
[0m[48;2;40;67;43m[39m+     93[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    retsept must be tied to a treatment.[K
[0m[48;2;40;67;43m[39m+     94[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    """[K
[0m[48;2;40;67;43m[39m+     95[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     96[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    serializer_class = PrescriptionSerializer[K
[0m[48;2;40;67;43m[39m+     97[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    permission_classes = [PrescriptionPermission][K
[0m[48;2;40;67;43m[39m+     98[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    filter_backends = [DjangoFilterBackend, filters.OrderingFilter][K
[0m[48;2;40;67;43m[39m+     99[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    ordering_fields = ["created_at", "sent_to_telegram_at"][K
[0m[48;2;40;67;43m[39m+    100[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    ordering = ["-created_at"][K
[0m[48;2;40;67;43m[39m+    101[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    http_method_names = ["get", "delete", "head", "options"][K
[0m[48;2;40;67;43m[39m+    102[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    103[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    def get_queryset(self):[K
[0m[48;2;40;67;43m[39m+    104[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        request: Request | None = getattr(self, "request", None)[K
[0m[48;2;40;67;43m[39m+    105[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        if request is None:[K
[0m[48;2;40;67;43m[39m+    106[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            return filter_prescriptions()[K
[0m[48;2;40;67;43m[39m+    107[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        params = request.query_params[K
[0m[48;2;40;67;43m[39m+    108[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        is_sent_raw = params.get("is_sent")[K
[0m[48;2;40;67;43m[39m+    109[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        is_sent: bool | None[K
[0m[48;2;40;67;43m[39m+    110[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        if is_sent_raw is None or is_sent_raw == "":[K
[0m[48;2;40;67;43m[39m+    111[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            is_sent = None[K
[0m[48;2;40;67;43m[39m+    112[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        else:[K
[0m[48;2;40;67;43m[39m+    113[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            is_sent = str(is_sent_raw).lower() in {"1", "true", "yes"}[K
[0m[48;2;40;67;43m[39m+    114[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    115[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        role = getattr(request.user, "role", None)[K
[0m[48;2;40;67;43m[39m+    116[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        include_inactive = str([K
[0m[48;2;40;67;43m[39m+    117[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            params.get("include_inactive", "")[K
[0m[48;2;40;67;43m[39m+    118[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        ).lower() in {"1", "true", "yes"}[K
[0m[48;2;40;67;43m[39m+    119[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    120[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        qs = filter_prescriptions([K
[0m[48;2;40;67;43m[39m+    121[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            treatment_id=params.get("treatment"),[K
[0m[48;2;40;67;43m[39m+    122[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            patient_id=params.get("patient"),[K
[0m[48;2;40;67;43m[39m+    123[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            doctor_id=params.get("doctor"),[K
[0m[48;2;40;67;43m[39m+    124[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            is_sent=is_sent,[K
[0m[48;2;40;67;43m[39m+    125[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            include_inactive=(include_inactive and role == "bosh_shifokor"),[K
[0m[48;2;40;67;43m[39m+    126[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        )[K
[0m[48;2;40;67;43m[39m+    127[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    128[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        if role == ROLE_DOCTOR:[K
[0m[48;2;40;67;43m[39m+    129[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            profile = getattr(request.user, "doctor_profile", None)[K
[0m[48;2;40;67;43m[39m+    130[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            if not getattr(profile, "can_view_other_doctors", False):[K
[0m[48;2;40;67;43m[39m+    131[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                if profile is not None:[K
[0m[48;2;40;67;43m[39m+    132[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                    qs = qs.filter(treatment__doctor=profile)[K
[0m[48;2;40;67;43m[39m+    133[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                else:[K
[0m[48;2;40;67;43m[39m+    134[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                    qs = qs.none()[K
[0m[48;2;40;67;43m[39m+    135[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    136[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        return qs[K
[0m[48;2;40;67;43m[39m+    137[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    138[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    @extend_schema([K
[0m[48;2;40;67;43m[39m+    139[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        parameters=[[K
[0m[48;2;40;67;43m[39m+    140[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            OpenApiParameter(name="treatment", required=False, type=str),[K
[0m[48;2;40;67;43m[39m+    141[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            OpenApiParameter(name="patient", required=False, type=str),[K
[0m[48;2;40;67;43m[39m+    142[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            OpenApiParameter(name="doctor", required=False, type=str),[K
[0m[48;2;40;67;43m[39m+    143[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            OpenApiParameter([K
[0m[48;2;40;67;43m[39m+    144[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                name="is_sent",[K
[0m[48;2;40;67;43m[39m+    145[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                required=False,[K
[0m[48;2;40;67;43m[39m+    146[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                type=bool,[K
[0m[48;2;40;67;43m[39m+    147[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                description="true → only sent; false → only pending; omitted → all",[K
[0m[48;2;40;67;43m[39m+    148[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            ),[K
[0m[48;2;40;67;43m[39m+    149[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        ][K
[0m[48;2;40;67;43m[39m+    150[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    )[K
[0m[48;2;40;67;43m[39m+    151[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    def list(self, request: Request, *args: Any, **kwargs: Any) -> Response:[K
[0m[48;2;40;67;43m[39m+    152[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        return super().list(request, *args, **kwargs)[K
[0m[48;2;40;67;43m[39m+    153[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    154[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    def destroy(self, request: Request, *args: Any, **kwargs: Any) -> Response:[K
[0m[48;2;40;67;43m[39m+    155[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        prescription: Prescription = self.get_object()[K
[0m[48;2;40;67;43m[39m+    156[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        soft_delete_prescription(prescription)[K
[0m[48;2;40;67;43m[39m+    157[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        return Response(status=status.HTTP_204_NO_CONTENT)[K
[0m[48;2;40;67;43m[39m+    158[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    159[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    160[0m:[39m[48;2;24;38;30m [38;2;101;115;126m# ---------------------------------------------------------------------------[K
[0m[48;2;40;67;43m[39m+    161[0m:[39m[48;2;24;38;30m [38;2;101;115;126m# POST /treatments/{id}/prescription/ — issue a retsept[K
[0m[48;2;40;67;43m[39m+    162[0m:[39m[48;2;24;38;30m [38;2;101;115;126m# ---------------------------------------------------------------------------[K
[0m[48;2;40;67;43m[39m+    163[0m:[39m[48;2;24;38;30m [38;2;101;115;126mclass IssuePrescriptionActionView(APIView):[K
[0m[48;2;40;67;43m[39m+    164[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    """Issue a retsept for a specific treatment.[K
[0m[48;2;40;67;43m[39m+    165[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    166[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    Sits under ``/api/v1/treatments/{id}/prescription/`` so the URL[K
[0m[48;2;40;67;43m[39m+    167[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    path matches PROJECT_BRIEF § "Prescriptions".[K
[0m[48;2;40;67;43m[39m+    168[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    """[K
[0m[48;2;40;67;43m[39m+    169[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    170[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    permission_classes = [TreatmentPermission][K
[0m[48;2;40;67;43m[39m+    171[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    172[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    @extend_schema([K
[0m[48;2;40;67;43m[39m+    173[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        tags=["prescriptions"],[K
[0m[48;2;40;67;43m[39m+    174[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        request=IssuePrescriptionSerializer,[K
[0m[48;2;40;67;43m[39m+    175[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        responses={201: PrescriptionSerializer},[K
[0m[48;2;40;67;43m[39m+    176[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        summary="Retsept yaratish va (ixtiyoriy) Telegram orqali yuborish.",[K
[0m[48;2;40;67;43m[39m+    177[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    )[K
[0m[48;2;40;67;43m[39m+    178[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    def post(self, request: Request, treatment_id: str) -> Response:[K
[0m[48;2;40;67;43m[39m+    179[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        treatment = get_object_or_404([K
[0m[48;2;40;67;43m[39m+    180[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            Treatment.objects.select_related([K
[0m[48;2;40;67;43m[39m+    181[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                "patient", "doctor", "doctor__user"[K
[0m[48;2;40;67;43m[39m+    182[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            ),[K
[0m[48;2;40;67;43m[39m+    183[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            pk=treatment_id,[K
[0m[48;2;40;67;43m[39m+    184[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        )[K
[0m[48;2;40;67;43m[39m+    185[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        self.check_object_permissions(request, treatment)[K
[0m[48;2;40;67;43m[39m+    186[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    187[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        serializer = IssuePrescriptionSerializer([K
[0m[48;2;40;67;43m[39m+    188[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            data=request.data,[K
[0m[48;2;40;67;43m[39m+    189[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            context={"request": request, "treatment": treatment},[K
[0m[48;2;40;67;43m[39m+    190[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        )[K
[0m[48;2;40;67;43m[39m+    191[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        serializer.is_valid(raise_exception=True)[K
[0m[48;2;40;67;43m[39m+    192[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        prescription = serializer.save()[K
[0m[48;2;40;67;43m[39m+    193[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        out = PrescriptionSerializer(prescription, context={"request": request}).data[K
[0m[48;2;40;67;43m[39m+    194[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        return Response(out, status=status.HTTP_201_CREATED)[K
[0m[48;2;40;67;43m[39m+    195[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    196[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    197[0m:[39m[48;2;24;38;30m [38;2;101;115;126m__all__ = [[K
[0m[48;2;40;67;43m[39m+    198[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    "PrescriptionTemplateViewSet",[K
[0m[48;2;40;67;43m[39m+    199[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    "PrescriptionViewSet",[K
[0m[48;2;40;67;43m[39m+    200[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    "IssuePrescriptionActionView",[K
[0m[48;2;40;67;43m[39m+    201[0m:[39m[48;2;24;38;30m [38;2;101;115;126m][K
[0m[K
Creating: [38;5;141m/home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/apps/prescriptions/views.py[0m
[38;5;244m - Completed in 0.1s[0m

I'll create the following file: [38;5;141m/home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/apps/prescriptions/urls.py[0m[38;5;244m (using tool: write)[0m

[48;2;40;67;43m[39m+     1[0m:[39m[48;2;24;38;30m [38;2;101;115;126m"""[38;2;101;115;126mURL routes for the ``prescriptions`` app.[K
[0m[48;2;40;67;43m[39m+     2[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     3[0m:[39m[48;2;24;38;30m [38;2;101;115;126mTwo mount points:[K
[0m[48;2;40;67;43m[39m+     4[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     5[0m:[39m[48;2;24;38;30m [38;2;101;115;126m* ``/api/v1/prescription-templates/`` → ``PrescriptionTemplateViewSet``[K
[0m[48;2;40;67;43m[39m+     6[0m:[39m[48;2;24;38;30m [38;2;101;115;126m* ``/api/v1/prescriptions/``          → ``PrescriptionViewSet``[K
[0m[48;2;40;67;43m[39m+     7[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     8[0m:[39m[48;2;24;38;30m [38;2;101;115;126mThe action endpoint ``POST /api/v1/treatments/{id}/prescription/`` is[K
[0m[48;2;40;67;43m[39m+     9[0m:[39m[48;2;24;38;30m [38;2;101;115;126mmounted separately (see ``prescription_action_urls`` in this module)[K
[0m[48;2;40;67;43m[39m+    10[0m:[39m[48;2;24;38;30m [38;2;101;115;126mand wired from ``config/urls.py``.[K
[0m[48;2;40;67;43m[39m+    11[0m:[39m[48;2;24;38;30m [38;2;101;115;126m"""[K
[0m[48;2;40;67;43m[39m+    12[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206m__future__[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206mannotations[K
[0m[48;2;40;67;43m[39m+    13[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    14[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206mdjango[38;2;192;197;206m.[38;2;192;197;206murls[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206mpath[K
[0m[48;2;40;67;43m[39m+    15[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206mrest_framework[38;2;192;197;206m.[38;2;192;197;206mrouters[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206mDefaultRouter[K
[0m[48;2;40;67;43m[39m+    16[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    17[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;180;142;173m.[38;2;192;197;206mviews[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206m([K
[0m[48;2;40;67;43m[39m+    18[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;192;197;206mIssuePrescriptionActionView[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+    19[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;192;197;206mPrescriptionTemplateViewSet[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+    20[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;192;197;206mPrescriptionViewSet[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+    21[0m:[39m[48;2;24;38;30m [38;2;192;197;206m)[K
[0m[48;2;40;67;43m[39m+    22[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    23[0m:[39m[48;2;24;38;30m [38;2;192;197;206mapp_name[38;2;192;197;206m [38;2;192;197;206m=[38;2;192;197;206m [38;2;192;197;206m"[38;2;163;190;140mprescriptions[38;2;192;197;206m"[K
[0m[48;2;40;67;43m[39m+    24[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    25[0m:[39m[48;2;24;38;30m [38;2;192;197;206mrouter[38;2;192;197;206m [38;2;192;197;206m=[38;2;192;197;206m [38;2;143;161;179mDefaultRouter[38;2;192;197;206m([38;2;192;197;206m)[K
[0m[48;2;40;67;43m[39m+    26[0m:[39m[48;2;24;38;30m [38;2;192;197;206mrouter[38;2;192;197;206m.[38;2;143;161;179mregister[38;2;192;197;206m([K
[0m[48;2;40;67;43m[39m+    27[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;180;142;173mr[38;2;192;197;206m"[38;2;163;190;140mtemplates[38;2;192;197;206m"[38;2;192;197;206m,[38;2;192;197;206m [38;2;192;197;206mPrescriptionTemplateViewSet[38;2;192;197;206m,[38;2;192;197;206m [38;2;191;97;106mbasename[38;2;192;197;206m=[38;2;192;197;206m"[38;2;163;190;140mprescription-template[38;2;192;197;206m"[K
[0m[48;2;40;67;43m[39m+    28[0m:[39m[48;2;24;38;30m [38;2;192;197;206m)[K
[0m[48;2;40;67;43m[39m+    29[0m:[39m[48;2;24;38;30m [38;2;192;197;206mrouter[38;2;192;197;206m.[38;2;143;161;179mregister[38;2;192;197;206m([K
[0m[48;2;40;67;43m[39m+    30[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;180;142;173mr[38;2;192;197;206m"[38;2;163;190;140mlist[38;2;192;197;206m"[38;2;192;197;206m,[38;2;192;197;206m [38;2;192;197;206mPrescriptionViewSet[38;2;192;197;206m,[38;2;192;197;206m [38;2;191;97;106mbasename[38;2;192;197;206m=[38;2;192;197;206m"[38;2;163;190;140mprescription[38;2;192;197;206m"[K
[0m[48;2;40;67;43m[39m+    31[0m:[39m[48;2;24;38;30m [38;2;192;197;206m)[K
[0m[48;2;40;67;43m[39m+    32[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    33[0m:[39m[48;2;24;38;30m [38;2;101;115;126m#[38;2;101;115;126m The two viewsets live under different top-level paths in the API[K
[0m[48;2;40;67;43m[39m+    34[0m:[39m[48;2;24;38;30m [38;2;101;115;126m# (``/prescription-templates/`` and ``/prescriptions/``) so we expose[K
[0m[48;2;40;67;43m[39m+    35[0m:[39m[48;2;24;38;30m [38;2;101;115;126m# them as *two* url-lists to keep the mount points clean.[K
[0m[48;2;40;67;43m[39m+    36[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    37[0m:[39m[48;2;24;38;30m [38;2;101;115;126mtemplates_router = DefaultRouter()[K
[0m[48;2;40;67;43m[39m+    38[0m:[39m[48;2;24;38;30m [38;2;101;115;126mtemplates_router.register([K
[0m[48;2;40;67;43m[39m+    39[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    r"", PrescriptionTemplateViewSet, basename="prescription-template"[K
[0m[48;2;40;67;43m[39m+    40[0m:[39m[48;2;24;38;30m [38;2;101;115;126m)[K
[0m[48;2;40;67;43m[39m+    41[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    42[0m:[39m[48;2;24;38;30m [38;2;101;115;126mprescriptions_router = DefaultRouter()[K
[0m[48;2;40;67;43m[39m+    43[0m:[39m[48;2;24;38;30m [38;2;101;115;126mprescriptions_router.register([K
[0m[48;2;40;67;43m[39m+    44[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    r"", PrescriptionViewSet, basename="prescription"[K
[0m[48;2;40;67;43m[39m+    45[0m:[39m[48;2;24;38;30m [38;2;101;115;126m)[K
[0m[48;2;40;67;43m[39m+    46[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    47[0m:[39m[48;2;24;38;30m [38;2;101;115;126m# --- Public url-lists (imported from config/urls.py) ------------------------[K
[0m[48;2;40;67;43m[39m+    48[0m:[39m[48;2;24;38;30m [38;2;101;115;126mtemplate_urlpatterns = templates_router.urls[K
[0m[48;2;40;67;43m[39m+    49[0m:[39m[48;2;24;38;30m [38;2;101;115;126mprescription_urlpatterns = prescriptions_router.urls[K
[0m[48;2;40;67;43m[39m+    50[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    51[0m:[39m[48;2;24;38;30m [38;2;101;115;126m# Action route: ``/api/v1/treatments/{treatment_id}/prescription/``[K
[0m[48;2;40;67;43m[39m+    52[0m:[39m[48;2;24;38;30m [38;2;101;115;126maction_urlpatterns = [[K
[0m[48;2;40;67;43m[39m+    53[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    path([K
[0m[48;2;40;67;43m[39m+    54[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        "<uuid:treatment_id>/prescription/",[K
[0m[48;2;40;67;43m[39m+    55[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        IssuePrescriptionActionView.as_view(),[K
[0m[48;2;40;67;43m[39m+    56[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        name="treatment-issue-prescription",[K
[0m[48;2;40;67;43m[39m+    57[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    ),[K
[0m[48;2;40;67;43m[39m+    58[0m:[39m[48;2;24;38;30m [38;2;101;115;126m][K
[0m[48;2;40;67;43m[39m+    59[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    60[0m:[39m[48;2;24;38;30m [38;2;101;115;126murlpatterns = template_urlpatterns[K
[0m[K
Creating: [38;5;141m/home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/apps/prescriptions/urls.py[0m
[38;5;244m - Completed in 0.0s[0m

I'll create the following file: [38;5;141m/home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/apps/prescriptions/admin.py[0m[38;5;244m (using tool: write)[0m

[48;2;40;67;43m[39m+     1[0m:[39m[48;2;24;38;30m [38;2;101;115;126m"""[38;2;101;115;126mDjango admin registrations for the ``prescriptions`` app.[38;2;101;115;126m"""[K
[0m[48;2;40;67;43m[39m+     2[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206m__future__[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206mannotations[K
[0m[48;2;40;67;43m[39m+     3[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     4[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206mdjango[38;2;192;197;206m.[38;2;192;197;206mcontrib[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206madmin[K
[0m[48;2;40;67;43m[39m+     5[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     6[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;180;142;173m.[38;2;192;197;206mmodels[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206mPrescription[38;2;192;197;206m,[38;2;192;197;206m [38;2;192;197;206mPrescriptionTemplate[K
[0m[48;2;40;67;43m[39m+     7[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     8[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     9[0m:[39m[48;2;24;38;30m [38;2;192;197;206m@[38;2;192;197;206madmin[38;2;192;197;206m.[38;2;191;97;106mregister[38;2;192;197;206m([38;2;192;197;206mPrescriptionTemplate[38;2;192;197;206m)[K
[0m[48;2;40;67;43m[39m+    10[0m:[39m[48;2;24;38;30m [38;2;180;142;173mclass[38;2;239;241;245m [38;2;235;203;139mPrescriptionTemplateAdmin[38;2;239;241;245m([38;2;163;190;140madmin[38;2;163;190;140m.[38;2;163;190;140mModelAdmin[38;2;239;241;245m)[38;2;239;241;245m:[K
[0m[48;2;40;67;43m[39m+    11[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;192;197;206mlist_display[38;2;192;197;206m [38;2;192;197;206m=[38;2;192;197;206m [38;2;192;197;206m([38;2;192;197;206m"[38;2;163;190;140mname[38;2;192;197;206m"[38;2;192;197;206m,[38;2;192;197;206m [38;2;192;197;206m"[38;2;163;190;140mcreated_by[38;2;192;197;206m"[38;2;192;197;206m,[38;2;192;197;206m [38;2;192;197;206m"[38;2;163;190;140mis_active[38;2;192;197;206m"[38;2;192;197;206m,[38;2;192;197;206m [38;2;192;197;206m"[38;2;163;190;140mcreated_at[38;2;192;197;206m"[38;2;192;197;206m)[K
[0m[48;2;40;67;43m[39m+    12[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;192;197;206mlist_filter[38;2;192;197;206m [38;2;192;197;206m=[38;2;192;197;206m [38;2;192;197;206m([38;2;192;197;206m"[38;2;163;190;140mis_active[38;2;192;197;206m"[38;2;192;197;206m,[38;2;192;197;206m)[K
[0m[48;2;40;67;43m[39m+    13[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;192;197;206msearch_fields[38;2;192;197;206m [38;2;192;197;206m=[38;2;192;197;206m [38;2;192;197;206m([38;2;192;197;206m"[38;2;163;190;140mname[38;2;192;197;206m"[38;2;192;197;206m,[38;2;192;197;206m [38;2;192;197;206m"[38;2;163;190;140mcontent[38;2;192;197;206m"[38;2;192;197;206m)[K
[0m[48;2;40;67;43m[39m+    14[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;192;197;206mreadonly_fields[38;2;192;197;206m [38;2;192;197;206m=[38;2;192;197;206m [38;2;192;197;206m([38;2;192;197;206m"[38;2;163;190;140mid[38;2;192;197;206m"[38;2;192;197;206m,[38;2;192;197;206m [38;2;192;197;206m"[38;2;163;190;140mcreated_at[38;2;192;197;206m"[38;2;192;197;206m,[38;2;192;197;206m [38;2;192;197;206m"[38;2;163;190;140mupdated_at[38;2;192;197;206m"[38;2;192;197;206m)[K
[0m[48;2;40;67;43m[39m+    15[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    16[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    17[0m:[39m[48;2;24;38;30m [38;2;192;197;206m@[38;2;192;197;206madmin[38;2;192;197;206m.[38;2;191;97;106mregister[38;2;192;197;206m([38;2;192;197;206mPrescription[38;2;192;197;206m)[K
[0m[48;2;40;67;43m[39m+    18[0m:[39m[48;2;24;38;30m [38;2;180;142;173mclass[38;2;239;241;245m [38;2;235;203;139mPrescriptionAdmin[38;2;239;241;245m([38;2;163;190;140madmin[38;2;163;190;140m.[38;2;163;190;140mModelAdmin[38;2;239;241;245m)[38;2;239;241;245m:[K
[0m[48;2;40;67;43m[39m+    19[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;192;197;206mlist_display[38;2;192;197;206m [38;2;192;197;206m=[38;2;192;197;206m [38;2;192;197;206m([K
[0m[48;2;40;67;43m[39m+    20[0m:[39m[48;2;24;38;30m [38;2;192;197;206m        [38;2;192;197;206m"[38;2;163;190;140mid[38;2;192;197;206m"[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+    21[0m:[39m[48;2;24;38;30m [38;2;192;197;206m        [38;2;192;197;206m"[38;2;163;190;140mtreatment[38;2;192;197;206m"[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+    22[0m:[39m[48;2;24;38;30m [38;2;192;197;206m        [38;2;192;197;206m"[38;2;163;190;140mtemplate[38;2;192;197;206m"[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+    23[0m:[39m[48;2;24;38;30m [38;2;192;197;206m        [38;2;192;197;206m"[38;2;163;190;140msent_to_telegram_at[38;2;192;197;206m"[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+    24[0m:[39m[48;2;24;38;30m [38;2;192;197;206m        [38;2;192;197;206m"[38;2;163;190;140mis_active[38;2;192;197;206m"[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+    25[0m:[39m[48;2;24;38;30m [38;2;192;197;206m        [38;2;192;197;206m"[38;2;163;190;140mcreated_at[38;2;192;197;206m"[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+    26[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;192;197;206m)[K
[0m[48;2;40;67;43m[39m+    27[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;192;197;206mlist_filter[38;2;192;197;206m [38;2;192;197;206m=[38;2;192;197;206m [38;2;192;197;206m([38;2;192;197;206m"[38;2;163;190;140mis_active[38;2;192;197;206m"[38;2;192;197;206m,[38;2;192;197;206m [38;2;192;197;206m"[38;2;163;190;140msent_to_telegram_at[38;2;192;197;206m"[38;2;192;197;206m)[K
[0m[48;2;40;67;43m[39m+    28[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;192;197;206msearch_fields[38;2;192;197;206m [38;2;192;197;206m=[38;2;192;197;206m [38;2;192;197;206m([38;2;192;197;206m"[38;2;163;190;140mcontent[38;2;192;197;206m"[38;2;192;197;206m,[38;2;192;197;206m [38;2;192;197;206m"[38;2;163;190;140mtreatment__id[38;2;192;197;206m"[38;2;192;197;206m)[K
[0m[48;2;40;67;43m[39m+    29[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;192;197;206mreadonly_fields[38;2;192;197;206m [38;2;192;197;206m=[38;2;192;197;206m [38;2;192;197;206m([38;2;192;197;206m"[38;2;163;190;140mid[38;2;192;197;206m"[38;2;192;197;206m,[38;2;192;197;206m [38;2;192;197;206m"[38;2;163;190;140mcreated_at[38;2;192;197;206m"[38;2;192;197;206m,[38;2;192;197;206m [38;2;192;197;206m"[38;2;163;190;140mupdated_at[38;2;192;197;206m"[38;2;192;197;206m)[K
[0m[K
Creating: [38;5;141m/home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/apps/prescriptions/admin.py[0m
[38;5;244m - Completed in 0.0s[0m

[38;5;141m> [0mNow create the migrations directory and wire the app into settings and URLs:[0m[0m
I'll create the following file: [38;5;141m/home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/apps/prescriptions/migrations/__init__.py[0m[38;5;244m (using tool: write)[0m

[K
Creating: [38;5;141m/home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/apps/prescriptions/migrations/__init__.py[0m
[38;5;244m - Completed in 0.1s[0m

I'll modify the following file: [38;5;141mdentacrm/backend/config/settings/base.py[0m[38;5;244m (using tool: write)[0m

[48;2;43;48;59m[39m  121, 121[0m:[39m[48;2;43;48;59m [38;2;192;197;206m    [38;2;192;197;206m"[38;2;163;190;140mapps.treatments[38;2;192;197;206m"[38;2;192;197;206m,[K
[0m[48;2;43;48;59m[39m  122, 122[0m:[39m[48;2;43;48;59m [38;2;192;197;206m    [38;2;192;197;206m"[38;2;163;190;140mapps.odontogram[38;2;192;197;206m"[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+      123[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;192;197;206m"[38;2;163;190;140mapps.prescriptions[38;2;192;197;206m"[38;2;192;197;206m,[K
[0m[48;2;43;48;59m[39m  123, 124[0m:[39m[48;2;43;48;59m [38;2;43;48;59m][K
[0m[K
Updating: [38;5;141mdentacrm/backend/config/settings/base.py[0m
[38;5;244m - Completed in 0.1s[0m

[38;5;141m> [0mNow update [38;5;10mconfig/urls.py[0m to include prescription routes. The two viewsets need to be mounted at different top-level paths and the action route needs to hang off the treatments path:[0m[0m
I'll modify the following file: [38;5;141mdentacrm/backend/config/urls.py[0m[38;5;244m (using tool: write)[0m

[48;2;43;48;59m[39m  41, 41[0m:[39m[48;2;43;48;59m [38;2;192;197;206m    [38;2;143;161;179mpath[38;2;192;197;206m([38;2;192;197;206m"[38;2;163;190;140mtreatments/[38;2;192;197;206m"[38;2;192;197;206m,[38;2;192;197;206m [38;2;143;161;179minclude[38;2;192;197;206m([38;2;192;197;206m"[38;2;163;190;140mapps.treatments.urls[38;2;192;197;206m"[38;2;192;197;206m,[38;2;192;197;206m [38;2;191;97;106mnamespace[38;2;192;197;206m=[38;2;192;197;206m"[38;2;163;190;140mtreatments[38;2;192;197;206m"[38;2;192;197;206m)[38;2;192;197;206m)[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+     42[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;143;161;179mpath[38;2;192;197;206m([K
[0m[48;2;40;67;43m[39m+     43[0m:[39m[48;2;24;38;30m [38;2;192;197;206m        [38;2;192;197;206m"[38;2;163;190;140mtreatments/[38;2;192;197;206m"[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+     44[0m:[39m[48;2;24;38;30m [38;2;192;197;206m        [38;2;143;161;179minclude[38;2;192;197;206m([K
[0m[48;2;40;67;43m[39m+     45[0m:[39m[48;2;24;38;30m [38;2;192;197;206m            [38;2;192;197;206m([K
[0m[48;2;40;67;43m[39m+     46[0m:[39m[48;2;24;38;30m [38;2;192;197;206m                [38;2;150;181;180m__import__[38;2;192;197;206m([K
[0m[48;2;40;67;43m[39m+     47[0m:[39m[48;2;24;38;30m [38;2;192;197;206m                    [38;2;192;197;206m"[38;2;163;190;140mapps.prescriptions.urls[38;2;192;197;206m"[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+     48[0m:[39m[48;2;24;38;30m [38;2;192;197;206m                    [38;2;191;97;106mfromlist[38;2;192;197;206m=[38;2;192;197;206m[[38;2;192;197;206m"[38;2;163;190;140maction_urlpatterns[38;2;192;197;206m"[38;2;192;197;206m][38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+     49[0m:[39m[48;2;24;38;30m [38;2;192;197;206m                [38;2;192;197;206m)[38;2;192;197;206m.[38;2;192;197;206maction_urlpatterns[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+     50[0m:[39m[48;2;24;38;30m [38;2;192;197;206m                [38;2;192;197;206m"[38;2;163;190;140mprescriptions-action[38;2;192;197;206m"[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+     51[0m:[39m[48;2;24;38;30m [38;2;192;197;206m            [38;2;192;197;206m)[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+     52[0m:[39m[48;2;24;38;30m [38;2;192;197;206m        [38;2;192;197;206m)[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+     53[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;192;197;206m)[38;2;192;197;206m,[K
[0m[48;2;43;48;59m[39m  42, 54[0m:[39m[48;2;43;48;59m [38;2;192;197;206m    [38;2;143;161;179mpath[38;2;192;197;206m([38;2;192;197;206m"[38;2;163;190;140mtooth-records/[38;2;192;197;206m"[38;2;192;197;206m,[38;2;192;197;206m [38;2;143;161;179minclude[38;2;192;197;206m([38;2;192;197;206m"[38;2;163;190;140mapps.odontogram.urls[38;2;192;197;206m"[38;2;192;197;206m,[38;2;192;197;206m [38;2;191;97;106mnamespace[38;2;192;197;206m=[38;2;192;197;206m"[38;2;163;190;140modontogram[38;2;192;197;206m"[38;2;192;197;206m)[38;2;192;197;206m)[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+     55[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;143;161;179mpath[38;2;192;197;206m([K
[0m[48;2;40;67;43m[39m+     56[0m:[39m[48;2;24;38;30m [38;2;192;197;206m        [38;2;192;197;206m"[38;2;163;190;140mprescription-templates/[38;2;192;197;206m"[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+     57[0m:[39m[48;2;24;38;30m [38;2;192;197;206m        [38;2;143;161;179minclude[38;2;192;197;206m([K
[0m[48;2;40;67;43m[39m+     58[0m:[39m[48;2;24;38;30m [38;2;192;197;206m            [38;2;192;197;206m([K
[0m[48;2;40;67;43m[39m+     59[0m:[39m[48;2;24;38;30m [38;2;192;197;206m                [38;2;150;181;180m__import__[38;2;192;197;206m([K
[0m[48;2;40;67;43m[39m+     60[0m:[39m[48;2;24;38;30m [38;2;192;197;206m                    [38;2;192;197;206m"[38;2;163;190;140mapps.prescriptions.urls[38;2;192;197;206m"[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+     61[0m:[39m[48;2;24;38;30m [38;2;192;197;206m                    [38;2;191;97;106mfromlist[38;2;192;197;206m=[38;2;192;197;206m[[38;2;192;197;206m"[38;2;163;190;140mtemplate_urlpatterns[38;2;192;197;206m"[38;2;192;197;206m][38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+     62[0m:[39m[48;2;24;38;30m [38;2;192;197;206m                [38;2;192;197;206m)[38;2;192;197;206m.[38;2;192;197;206mtemplate_urlpatterns[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+     63[0m:[39m[48;2;24;38;30m [38;2;192;197;206m                [38;2;192;197;206m"[38;2;163;190;140mprescription-templates[38;2;192;197;206m"[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+     64[0m:[39m[48;2;24;38;30m [38;2;192;197;206m            [38;2;192;197;206m)[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+     65[0m:[39m[48;2;24;38;30m [38;2;192;197;206m        [38;2;192;197;206m)[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+     66[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;192;197;206m)[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+     67[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;143;161;179mpath[38;2;192;197;206m([K
[0m[48;2;40;67;43m[39m+     68[0m:[39m[48;2;24;38;30m [38;2;192;197;206m        [38;2;192;197;206m"[38;2;163;190;140mprescriptions/[38;2;192;197;206m"[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+     69[0m:[39m[48;2;24;38;30m [38;2;192;197;206m        [38;2;143;161;179minclude[38;2;192;197;206m([K
[0m[48;2;40;67;43m[39m+     70[0m:[39m[48;2;24;38;30m [38;2;192;197;206m            [38;2;192;197;206m([K
[0m[48;2;40;67;43m[39m+     71[0m:[39m[48;2;24;38;30m [38;2;192;197;206m                [38;2;150;181;180m__import__[38;2;192;197;206m([K
[0m[48;2;40;67;43m[39m+     72[0m:[39m[48;2;24;38;30m [38;2;192;197;206m                    [38;2;192;197;206m"[38;2;163;190;140mapps.prescriptions.urls[38;2;192;197;206m"[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+     73[0m:[39m[48;2;24;38;30m [38;2;192;197;206m                    [38;2;191;97;106mfromlist[38;2;192;197;206m=[38;2;192;197;206m[[38;2;192;197;206m"[38;2;163;190;140mprescription_urlpatterns[38;2;192;197;206m"[38;2;192;197;206m][38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+     74[0m:[39m[48;2;24;38;30m [38;2;192;197;206m                [38;2;192;197;206m)[38;2;192;197;206m.[38;2;192;197;206mprescription_urlpatterns[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+     75[0m:[39m[48;2;24;38;30m [38;2;192;197;206m                [38;2;192;197;206m"[38;2;163;190;140mprescriptions[38;2;192;197;206m"[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+     76[0m:[39m[48;2;24;38;30m [38;2;192;197;206m            [38;2;192;197;206m)[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+     77[0m:[39m[48;2;24;38;30m [38;2;192;197;206m        [38;2;192;197;206m)[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+     78[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;192;197;206m)[38;2;192;197;206m,[K
[0m[48;2;43;48;59m[39m  43, 79[0m:[39m[48;2;43;48;59m [38;2;43;48;59m][K
[0m[K
Updating: [38;5;141mdentacrm/backend/config/urls.py[0m
[38;5;244m - Completed in 0.1s[0m

[38;5;141m> [0mLet me clean up the URL config with proper imports:[0m[0m
I'll create the following file: [38;5;141mdentacrm/backend/config/urls.py[0m[38;5;244m (using tool: write)[0m

[48;2;43;48;59m[39m    1,  1[0m:[39m[48;2;43;48;59m [38;2;101;115;126m"""[38;2;101;115;126mRoot URL configuration for DentaCRM.[K
[0m[48;2;43;48;59m[39m    2,  2[0m:[39m[48;2;43;48;59m [K
[0m[48;2;43;48;59m[39m    3,  3[0m:[39m[48;2;43;48;59m [38;2;101;115;126mThe API is versioned under ``/api/v1/`` and every app registers its own[K
[0m[48;2;43;48;59m[39m    4,  4[0m:[39m[48;2;43;48;59m [38;2;101;115;126mrouter / URLconf via ``config.urls`` include statements added as the app[K
[0m[48;2;43;48;59m[39m    5,  5[0m:[39m[48;2;43;48;59m [38;2;101;115;126mcomes online in subsequent build tasks.[K
[0m[48;2;43;48;59m[39m    6,  6[0m:[39m[48;2;43;48;59m [38;2;101;115;126m"""[K
[0m[48;2;43;48;59m[39m    7,  7[0m:[39m[48;2;43;48;59m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206m__future__[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206mannotations[K
[0m[48;2;43;48;59m[39m    8,  8[0m:[39m[48;2;43;48;59m [K
[0m[48;2;43;48;59m[39m    9,  9[0m:[39m[48;2;43;48;59m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206mdjango[38;2;192;197;206m.[38;2;192;197;206mconf[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206msettings[K
[0m[48;2;43;48;59m[39m   10, 10[0m:[39m[48;2;43;48;59m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206mdjango[38;2;192;197;206m.[38;2;192;197;206mconf[38;2;192;197;206m.[38;2;192;197;206murls[38;2;192;197;206m.[38;2;192;197;206mstatic[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206mstatic[K
[0m[48;2;43;48;59m[39m   11, 11[0m:[39m[48;2;43;48;59m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206mdjango[38;2;192;197;206m.[38;2;192;197;206mcontrib[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206madmin[K
[0m[48;2;43;48;59m[39m   12, 12[0m:[39m[48;2;43;48;59m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206mdjango[38;2;192;197;206m.[38;2;192;197;206mhttp[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206mJsonResponse[K
[0m[48;2;43;48;59m[39m   13, 13[0m:[39m[48;2;43;48;59m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206mdjango[38;2;192;197;206m.[38;2;192;197;206murls[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206minclude[38;2;192;197;206m,[38;2;192;197;206m [38;2;192;197;206mpath[K
[0m[48;2;43;48;59m[39m   14, 14[0m:[39m[48;2;43;48;59m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206mdrf_spectacular[38;2;192;197;206m.[38;2;192;197;206mviews[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206m([K
[0m[48;2;43;48;59m[39m   15, 15[0m:[39m[48;2;43;48;59m [38;2;192;197;206m    [38;2;192;197;206mSpectacularAPIView[38;2;192;197;206m,[K
[0m[48;2;43;48;59m[39m   16, 16[0m:[39m[48;2;43;48;59m [38;2;192;197;206m    [38;2;192;197;206mSpectacularRedocView[38;2;192;197;206m,[K
[0m[48;2;43;48;59m[39m   17, 17[0m:[39m[48;2;43;48;59m [38;2;192;197;206m    [38;2;192;197;206mSpectacularSwaggerView[38;2;192;197;206m,[K
[0m[48;2;43;48;59m[39m   18, 18[0m:[39m[48;2;43;48;59m [38;2;192;197;206m)[K
[0m[48;2;43;48;59m[39m   19, 19[0m:[39m[48;2;43;48;59m [K
[0m[48;2;40;67;43m[39m+      20[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206mapps[38;2;192;197;206m.[38;2;192;197;206mprescriptions[38;2;192;197;206m.[38;2;192;197;206murls[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206m([K
[0m[48;2;40;67;43m[39m+      21[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;192;197;206maction_urlpatterns[38;2;192;197;206m [38;2;180;142;173mas[38;2;192;197;206m [38;2;192;197;206mprescription_action_urls[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+      22[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;192;197;206mprescription_urlpatterns[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+      23[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;192;197;206mtemplate_urlpatterns[38;2;192;197;206m [38;2;180;142;173mas[38;2;192;197;206m [38;2;192;197;206mprescription_template_urls[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+      24[0m:[39m[48;2;24;38;30m [38;2;192;197;206m)[K
[0m[48;2;40;67;43m[39m+      25[0m:[39m[48;2;24;38;30m [K
[0m[48;2;43;48;59m[39m   20, 26[0m:[39m[48;2;43;48;59m [K
[0m[48;2;43;48;59m[39m   21, 27[0m:[39m[48;2;43;48;59m [38;2;180;142;173mdef[38;2;192;197;206m [38;2;143;161;179mhealthcheck[38;2;192;197;206m([38;2;191;97;106m_request[38;2;192;197;206m)[38;2;192;197;206m:[K
[0m[48;2;43;48;59m[39m   22, 28[0m:[39m[48;2;43;48;59m [38;2;192;197;206m    [38;2;101;115;126m"""[38;2;101;115;126mSimple liveness endpoint used by docker healthchecks.[38;2;101;115;126m"""[K
[0m[48;2;43;48;59m[39m   23, 29[0m:[39m[48;2;43;48;59m [38;2;192;197;206m    [38;2;180;142;173mreturn[38;2;192;197;206m [38;2;143;161;179mJsonResponse[38;2;192;197;206m([38;2;192;197;206m{[38;2;192;197;206m"[38;2;163;190;140mstatus[38;2;192;197;206m"[38;2;192;197;206m:[38;2;192;197;206m [38;2;192;197;206m"[38;2;163;190;140mok[38;2;192;197;206m"[38;2;192;197;206m,[38;2;192;197;206m [38;2;192;197;206m"[38;2;163;190;140mservice[38;2;192;197;206m"[38;2;192;197;206m:[38;2;192;197;206m [38;2;192;197;206m"[38;2;163;190;140mdentacrm-backend[38;2;192;197;206m"[38;2;192;197;206m}[38;2;192;197;206m)[K
[0m[48;2;43;48;59m[39m   24, 30[0m:[39m[48;2;43;48;59m [K
[0m[48;2;43;48;59m[39m   25, 31[0m:[39m[48;2;43;48;59m [K
[0m[48;2;43;48;59m[39m   26, 32[0m:[39m[48;2;43;48;59m [38;2;101;115;126m#[38;2;101;115;126m ---------------------------------------------------------------------------[K
[0m[48;2;43;48;59m[39m   27, 33[0m:[39m[48;2;43;48;59m [38;2;101;115;126m# API v1[K
[0m[48;2;43;48;59m[39m   28, 34[0m:[39m[48;2;43;48;59m [38;2;101;115;126m# ---------------------------------------------------------------------------[K
[0m[48;2;43;48;59m[39m   29, 35[0m:[39m[48;2;43;48;59m [38;2;101;115;126m# App URL includes are appended here as new apps come online. Each entry[K
[0m[48;2;43;48;59m[39m   30, 36[0m:[39m[48;2;43;48;59m [38;2;101;115;126m# is a real, importable urls module — no dangling includes.[K
[0m[48;2;43;48;59m[39m   31, 37[0m:[39m[48;2;43;48;59m [38;2;101;115;126mapi_v1_patterns: list = [[K
[0m[48;2;43;48;59m[39m   32, 38[0m:[39m[48;2;43;48;59m [38;2;101;115;126m    path("auth/", include("apps.accounts.urls", namespace="accounts")),[K
[0m[48;2;43;48;59m[39m   33, 39[0m:[39m[48;2;43;48;59m [38;2;101;115;126m    path("departments/", include("apps.departments.urls", namespace="departments")),[K
[0m[48;2;43;48;59m[39m   34, 40[0m:[39m[48;2;43;48;59m [38;2;101;115;126m    path("doctors/", include("apps.doctors.urls", namespace="doctors")),[K
[0m[48;2;43;48;59m[39m   35, 41[0m:[39m[48;2;43;48;59m [38;2;101;115;126m    path([K
[0m[48;2;43;48;59m[39m   36, 42[0m:[39m[48;2;43;48;59m [38;2;101;115;126m        "procedure-types/",[K
[0m[48;2;43;48;59m[39m   37, 43[0m:[39m[48;2;43;48;59m [38;2;101;115;126m        include("apps.doctors.procedure_urls", namespace="procedure-types"),[K
[0m[48;2;43;48;59m[39m   38, 44[0m:[39m[48;2;43;48;59m [38;2;101;115;126m    ),[K
[0m[48;2;43;48;59m[39m   39, 45[0m:[39m[48;2;43;48;59m [38;2;101;115;126m    path("patients/", include("apps.patients.urls", namespace="patients")),[K
[0m[48;2;43;48;59m[39m   40, 46[0m:[39m[48;2;43;48;59m [38;2;101;115;126m    path("appointments/", include("apps.scheduling.urls", namespace="scheduling")),[K
[0m[48;2;43;48;59m[39m   41, 47[0m:[39m[48;2;43;48;59m [38;2;101;115;126m    path("treatments/", include("apps.treatments.urls", namespace="treatments")),[K
[0m[48;2;79;40;40m[39m-  42    [0m:[39m[48;2;36;25;28m [38;2;101;115;126m    path([K
[0m[48;2;79;40;40m[39m-  43    [0m:[39m[48;2;36;25;28m [38;2;101;115;126m        "treatments/",[K
[0m[48;2;79;40;40m[39m-  44    [0m:[39m[48;2;36;25;28m [38;2;101;115;126m        include([K
[0m[48;2;79;40;40m[39m-  45    [0m:[39m[48;2;36;25;28m [38;2;101;115;126m            ([K
[0m[48;2;79;40;40m[39m-  46    [0m:[39m[48;2;36;25;28m [38;2;101;115;126m                __import__([K
[0m[48;2;79;40;40m[39m-  47    [0m:[39m[48;2;36;25;28m [38;2;101;115;126m                    "apps.prescriptions.urls",[K
[0m[48;2;79;40;40m[39m-  48    [0m:[39m[48;2;36;25;28m [38;2;101;115;126m                    fromlist=["action_urlpatterns"],[K
[0m[48;2;79;40;40m[39m-  49    [0m:[39m[48;2;36;25;28m [38;2;101;115;126m                ).action_urlpatterns,[K
[0m[48;2;79;40;40m[39m-  50    [0m:[39m[48;2;36;25;28m [38;2;101;115;126m                "prescriptions-action",[K
[0m[48;2;79;40;40m[39m-  51    [0m:[39m[48;2;36;25;28m [38;2;101;115;126m            ),[K
[0m[48;2;79;40;40m[39m-  52    [0m:[39m[48;2;36;25;28m [38;2;101;115;126m        ),[K
[0m[48;2;79;40;40m[39m-  53    [0m:[39m[48;2;36;25;28m [38;2;101;115;126m    ),[K
[0m[48;2;40;67;43m[39m+      48[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    # ``/api/v1/treatments/{id}/prescription/`` — POST issues a retsept.[K
[0m[48;2;40;67;43m[39m+      49[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    # Mounted *before* the treatments viewset router in DRF terms so the[K
[0m[48;2;40;67;43m[39m+      50[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    # named route wins; DRF routers match by full path so order-safe here.[K
[0m[48;2;40;67;43m[39m+      51[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    path("treatments/", include((prescription_action_urls, "prescriptions-action"))),[K
[0m[48;2;43;48;59m[39m   54, 52[0m:[39m[48;2;43;48;59m [38;2;101;115;126m    path("tooth-records/", include("apps.odontogram.urls", namespace="odontogram")),[K
[0m[48;2;43;48;59m[39m   55, 53[0m:[39m[48;2;43;48;59m [38;2;101;115;126m    path([K
[0m[48;2;43;48;59m[39m   56, 54[0m:[39m[48;2;43;48;59m [38;2;101;115;126m        "prescription-templates/",[K
[0m[48;2;79;40;40m[39m-  57    [0m:[39m[48;2;36;25;28m [38;2;101;115;126m        include([K
[0m[48;2;79;40;40m[39m-  58    [0m:[39m[48;2;36;25;28m [38;2;101;115;126m            ([K
[0m[48;2;79;40;40m[39m-  59    [0m:[39m[48;2;36;25;28m [38;2;101;115;126m                __import__([K
[0m[48;2;79;40;40m[39m-  60    [0m:[39m[48;2;36;25;28m [38;2;101;115;126m                    "apps.prescriptions.urls",[K
[0m[48;2;79;40;40m[39m-  61    [0m:[39m[48;2;36;25;28m [38;2;101;115;126m                    fromlist=["template_urlpatterns"],[K
[0m[48;2;79;40;40m[39m-  62    [0m:[39m[48;2;36;25;28m [38;2;101;115;126m                ).template_urlpatterns,[K
[0m[48;2;79;40;40m[39m-  63    [0m:[39m[48;2;36;25;28m [38;2;101;115;126m                "prescription-templates",[K
[0m[48;2;79;40;40m[39m-  64    [0m:[39m[48;2;36;25;28m [38;2;101;115;126m            ),[K
[0m[48;2;79;40;40m[39m-  65    [0m:[39m[48;2;36;25;28m [38;2;101;115;126m        ),[K
[0m[48;2;40;67;43m[39m+      55[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        include((prescription_template_urls, "prescription-templates")),[K
[0m[48;2;43;48;59m[39m   66, 56[0m:[39m[48;2;43;48;59m [38;2;101;115;126m    ),[K
[0m[48;2;43;48;59m[39m   67, 57[0m:[39m[48;2;43;48;59m [38;2;101;115;126m    path([K
[0m[48;2;43;48;59m[39m   68, 58[0m:[39m[48;2;43;48;59m [38;2;101;115;126m        "prescriptions/",[K
[0m[48;2;79;40;40m[39m-  69    [0m:[39m[48;2;36;25;28m [38;2;101;115;126m        include([K
[0m[48;2;79;40;40m[39m-  70    [0m:[39m[48;2;36;25;28m [38;2;101;115;126m            ([K
[0m[48;2;79;40;40m[39m-  71    [0m:[39m[48;2;36;25;28m [38;2;101;115;126m                __import__([K
[0m[48;2;79;40;40m[39m-  72    [0m:[39m[48;2;36;25;28m [38;2;101;115;126m                    "apps.prescriptions.urls",[K
[0m[48;2;79;40;40m[39m-  73    [0m:[39m[48;2;36;25;28m [38;2;101;115;126m                    fromlist=["prescription_urlpatterns"],[K
[0m[48;2;79;40;40m[39m-  74    [0m:[39m[48;2;36;25;28m [38;2;101;115;126m                ).prescription_urlpatterns,[K
[0m[48;2;79;40;40m[39m-  75    [0m:[39m[48;2;36;25;28m [38;2;101;115;126m                "prescriptions",[K
[0m[48;2;79;40;40m[39m-  76    [0m:[39m[48;2;36;25;28m [38;2;101;115;126m            ),[K
[0m[48;2;79;40;40m[39m-  77    [0m:[39m[48;2;36;25;28m [38;2;101;115;126m        ),[K
[0m[48;2;40;67;43m[39m+      59[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        include((prescription_urlpatterns, "prescriptions")),[K
[0m[48;2;43;48;59m[39m   78, 60[0m:[39m[48;2;43;48;59m [38;2;101;115;126m    ),[K
[0m[48;2;43;48;59m[39m   79, 61[0m:[39m[48;2;43;48;59m [38;2;101;115;126m][K
[0m[48;2;43;48;59m[39m   80, 62[0m:[39m[48;2;43;48;59m [K
[0m[48;2;43;48;59m[39m   81, 63[0m:[39m[48;2;43;48;59m [K
[0m[48;2;43;48;59m[39m   82, 64[0m:[39m[48;2;43;48;59m [38;2;101;115;126murlpatterns = [[K
[0m[48;2;43;48;59m[39m   83, 65[0m:[39m[48;2;43;48;59m [38;2;101;115;126m    # Admin (Django-admin is kept enabled so bosh_shifokor can inspect data[K
[0m[48;2;43;48;59m[39m   84, 66[0m:[39m[48;2;43;48;59m [38;2;101;115;126m    # during development; secured behind ADMIN_URL in prod via env).[K
[0m[48;2;43;48;59m[39m   85, 67[0m:[39m[48;2;43;48;59m [38;2;101;115;126m    path("admin/", admin.site.urls),[K
[0m[48;2;43;48;59m[39m   86, 68[0m:[39m[48;2;43;48;59m [K
[0m[48;2;43;48;59m[39m   87, 69[0m:[39m[48;2;43;48;59m [38;2;101;115;126m    # Health check[K
[0m[48;2;43;48;59m[39m   88, 70[0m:[39m[48;2;43;48;59m [38;2;101;115;126m    path("healthz/", healthcheck, name="healthz"),[K
[0m[48;2;43;48;59m[39m   89, 71[0m:[39m[48;2;43;48;59m [K
[0m[48;2;43;48;59m[39m   90, 72[0m:[39m[48;2;43;48;59m [38;2;101;115;126m    # OpenAPI / Swagger[K
[0m[48;2;43;48;59m[39m   91, 73[0m:[39m[48;2;43;48;59m [38;2;101;115;126m    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),[K
[0m[48;2;43;48;59m[39m   92, 74[0m:[39m[48;2;43;48;59m [38;2;101;115;126m    path([K
[0m[48;2;43;48;59m[39m   93, 75[0m:[39m[48;2;43;48;59m [38;2;101;115;126m        "api/docs/",[K
[0m[48;2;43;48;59m[39m   94, 76[0m:[39m[48;2;43;48;59m [38;2;101;115;126m        SpectacularSwaggerView.as_view(url_name="schema"),[K
[0m[48;2;43;48;59m[39m   95, 77[0m:[39m[48;2;43;48;59m [38;2;101;115;126m        name="swagger-ui",[K
[0m[48;2;43;48;59m[39m   96, 78[0m:[39m[48;2;43;48;59m [38;2;101;115;126m    ),[K
[0m[48;2;43;48;59m[39m   97, 79[0m:[39m[48;2;43;48;59m [38;2;101;115;126m    path([K
[0m[48;2;43;48;59m[39m   98, 80[0m:[39m[48;2;43;48;59m [38;2;101;115;126m        "api/redoc/",[K
[0m[48;2;43;48;59m[39m   99, 81[0m:[39m[48;2;43;48;59m [38;2;101;115;126m        SpectacularRedocView.as_view(url_name="schema"),[K
[0m[48;2;43;48;59m[39m  100, 82[0m:[39m[48;2;43;48;59m [38;2;101;115;126m        name="redoc",[K
[0m[48;2;43;48;59m[39m  101, 83[0m:[39m[48;2;43;48;59m [38;2;101;115;126m    ),[K
[0m[48;2;43;48;59m[39m  102, 84[0m:[39m[48;2;43;48;59m [K
[0m[48;2;43;48;59m[39m  103, 85[0m:[39m[48;2;43;48;59m [38;2;101;115;126m    # Versioned API[K
[0m[48;2;43;48;59m[39m  104, 86[0m:[39m[48;2;43;48;59m [38;2;101;115;126m    path("api/v1/", include((api_v1_patterns, "v1"), namespace="v1")),[K
[0m[48;2;43;48;59m[39m  105, 87[0m:[39m[48;2;43;48;59m [38;2;101;115;126m][K
[0m[48;2;43;48;59m[39m  106, 88[0m:[39m[48;2;43;48;59m [K
[0m[48;2;43;48;59m[39m  107, 89[0m:[39m[48;2;43;48;59m [K
[0m[48;2;43;48;59m[39m  108, 90[0m:[39m[48;2;43;48;59m [38;2;101;115;126m# Serve media/static in dev — production uses nginx/S3.[K
[0m[48;2;43;48;59m[39m  109, 91[0m:[39m[48;2;43;48;59m [38;2;101;115;126mif settings.DEBUG:[K
[0m[48;2;43;48;59m[39m  110, 92[0m:[39m[48;2;43;48;59m [38;2;101;115;126m    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)[K
[0m[48;2;43;48;59m[39m  111, 93[0m:[39m[48;2;43;48;59m [38;2;101;115;126m    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)[K
[0m[K
Replacing: [38;5;141mdentacrm/backend/config/urls.py[0m
[38;5;244m - Completed in 0.1s[0m

[38;5;141m> [0mNow generate migrations and verify Django is happy:[0m[0m
I will run the following command: [38;5;141msource .venv/bin/activate && python manage.py makemigrations prescriptions 2>&1[0m (in [38;5;141mdentacrm/backend[0m)[38;5;244m (using tool: shell)[0m

Migrations for 'prescriptions':
  apps/prescriptions/migrations/0001_initial.py
    - Create model PrescriptionTemplate
    - Create model Prescription
    - Create index pr_tpl_name_idx on field(s) name of model prescriptiontemplate
    - Create constraint prescriptions_template_unique_name_per_owner on model prescriptiontemplate
    - Create index pr_tr_idx on field(s) treatment, -created_at of model prescription
    - Create index pr_sent_idx on field(s) sent_to_telegram_at of model prescription
[38;5;244m - Completed in 2.277s[0m

I will run the following command: [38;5;141msource .venv/bin/activate && python manage.py check 2>&1[0m (in [38;5;141mdentacrm/backend[0m)[38;5;244m (using tool: shell)[0m

System check identified no issues (0 silenced).
[38;5;244m - Completed in 1.896s[0m

I will run the following command: [38;5;141msource .venv/bin/activate && python manage.py migrate 2>&1 | tail -10[0m (in [38;5;141mdentacrm/backend[0m)[38;5;244m (using tool: shell)[0m

Operations to perform:
  Apply all migrations: accounts, admin, auth, contenttypes, departments, django_celery_beat, django_celery_results, doctors, odontogram, patients, prescriptions, scheduling, sessions, token_blacklist, treatments
Running migrations:
  Applying prescriptions.0001_initial... OK
[38;5;244m - Completed in 2.724s[0m

[38;5;141m> [0mMigration works. Now write tests for the prescriptions app:[0m[0m
Reading file: [38;5;141m/home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/tests/test_treatments.py[0m, from line [38;5;141m1[0m to [38;5;141m100[0m[38;5;244m (using tool: read)[0m
[38;5;10m ✓ [0mSuccessfully read [38;5;244m2706 bytes[0m from /home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/tests/test_treatments.py
[38;5;244m - Completed in 0.0s[0m

Reading file: [38;5;141m/home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/tests/test_treatments.py[0m, from line [38;5;141m100[0m to [38;5;141m220[0m[38;5;244m (using tool: read)[0m
[38;5;10m ✓ [0mSuccessfully read [38;5;244m2895 bytes[0m from /home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/tests/test_treatments.py
[38;5;244m - Completed in 0.0s[0m

[38;5;141m> [0mNow let me write comprehensive tests for prescriptions:[0m[0m
I'll create the following file: [38;5;141m/home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/tests/test_prescriptions.py[0m[38;5;244m (using tool: write)[0m

[48;2;40;67;43m[39m+      1[0m:[39m[48;2;24;38;30m [38;2;101;115;126m"""[38;2;101;115;126mTests for the ``prescriptions`` app (T14).[K
[0m[48;2;40;67;43m[39m+      2[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+      3[0m:[39m[48;2;24;38;30m [38;2;101;115;126mCovers PROJECT_BRIEF acceptance criteria:[K
[0m[48;2;40;67;43m[39m+      4[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+      5[0m:[39m[48;2;24;38;30m [38;2;101;115;126m* #6 CRUD — templates: list/create/retrieve/update/delete.[K
[0m[48;2;40;67;43m[39m+      6[0m:[39m[48;2;24;38;30m [38;2;101;115;126m* #10 Retsept Telegram orqali bemorga yuboriladi — the ``send`` path[K
[0m[48;2;40;67;43m[39m+      7[0m:[39m[48;2;24;38;30m [38;2;101;115;126m  sets ``sentToTelegramAt`` when the sender succeeds and leaves it[K
[0m[48;2;40;67;43m[39m+      8[0m:[39m[48;2;24;38;30m [38;2;101;115;126m  ``None`` otherwise.[K
[0m[48;2;40;67;43m[39m+      9[0m:[39m[48;2;24;38;30m [38;2;101;115;126m* #4 RBAC — bosh_shifokor writes anywhere; doctor writes own; admin[K
[0m[48;2;40;67;43m[39m+     10[0m:[39m[48;2;24;38;30m [38;2;101;115;126m  reads only; anonymous rejected.[K
[0m[48;2;40;67;43m[39m+     11[0m:[39m[48;2;24;38;30m [38;2;101;115;126m* Standard error envelope + camelCase serialisation.[K
[0m[48;2;40;67;43m[39m+     12[0m:[39m[48;2;24;38;30m [38;2;101;115;126m* Filters — ``?treatment=&patient=&doctor=&is_sent=``.[K
[0m[48;2;40;67;43m[39m+     13[0m:[39m[48;2;24;38;30m [38;2;101;115;126m* Placeholder substitution — {patient_name}, {doctor_name}, {diagnosis}.[K
[0m[48;2;40;67;43m[39m+     14[0m:[39m[48;2;24;38;30m [38;2;101;115;126m"""[K
[0m[48;2;40;67;43m[39m+     15[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206m__future__[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206mannotations[K
[0m[48;2;40;67;43m[39m+     16[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     17[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206mdatetime[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206mdatetime[38;2;192;197;206m,[38;2;192;197;206m [38;2;192;197;206mtime[38;2;192;197;206m,[38;2;192;197;206m [38;2;192;197;206mtimedelta[K
[0m[48;2;40;67;43m[39m+     18[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206mdecimal[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206mDecimal[K
[0m[48;2;40;67;43m[39m+     19[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206munittest[38;2;192;197;206m.[38;2;192;197;206mmock[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206mpatch[K
[0m[48;2;40;67;43m[39m+     20[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     21[0m:[39m[48;2;24;38;30m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206mpytest[K
[0m[48;2;40;67;43m[39m+     22[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206mdjango[38;2;192;197;206m.[38;2;192;197;206mcontrib[38;2;192;197;206m.[38;2;192;197;206mauth[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206mget_user_model[K
[0m[48;2;40;67;43m[39m+     23[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206mdjango[38;2;192;197;206m.[38;2;192;197;206mcore[38;2;192;197;206m.[38;2;192;197;206mexceptions[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206mValidationError[K
[0m[48;2;40;67;43m[39m+     24[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206mdjango[38;2;192;197;206m.[38;2;192;197;206mutils[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206mtimezone[K
[0m[48;2;40;67;43m[39m+     25[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206mrest_framework[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206mstatus[K
[0m[48;2;40;67;43m[39m+     26[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206mrest_framework[38;2;192;197;206m.[38;2;192;197;206mtest[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206mAPIClient[K
[0m[48;2;40;67;43m[39m+     27[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     28[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206mapps[38;2;192;197;206m.[38;2;192;197;206mdepartments[38;2;192;197;206m.[38;2;192;197;206mmodels[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206mDepartment[K
[0m[48;2;40;67;43m[39m+     29[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206mapps[38;2;192;197;206m.[38;2;192;197;206mdoctors[38;2;192;197;206m.[38;2;192;197;206mmodels[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206mCommissionBasis[38;2;192;197;206m,[38;2;192;197;206m [38;2;192;197;206mDoctorProfile[38;2;192;197;206m,[38;2;192;197;206m [38;2;192;197;206mProcedureType[K
[0m[48;2;40;67;43m[39m+     30[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206mapps[38;2;192;197;206m.[38;2;192;197;206mpatients[38;2;192;197;206m.[38;2;192;197;206mservices[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206mcreate_patient[K
[0m[48;2;40;67;43m[39m+     31[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206mapps[38;2;192;197;206m.[38;2;192;197;206mprescriptions[38;2;192;197;206m.[38;2;192;197;206mmodels[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206mPrescription[38;2;192;197;206m,[38;2;192;197;206m [38;2;192;197;206mPrescriptionTemplate[K
[0m[48;2;40;67;43m[39m+     32[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206mapps[38;2;192;197;206m.[38;2;192;197;206mprescriptions[38;2;192;197;206m.[38;2;192;197;206mselectors[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206m([K
[0m[48;2;40;67;43m[39m+     33[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;192;197;206mactive_templates[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+     34[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;192;197;206mfilter_prescriptions[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+     35[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;192;197;206mprescriptions_for_patient[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+     36[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;192;197;206mprescriptions_for_treatment[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+     37[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;192;197;206mtemplate_by_id[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+     38[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;192;197;206mtemplates_for_user[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+     39[0m:[39m[48;2;24;38;30m [38;2;192;197;206m)[K
[0m[48;2;40;67;43m[39m+     40[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206mapps[38;2;192;197;206m.[38;2;192;197;206mprescriptions[38;2;192;197;206m.[38;2;192;197;206mservices[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206m([K
[0m[48;2;40;67;43m[39m+     41[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;192;197;206mcreate_prescription_for_treatment[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+     42[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;192;197;206mcreate_prescription_template[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+     43[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;192;197;206mmark_prescription_sent[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+     44[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;192;197;206msoft_delete_prescription[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+     45[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;192;197;206msoft_delete_template[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+     46[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;192;197;206mupdate_prescription_template[38;2;192;197;206m,[K
[0m[48;2;40;67;43m[39m+     47[0m:[39m[48;2;24;38;30m [38;2;192;197;206m)[K
[0m[48;2;40;67;43m[39m+     48[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206mapps[38;2;192;197;206m.[38;2;192;197;206mscheduling[38;2;192;197;206m.[38;2;192;197;206mservices[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206mcreate_appointment[K
[0m[48;2;40;67;43m[39m+     49[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206mapps[38;2;192;197;206m.[38;2;192;197;206mtreatments[38;2;192;197;206m.[38;2;192;197;206mservices[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206mcreate_treatment[K
[0m[48;2;40;67;43m[39m+     50[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     51[0m:[39m[48;2;24;38;30m [38;2;192;197;206mpytestmark[38;2;192;197;206m [38;2;192;197;206m=[38;2;192;197;206m [38;2;192;197;206mpytest[38;2;192;197;206m.[38;2;192;197;206mmark[38;2;192;197;206m.[38;2;192;197;206mdjango_db[K
[0m[48;2;40;67;43m[39m+     52[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     53[0m:[39m[48;2;24;38;30m [38;2;192;197;206mUser[38;2;192;197;206m [38;2;192;197;206m=[38;2;192;197;206m [38;2;143;161;179mget_user_model[38;2;192;197;206m([38;2;192;197;206m)[K
[0m[48;2;40;67;43m[39m+     54[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     55[0m:[39m[48;2;24;38;30m [38;2;191;97;106mTEMPLATES_URL[38;2;192;197;206m [38;2;192;197;206m=[38;2;192;197;206m [38;2;192;197;206m"[38;2;163;190;140m/api/v1/prescription-templates/[38;2;192;197;206m"[K
[0m[48;2;40;67;43m[39m+     56[0m:[39m[48;2;24;38;30m [38;2;191;97;106mPRESCRIPTIONS_URL[38;2;192;197;206m [38;2;192;197;206m=[38;2;192;197;206m [38;2;192;197;206m"[38;2;163;190;140m/api/v1/prescriptions/[38;2;192;197;206m"[K
[0m[48;2;40;67;43m[39m+     57[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     58[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     59[0m:[39m[48;2;24;38;30m [38;2;101;115;126m#[38;2;101;115;126m ===========================================================================[K
[0m[48;2;40;67;43m[39m+     60[0m:[39m[48;2;24;38;30m [38;2;101;115;126m# Fixtures[K
[0m[48;2;40;67;43m[39m+     61[0m:[39m[48;2;24;38;30m [38;2;101;115;126m# ===========================================================================[K
[0m[48;2;40;67;43m[39m+     62[0m:[39m[48;2;24;38;30m [38;2;101;115;126m@pytest.fixture[K
[0m[48;2;40;67;43m[39m+     63[0m:[39m[48;2;24;38;30m [38;2;101;115;126mdef head_doctor():[K
[0m[48;2;40;67;43m[39m+     64[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    return User.objects.create_user([K
[0m[48;2;40;67;43m[39m+     65[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        phone_number="+998900000101",[K
[0m[48;2;40;67;43m[39m+     66[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        password="StrongPass!123",[K
[0m[48;2;40;67;43m[39m+     67[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        first_name="Bosh",[K
[0m[48;2;40;67;43m[39m+     68[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        last_name="Shifokor",[K
[0m[48;2;40;67;43m[39m+     69[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        role=User.Role.BOSH_SHIFOKOR,[K
[0m[48;2;40;67;43m[39m+     70[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    )[K
[0m[48;2;40;67;43m[39m+     71[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     72[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     73[0m:[39m[48;2;24;38;30m [38;2;101;115;126m@pytest.fixture[K
[0m[48;2;40;67;43m[39m+     74[0m:[39m[48;2;24;38;30m [38;2;101;115;126mdef administrator():[K
[0m[48;2;40;67;43m[39m+     75[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    return User.objects.create_user([K
[0m[48;2;40;67;43m[39m+     76[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        phone_number="+998900000102",[K
[0m[48;2;40;67;43m[39m+     77[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        password="StrongPass!123",[K
[0m[48;2;40;67;43m[39m+     78[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        first_name="Adm",[K
[0m[48;2;40;67;43m[39m+     79[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        last_name="In",[K
[0m[48;2;40;67;43m[39m+     80[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        role=User.Role.ADMINISTRATOR,[K
[0m[48;2;40;67;43m[39m+     81[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    )[K
[0m[48;2;40;67;43m[39m+     82[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     83[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     84[0m:[39m[48;2;24;38;30m [38;2;101;115;126m@pytest.fixture[K
[0m[48;2;40;67;43m[39m+     85[0m:[39m[48;2;24;38;30m [38;2;101;115;126mdef doctor_user():[K
[0m[48;2;40;67;43m[39m+     86[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    return User.objects.create_user([K
[0m[48;2;40;67;43m[39m+     87[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        phone_number="+998900000103",[K
[0m[48;2;40;67;43m[39m+     88[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        password="StrongPass!123",[K
[0m[48;2;40;67;43m[39m+     89[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        first_name="Doc",[K
[0m[48;2;40;67;43m[39m+     90[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        last_name="Tor",[K
[0m[48;2;40;67;43m[39m+     91[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        role=User.Role.DOCTOR,[K
[0m[48;2;40;67;43m[39m+     92[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    )[K
[0m[48;2;40;67;43m[39m+     93[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     94[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     95[0m:[39m[48;2;24;38;30m [38;2;101;115;126m@pytest.fixture[K
[0m[48;2;40;67;43m[39m+     96[0m:[39m[48;2;24;38;30m [38;2;101;115;126mdef other_doctor_user():[K
[0m[48;2;40;67;43m[39m+     97[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    return User.objects.create_user([K
[0m[48;2;40;67;43m[39m+     98[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        phone_number="+998900000104",[K
[0m[48;2;40;67;43m[39m+     99[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        password="StrongPass!123",[K
[0m[48;2;40;67;43m[39m+    100[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        first_name="Other",[K
[0m[48;2;40;67;43m[39m+    101[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        last_name="Doc",[K
[0m[48;2;40;67;43m[39m+    102[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        role=User.Role.DOCTOR,[K
[0m[48;2;40;67;43m[39m+    103[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    )[K
[0m[48;2;40;67;43m[39m+    104[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    105[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    106[0m:[39m[48;2;24;38;30m [38;2;101;115;126m@pytest.fixture[K
[0m[48;2;40;67;43m[39m+    107[0m:[39m[48;2;24;38;30m [38;2;101;115;126mdef department(head_doctor):[K
[0m[48;2;40;67;43m[39m+    108[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    return Department.objects.create([K
[0m[48;2;40;67;43m[39m+    109[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        name="Terapiya", description="Test", created_by=head_doctor[K
[0m[48;2;40;67;43m[39m+    110[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    )[K
[0m[48;2;40;67;43m[39m+    111[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    112[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    113[0m:[39m[48;2;24;38;30m [38;2;101;115;126m@pytest.fixture[K
[0m[48;2;40;67;43m[39m+    114[0m:[39m[48;2;24;38;30m [38;2;101;115;126mdef doctor(doctor_user, department):[K
[0m[48;2;40;67;43m[39m+    115[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    profile = DoctorProfile.objects.create([K
[0m[48;2;40;67;43m[39m+    116[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        user=doctor_user,[K
[0m[48;2;40;67;43m[39m+    117[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        specialization="Terapevt",[K
[0m[48;2;40;67;43m[39m+    118[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        commission_basis=CommissionBasis.FROM_TOTAL,[K
[0m[48;2;40;67;43m[39m+    119[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        default_commission_rate=Decimal("30.00"),[K
[0m[48;2;40;67;43m[39m+    120[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    )[K
[0m[48;2;40;67;43m[39m+    121[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    profile.departments.add(department)[K
[0m[48;2;40;67;43m[39m+    122[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    return profile[K
[0m[48;2;40;67;43m[39m+    123[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    124[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    125[0m:[39m[48;2;24;38;30m [38;2;101;115;126m@pytest.fixture[K
[0m[48;2;40;67;43m[39m+    126[0m:[39m[48;2;24;38;30m [38;2;101;115;126mdef other_doctor(other_doctor_user, department):[K
[0m[48;2;40;67;43m[39m+    127[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    profile = DoctorProfile.objects.create([K
[0m[48;2;40;67;43m[39m+    128[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        user=other_doctor_user,[K
[0m[48;2;40;67;43m[39m+    129[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        specialization="Boshqa",[K
[0m[48;2;40;67;43m[39m+    130[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        commission_basis=CommissionBasis.FROM_TOTAL,[K
[0m[48;2;40;67;43m[39m+    131[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        default_commission_rate=Decimal("30.00"),[K
[0m[48;2;40;67;43m[39m+    132[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    )[K
[0m[48;2;40;67;43m[39m+    133[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    profile.departments.add(department)[K
[0m[48;2;40;67;43m[39m+    134[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    return profile[K
[0m[48;2;40;67;43m[39m+    135[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    136[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    137[0m:[39m[48;2;24;38;30m [38;2;101;115;126m@pytest.fixture[K
[0m[48;2;40;67;43m[39m+    138[0m:[39m[48;2;24;38;30m [38;2;101;115;126mdef procedure_type(department):[K
[0m[48;2;40;67;43m[39m+    139[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    return ProcedureType.objects.create([K
[0m[48;2;40;67;43m[39m+    140[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        name="Plomba",[K
[0m[48;2;40;67;43m[39m+    141[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        department=department,[K
[0m[48;2;40;67;43m[39m+    142[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        default_duration_minutes=30,[K
[0m[48;2;40;67;43m[39m+    143[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        default_price=Decimal("100000.00"),[K
[0m[48;2;40;67;43m[39m+    144[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    )[K
[0m[48;2;40;67;43m[39m+    145[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    146[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    147[0m:[39m[48;2;24;38;30m [38;2;101;115;126m@pytest.fixture[K
[0m[48;2;40;67;43m[39m+    148[0m:[39m[48;2;24;38;30m [38;2;101;115;126mdef patient(administrator):[K
[0m[48;2;40;67;43m[39m+    149[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    return create_patient([K
[0m[48;2;40;67;43m[39m+    150[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        first_name="Ali",[K
[0m[48;2;40;67;43m[39m+    151[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        last_name="Valiyev",[K
[0m[48;2;40;67;43m[39m+    152[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        phone_number="+998901111111",[K
[0m[48;2;40;67;43m[39m+    153[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        telegram_chat_id="12345",[K
[0m[48;2;40;67;43m[39m+    154[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        created_by=administrator,[K
[0m[48;2;40;67;43m[39m+    155[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    )[K
[0m[48;2;40;67;43m[39m+    156[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    157[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    158[0m:[39m[48;2;24;38;30m [38;2;101;115;126m@pytest.fixture[K
[0m[48;2;40;67;43m[39m+    159[0m:[39m[48;2;24;38;30m [38;2;101;115;126mdef patient_without_telegram(administrator):[K
[0m[48;2;40;67;43m[39m+    160[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    return create_patient([K
[0m[48;2;40;67;43m[39m+    161[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        first_name="Bek",[K
[0m[48;2;40;67;43m[39m+    162[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        last_name="Karimov",[K
[0m[48;2;40;67;43m[39m+    163[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        phone_number="+998902222222",[K
[0m[48;2;40;67;43m[39m+    164[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        created_by=administrator,[K
[0m[48;2;40;67;43m[39m+    165[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    )[K
[0m[48;2;40;67;43m[39m+    166[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    167[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    168[0m:[39m[48;2;24;38;30m [38;2;101;115;126m@pytest.fixture[K
[0m[48;2;40;67;43m[39m+    169[0m:[39m[48;2;24;38;30m [38;2;101;115;126mdef appointment(patient, doctor, department, procedure_type, administrator):[K
[0m[48;2;40;67;43m[39m+    170[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    tz = timezone.get_current_timezone()[K
[0m[48;2;40;67;43m[39m+    171[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    start = timezone.make_aware([K
[0m[48;2;40;67;43m[39m+    172[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        datetime.combine([K
[0m[48;2;40;67;43m[39m+    173[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            timezone.localdate() + timedelta(days=1), time(10, 0)[K
[0m[48;2;40;67;43m[39m+    174[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        ),[K
[0m[48;2;40;67;43m[39m+    175[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        tz,[K
[0m[48;2;40;67;43m[39m+    176[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    )[K
[0m[48;2;40;67;43m[39m+    177[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    end = start + timedelta(minutes=30)[K
[0m[48;2;40;67;43m[39m+    178[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    return create_appointment([K
[0m[48;2;40;67;43m[39m+    179[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        patient=patient,[K
[0m[48;2;40;67;43m[39m+    180[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        doctor=doctor,[K
[0m[48;2;40;67;43m[39m+    181[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        department=department,[K
[0m[48;2;40;67;43m[39m+    182[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        procedure_type=procedure_type,[K
[0m[48;2;40;67;43m[39m+    183[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        scheduled_start=start,[K
[0m[48;2;40;67;43m[39m+    184[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        scheduled_end=end,[K
[0m[48;2;40;67;43m[39m+    185[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        created_by=administrator,[K
[0m[48;2;40;67;43m[39m+    186[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    )[K
[0m[48;2;40;67;43m[39m+    187[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    188[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    189[0m:[39m[48;2;24;38;30m [38;2;101;115;126m@pytest.fixture[K
[0m[48;2;40;67;43m[39m+    190[0m:[39m[48;2;24;38;30m [38;2;101;115;126mdef treatment(patient, doctor, department, procedure_type, appointment, head_doctor):[K
[0m[48;2;40;67;43m[39m+    191[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    return create_treatment([K
[0m[48;2;40;67;43m[39m+    192[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        doctor=doctor,[K
[0m[48;2;40;67;43m[39m+    193[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        patient=patient,[K
[0m[48;2;40;67;43m[39m+    194[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        department=department,[K
[0m[48;2;40;67;43m[39m+    195[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        procedure_type=procedure_type,[K
[0m[48;2;40;67;43m[39m+    196[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        appointment=appointment,[K
[0m[48;2;40;67;43m[39m+    197[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        diagnosis="Kariyes",[K
[0m[48;2;40;67;43m[39m+    198[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        description="Plomba qo'yildi",[K
[0m[48;2;40;67;43m[39m+    199[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        price=Decimal("120000.00"),[K
[0m[48;2;40;67;43m[39m+    200[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        created_by=head_doctor,[K
[0m[48;2;40;67;43m[39m+    201[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    )[K
[0m[48;2;40;67;43m[39m+    202[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    203[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    204[0m:[39m[48;2;24;38;30m [38;2;101;115;126m@pytest.fixture[K
[0m[48;2;40;67;43m[39m+    205[0m:[39m[48;2;24;38;30m [38;2;101;115;126mdef treatment_no_telegram([K
[0m[48;2;40;67;43m[39m+    206[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    patient_without_telegram, doctor, department, procedure_type, head_doctor[K
[0m[48;2;40;67;43m[39m+    207[0m:[39m[48;2;24;38;30m [38;2;101;115;126m):[K
[0m[48;2;40;67;43m[39m+    208[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    return create_treatment([K
[0m[48;2;40;67;43m[39m+    209[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        doctor=doctor,[K
[0m[48;2;40;67;43m[39m+    210[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        patient=patient_without_telegram,[K
[0m[48;2;40;67;43m[39m+    211[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        department=department,[K
[0m[48;2;40;67;43m[39m+    212[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        procedure_type=procedure_type,[K
[0m[48;2;40;67;43m[39m+    213[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        diagnosis="Kariyes",[K
[0m[48;2;40;67;43m[39m+    214[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        price=Decimal("100000.00"),[K
[0m[48;2;40;67;43m[39m+    215[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        created_by=head_doctor,[K
[0m[48;2;40;67;43m[39m+    216[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    )[K
[0m[48;2;40;67;43m[39m+    217[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    218[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    219[0m:[39m[48;2;24;38;30m [38;2;101;115;126m@pytest.fixture[K
[0m[48;2;40;67;43m[39m+    220[0m:[39m[48;2;24;38;30m [38;2;101;115;126mdef other_treatment(patient, other_doctor, department, procedure_type, head_doctor):[K
[0m[48;2;40;67;43m[39m+    221[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    return create_treatment([K
[0m[48;2;40;67;43m[39m+    222[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        doctor=other_doctor,[K
[0m[48;2;40;67;43m[39m+    223[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        patient=patient,[K
[0m[48;2;40;67;43m[39m+    224[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        department=department,[K
[0m[48;2;40;67;43m[39m+    225[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        procedure_type=procedure_type,[K
[0m[48;2;40;67;43m[39m+    226[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        diagnosis="Kariyes 2",[K
[0m[48;2;40;67;43m[39m+    227[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        price=Decimal("80000.00"),[K
[0m[48;2;40;67;43m[39m+    228[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        created_by=head_doctor,[K
[0m[48;2;40;67;43m[39m+    229[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    )[K
[0m[48;2;40;67;43m[39m+    230[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    231[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    232[0m:[39m[48;2;24;38;30m [38;2;101;115;126m@pytest.fixture[K
[0m[48;2;40;67;43m[39m+    233[0m:[39m[48;2;24;38;30m [38;2;101;115;126mdef api_client():[K
[0m[48;2;40;67;43m[39m+    234[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    return APIClient()[K
[0m[48;2;40;67;43m[39m+    235[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    236[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    237[0m:[39m[48;2;24;38;30m [38;2;101;115;126mdef _auth(client: APIClient, user) -> APIClient:[K
[0m[48;2;40;67;43m[39m+    238[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    client.force_authenticate(user=user)[K
[0m[48;2;40;67;43m[39m+    239[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    return client[K
[0m[48;2;40;67;43m[39m+    240[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    241[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    242[0m:[39m[48;2;24;38;30m [38;2;101;115;126m# ===========================================================================[K
[0m[48;2;40;67;43m[39m+    243[0m:[39m[48;2;24;38;30m [38;2;101;115;126m# Model tests[K
[0m[48;2;40;67;43m[39m+    244[0m:[39m[48;2;24;38;30m [38;2;101;115;126m# ===========================================================================[K
[0m[48;2;40;67;43m[39m+    245[0m:[39m[48;2;24;38;30m [38;2;101;115;126mclass TestPrescriptionTemplateModel:[K
[0m[48;2;40;67;43m[39m+    246[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    def test_str(self, head_doctor):[K
[0m[48;2;40;67;43m[39m+    247[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        tpl = PrescriptionTemplate.objects.create([K
[0m[48;2;40;67;43m[39m+    248[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            name="Analgin",[K
[0m[48;2;40;67;43m[39m+    249[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            content="1 tabletka kuniga 3 marta",[K
[0m[48;2;40;67;43m[39m+    250[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            created_by=head_doctor,[K
[0m[48;2;40;67;43m[39m+    251[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        )[K
[0m[48;2;40;67;43m[39m+    252[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        assert "Analgin" in str(tpl)[K
[0m[48;2;40;67;43m[39m+    253[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    254[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    def test_unique_name_per_owner(self, head_doctor):[K
[0m[48;2;40;67;43m[39m+    255[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        PrescriptionTemplate.objects.create([K
[0m[48;2;40;67;43m[39m+    256[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            name="Duplicate",[K
[0m[48;2;40;67;43m[39m+    257[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            content="x",[K
[0m[48;2;40;67;43m[39m+    258[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            created_by=head_doctor,[K
[0m[48;2;40;67;43m[39m+    259[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        )[K
[0m[48;2;40;67;43m[39m+    260[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        with pytest.raises(Exception):[K
[0m[48;2;40;67;43m[39m+    261[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            PrescriptionTemplate.objects.create([K
[0m[48;2;40;67;43m[39m+    262[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                name="Duplicate",[K
[0m[48;2;40;67;43m[39m+    263[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                content="y",[K
[0m[48;2;40;67;43m[39m+    264[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                created_by=head_doctor,[K
[0m[48;2;40;67;43m[39m+    265[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            )[K
[0m[48;2;40;67;43m[39m+    266[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    267[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    268[0m:[39m[48;2;24;38;30m [38;2;101;115;126mclass TestPrescriptionModel:[K
[0m[48;2;40;67;43m[39m+    269[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    def test_is_sent_property(self, treatment):[K
[0m[48;2;40;67;43m[39m+    270[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        p = Prescription.objects.create([K
[0m[48;2;40;67;43m[39m+    271[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            treatment=treatment,[K
[0m[48;2;40;67;43m[39m+    272[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            content="Test",[K
[0m[48;2;40;67;43m[39m+    273[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        )[K
[0m[48;2;40;67;43m[39m+    274[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        assert p.is_sent is False[K
[0m[48;2;40;67;43m[39m+    275[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        p.sent_to_telegram_at = timezone.now()[K
[0m[48;2;40;67;43m[39m+    276[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        p.save()[K
[0m[48;2;40;67;43m[39m+    277[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        assert p.is_sent is True[K
[0m[48;2;40;67;43m[39m+    278[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    279[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    def test_str(self, treatment):[K
[0m[48;2;40;67;43m[39m+    280[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        p = Prescription.objects.create(treatment=treatment, content="X")[K
[0m[48;2;40;67;43m[39m+    281[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        assert str(treatment.pk) in str(p)[K
[0m[48;2;40;67;43m[39m+    282[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    283[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    284[0m:[39m[48;2;24;38;30m [38;2;101;115;126m# ===========================================================================[K
[0m[48;2;40;67;43m[39m+    285[0m:[39m[48;2;24;38;30m [38;2;101;115;126m# Service tests — template CRUD[K
[0m[48;2;40;67;43m[39m+    286[0m:[39m[48;2;24;38;30m [38;2;101;115;126m# ===========================================================================[K
[0m[48;2;40;67;43m[39m+    287[0m:[39m[48;2;24;38;30m [38;2;101;115;126mclass TestTemplateServices:[K
[0m[48;2;40;67;43m[39m+    288[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    def test_create_template(self, head_doctor):[K
[0m[48;2;40;67;43m[39m+    289[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        tpl = create_prescription_template([K
[0m[48;2;40;67;43m[39m+    290[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            name="Analgin",[K
[0m[48;2;40;67;43m[39m+    291[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            content="1 tabletka",[K
[0m[48;2;40;67;43m[39m+    292[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            created_by=head_doctor,[K
[0m[48;2;40;67;43m[39m+    293[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        )[K
[0m[48;2;40;67;43m[39m+    294[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        assert tpl.name == "Analgin"[K
[0m[48;2;40;67;43m[39m+    295[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        assert tpl.content == "1 tabletka"[K
[0m[48;2;40;67;43m[39m+    296[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        assert tpl.created_by_id == head_doctor.id[K
[0m[48;2;40;67;43m[39m+    297[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    298[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    def test_create_template_strips_whitespace(self, head_doctor):[K
[0m[48;2;40;67;43m[39m+    299[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        tpl = create_prescription_template([K
[0m[48;2;40;67;43m[39m+    300[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            name="  Padded  ",[K
[0m[48;2;40;67;43m[39m+    301[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            content="  Body  ",[K
[0m[48;2;40;67;43m[39m+    302[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            created_by=head_doctor,[K
[0m[48;2;40;67;43m[39m+    303[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        )[K
[0m[48;2;40;67;43m[39m+    304[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        assert tpl.name == "Padded"[K
[0m[48;2;40;67;43m[39m+    305[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        assert tpl.content == "Body"[K
[0m[48;2;40;67;43m[39m+    306[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    307[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    def test_create_template_requires_name(self, head_doctor):[K
[0m[48;2;40;67;43m[39m+    308[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        with pytest.raises(ValidationError):[K
[0m[48;2;40;67;43m[39m+    309[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            create_prescription_template(name="", content="x", created_by=head_doctor)[K
[0m[48;2;40;67;43m[39m+    310[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    311[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    def test_create_template_requires_content(self, head_doctor):[K
[0m[48;2;40;67;43m[39m+    312[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        with pytest.raises(ValidationError):[K
[0m[48;2;40;67;43m[39m+    313[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            create_prescription_template(name="X", content="", created_by=head_doctor)[K
[0m[48;2;40;67;43m[39m+    314[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    315[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    def test_create_template_rejects_duplicate_name(self, head_doctor):[K
[0m[48;2;40;67;43m[39m+    316[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        create_prescription_template([K
[0m[48;2;40;67;43m[39m+    317[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            name="Same", content="a", created_by=head_doctor[K
[0m[48;2;40;67;43m[39m+    318[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        )[K
[0m[48;2;40;67;43m[39m+    319[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        with pytest.raises(ValidationError):[K
[0m[48;2;40;67;43m[39m+    320[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            create_prescription_template([K
[0m[48;2;40;67;43m[39m+    321[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                name="Same", content="b", created_by=head_doctor[K
[0m[48;2;40;67;43m[39m+    322[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            )[K
[0m[48;2;40;67;43m[39m+    323[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    324[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    def test_different_owners_can_share_name(self, head_doctor, doctor_user):[K
[0m[48;2;40;67;43m[39m+    325[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        t1 = create_prescription_template([K
[0m[48;2;40;67;43m[39m+    326[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            name="Shared", content="a", created_by=head_doctor[K
[0m[48;2;40;67;43m[39m+    327[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        )[K
[0m[48;2;40;67;43m[39m+    328[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        t2 = create_prescription_template([K
[0m[48;2;40;67;43m[39m+    329[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            name="Shared", content="b", created_by=doctor_user[K
[0m[48;2;40;67;43m[39m+    330[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        )[K
[0m[48;2;40;67;43m[39m+    331[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        assert t1.pk != t2.pk[K
[0m[48;2;40;67;43m[39m+    332[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    333[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    def test_update_template(self, head_doctor):[K
[0m[48;2;40;67;43m[39m+    334[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        tpl = create_prescription_template([K
[0m[48;2;40;67;43m[39m+    335[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            name="Old", content="old body", created_by=head_doctor[K
[0m[48;2;40;67;43m[39m+    336[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        )[K
[0m[48;2;40;67;43m[39m+    337[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        updated = update_prescription_template(tpl, name="New", content="new body")[K
[0m[48;2;40;67;43m[39m+    338[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        assert updated.name == "New"[K
[0m[48;2;40;67;43m[39m+    339[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        assert updated.content == "new body"[K
[0m[48;2;40;67;43m[39m+    340[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    341[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    def test_soft_delete_template(self, head_doctor):[K
[0m[48;2;40;67;43m[39m+    342[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        tpl = create_prescription_template([K
[0m[48;2;40;67;43m[39m+    343[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            name="Kill", content="x", created_by=head_doctor[K
[0m[48;2;40;67;43m[39m+    344[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        )[K
[0m[48;2;40;67;43m[39m+    345[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        soft_delete_template(tpl)[K
[0m[48;2;40;67;43m[39m+    346[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        tpl.refresh_from_db()[K
[0m[48;2;40;67;43m[39m+    347[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        assert tpl.is_active is False[K
[0m[48;2;40;67;43m[39m+    348[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    349[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    350[0m:[39m[48;2;24;38;30m [38;2;101;115;126m# ===========================================================================[K
[0m[48;2;40;67;43m[39m+    351[0m:[39m[48;2;24;38;30m [38;2;101;115;126m# Service tests — prescription issue[K
[0m[48;2;40;67;43m[39m+    352[0m:[39m[48;2;24;38;30m [38;2;101;115;126m# ===========================================================================[K
[0m[48;2;40;67;43m[39m+    353[0m:[39m[48;2;24;38;30m [38;2;101;115;126mclass TestPrescriptionServices:[K
[0m[48;2;40;67;43m[39m+    354[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    def test_create_from_content(self, treatment, head_doctor):[K
[0m[48;2;40;67;43m[39m+    355[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        p = create_prescription_for_treatment([K
[0m[48;2;40;67;43m[39m+    356[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            treatment=treatment,[K
[0m[48;2;40;67;43m[39m+    357[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            content="Ibuprofen 400mg",[K
[0m[48;2;40;67;43m[39m+    358[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            created_by=head_doctor,[K
[0m[48;2;40;67;43m[39m+    359[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            send=False,[K
[0m[48;2;40;67;43m[39m+    360[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        )[K
[0m[48;2;40;67;43m[39m+    361[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        assert p.content == "Ibuprofen 400mg"[K
[0m[48;2;40;67;43m[39m+    362[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        assert p.template is None[K
[0m[48;2;40;67;43m[39m+    363[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        assert p.treatment_id == treatment.pk[K
[0m[48;2;40;67;43m[39m+    364[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        assert p.sent_to_telegram_at is None[K
[0m[48;2;40;67;43m[39m+    365[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        assert p.created_by_id == head_doctor.id[K
[0m[48;2;40;67;43m[39m+    366[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    367[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    def test_create_from_template(self, treatment, head_doctor):[K
[0m[48;2;40;67;43m[39m+    368[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        tpl = create_prescription_template([K
[0m[48;2;40;67;43m[39m+    369[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            name="Std",[K
[0m[48;2;40;67;43m[39m+    370[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            content="Amoksitsillin 500mg 3 marta",[K
[0m[48;2;40;67;43m[39m+    371[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            created_by=head_doctor,[K
[0m[48;2;40;67;43m[39m+    372[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        )[K
[0m[48;2;40;67;43m[39m+    373[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        p = create_prescription_for_treatment([K
[0m[48;2;40;67;43m[39m+    374[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            treatment=treatment,[K
[0m[48;2;40;67;43m[39m+    375[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            template=tpl,[K
[0m[48;2;40;67;43m[39m+    376[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            created_by=head_doctor,[K
[0m[48;2;40;67;43m[39m+    377[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            send=False,[K
[0m[48;2;40;67;43m[39m+    378[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        )[K
[0m[48;2;40;67;43m[39m+    379[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        assert p.template_id == tpl.pk[K
[0m[48;2;40;67;43m[39m+    380[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        assert p.content == "Amoksitsillin 500mg 3 marta"[K
[0m[48;2;40;67;43m[39m+    381[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    382[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    def test_placeholder_substitution(self, treatment, head_doctor):[K
[0m[48;2;40;67;43m[39m+    383[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        p = create_prescription_for_treatment([K
[0m[48;2;40;67;43m[39m+    384[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            treatment=treatment,[K
[0m[48;2;40;67;43m[39m+    385[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            content="Hurmatli {patient_name}, {diagnosis} uchun retsept.",[K
[0m[48;2;40;67;43m[39m+    386[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            created_by=head_doctor,[K
[0m[48;2;40;67;43m[39m+    387[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            send=False,[K
[0m[48;2;40;67;43m[39m+    388[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        )[K
[0m[48;2;40;67;43m[39m+    389[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        assert "Ali Valiyev" in p.content[K
[0m[48;2;40;67;43m[39m+    390[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        assert "Kariyes" in p.content[K
[0m[48;2;40;67;43m[39m+    391[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        assert "{patient_name}" not in p.content[K
[0m[48;2;40;67;43m[39m+    392[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        assert "{diagnosis}" not in p.content[K
[0m[48;2;40;67;43m[39m+    393[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    394[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    def test_doctor_name_placeholder(self, treatment, head_doctor):[K
[0m[48;2;40;67;43m[39m+    395[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        p = create_prescription_for_treatment([K
[0m[48;2;40;67;43m[39m+    396[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            treatment=treatment,[K
[0m[48;2;40;67;43m[39m+    397[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            content="Shifokor: {doctor_name}",[K
[0m[48;2;40;67;43m[39m+    398[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            created_by=head_doctor,[K
[0m[48;2;40;67;43m[39m+    399[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            send=False,[K
[0m[48;2;40;67;43m[39m+    400[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        )[K
[0m[48;2;40;67;43m[39m+    401[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        assert "Doc Tor" in p.content[K
[0m[48;2;40;67;43m[39m+    402[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    403[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    def test_requires_content_or_template(self, treatment, head_doctor):[K
[0m[48;2;40;67;43m[39m+    404[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        with pytest.raises(ValidationError):[K
[0m[48;2;40;67;43m[39m+    405[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            create_prescription_for_treatment([K
[0m[48;2;40;67;43m[39m+    406[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                treatment=treatment,[K
[0m[48;2;40;67;43m[39m+    407[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                content=None,[K
[0m[48;2;40;67;43m[39m+    408[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                template=None,[K
[0m[48;2;40;67;43m[39m+    409[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                created_by=head_doctor,[K
[0m[48;2;40;67;43m[39m+    410[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                send=False,[K
[0m[48;2;40;67;43m[39m+    411[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            )[K
[0m[48;2;40;67;43m[39m+    412[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    413[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    def test_content_from_template_can_be_overridden(self, treatment, head_doctor):[K
[0m[48;2;40;67;43m[39m+    414[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        tpl = create_prescription_template([K
[0m[48;2;40;67;43m[39m+    415[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            name="Std",[K
[0m[48;2;40;67;43m[39m+    416[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            content="Default body",[K
[0m[48;2;40;67;43m[39m+    417[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            created_by=head_doctor,[K
[0m[48;2;40;67;43m[39m+    418[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        )[K
[0m[48;2;40;67;43m[39m+    419[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        p = create_prescription_for_treatment([K
[0m[48;2;40;67;43m[39m+    420[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            treatment=treatment,[K
[0m[48;2;40;67;43m[39m+    421[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            template=tpl,[K
[0m[48;2;40;67;43m[39m+    422[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            content="Override body",[K
[0m[48;2;40;67;43m[39m+    423[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            created_by=head_doctor,[K
[0m[48;2;40;67;43m[39m+    424[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            send=False,[K
[0m[48;2;40;67;43m[39m+    425[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        )[K
[0m[48;2;40;67;43m[39m+    426[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        assert p.template_id == tpl.pk[K
[0m[48;2;40;67;43m[39m+    427[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        assert p.content == "Override body"[K
[0m[48;2;40;67;43m[39m+    428[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    429[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    def test_content_stored_verbatim_after_template_edit([K
[0m[48;2;40;67;43m[39m+    430[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        self, treatment, head_doctor[K
[0m[48;2;40;67;43m[39m+    431[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    ):[K
[0m[48;2;40;67;43m[39m+    432[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        tpl = create_prescription_template([K
[0m[48;2;40;67;43m[39m+    433[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            name="Std",[K
[0m[48;2;40;67;43m[39m+    434[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            content="Original body",[K
[0m[48;2;40;67;43m[39m+    435[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            created_by=head_doctor,[K
[0m[48;2;40;67;43m[39m+    436[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        )[K
[0m[48;2;40;67;43m[39m+    437[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        p = create_prescription_for_treatment([K
[0m[48;2;40;67;43m[39m+    438[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            treatment=treatment,[K
[0m[48;2;40;67;43m[39m+    439[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            template=tpl,[K
[0m[48;2;40;67;43m[39m+    440[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            created_by=head_doctor,[K
[0m[48;2;40;67;43m[39m+    441[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            send=False,[K
[0m[48;2;40;67;43m[39m+    442[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        )[K
[0m[48;2;40;67;43m[39m+    443[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        # Later edit to the template must not rewrite the retsept.[K
[0m[48;2;40;67;43m[39m+    444[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        update_prescription_template(tpl, content="Edited body")[K
[0m[48;2;40;67;43m[39m+    445[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        p.refresh_from_db()[K
[0m[48;2;40;67;43m[39m+    446[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        assert p.content == "Original body"[K
[0m[48;2;40;67;43m[39m+    447[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    448[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    def test_missing_telegram_leaves_sent_none([K
[0m[48;2;40;67;43m[39m+    449[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        self, treatment_no_telegram, head_doctor[K
[0m[48;2;40;67;43m[39m+    450[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    ):[K
[0m[48;2;40;67;43m[39m+    451[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        p = create_prescription_for_treatment([K
[0m[48;2;40;67;43m[39m+    452[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            treatment=treatment_no_telegram,[K
[0m[48;2;40;67;43m[39m+    453[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            content="Ibuprofen",[K
[0m[48;2;40;67;43m[39m+    454[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            created_by=head_doctor,[K
[0m[48;2;40;67;43m[39m+    455[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            send=True,  # requested, but chat_id missing[K
[0m[48;2;40;67;43m[39m+    456[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        )[K
[0m[48;2;40;67;43m[39m+    457[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        assert p.sent_to_telegram_at is None[K
[0m[48;2;40;67;43m[39m+    458[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    459[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    def test_send_success_sets_sent_at(self, treatment, head_doctor):[K
[0m[48;2;40;67;43m[39m+    460[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        # Patch the internal helper to simulate a successful bot delivery.[K
[0m[48;2;40;67;43m[39m+    461[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        with patch([K
[0m[48;2;40;67;43m[39m+    462[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            "apps.prescriptions.services._send_via_telegram", return_value=True[K
[0m[48;2;40;67;43m[39m+    463[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        ):[K
[0m[48;2;40;67;43m[39m+    464[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            p = create_prescription_for_treatment([K
[0m[48;2;40;67;43m[39m+    465[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                treatment=treatment,[K
[0m[48;2;40;67;43m[39m+    466[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                content="Ibuprofen",[K
[0m[48;2;40;67;43m[39m+    467[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                created_by=head_doctor,[K
[0m[48;2;40;67;43m[39m+    468[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                send=True,[K
[0m[48;2;40;67;43m[39m+    469[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            )[K
[0m[48;2;40;67;43m[39m+    470[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        assert p.sent_to_telegram_at is not None[K
[0m[48;2;40;67;43m[39m+    471[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    472[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    def test_send_disabled_leaves_sent_none(self, treatment, head_doctor):[K
[0m[48;2;40;67;43m[39m+    473[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        with patch([K
[0m[48;2;40;67;43m[39m+    474[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            "apps.prescriptions.services._send_via_telegram", return_value=True[K
[0m[48;2;40;67;43m[39m+    475[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        ) as fake:[K
[0m[48;2;40;67;43m[39m+    476[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            p = create_prescription_for_treatment([K
[0m[48;2;40;67;43m[39m+    477[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                treatment=treatment,[K
[0m[48;2;40;67;43m[39m+    478[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                content="Ibuprofen",[K
[0m[48;2;40;67;43m[39m+    479[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                created_by=head_doctor,[K
[0m[48;2;40;67;43m[39m+    480[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                send=False,[K
[0m[48;2;40;67;43m[39m+    481[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            )[K
[0m[48;2;40;67;43m[39m+    482[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            fake.assert_not_called()[K
[0m[48;2;40;67;43m[39m+    483[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        assert p.sent_to_telegram_at is None[K
[0m[48;2;40;67;43m[39m+    484[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    485[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    def test_mark_sent_manually(self, treatment, head_doctor):[K
[0m[48;2;40;67;43m[39m+    486[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        p = create_prescription_for_treatment([K
[0m[48;2;40;67;43m[39m+    487[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            treatment=treatment,[K
[0m[48;2;40;67;43m[39m+    488[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            content="X",[K
[0m[48;2;40;67;43m[39m+    489[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            created_by=head_doctor,[K
[0m[48;2;40;67;43m[39m+    490[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            send=False,[K
[0m[48;2;40;67;43m[39m+    491[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        )[K
[0m[48;2;40;67;43m[39m+    492[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        assert p.sent_to_telegram_at is None[K
[0m[48;2;40;67;43m[39m+    493[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        mark_prescription_sent(p)[K
[0m[48;2;40;67;43m[39m+    494[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        p.refresh_from_db()[K
[0m[48;2;40;67;43m[39m+    495[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        assert p.sent_to_telegram_at is not None[K
[0m[48;2;40;67;43m[39m+    496[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    497[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    def test_soft_delete_prescription(self, treatment, head_doctor):[K
[0m[48;2;40;67;43m[39m+    498[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        p = create_prescription_for_treatment([K
[0m[48;2;40;67;43m[39m+    499[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            treatment=treatment,[K
[0m[48;2;40;67;43m[39m+    500[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            content="X",[K
[0m[48;2;40;67;43m[39m+    501[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            created_by=head_doctor,[K
[0m[48;2;40;67;43m[39m+    502[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            send=False,[K
[0m[48;2;40;67;43m[39m+    503[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        )[K
[0m[48;2;40;67;43m[39m+    504[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        soft_delete_prescription(p)[K
[0m[48;2;40;67;43m[39m+    505[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        p.refresh_from_db()[K
[0m[48;2;40;67;43m[39m+    506[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        assert p.is_active is False[K
[0m[48;2;40;67;43m[39m+    507[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    508[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    509[0m:[39m[48;2;24;38;30m [38;2;101;115;126m# ===========================================================================[K
[0m[48;2;40;67;43m[39m+    510[0m:[39m[48;2;24;38;30m [38;2;101;115;126m# Selector tests[K
[0m[48;2;40;67;43m[39m+    511[0m:[39m[48;2;24;38;30m [38;2;101;115;126m# ===========================================================================[K
[0m[48;2;40;67;43m[39m+    512[0m:[39m[48;2;24;38;30m [38;2;101;115;126mclass TestSelectors:[K
[0m[48;2;40;67;43m[39m+    513[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    def test_active_templates_excludes_inactive(self, head_doctor):[K
[0m[48;2;40;67;43m[39m+    514[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        active = create_prescription_template([K
[0m[48;2;40;67;43m[39m+    515[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            name="A", content="x", created_by=head_doctor[K
[0m[48;2;40;67;43m[39m+    516[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        )[K
[0m[48;2;40;67;43m[39m+    517[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        gone = create_prescription_template([K
[0m[48;2;40;67;43m[39m+    518[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            name="B", content="x", created_by=head_doctor[K
[0m[48;2;40;67;43m[39m+    519[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        )[K
[0m[48;2;40;67;43m[39m+    520[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        soft_delete_template(gone)[K
[0m[48;2;40;67;43m[39m+    521[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        assert active in active_templates()[K
[0m[48;2;40;67;43m[39m+    522[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        assert gone not in active_templates()[K
[0m[48;2;40;67;43m[39m+    523[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    524[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    def test_template_by_id(self, head_doctor):[K
[0m[48;2;40;67;43m[39m+    525[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        tpl = create_prescription_template([K
[0m[48;2;40;67;43m[39m+    526[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            name="X", content="x", created_by=head_doctor[K
[0m[48;2;40;67;43m[39m+    527[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        )[K
[0m[48;2;40;67;43m[39m+    528[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        assert template_by_id(tpl.pk) == tpl[K
[0m[48;2;40;67;43m[39m+    529[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        assert template_by_id("00000000-0000-0000-0000-000000000000") is None[K
[0m[48;2;40;67;43m[39m+    530[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    531[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    def test_templates_for_user_orders_own_first(self, head_doctor, doctor_user):[K
[0m[48;2;40;67;43m[39m+    532[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        other = create_prescription_template([K
[0m[48;2;40;67;43m[39m+    533[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            name="B-other", content="x", created_by=head_doctor[K
[0m[48;2;40;67;43m[39m+    534[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        )[K
[0m[48;2;40;67;43m[39m+    535[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        own = create_prescription_template([K
[0m[48;2;40;67;43m[39m+    536[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            name="A-own", content="x", created_by=doctor_user[K
[0m[48;2;40;67;43m[39m+    537[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        )[K
[0m[48;2;40;67;43m[39m+    538[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        results = list(templates_for_user(doctor_user.id))[K
[0m[48;2;40;67;43m[39m+    539[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        assert results.index(own) < results.index(other)[K
[0m[48;2;40;67;43m[39m+    540[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    541[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    def test_prescriptions_for_treatment(self, treatment, head_doctor):[K
[0m[48;2;40;67;43m[39m+    542[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        p1 = create_prescription_for_treatment([K
[0m[48;2;40;67;43m[39m+    543[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            treatment=treatment, content="A", created_by=head_doctor, send=False[K
[0m[48;2;40;67;43m[39m+    544[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        )[K
[0m[48;2;40;67;43m[39m+    545[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        p2 = create_prescription_for_treatment([K
[0m[48;2;40;67;43m[39m+    546[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            treatment=treatment, content="B", created_by=head_doctor, send=False[K
[0m[48;2;40;67;43m[39m+    547[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        )[K
[0m[48;2;40;67;43m[39m+    548[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        result = list(prescriptions_for_treatment(treatment.pk))[K
[0m[48;2;40;67;43m[39m+    549[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        assert p1 in result and p2 in result[K
[0m[48;2;40;67;43m[39m+    550[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        assert len(result) == 2[K
[0m[48;2;40;67;43m[39m+    551[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    552[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    def test_prescriptions_for_patient(self, treatment, head_doctor):[K
[0m[48;2;40;67;43m[39m+    553[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        p = create_prescription_for_treatment([K
[0m[48;2;40;67;43m[39m+    554[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            treatment=treatment, content="X", created_by=head_doctor, send=False[K
[0m[48;2;40;67;43m[39m+    555[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        )[K
[0m[48;2;40;67;43m[39m+    556[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        result = list(prescriptions_for_patient(treatment.patient_id))[K
[0m[48;2;40;67;43m[39m+    557[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        assert p in result[K
[0m[48;2;40;67;43m[39m+    558[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    559[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    def test_filter_is_sent(self, treatment, head_doctor):[K
[0m[48;2;40;67;43m[39m+    560[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        pending = create_prescription_for_treatment([K
[0m[48;2;40;67;43m[39m+    561[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            treatment=treatment, content="Pending", created_by=head_doctor, send=False[K
[0m[48;2;40;67;43m[39m+    562[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        )[K
[0m[48;2;40;67;43m[39m+    563[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        sent = create_prescription_for_treatment([K
[0m[48;2;40;67;43m[39m+    564[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            treatment=treatment, content="Sent", created_by=head_doctor, send=False[K
[0m[48;2;40;67;43m[39m+    565[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        )[K
[0m[48;2;40;67;43m[39m+    566[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        mark_prescription_sent(sent)[K
[0m[48;2;40;67;43m[39m+    567[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    568[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        sent_only = list(filter_prescriptions(is_sent=True))[K
[0m[48;2;40;67;43m[39m+    569[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        pending_only = list(filter_prescriptions(is_sent=False))[K
[0m[48;2;40;67;43m[39m+    570[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        assert sent in sent_only and pending not in sent_only[K
[0m[48;2;40;67;43m[39m+    571[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        assert pending in pending_only and sent not in pending_only[K
[0m[48;2;40;67;43m[39m+    572[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    573[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    574[0m:[39m[48;2;24;38;30m [38;2;101;115;126m# ===========================================================================[K
[0m[48;2;40;67;43m[39m+    575[0m:[39m[48;2;24;38;30m [38;2;101;115;126m# API tests — templates CRUD[K
[0m[48;2;40;67;43m[39m+    576[0m:[39m[48;2;24;38;30m [38;2;101;115;126m# ===========================================================================[K
[0m[48;2;40;67;43m[39m+    577[0m:[39m[48;2;24;38;30m [38;2;101;115;126mclass TestTemplateAPI:[K
[0m[48;2;40;67;43m[39m+    578[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    def test_anonymous_denied(self, api_client):[K
[0m[48;2;40;67;43m[39m+    579[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        r = api_client.get(TEMPLATES_URL)[K
[0m[48;2;40;67;43m[39m+    580[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        assert r.status_code == status.HTTP_401_UNAUTHORIZED[K
[0m[48;2;40;67;43m[39m+    581[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    582[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    def test_head_doctor_can_list(self, api_client, head_doctor):[K
[0m[48;2;40;67;43m[39m+    583[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        create_prescription_template([K
[0m[48;2;40;67;43m[39m+    584[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            name="A", content="x", created_by=head_doctor[K
[0m[48;2;40;67;43m[39m+    585[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        )[K
[0m[48;2;40;67;43m[39m+    586[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        r = _auth(api_client, head_doctor).get(TEMPLATES_URL)[K
[0m[48;2;40;67;43m[39m+    587[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        assert r.status_code == status.HTTP_200_OK[K
[0m[48;2;40;67;43m[39m+    588[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        data = r.json()[K
[0m[48;2;40;67;43m[39m+    589[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        assert data["count"] == 1[K
[0m[48;2;40;67;43m[39m+    590[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        assert data["results"][0]["name"] == "A"[K
[0m[48;2;40;67;43m[39m+    591[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        # camelCase envelope[K
[0m[48;2;40;67;43m[39m+    592[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        assert "isActive" in data["results"][0][K
[0m[48;2;40;67;43m[39m+    593[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    594[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    def test_head_doctor_can_create(self, api_client, head_doctor):[K
[0m[48;2;40;67;43m[39m+    595[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        r = _auth(api_client, head_doctor).post([K
[0m[48;2;40;67;43m[39m+    596[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            TEMPLATES_URL,[K
[0m[48;2;40;67;43m[39m+    597[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            {"name": "Yangi", "content": "Body"},[K
[0m[48;2;40;67;43m[39m+    598[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            format="json",[K
[0m[48;2;40;67;43m[39m+    599[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        )[K
[0m[48;2;40;67;43m[39m+    600[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        assert r.status_code == status.HTTP_201_CREATED, r.content[K
[0m[48;2;40;67;43m[39m+    601[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        assert r.json()["name"] == "Yangi"[K
[0m[48;2;40;67;43m[39m+    602[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        assert PrescriptionTemplate.objects.filter(name="Yangi").exists()[K
[0m[48;2;40;67;43m[39m+    603[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    604[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    def test_doctor_can_create(self, api_client, doctor_user):[K
[0m[48;2;40;67;43m[39m+    605[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        r = _auth(api_client, doctor_user).post([K
[0m[48;2;40;67;43m[39m+    606[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            TEMPLATES_URL,[K
[0m[48;2;40;67;43m[39m+    607[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            {"name": "DocOwn", "content": "Body"},[K
[0m[48;2;40;67;43m[39m+    608[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            format="json",[K
[0m[48;2;40;67;43m[39m+    609[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        )[K
[0m[48;2;40;67;43m[39m+    610[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        assert r.status_code == status.HTTP_201_CREATED, r.content[K
[0m[48;2;40;67;43m[39m+    611[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    612[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    def test_administrator_cannot_create(self, api_client, administrator):[K
[0m[48;2;40;67;43m[39m+    613[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        r = _auth(api_client, administrator).post([K
[0m[48;2;40;67;43m[39m+    614[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            TEMPLATES_URL,[K
[0m[48;2;40;67;43m[39m+    615[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            {"name": "X", "content": "Y"},[K
[0m[48;2;40;67;43m[39m+    616[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            format="json",[K
[0m[48;2;40;67;43m[39m+    617[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        )[K
[0m[48;2;40;67;43m[39m+    618[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        assert r.status_code == status.HTTP_403_FORBIDDEN[K
[0m[48;2;40;67;43m[39m+    619[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    620[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    def test_administrator_can_list(self, api_client, administrator, head_doctor):[K
[0m[48;2;40;67;43m[39m+    621[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        create_prescription_template([K
[0m[48;2;40;67;43m[39m+    622[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            name="A", content="x", created_by=head_doctor[K
[0m[48;2;40;67;43m[39m+    623[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        )[K
[0m[48;2;40;67;43m[39m+    624[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        r = _auth(api_client, administrator).get(TEMPLATES_URL)[K
[0m[48;2;40;67;43m[39m+    625[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        assert r.status_code == status.HTTP_200_OK[K
[0m[48;2;40;67;43m[39m+    626[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        assert r.json()["count"] == 1[K
[0m[48;2;40;67;43m[39m+    627[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    628[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    def test_duplicate_name_returns_envelope(self, api_client, head_doctor):[K
[0m[48;2;40;67;43m[39m+    629[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        create_prescription_template([K
[0m[48;2;40;67;43m[39m+    630[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            name="Same", content="a", created_by=head_doctor[K
[0m[48;2;40;67;43m[39m+    631[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        )[K
[0m[48;2;40;67;43m[39m+    632[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        r = _auth(api_client, head_doctor).post([K
[0m[48;2;40;67;43m[39m+    633[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            TEMPLATES_URL,[K
[0m[48;2;40;67;43m[39m+    634[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            {"name": "Same", "content": "b"},[K
[0m[48;2;40;67;43m[39m+    635[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            format="json",[K
[0m[48;2;40;67;43m[39m+    636[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        )[K
[0m[48;2;40;67;43m[39m+    637[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        assert r.status_code == status.HTTP_400_BAD_REQUEST[K
[0m[48;2;40;67;43m[39m+    638[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        body = r.json()[K
[0m[48;2;40;67;43m[39m+    639[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        assert "error" in body[K
[0m[48;2;40;67;43m[39m+    640[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        assert body["error"]["code"] == "VALIDATION_ERROR"[K
[0m[48;2;40;67;43m[39m+    641[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    642[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    def test_patch_own_template(self, api_client, doctor_user):[K
[0m[48;2;40;67;43m[39m+    643[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        tpl = create_prescription_template([K
[0m[48;2;40;67;43m[39m+    644[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            name="Own", content="a", created_by=doctor_user[K
[0m[48;2;40;67;43m[39m+    645[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        )[K
[0m[48;2;40;67;43m[39m+    646[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        r = _auth(api_client, doctor_user).patch([K
[0m[48;2;40;67;43m[39m+    647[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            f"{TEMPLATES_URL}{tpl.pk}/",[K
[0m[48;2;40;67;43m[39m+    648[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            {"content": "b"},[K
[0m[48;2;40;67;43m[39m+    649[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            format="json",[K
[0m[48;2;40;67;43m[39m+    650[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        )[K
[0m[48;2;40;67;43m[39m+    651[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        assert r.status_code == status.HTTP_200_OK, r.content[K
[0m[48;2;40;67;43m[39m+    652[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        tpl.refresh_from_db()[K
[0m[48;2;40;67;43m[39m+    653[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        assert tpl.content == "b"[K
[0m[48;2;40;67;43m[39m+    654[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    655[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    def test_doctor_cannot_patch_others_template([K
[0m[48;2;40;67;43m[39m+    656[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        self, api_client, doctor_user, head_doctor[K
[0m[48;2;40;67;43m[39m+    657[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    ):[K
[0m[48;2;40;67;43m[39m+    658[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        tpl = create_prescription_template([K
[0m[48;2;40;67;43m[39m+    659[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            name="Boss", content="a", created_by=head_doctor[K
[0m[48;2;40;67;43m[39m+    660[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        )[K
[0m[48;2;40;67;43m[39m+    661[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        r = _auth(api_client, doctor_user).patch([K
[0m[48;2;40;67;43m[39m+    662[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            f"{TEMPLATES_URL}{tpl.pk}/",[K
[0m[48;2;40;67;43m[39m+    663[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            {"content": "hack"},[K
[0m[48;2;40;67;43m[39m+    664[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            format="json",[K
[0m[48;2;40;67;43m[39m+    665[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        )[K
[0m[48;2;40;67;43m[39m+    666[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        assert r.status_code == status.HTTP_403_FORBIDDEN[K
[0m[48;2;40;67;43m[39m+    667[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    668[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    def test_soft_delete(self, api_client, head_doctor):[K
[0m[48;2;40;67;43m[39m+    669[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        tpl = create_prescription_template([K
[0m[48;2;40;67;43m[39m+    670[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            name="Kill", content="x", created_by=head_doctor[K
[0m[48;2;40;67;43m[39m+    671[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        )[K
[0m[48;2;40;67;43m[39m+    672[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        r = _auth(api_client, head_doctor).delete(f"{TEMPLATES_URL}{tpl.pk}/")[K
[0m[48;2;40;67;43m[39m+    673[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        assert r.status_code == status.HTTP_204_NO_CONTENT[K
[0m[48;2;40;67;43m[39m+    674[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        tpl.refresh_from_db()[K
[0m[48;2;40;67;43m[39m+    675[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        assert tpl.is_active is False[K
[0m[48;2;40;67;43m[39m+    676[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    677[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    def test_camelcase_input_accepted(self, api_client, head_doctor):[K
[0m[48;2;40;67;43m[39m+    678[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        # POST with camelCase alias should still work[K
[0m[48;2;40;67;43m[39m+    679[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        r = _auth(api_client, head_doctor).post([K
[0m[48;2;40;67;43m[39m+    680[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            TEMPLATES_URL,[K
[0m[48;2;40;67;43m[39m+    681[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            {"name": "Alias", "content": "x", "isActive": True},[K
[0m[48;2;40;67;43m[39m+    682[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            format="json",[K
[0m[48;2;40;67;43m[39m+    683[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        )[K
[0m[48;2;40;67;43m[39m+    684[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        assert r.status_code == status.HTTP_201_CREATED, r.content[K
[0m[48;2;40;67;43m[39m+    685[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    686[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    687[0m:[39m[48;2;24;38;30m [38;2;101;115;126m# ===========================================================================[K
[0m[48;2;40;67;43m[39m+    688[0m:[39m[48;2;24;38;30m [38;2;101;115;126m# API tests — Prescription read-only viewset[K
[0m[48;2;40;67;43m[39m+    689[0m:[39m[48;2;24;38;30m [38;2;101;115;126m# ===========================================================================[K
[0m[48;2;40;67;43m[39m+    690[0m:[39m[48;2;24;38;30m [38;2;101;115;126mclass TestPrescriptionListAPI:[K
[0m[48;2;40;67;43m[39m+    691[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    def test_head_doctor_sees_all([K
[0m[48;2;40;67;43m[39m+    692[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        self, api_client, head_doctor, treatment, other_treatment[K
[0m[48;2;40;67;43m[39m+    693[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    ):[K
[0m[48;2;40;67;43m[39m+    694[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        create_prescription_for_treatment([K
[0m[48;2;40;67;43m[39m+    695[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            treatment=treatment, content="A", created_by=head_doctor, send=False[K
[0m[48;2;40;67;43m[39m+    696[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        )[K
[0m[48;2;40;67;43m[39m+    697[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        create_prescription_for_treatment([K
[0m[48;2;40;67;43m[39m+    698[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            treatment=other_treatment,[K
[0m[48;2;40;67;43m[39m+    699[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            content="B",[K
[0m[48;2;40;67;43m[39m+    700[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            created_by=head_doctor,[K
[0m[48;2;40;67;43m[39m+    701[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            send=False,[K
[0m[48;2;40;67;43m[39m+    702[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        )[K
[0m[48;2;40;67;43m[39m+    703[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        r = _auth(api_client, head_doctor).get(PRESCRIPTIONS_URL)[K
[0m[48;2;40;67;43m[39m+    704[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        assert r.status_code == status.HTTP_200_OK[K
[0m[48;2;40;67;43m[39m+    705[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        assert r.json()["count"] == 2[K
[0m[48;2;40;67;43m[39m+    706[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    707[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    def test_doctor_sees_only_own([K
[0m[48;2;40;67;43m[39m+    708[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        self,[K
[0m[48;2;40;67;43m[39m+    709[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        api_client,[K
[0m[48;2;40;67;43m[39m+    710[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        head_doctor,[K
[0m[48;2;40;67;43m[39m+    711[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        doctor,[K
[0m[48;2;40;67;43m[39m+    712[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        doctor_user,[K
[0m[48;2;40;67;43m[39m+    713[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        treatment,[K
[0m[48;2;40;67;43m[39m+    714[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        other_treatment,[K
[0m[48;2;40;67;43m[39m+    715[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    ):[K
[0m[48;2;40;67;43m[39m+    716[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        # Retsept on own treatment[K
[0m[48;2;40;67;43m[39m+    717[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        mine = create_prescription_for_treatment([K
[0m[48;2;40;67;43m[39m+    718[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            treatment=treatment, content="Mine", created_by=head_doctor, send=False[K
[0m[48;2;40;67;43m[39m+    719[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        )[K
[0m[48;2;40;67;43m[39m+    720[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        # Retsept on other doctor's treatment[K
[0m[48;2;40;67;43m[39m+    721[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        theirs = create_prescription_for_treatment([K
[0m[48;2;40;67;43m[39m+    722[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            treatment=other_treatment,[K
[0m[48;2;40;67;43m[39m+    723[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            content="Theirs",[K
[0m[48;2;40;67;43m[39m+    724[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            created_by=head_doctor,[K
[0m[48;2;40;67;43m[39m+    725[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            send=False,[K
[0m[48;2;40;67;43m[39m+    726[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        )[K
[0m[48;2;40;67;43m[39m+    727[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        r = _auth(api_client, doctor_user).get(PRESCRIPTIONS_URL)[K
[0m[48;2;40;67;43m[39m+    728[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        assert r.status_code == status.HTTP_200_OK[K
[0m[48;2;40;67;43m[39m+    729[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        ids = {row["id"] for row in r.json()["results"]}[K
[0m[48;2;40;67;43m[39m+    730[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        assert str(mine.pk) in ids[K
[0m[48;2;40;67;43m[39m+    731[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        assert str(theirs.pk) not in ids[K
[0m[48;2;40;67;43m[39m+    732[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    733[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    def test_filter_by_treatment([K
[0m[48;2;40;67;43m[39m+    734[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        self, api_client, head_doctor, treatment, other_treatment[K
[0m[48;2;40;67;43m[39m+    735[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    ):[K
[0m[48;2;40;67;43m[39m+    736[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        target = create_prescription_for_treatment([K
[0m[48;2;40;67;43m[39m+    737[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            treatment=treatment, content="X", created_by=head_doctor, send=False[K
[0m[48;2;40;67;43m[39m+    738[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        )[K
[0m[48;2;40;67;43m[39m+    739[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        create_prescription_for_treatment([K
[0m[48;2;40;67;43m[39m+    740[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            treatment=other_treatment,[K
[0m[48;2;40;67;43m[39m+    741[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            content="Y",[K
[0m[48;2;40;67;43m[39m+    742[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            created_by=head_doctor,[K
[0m[48;2;40;67;43m[39m+    743[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            send=False,[K
[0m[48;2;40;67;43m[39m+    744[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        )[K
[0m[48;2;40;67;43m[39m+    745[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        r = _auth(api_client, head_doctor).get([K
[0m[48;2;40;67;43m[39m+    746[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            f"{PRESCRIPTIONS_URL}?treatment={treatment.pk}"[K
[0m[48;2;40;67;43m[39m+    747[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        )[K
[0m[48;2;40;67;43m[39m+    748[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        assert r.status_code == status.HTTP_200_OK[K
[0m[48;2;40;67;43m[39m+    749[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        data = r.json()[K
[0m[48;2;40;67;43m[39m+    750[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        assert data["count"] == 1[K
[0m[48;2;40;67;43m[39m+    751[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        assert data["results"][0]["id"] == str(target.pk)[K
[0m[48;2;40;67;43m[39m+    752[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    753[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    def test_filter_is_sent(self, api_client, head_doctor, treatment):[K
[0m[48;2;40;67;43m[39m+    754[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        sent = create_prescription_for_treatment([K
[0m[48;2;40;67;43m[39m+    755[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            treatment=treatment, content="A", created_by=head_doctor, send=False[K
[0m[48;2;40;67;43m[39m+    756[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        )[K
[0m[48;2;40;67;43m[39m+    757[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        mark_prescription_sent(sent)[K
[0m[48;2;40;67;43m[39m+    758[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        create_prescription_for_treatment([K
[0m[48;2;40;67;43m[39m+    759[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            treatment=treatment, content="B", created_by=head_doctor, send=False[K
[0m[48;2;40;67;43m[39m+    760[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        )[K
[0m[48;2;40;67;43m[39m+    761[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        r = _auth(api_client, head_doctor).get(f"{PRESCRIPTIONS_URL}?is_sent=true")[K
[0m[48;2;40;67;43m[39m+    762[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        assert r.status_code == status.HTTP_200_OK[K
[0m[48;2;40;67;43m[39m+    763[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        assert r.json()["count"] == 1[K
[0m[48;2;40;67;43m[39m+    764[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        assert r.json()["results"][0]["id"] == str(sent.pk)[K
[0m[48;2;40;67;43m[39m+    765[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    766[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    def test_soft_delete_via_api(self, api_client, head_doctor, treatment):[K
[0m[48;2;40;67;43m[39m+    767[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        p = create_prescription_for_treatment([K
[0m[48;2;40;67;43m[39m+    768[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            treatment=treatment, content="X", created_by=head_doctor, send=False[K
[0m[48;2;40;67;43m[39m+    769[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        )[K
[0m[48;2;40;67;43m[39m+    770[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        r = _auth(api_client, head_doctor).delete(f"{PRESCRIPTIONS_URL}{p.pk}/")[K
[0m[48;2;40;67;43m[39m+    771[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        assert r.status_code == status.HTTP_204_NO_CONTENT[K
[0m[48;2;40;67;43m[39m+    772[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        p.refresh_from_db()[K
[0m[48;2;40;67;43m[39m+    773[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        assert p.is_active is False[K
[0m[48;2;40;67;43m[39m+    774[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    775[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    def test_post_to_prescriptions_url_not_allowed([K
[0m[48;2;40;67;43m[39m+    776[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        self, api_client, head_doctor[K
[0m[48;2;40;67;43m[39m+    777[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    ):[K
[0m[48;2;40;67;43m[39m+    778[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        r = _auth(api_client, head_doctor).post([K
[0m[48;2;40;67;43m[39m+    779[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            PRESCRIPTIONS_URL, {"content": "x"}, format="json"[K
[0m[48;2;40;67;43m[39m+    780[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        )[K
[0m[48;2;40;67;43m[39m+    781[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        assert r.status_code == status.HTTP_405_METHOD_NOT_ALLOWED[K
[0m[48;2;40;67;43m[39m+    782[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    783[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    784[0m:[39m[48;2;24;38;30m [38;2;101;115;126m# ===========================================================================[K
[0m[48;2;40;67;43m[39m+    785[0m:[39m[48;2;24;38;30m [38;2;101;115;126m# API tests — POST /treatments/{id}/prescription/[K
[0m[48;2;40;67;43m[39m+    786[0m:[39m[48;2;24;38;30m [38;2;101;115;126m# ===========================================================================[K
[0m[48;2;40;67;43m[39m+    787[0m:[39m[48;2;24;38;30m [38;2;101;115;126mclass TestIssuePrescriptionAPI:[K
[0m[48;2;40;67;43m[39m+    788[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    def _issue_url(self, treatment) -> str:[K
[0m[48;2;40;67;43m[39m+    789[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        return f"/api/v1/treatments/{treatment.pk}/prescription/"[K
[0m[48;2;40;67;43m[39m+    790[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    791[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    def test_anonymous_denied(self, api_client, treatment):[K
[0m[48;2;40;67;43m[39m+    792[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        r = api_client.post(self._issue_url(treatment), {"content": "x"}, format="json")[K
[0m[48;2;40;67;43m[39m+    793[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        assert r.status_code == status.HTTP_401_UNAUTHORIZED[K
[0m[48;2;40;67;43m[39m+    794[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    795[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    def test_administrator_forbidden(self, api_client, administrator, treatment):[K
[0m[48;2;40;67;43m[39m+    796[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        r = _auth(api_client, administrator).post([K
[0m[48;2;40;67;43m[39m+    797[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            self._issue_url(treatment),[K
[0m[48;2;40;67;43m[39m+    798[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            {"content": "Ibuprofen"},[K
[0m[48;2;40;67;43m[39m+    799[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            format="json",[K
[0m[48;2;40;67;43m[39m+    800[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        )[K
[0m[48;2;40;67;43m[39m+    801[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        assert r.status_code == status.HTTP_403_FORBIDDEN[K
[0m[48;2;40;67;43m[39m+    802[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    803[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    def test_head_doctor_can_issue(self, api_client, head_doctor, treatment):[K
[0m[48;2;40;67;43m[39m+    804[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        with patch([K
[0m[48;2;40;67;43m[39m+    805[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            "apps.prescriptions.services._send_via_telegram", return_value=True[K
[0m[48;2;40;67;43m[39m+    806[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        ):[K
[0m[48;2;40;67;43m[39m+    807[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            r = _auth(api_client, head_doctor).post([K
[0m[48;2;40;67;43m[39m+    808[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                self._issue_url(treatment),[K
[0m[48;2;40;67;43m[39m+    809[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                {"content": "Ibuprofen 400mg"},[K
[0m[48;2;40;67;43m[39m+    810[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                format="json",[K
[0m[48;2;40;67;43m[39m+    811[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            )[K
[0m[48;2;40;67;43m[39m+    812[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        assert r.status_code == status.HTTP_201_CREATED, r.content[K
[0m[48;2;40;67;43m[39m+    813[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        body = r.json()[K
[0m[48;2;40;67;43m[39m+    814[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        assert body["content"] == "Ibuprofen 400mg"[K
[0m[48;2;40;67;43m[39m+    815[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        assert body["treatmentId"] == str(treatment.pk)[K
[0m[48;2;40;67;43m[39m+    816[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        assert body["isSent"] is True[K
[0m[48;2;40;67;43m[39m+    817[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        assert body["sentToTelegramAt"] is not None[K
[0m[48;2;40;67;43m[39m+    818[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    819[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    def test_owner_doctor_can_issue(self, api_client, doctor_user, treatment):[K
[0m[48;2;40;67;43m[39m+    820[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        with patch([K
[0m[48;2;40;67;43m[39m+    821[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            "apps.prescriptions.services._send_via_telegram", return_value=False[K
[0m[48;2;40;67;43m[39m+    822[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        ):[K
[0m[48;2;40;67;43m[39m+    823[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            r = _auth(api_client, doctor_user).post([K
[0m[48;2;40;67;43m[39m+    824[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                self._issue_url(treatment),[K
[0m[48;2;40;67;43m[39m+    825[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                {"content": "Amoksitsillin"},[K
[0m[48;2;40;67;43m[39m+    826[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                format="json",[K
[0m[48;2;40;67;43m[39m+    827[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            )[K
[0m[48;2;40;67;43m[39m+    828[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        assert r.status_code == status.HTTP_201_CREATED, r.content[K
[0m[48;2;40;67;43m[39m+    829[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        assert r.json()["isSent"] is False[K
[0m[48;2;40;67;43m[39m+    830[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    831[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    def test_other_doctor_forbidden([K
[0m[48;2;40;67;43m[39m+    832[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        self, api_client, other_doctor_user, other_doctor, treatment[K
[0m[48;2;40;67;43m[39m+    833[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    ):[K
[0m[48;2;40;67;43m[39m+    834[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        r = _auth(api_client, other_doctor_user).post([K
[0m[48;2;40;67;43m[39m+    835[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            self._issue_url(treatment),[K
[0m[48;2;40;67;43m[39m+    836[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            {"content": "Hack"},[K
[0m[48;2;40;67;43m[39m+    837[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            format="json",[K
[0m[48;2;40;67;43m[39m+    838[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        )[K
[0m[48;2;40;67;43m[39m+    839[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        assert r.status_code == status.HTTP_403_FORBIDDEN[K
[0m[48;2;40;67;43m[39m+    840[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    841[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    def test_from_template_id_camelcase([K
[0m[48;2;40;67;43m[39m+    842[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        self, api_client, head_doctor, treatment[K
[0m[48;2;40;67;43m[39m+    843[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    ):[K
[0m[48;2;40;67;43m[39m+    844[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        tpl = create_prescription_template([K
[0m[48;2;40;67;43m[39m+    845[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            name="Std", content="Body {patient_name}", created_by=head_doctor[K
[0m[48;2;40;67;43m[39m+    846[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        )[K
[0m[48;2;40;67;43m[39m+    847[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        with patch([K
[0m[48;2;40;67;43m[39m+    848[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            "apps.prescriptions.services._send_via_telegram", return_value=False[K
[0m[48;2;40;67;43m[39m+    849[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        ):[K
[0m[48;2;40;67;43m[39m+    850[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            r = _auth(api_client, head_doctor).post([K
[0m[48;2;40;67;43m[39m+    851[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                self._issue_url(treatment),[K
[0m[48;2;40;67;43m[39m+    852[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                {"templateId": str(tpl.pk)},[K
[0m[48;2;40;67;43m[39m+    853[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                format="json",[K
[0m[48;2;40;67;43m[39m+    854[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            )[K
[0m[48;2;40;67;43m[39m+    855[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        assert r.status_code == status.HTTP_201_CREATED, r.content[K
[0m[48;2;40;67;43m[39m+    856[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        assert "Ali Valiyev" in r.json()["content"][K
[0m[48;2;40;67;43m[39m+    857[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    858[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    def test_missing_content_and_template_returns_envelope([K
[0m[48;2;40;67;43m[39m+    859[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        self, api_client, head_doctor, treatment[K
[0m[48;2;40;67;43m[39m+    860[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    ):[K
[0m[48;2;40;67;43m[39m+    861[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        r = _auth(api_client, head_doctor).post([K
[0m[48;2;40;67;43m[39m+    862[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            self._issue_url(treatment),[K
[0m[48;2;40;67;43m[39m+    863[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            {"send": False},[K
[0m[48;2;40;67;43m[39m+    864[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            format="json",[K
[0m[48;2;40;67;43m[39m+    865[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        )[K
[0m[48;2;40;67;43m[39m+    866[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        assert r.status_code == status.HTTP_400_BAD_REQUEST[K
[0m[48;2;40;67;43m[39m+    867[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        assert "error" in r.json()[K
[0m[48;2;40;67;43m[39m+    868[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    869[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    def test_send_false_leaves_sent_none([K
[0m[48;2;40;67;43m[39m+    870[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        self, api_client, head_doctor, treatment[K
[0m[48;2;40;67;43m[39m+    871[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    ):[K
[0m[48;2;40;67;43m[39m+    872[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        # Even if the fake sender would succeed, send=False disables it.[K
[0m[48;2;40;67;43m[39m+    873[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        with patch([K
[0m[48;2;40;67;43m[39m+    874[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            "apps.prescriptions.services._send_via_telegram", return_value=True[K
[0m[48;2;40;67;43m[39m+    875[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        ):[K
[0m[48;2;40;67;43m[39m+    876[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            r = _auth(api_client, head_doctor).post([K
[0m[48;2;40;67;43m[39m+    877[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                self._issue_url(treatment),[K
[0m[48;2;40;67;43m[39m+    878[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                {"content": "X", "send": False},[K
[0m[48;2;40;67;43m[39m+    879[0m:[39m[48;2;24;38;30m [38;2;101;115;126m                format="json",[K
[0m[48;2;40;67;43m[39m+    880[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            )[K
[0m[48;2;40;67;43m[39m+    881[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        assert r.status_code == status.HTTP_201_CREATED[K
[0m[48;2;40;67;43m[39m+    882[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        assert r.json()["isSent"] is False[K
[0m[48;2;40;67;43m[39m+    883[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    884[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    def test_send_but_no_telegram_chat_id([K
[0m[48;2;40;67;43m[39m+    885[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        self, api_client, head_doctor, treatment_no_telegram[K
[0m[48;2;40;67;43m[39m+    886[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    ):[K
[0m[48;2;40;67;43m[39m+    887[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        r = _auth(api_client, head_doctor).post([K
[0m[48;2;40;67;43m[39m+    888[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            self._issue_url(treatment_no_telegram),[K
[0m[48;2;40;67;43m[39m+    889[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            {"content": "X"},[K
[0m[48;2;40;67;43m[39m+    890[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            format="json",[K
[0m[48;2;40;67;43m[39m+    891[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        )[K
[0m[48;2;40;67;43m[39m+    892[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        assert r.status_code == status.HTTP_201_CREATED, r.content[K
[0m[48;2;40;67;43m[39m+    893[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        assert r.json()["isSent"] is False[K
[0m[48;2;40;67;43m[39m+    894[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    895[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    def test_nonexistent_treatment_returns_404(self, api_client, head_doctor):[K
[0m[48;2;40;67;43m[39m+    896[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        r = _auth(api_client, head_doctor).post([K
[0m[48;2;40;67;43m[39m+    897[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            "/api/v1/treatments/00000000-0000-0000-0000-000000000000/prescription/",[K
[0m[48;2;40;67;43m[39m+    898[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            {"content": "X"},[K
[0m[48;2;40;67;43m[39m+    899[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            format="json",[K
[0m[48;2;40;67;43m[39m+    900[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        )[K
[0m[48;2;40;67;43m[39m+    901[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        assert r.status_code == status.HTTP_404_NOT_FOUND[K
[0m[48;2;40;67;43m[39m+    902[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    903[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    904[0m:[39m[48;2;24;38;30m [38;2;101;115;126m# ===========================================================================[K
[0m[48;2;40;67;43m[39m+    905[0m:[39m[48;2;24;38;30m [38;2;101;115;126m# camelCase serialisation sanity[K
[0m[48;2;40;67;43m[39m+    906[0m:[39m[48;2;24;38;30m [38;2;101;115;126m# ===========================================================================[K
[0m[48;2;40;67;43m[39m+    907[0m:[39m[48;2;24;38;30m [38;2;101;115;126mclass TestSerialisation:[K
[0m[48;2;40;67;43m[39m+    908[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    def test_prescription_shape(self, api_client, head_doctor, treatment):[K
[0m[48;2;40;67;43m[39m+    909[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        create_prescription_for_treatment([K
[0m[48;2;40;67;43m[39m+    910[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            treatment=treatment, content="Body", created_by=head_doctor, send=False[K
[0m[48;2;40;67;43m[39m+    911[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        )[K
[0m[48;2;40;67;43m[39m+    912[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        r = _auth(api_client, head_doctor).get(PRESCRIPTIONS_URL)[K
[0m[48;2;40;67;43m[39m+    913[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        row = r.json()["results"][0][K
[0m[48;2;40;67;43m[39m+    914[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        for camel in ([K
[0m[48;2;40;67;43m[39m+    915[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            "id",[K
[0m[48;2;40;67;43m[39m+    916[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            "treatmentId",[K
[0m[48;2;40;67;43m[39m+    917[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            "content",[K
[0m[48;2;40;67;43m[39m+    918[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            "sentToTelegramAt",[K
[0m[48;2;40;67;43m[39m+    919[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            "isSent",[K
[0m[48;2;40;67;43m[39m+    920[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            "isActive",[K
[0m[48;2;40;67;43m[39m+    921[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            "createdAt",[K
[0m[48;2;40;67;43m[39m+    922[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        ):[K
[0m[48;2;40;67;43m[39m+    923[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            assert camel in row, f"missing camelCase key: {camel}"[K
[0m[K
Creating: [38;5;141m/home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/tests/test_prescriptions.py[0m
[38;5;244m - Completed in 0.1s[0m

I will run the following command: [38;5;141msource .venv/bin/activate && python -m pytest tests/test_prescriptions.py --tb=short -q 2>&1 | tail -80[0m (in [38;5;141mdentacrm/backend[0m)[38;5;244m (using tool: shell)[0m

..........................................................               [100%]
58 passed in 50.04s
[38;5;244m - Completed in 52.187s[0m

[38;5;141m> [0mAll 58 new tests pass. Now let me also run the full test suite to ensure no regressions:[0m[0m
I will run the following command: [38;5;141msource .venv/bin/activate && python -m pytest --tb=short -q 2>&1 | tail -20[0m (in [38;5;141mdentacrm/backend[0m)[38;5;244m (using tool: shell)[0m

........................................................................ [ 25%]
........................................................................ [ 50%]
........................................................................ [ 75%]
.......................................................................  [100%]
287 passed in 235.91s (0:03:55)
[38;5;244m - Completed in 238.143s[0m

[38;5;141m> [0mAll 287 tests pass (229 previous + 58 new). Let me verify the URLs work correctly using Django's URL introspection and check the Swagger schema:[0m[0m
I will run the following command: [38;5;141msource .venv/bin/activate && python manage.py show_urls 2>&1 | grep -E "(prescription|/prescriptions/)" | head -30[0m (in [38;5;141mdentacrm/backend[0m)[38;5;244m (using tool: shell)[0m

[38;5;244m - Completed in 1.264s[0m

I will run the following command: [38;5;141msource .venv/bin/activate && python -c "
from django.urls import get_resolver
from django.conf import settings
import django, os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.dev')
django.setup()

def walk(patterns, prefix=''):
    for p in patterns:
        pat = str(p.pattern)
        if hasattr(p, 'url_patterns'):
            walk(p.url_patterns, prefix + pat)
        else:
            full = prefix + pat
            if 'prescription' in full:
                print(full)

from config.urls import urlpatterns
walk(urlpatterns)
" 2>&1[0m (in [38;5;141mdentacrm/backend[0m)[38;5;244m (using tool: shell)[0m

admin/prescriptions/prescriptiontemplate/
admin/prescriptions/prescriptiontemplate/add/
admin/prescriptions/prescriptiontemplate/<path:object_id>/history/
admin/prescriptions/prescriptiontemplate/<path:object_id>/delete/
admin/prescriptions/prescriptiontemplate/<path:object_id>/change/
admin/prescriptions/prescriptiontemplate/<path:object_id>/
admin/prescriptions/prescription/
admin/prescriptions/prescription/add/
admin/prescriptions/prescription/<path:object_id>/history/
admin/prescriptions/prescription/<path:object_id>/delete/
admin/prescriptions/prescription/<path:object_id>/change/
admin/prescriptions/prescription/<path:object_id>/
admin/^(?P<app_label>auth|token_blacklist|django_celery_beat|django_celery_results|accounts|departments|doctors|patients|scheduling|treatments|odontogram|prescriptions)/$
api/v1/treatments/<uuid:treatment_id>/prescription/
api/v1/prescription-templates/^$
api/v1/prescription-templates/^\.(?P<format>[a-z0-9]+)/?$
api/v1/prescription-templates/^(?P<pk>[^/.]+)/$
api/v1/prescription-templates/^(?P<pk>[^/.]+)\.(?P<format>[a-z0-9]+)/?$
api/v1/prescription-templates/
api/v1/prescription-templates/<drf_format_suffix:format>
api/v1/prescriptions/^$
api/v1/prescriptions/^\.(?P<format>[a-z0-9]+)/?$
api/v1/prescriptions/^(?P<pk>[^/.]+)/$
api/v1/prescriptions/^(?P<pk>[^/.]+)\.(?P<format>[a-z0-9]+)/?$
api/v1/prescriptions/
api/v1/prescriptions/<drf_format_suffix:format>
[38;5;244m - Completed in 1.754s[0m

[38;5;141m> [0mRoutes are correctly wired. Let me also verify the Swagger schema doesn't break:[0m[0m
I will run the following command: [38;5;141msource .venv/bin/activate && python manage.py spectacular --file /tmp/schema.yaml 2>&1 | tail -20[0m (in [38;5;141mdentacrm/backend[0m)[38;5;244m (using tool: shell)[0m

/home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/apps/doctors/views.py:63: Warning [DoctorProfileViewSet]: could not derive type of path parameter "entry_id" because model "apps.doctors.models.DoctorProfile" contained no such field. Consider annotating parameter with @extend_schema. Defaulting to "string".

Schema generation summary:
Warnings: 2 (1 unique)
Errors:   0 (0 unique)

[38;5;244m - Completed in 3.203s[0m

I will run the following command: [38;5;141mgrep -c "prescription" /tmp/schema.yaml[0m[38;5;244m (using tool: shell)[0m

35
[38;5;244m - Completed in 0.12s[0m

I will run the following command: [38;5;141msource .venv/bin/activate && ruff check apps/prescriptions/ 2>&1 | tail -20[0m (in [38;5;141mdentacrm/backend[0m)[38;5;244m (using tool: shell)[0m

apps/prescriptions/views.py:20:39: F401 [*] `rest_framework.decorators.action` imported but unused
   |
18 | from drf_spectacular.utils import OpenApiParameter, extend_schema
19 | from rest_framework import filters, status, viewsets
20 | from rest_framework.decorators import action
   |                                       ^^^^^^ F401
21 | from rest_framework.generics import get_object_or_404
22 | from rest_framework.request import Request
   |
   = help: Remove unused import: `rest_framework.decorators.action`

Found 1 error.
[*] 1 fixable with the `--fix` option.
[38;5;244m - Completed in 0.36s[0m

I'll modify the following file: [38;5;141mdentacrm/backend/apps/prescriptions/views.py[0m[38;5;244m (using tool: write)[0m

[48;2;43;48;59m[39m  19, 19[0m:[39m[48;2;43;48;59m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206mrest_framework[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206mfilters[38;2;192;197;206m,[38;2;192;197;206m [38;2;192;197;206mstatus[38;2;192;197;206m,[38;2;192;197;206m [38;2;192;197;206mviewsets[K
[0m[48;2;79;40;40m[39m- 20    [0m:[39m[48;2;36;25;28m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206mrest_framework[38;2;192;197;206m.[38;2;192;197;206mdecorators[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206maction[K
[0m[48;2;43;48;59m[39m  21, 20[0m:[39m[48;2;43;48;59m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206mrest_framework[38;2;192;197;206m.[38;2;192;197;206mgenerics[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206mget_object_or_404[K
[0m[K
Updating: [38;5;141mdentacrm/backend/apps/prescriptions/views.py[0m
[38;5;244m - Completed in 0.1s[0m

I will run the following command: [38;5;141msource .venv/bin/activate && ruff check apps/prescriptions/ tests/test_prescriptions.py 2>&1 | tail -30[0m (in [38;5;141mdentacrm/backend[0m)[38;5;244m (using tool: shell)[0m

tests/test_prescriptions.py:260:14: B017 `pytest.raises(Exception)` should be considered evil
    |
258 |             created_by=head_doctor,
259 |         )
260 |         with pytest.raises(Exception):
    |              ^^^^^^^^^^^^^^^^^^^^^^^^ B017
261 |             PrescriptionTemplate.objects.create(
262 |                 name="Duplicate",
    |

Found 1 error.
[38;5;244m - Completed in 0.36s[0m

I'll modify the following file: [38;5;141mdentacrm/backend/tests/test_prescriptions.py[0m[38;5;244m (using tool: write)[0m

[48;2;43;48;59m[39m  254, 254[0m:[39m[48;2;43;48;59m [38;2;192;197;206m    [38;2;180;142;173mdef[38;2;192;197;206m [38;2;143;161;179mtest_unique_name_per_owner[38;2;192;197;206m([38;2;191;97;106mself[38;2;192;197;206m,[38;2;192;197;206m [38;2;191;97;106mhead_doctor[38;2;192;197;206m)[38;2;192;197;206m:[K
[0m[48;2;40;67;43m[39m+      255[0m:[39m[48;2;24;38;30m [38;2;192;197;206m        [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206mdjango[38;2;192;197;206m.[38;2;192;197;206mdb[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206mIntegrityError[K
[0m[48;2;40;67;43m[39m+      256[0m:[39m[48;2;24;38;30m [K
[0m[48;2;43;48;59m[39m  255, 257[0m:[39m[48;2;43;48;59m [38;2;192;197;206m        [38;2;192;197;206mPrescriptionTemplate[38;2;192;197;206m.[38;2;192;197;206mobjects[38;2;192;197;206m.[38;2;143;161;179mcreate[38;2;192;197;206m([K
[0m[48;2;43;48;59m[39m  256, 258[0m:[39m[48;2;43;48;59m [38;2;192;197;206m            [38;2;191;97;106mname[38;2;192;197;206m=[38;2;192;197;206m"[38;2;163;190;140mDuplicate[38;2;192;197;206m"[38;2;192;197;206m,[K
[0m[48;2;43;48;59m[39m  257, 259[0m:[39m[48;2;43;48;59m [38;2;192;197;206m            [38;2;191;97;106mcontent[38;2;192;197;206m=[38;2;192;197;206m"[38;2;163;190;140mx[38;2;192;197;206m"[38;2;192;197;206m,[K
[0m[48;2;43;48;59m[39m  258, 260[0m:[39m[48;2;43;48;59m [38;2;192;197;206m            [38;2;191;97;106mcreated_by[38;2;192;197;206m=[38;2;192;197;206mhead_doctor[38;2;192;197;206m,[K
[0m[48;2;43;48;59m[39m  259, 261[0m:[39m[48;2;43;48;59m [38;2;192;197;206m        [38;2;192;197;206m)[K
[0m[48;2;79;40;40m[39m- 260     [0m:[39m[48;2;36;25;28m [38;2;192;197;206m        [38;2;180;142;173mwith[38;2;192;197;206m [38;2;192;197;206mpytest[38;2;192;197;206m.[38;2;143;161;179mraises[38;2;192;197;206m([38;2;192;197;206mException[38;2;192;197;206m)[38;2;192;197;206m:[K
[0m[48;2;40;67;43m[39m+      262[0m:[39m[48;2;24;38;30m [38;2;192;197;206m        [38;2;180;142;173mwith[38;2;192;197;206m [38;2;192;197;206mpytest[38;2;192;197;206m.[38;2;143;161;179mraises[38;2;192;197;206m([38;2;192;197;206mIntegrityError[38;2;192;197;206m)[38;2;192;197;206m:[K
[0m[48;2;43;48;59m[39m  261, 263[0m:[39m[48;2;43;48;59m [38;2;192;197;206m            [38;2;192;197;206mPrescriptionTemplate[38;2;192;197;206m.[38;2;192;197;206mobjects[38;2;192;197;206m.[38;2;143;161;179mcreate[38;2;192;197;206m([K
[0m[48;2;43;48;59m[39m  262, 264[0m:[39m[48;2;43;48;59m [38;2;192;197;206m                [38;2;191;97;106mname[38;2;192;197;206m=[38;2;192;197;206m"[38;2;163;190;140mDuplicate[38;2;192;197;206m"[38;2;192;197;206m,[K
[0m[48;2;43;48;59m[39m  263, 265[0m:[39m[48;2;43;48;59m [38;2;192;197;206m                [38;2;191;97;106mcontent[38;2;192;197;206m=[38;2;192;197;206m"[38;2;163;190;140my[38;2;192;197;206m"[38;2;192;197;206m,[K
[0m[48;2;43;48;59m[39m  264, 266[0m:[39m[48;2;43;48;59m [38;2;192;197;206m                [38;2;191;97;106mcreated_by[38;2;192;197;206m=[38;2;192;197;206mhead_doctor[38;2;192;197;206m,[K
[0m[48;2;43;48;59m[39m  265, 267[0m:[39m[48;2;43;48;59m [38;2;192;197;206m            [38;2;192;197;206m)[K
[0m[K
Updating: [38;5;141mdentacrm/backend/tests/test_prescriptions.py[0m
[38;5;244m - Completed in 0.1s[0m

I will run the following command: [38;5;141msource .venv/bin/activate && ruff check apps/prescriptions/ tests/test_prescriptions.py 2>&1 | tail -10[0m (in [38;5;141mdentacrm/backend[0m)[38;5;244m (using tool: shell)[0m

All checks passed!
[38;5;244m - Completed in 0.37s[0m

I will run the following command: [38;5;141msource .venv/bin/activate && python -m pytest tests/test_prescriptions.py --tb=short -q 2>&1 | tail -5[0m (in [38;5;141mdentacrm/backend[0m)[38;5;244m (using tool: shell)[0m

..........................................................               [100%]
58 passed in 46.08s
[38;5;244m - Completed in 48.302s[0m

I will run the following command: [38;5;141msource .venv/bin/activate && python -m pytest --tb=short -q 2>&1 | tail -5[0m (in [38;5;141mdentacrm/backend[0m)[38;5;244m (using tool: shell)[0m

........................................................................ [ 25%]
........................................................................ [ 50%]
........................................................................ [ 75%]
.......................................................................  [100%]
287 passed in 215.51s (0:03:35)
[38;5;244m - Completed in 217.631s[0m

[38;5;141m> [0mLet me clean up leftover clutter in [38;5;10mapps/prescriptions/urls.py[0m:[0m[0m
I'll create the following file: [38;5;141mdentacrm/backend/apps/prescriptions/urls.py[0m[38;5;244m (using tool: write)[0m

[48;2;43;48;59m[39m   1,  1[0m:[39m[48;2;43;48;59m [38;2;101;115;126m"""[38;2;101;115;126mURL routes for the ``prescriptions`` app.[K
[0m[48;2;43;48;59m[39m   2,  2[0m:[39m[48;2;43;48;59m [K
[0m[48;2;79;40;40m[39m-  3    [0m:[39m[48;2;36;25;28m [38;2;101;115;126mTwo mount points:[K
[0m[48;2;40;67;43m[39m+      3[0m:[39m[48;2;24;38;30m [38;2;101;115;126mThree mount points (see ``config/urls.py``):[K
[0m[48;2;43;48;59m[39m   4,  4[0m:[39m[48;2;43;48;59m [K
[0m[48;2;79;40;40m[39m-  5    [0m:[39m[48;2;36;25;28m [38;2;101;115;126m* ``/api/v1/prescription-templates/`` → ``PrescriptionTemplateViewSet``[K
[0m[48;2;79;40;40m[39m-  6    [0m:[39m[48;2;36;25;28m [38;2;101;115;126m* ``/api/v1/prescriptions/``          → ``PrescriptionViewSet``[K
[0m[48;2;40;67;43m[39m+      5[0m:[39m[48;2;24;38;30m [38;2;101;115;126m* ``/api/v1/prescription-templates/`` → ``template_urlpatterns``[K
[0m[48;2;40;67;43m[39m+      6[0m:[39m[48;2;24;38;30m [38;2;101;115;126m* ``/api/v1/prescriptions/``          → ``prescription_urlpatterns``[K
[0m[48;2;40;67;43m[39m+      7[0m:[39m[48;2;24;38;30m [38;2;101;115;126m* ``/api/v1/treatments/{id}/prescription/`` → ``action_urlpatterns``[K
[0m[48;2;43;48;59m[39m   7,  8[0m:[39m[48;2;43;48;59m [K
[0m[48;2;79;40;40m[39m-  8    [0m:[39m[48;2;36;25;28m [38;2;101;115;126mThe action endpoint ``POST /api/v1/treatments/{id}/prescription/`` is[K
[0m[48;2;79;40;40m[39m-  9    [0m:[39m[48;2;36;25;28m [38;2;101;115;126mmounted separately (see ``prescription_action_urls`` in this module)[K
[0m[48;2;79;40;40m[39m- 10    [0m:[39m[48;2;36;25;28m [38;2;101;115;126mand wired from ``config/urls.py``.[K
[0m[48;2;40;67;43m[39m+      9[0m:[39m[48;2;24;38;30m [38;2;101;115;126mThe three viewsets live under distinct top-level paths so we expose[K
[0m[48;2;40;67;43m[39m+     10[0m:[39m[48;2;24;38;30m [38;2;101;115;126mthree named url-lists rather than a single ``urlpatterns`` with[K
[0m[48;2;40;67;43m[39m+     11[0m:[39m[48;2;24;38;30m [38;2;101;115;126m``include`` gymnastics.[K
[0m[48;2;43;48;59m[39m  11, 12[0m:[39m[48;2;43;48;59m [38;2;101;115;126m"""[K
[0m[48;2;43;48;59m[39m  12, 13[0m:[39m[48;2;43;48;59m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206m__future__[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206mannotations[K
[0m[48;2;43;48;59m[39m  13, 14[0m:[39m[48;2;43;48;59m [K
[0m[48;2;43;48;59m[39m  14, 15[0m:[39m[48;2;43;48;59m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206mdjango[38;2;192;197;206m.[38;2;192;197;206murls[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206mpath[K
[0m[48;2;43;48;59m[39m  15, 16[0m:[39m[48;2;43;48;59m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206mrest_framework[38;2;192;197;206m.[38;2;192;197;206mrouters[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206mDefaultRouter[K
[0m[48;2;43;48;59m[39m  16, 17[0m:[39m[48;2;43;48;59m [K
[0m[48;2;43;48;59m[39m  17, 18[0m:[39m[48;2;43;48;59m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;180;142;173m.[38;2;192;197;206mviews[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206m([K
[0m[48;2;43;48;59m[39m  18, 19[0m:[39m[48;2;43;48;59m [38;2;192;197;206m    [38;2;192;197;206mIssuePrescriptionActionView[38;2;192;197;206m,[K
[0m[48;2;43;48;59m[39m  19, 20[0m:[39m[48;2;43;48;59m [38;2;192;197;206m    [38;2;192;197;206mPrescriptionTemplateViewSet[38;2;192;197;206m,[K
[0m[48;2;43;48;59m[39m  20, 21[0m:[39m[48;2;43;48;59m [38;2;192;197;206m    [38;2;192;197;206mPrescriptionViewSet[38;2;192;197;206m,[K
[0m[48;2;43;48;59m[39m  21, 22[0m:[39m[48;2;43;48;59m [38;2;192;197;206m)[K
[0m[48;2;43;48;59m[39m  22, 23[0m:[39m[48;2;43;48;59m [K
[0m[48;2;43;48;59m[39m  23, 24[0m:[39m[48;2;43;48;59m [38;2;192;197;206mapp_name[38;2;192;197;206m [38;2;192;197;206m=[38;2;192;197;206m [38;2;192;197;206m"[38;2;163;190;140mprescriptions[38;2;192;197;206m"[K
[0m[48;2;43;48;59m[39m  24, 25[0m:[39m[48;2;43;48;59m [K
[0m[48;2;79;40;40m[39m- 25    [0m:[39m[48;2;36;25;28m [38;2;192;197;206mrouter[38;2;192;197;206m [38;2;192;197;206m=[38;2;192;197;206m [38;2;143;161;179mDefaultRouter[38;2;192;197;206m([38;2;192;197;206m)[K
[0m[48;2;79;40;40m[39m- 26    [0m:[39m[48;2;36;25;28m [38;2;192;197;206mrouter[38;2;192;197;206m.[38;2;143;161;179mregister[38;2;192;197;206m([K
[0m[48;2;79;40;40m[39m- 27    [0m:[39m[48;2;36;25;28m [38;2;192;197;206m    [38;2;180;142;173mr[38;2;192;197;206m"[38;2;163;190;140mtemplates[38;2;192;197;206m"[38;2;192;197;206m,[38;2;192;197;206m [38;2;192;197;206mPrescriptionTemplateViewSet[38;2;192;197;206m,[38;2;192;197;206m [38;2;191;97;106mbasename[38;2;192;197;206m=[38;2;192;197;206m"[38;2;163;190;140mprescription-template[38;2;192;197;206m"[K
[0m[48;2;79;40;40m[39m- 28    [0m:[39m[48;2;36;25;28m [38;2;192;197;206m)[K
[0m[48;2;79;40;40m[39m- 29    [0m:[39m[48;2;36;25;28m [38;2;192;197;206mrouter[38;2;192;197;206m.[38;2;143;161;179mregister[38;2;192;197;206m([K
[0m[48;2;79;40;40m[39m- 30    [0m:[39m[48;2;36;25;28m [38;2;192;197;206m    [38;2;180;142;173mr[38;2;192;197;206m"[38;2;163;190;140mlist[38;2;192;197;206m"[38;2;192;197;206m,[38;2;192;197;206m [38;2;192;197;206mPrescriptionViewSet[38;2;192;197;206m,[38;2;192;197;206m [38;2;191;97;106mbasename[38;2;192;197;206m=[38;2;192;197;206m"[38;2;163;190;140mprescription[38;2;192;197;206m"[K
[0m[48;2;79;40;40m[39m- 31    [0m:[39m[48;2;36;25;28m [38;2;192;197;206m)[K
[0m[48;2;43;48;59m[39m  32, 26[0m:[39m[48;2;43;48;59m [K
[0m[48;2;79;40;40m[39m- 33    [0m:[39m[48;2;36;25;28m [38;2;101;115;126m#[38;2;101;115;126m The two viewsets live under different top-level paths in the API[K
[0m[48;2;79;40;40m[39m- 34    [0m:[39m[48;2;36;25;28m [38;2;101;115;126m# (``/prescription-templates/`` and ``/prescriptions/``) so we expose[K
[0m[48;2;79;40;40m[39m- 35    [0m:[39m[48;2;36;25;28m [38;2;101;115;126m# them as *two* url-lists to keep the mount points clean.[K
[0m[48;2;40;67;43m[39m+     27[0m:[39m[48;2;24;38;30m [38;2;180;142;173mdef[38;2;192;197;206m [38;2;143;161;179m_template_router[38;2;192;197;206m([38;2;192;197;206m)[38;2;192;197;206m [38;2;192;197;206m->[38;2;192;197;206m [38;2;192;197;206mDefaultRouter[38;2;192;197;206m:[K
[0m[48;2;40;67;43m[39m+     28[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;192;197;206mrouter[38;2;192;197;206m [38;2;192;197;206m=[38;2;192;197;206m [38;2;143;161;179mDefaultRouter[38;2;192;197;206m([38;2;192;197;206m)[K
[0m[48;2;40;67;43m[39m+     29[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;192;197;206mrouter[38;2;192;197;206m.[38;2;143;161;179mregister[38;2;192;197;206m([38;2;180;142;173mr[38;2;192;197;206m"[38;2;192;197;206m"[38;2;192;197;206m,[38;2;192;197;206m [38;2;192;197;206mPrescriptionTemplateViewSet[38;2;192;197;206m,[38;2;192;197;206m [38;2;191;97;106mbasename[38;2;192;197;206m=[38;2;192;197;206m"[38;2;163;190;140mprescription-template[38;2;192;197;206m"[38;2;192;197;206m)[K
[0m[48;2;40;67;43m[39m+     30[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;180;142;173mreturn[38;2;192;197;206m [38;2;192;197;206mrouter[K
[0m[48;2;40;67;43m[39m+     31[0m:[39m[48;2;24;38;30m [K
[0m[48;2;43;48;59m[39m  36, 32[0m:[39m[48;2;43;48;59m [K
[0m[48;2;79;40;40m[39m- 37    [0m:[39m[48;2;36;25;28m [38;2;101;115;126mtemplates_router = DefaultRouter()[K
[0m[48;2;79;40;40m[39m- 38    [0m:[39m[48;2;36;25;28m [38;2;101;115;126mtemplates_router.register([K
[0m[48;2;79;40;40m[39m- 39    [0m:[39m[48;2;36;25;28m [38;2;101;115;126m    r"", PrescriptionTemplateViewSet, basename="prescription-template"[K
[0m[48;2;79;40;40m[39m- 40    [0m:[39m[48;2;36;25;28m [38;2;101;115;126m)[K
[0m[48;2;40;67;43m[39m+     33[0m:[39m[48;2;24;38;30m [38;2;180;142;173mdef[38;2;192;197;206m [38;2;143;161;179m_prescription_router[38;2;192;197;206m([38;2;192;197;206m)[38;2;192;197;206m [38;2;192;197;206m->[38;2;192;197;206m [38;2;192;197;206mDefaultRouter[38;2;192;197;206m:[K
[0m[48;2;40;67;43m[39m+     34[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;192;197;206mrouter[38;2;192;197;206m [38;2;192;197;206m=[38;2;192;197;206m [38;2;143;161;179mDefaultRouter[38;2;192;197;206m([38;2;192;197;206m)[K
[0m[48;2;40;67;43m[39m+     35[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;192;197;206mrouter[38;2;192;197;206m.[38;2;143;161;179mregister[38;2;192;197;206m([38;2;180;142;173mr[38;2;192;197;206m"[38;2;192;197;206m"[38;2;192;197;206m,[38;2;192;197;206m [38;2;192;197;206mPrescriptionViewSet[38;2;192;197;206m,[38;2;192;197;206m [38;2;191;97;106mbasename[38;2;192;197;206m=[38;2;192;197;206m"[38;2;163;190;140mprescription[38;2;192;197;206m"[38;2;192;197;206m)[K
[0m[48;2;40;67;43m[39m+     36[0m:[39m[48;2;24;38;30m [38;2;192;197;206m    [38;2;180;142;173mreturn[38;2;192;197;206m [38;2;192;197;206mrouter[K
[0m[48;2;43;48;59m[39m  41, 37[0m:[39m[48;2;43;48;59m [K
[0m[48;2;79;40;40m[39m- 42    [0m:[39m[48;2;36;25;28m [38;2;101;115;126mprescriptions_router = DefaultRouter()[K
[0m[48;2;79;40;40m[39m- 43    [0m:[39m[48;2;36;25;28m [38;2;101;115;126mprescriptions_router.register([K
[0m[48;2;79;40;40m[39m- 44    [0m:[39m[48;2;36;25;28m [38;2;101;115;126m    r"", PrescriptionViewSet, basename="prescription"[K
[0m[48;2;79;40;40m[39m- 45    [0m:[39m[48;2;36;25;28m [38;2;101;115;126m)[K
[0m[48;2;43;48;59m[39m  46, 38[0m:[39m[48;2;43;48;59m [K
[0m[48;2;79;40;40m[39m- 47    [0m:[39m[48;2;36;25;28m [38;2;101;115;126m# --- Public url-lists (imported from config/urls.py) ------------------------[K
[0m[48;2;79;40;40m[39m- 48    [0m:[39m[48;2;36;25;28m [38;2;101;115;126mtemplate_urlpatterns = templates_router.urls[K
[0m[48;2;79;40;40m[39m- 49    [0m:[39m[48;2;36;25;28m [38;2;101;115;126mprescription_urlpatterns = prescriptions_router.urls[K
[0m[48;2;40;67;43m[39m+     39[0m:[39m[48;2;24;38;30m [38;2;192;197;206mtemplate_urlpatterns[38;2;192;197;206m [38;2;192;197;206m=[38;2;192;197;206m [38;2;143;161;179m_template_router[38;2;192;197;206m([38;2;192;197;206m)[38;2;192;197;206m.[38;2;192;197;206murls[K
[0m[48;2;40;67;43m[39m+     40[0m:[39m[48;2;24;38;30m [38;2;192;197;206mprescription_urlpatterns[38;2;192;197;206m [38;2;192;197;206m=[38;2;192;197;206m [38;2;143;161;179m_prescription_router[38;2;192;197;206m([38;2;192;197;206m)[38;2;192;197;206m.[38;2;192;197;206murls[K
[0m[48;2;43;48;59m[39m  50, 41[0m:[39m[48;2;43;48;59m [K
[0m[48;2;79;40;40m[39m- 51    [0m:[39m[48;2;36;25;28m [38;2;101;115;126m# Action route: ``/api/v1/treatments/{treatment_id}/prescription/``[K
[0m[48;2;40;67;43m[39m+     42[0m:[39m[48;2;24;38;30m [38;2;101;115;126m#[38;2;101;115;126m Action route: ``/api/v1/treatments/{treatment_id}/prescription/``[K
[0m[48;2;43;48;59m[39m  52, 43[0m:[39m[48;2;43;48;59m [38;2;101;115;126maction_urlpatterns = [[K
[0m[48;2;43;48;59m[39m  53, 44[0m:[39m[48;2;43;48;59m [38;2;101;115;126m    path([K
[0m[48;2;43;48;59m[39m  54, 45[0m:[39m[48;2;43;48;59m [38;2;101;115;126m        "<uuid:treatment_id>/prescription/",[K
[0m[48;2;43;48;59m[39m  55, 46[0m:[39m[48;2;43;48;59m [38;2;101;115;126m        IssuePrescriptionActionView.as_view(),[K
[0m[48;2;43;48;59m[39m  56, 47[0m:[39m[48;2;43;48;59m [38;2;101;115;126m        name="treatment-issue-prescription",[K
[0m[48;2;43;48;59m[39m  57, 48[0m:[39m[48;2;43;48;59m [38;2;101;115;126m    ),[K
[0m[48;2;43;48;59m[39m  58, 49[0m:[39m[48;2;43;48;59m [38;2;101;115;126m][K
[0m[48;2;43;48;59m[39m  59, 50[0m:[39m[48;2;43;48;59m [K
[0m[48;2;40;67;43m[39m+     51[0m:[39m[48;2;24;38;30m [38;2;101;115;126m# Compatibility: some tooling imports ``urlpatterns`` from every app.[K
[0m[48;2;43;48;59m[39m  60, 52[0m:[39m[48;2;43;48;59m [38;2;101;115;126murlpatterns = template_urlpatterns[K
[0m[48;2;40;67;43m[39m+     53[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     54[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     55[0m:[39m[48;2;24;38;30m [38;2;101;115;126m__all__ = [[K
[0m[48;2;40;67;43m[39m+     56[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    "template_urlpatterns",[K
[0m[48;2;40;67;43m[39m+     57[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    "prescription_urlpatterns",[K
[0m[48;2;40;67;43m[39m+     58[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    "action_urlpatterns",[K
[0m[48;2;40;67;43m[39m+     59[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    "urlpatterns",[K
[0m[48;2;40;67;43m[39m+     60[0m:[39m[48;2;24;38;30m [38;2;101;115;126m][K
[0m[K
Replacing: [38;5;141mdentacrm/backend/apps/prescriptions/urls.py[0m
[38;5;244m - Completed in 0.1s[0m

I will run the following command: [38;5;141msource .venv/bin/activate && python manage.py check 2>&1 && python -m pytest tests/test_prescriptions.py --tb=short -q 2>&1 | tail -5[0m (in [38;5;141mdentacrm/backend[0m)[38;5;244m (using tool: shell)[0m

System check identified no issues (0 silenced).
..........................................................               [100%]
58 passed in 56.15s
[38;5;244m - Completed in 60.401s[0m

I will run the following command: [38;5;141msource .venv/bin/activate && ruff check apps/prescriptions/ 2>&1[0m (in [38;5;141mdentacrm/backend[0m)[38;5;244m (using tool: shell)[0m

All checks passed!
[38;5;244m - Completed in 0.31s[0m

[38;5;141m> [0mLet me also verify the migration file exists and looks clean:[0m[0m
Reading directory: [38;5;141m/home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/apps/prescriptions[0m[38;5;244m (using tool: read, max depth: 0, max entries: 1000, excluding: defaults)[0m
[38;5;10m ✓ [0mSuccessfully read directory [38;5;141m/home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/apps/prescriptions[0m [38;5;244m(12 entries)[0m
[38;5;244m - Completed in 0.0s[0m

I will run the following command: [38;5;141mls apps/prescriptions/migrations/[0m (in [38;5;141mdentacrm/backend[0m)[38;5;244m (using tool: shell)[0m

0001_initial.py
__init__.py
__pycache__
[38;5;244m - Completed in 0.11s[0m

[38;5;141m> [0mAll the pieces are in place. Let me run the full test suite one last time to confirm no regressions:[0m[0m
I will run the following command: [38;5;141msource .venv/bin/activate && python -m pytest --tb=short -q 2>&1 | tail -5[0m (in [38;5;141mdentacrm/backend[0m)[38;5;244m (using tool: shell)[0m

........................................................................ [ 25%]
........................................................................ [ 50%]
........................................................................ [ 75%]
.......................................................................  [100%]
287 passed in 224.36s (0:03:44)
[38;5;244m - Completed in 226.407s[0m

[38;5;141m> [0mAll 287 tests pass. Task 14 (prescriptions app) is complete.[0m[0m
[0m[0m
[1mjson
[0m[38;5;10m{
  "state": "needs_review",
  "summary": "Implemented Phase 3 Task 14 — the `prescriptions` app. Two models (`PrescriptionTemplate`, `Prescription`) inheriting `core.BaseModel`, full write-side services (`create_prescription_template`, `update_prescription_template`, `soft_delete_template`, `create_prescription_for_treatment`, `mark_prescription_sent`, `soft_delete_prescription`) with placeholder substitution (`{patient_name}`, `{doctor_name}`, `{diagnosis}`) and defensive Telegram delivery that leaves `sent_to_telegram_at=None` when the bot app is absent or `patient.telegram_chat_id` is empty. Read-side selectors, role-scoped permissions (bosh_shifokor full; doctor writes own only; administrator read-only), camelCase DRF serializers, `PrescriptionTemplateViewSet` (CRUD), `PrescriptionViewSet` (list/retrieve/soft-delete, filterable by `?treatment=&patient=&doctor=&is_sent=`), and `IssuePrescriptionActionView` at `POST /api/v1/treatments/{id}/prescription/`. Wired into `INSTALLED_APPS`, `config/urls.py`, and Django admin. 58 pytest tests added covering models, services, selectors, RBAC, filters, camelCase envelope, template ownership, verbatim content retention, and Telegram delivery paths.",
  "files_changed": [
    "dentacrm/backend/apps/prescriptions/__init__.py",
    "dentacrm/backend/apps/prescriptions/apps.py",
    "dentacrm/backend/apps/prescriptions/models.py",
    "dentacrm/backend/apps/prescriptions/selectors.py",
    "dentacrm/backend/apps/prescriptions/services.py",
    "dentacrm/backend/apps/prescriptions/permissions.py",
    "dentacrm/backend/apps/prescriptions/serializers.py",
    "dentacrm/backend/apps/prescriptions/views.py",
    "dentacrm/backend/apps/prescriptions/urls.py",
    "dentacrm/backend/apps/prescriptions/admin.py",
    "dentacrm/backend/apps/prescriptions/migrations/__init__.py",
    "dentacrm/backend/apps/prescriptions/migrations/0001_initial.py",
    "dentacrm/backend/config/settings/base.py",
    "dentacrm/backend/config/urls.py",
    "dentacrm/backend/tests/test_prescriptions.py"
  ],
  "verification": "`python manage.py check` → no issues; `python manage.py makemigrations prescriptions` → 0001_initial created; `python manage.py migrate` → applied cleanly; `python manage.py spectacular --file /tmp/schema.yaml` → 0 errors, 35 prescription mentions in schema; `ruff check apps/prescriptions/ tests/test_prescriptions.py` → all checks passed; `pytest tests/test_prescriptions.py` → 58 passed; `pytest` (full suite) → 287 passed (229 baseline + 58 new), 0 regressions.",
  "next_suggested_task": "Phase 3, Task 15: inventory app (Material, MaterialUsage, MaterialStockLog + auto-decrement signals + low-stock alert). Then Phase 4 payments/ratings/reports, Phase 5 notifications/telegram_bot/celery, Phase 6 seed_demo_data + docker-compose prod + CI.",
  "blockers": []
}
[0m
```

## STDERR
```text
[32mAll tools are now trusted ([0m[31m![0m[32m). Kiro will execute tools without asking for confirmation.[0m
Agents can sometimes do unexpected things so understand the risks.

Learn more at [38;5;141mhttps://kiro.dev/docs/cli/chat/security/#using-tools-trust-all-safely[0m



[38;5;252m[0m[?25l[?25l[0m[0m[?25l[0m[?25l[0m[0m[?25l[0m[?25l[?25l[0m[0m[?25l[0m[?25l[0m[0m[?25l[0m[?25l[0m[0m[?25l[0m[?25l[0m[0m[?25l[0m[?25l[0m[0m[?25l[0m[?25l[0m[0m[?25l[0m[?25l[0m[0m[?25l[0m[?25l[0m[0m[?25l[0m[?25l[0m[0m[?25l[0m[?25l[0m[0m[?25l[0m[?25l[0m[0m[?25l[0m[?25l[0m[0m[?25l[0m[?25l[0m[0m[?25l[0m[?25l[0m[0m[?25l[0m[?25l[0m[0m[?25l[0m[?25l[0m[0m[?25l[0m[?25l[0m[0m[?25l[0m[?25l[0m[0m[?25l[0m[?25l[0m[0m[?25l[0m[?25l[0m[0m[?25l[0m[?25l[0m[0m[?25l[0m[?25l[0m[0m[?25l[0m[?25l[0m[0m[?25l[0m[?25l[0m[0m[?25l[0m[?25l[0m[0m[?25l[0m[?25l[0m[0m[?25l[0m[?25l[0m[0m[?25l[0m[?25l[0m[0m[?25l[0m[?25l[0m[0m[?25l[0m[?25l[0m[0m[?25l[0m[?25l[0m[0m[?25l[0m[?25l[0m[0m[?25l[0m[?25l[0m[0m[?25l[0m[?25l[0m[0m[?25l[0m[?25l[0m[0m[?25l[0m[?25l[0m[0m[?25l[0m[?25l[0m[0m[?25l[0m[?25l[0m[0m[?25l[0m[?25l[0m[0m[?25l[0m[?25l[0m[0m[?25l[0m[?25l[0m[0m[?25l[0m[?25l[0m[0m[?25l[0m[?25l[0m[0m[?25l[0m[0m[0m
[38;5;8m
 ▸ Credits: 32.55 • Time: 24m 28s

[0m[1G[0m[0m[?25h
```