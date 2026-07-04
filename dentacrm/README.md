# DentaCRM

Tish klinikalari uchun CRM tizimi — bemor boshqaruvi, navbat/jadval, davolanish
yozuvlari, odontogram, omborxona, to'lovlar, shifokor reytingi, Telegram bot va
boshqaruv paneli.

Arxitektura: **modular monolith** — bitta Django 5 backend + React 18 SPA,
Docker Compose bilan orkestrastiya qilinadi.

## Talab qilinadigan versiyalar

| Vosita          | Versiya |
|-----------------|---------|
| Docker          | 24+     |
| Docker Compose  | v2      |
| Python (host)   | 3.12+   |
| Node.js (host)  | 20+     |

Host'da Python/Node kerak faqat container'siz lokal ishlash uchun. Odatiy oqim —
`docker compose up`.

## Tez ishga tushirish — DEV

```bash
# 1. Envni sozlash
cp .env.example .env

# 2. Butun stackni ko'tarish
docker compose up --build

# 3. Demo ma'lumotlar (migratsiya container ichida avtomatik ishlaydi)
docker compose exec backend python manage.py seed_demo_data
```

Ishga tushgandan keyin:

| Xizmat             | URL                                    |
|--------------------|----------------------------------------|
| Frontend (Vite)    | http://localhost:5173                  |
| Backend API        | http://localhost:8000/api/v1/          |
| Swagger docs       | http://localhost:8000/api/docs/        |
| ReDoc              | http://localhost:8000/api/redoc/       |
| Django admin       | http://localhost:8000/admin/           |
| MinIO console      | http://localhost:9001 (minioadmin/…)   |
| Postgres           | localhost:5432                         |
| Redis              | localhost:6379                         |

### Demo login ma'lumotlari

`seed_demo_data` quyidagi foydalanuvchilarni yaratadi (parol hammasida:
**`demo12345`**):

| Rol            | Telefon         | Ism           |
|----------------|-----------------|---------------|
| bosh_shifokor  | +998900000001   | Bosh Shifokor |
| doctor         | +998900000002   | Dilshod Karimov (Terapevt) |
| doctor         | +998900000003   | Zilola Ismoilova (Ortoped) |
| administrator  | +998900000010   | Administrator |

Bemorlar (10 ta): `+998900010001` … `+998900010010`.

Yangidan boshlash uchun `--wipe` bayrog'i:

```bash
docker compose exec backend python manage.py seed_demo_data --wipe
```

## PROD ishga tushirish

```bash
# 1. Prod envni sozlang — barcha REPLACE_ME_… qiymatlarni real qiymatlarga o'zgartiring
cp .env.prod.example .env

# 2. Butun stackni ko'tarish (nginx + gunicorn + celery + bot + frontend)
docker compose -f docker-compose.prod.yml up -d --build

# 3. Loglar
docker compose -f docker-compose.prod.yml logs -f backend
```

Prod stack quyidagilarni avtomatik bajaradi:

- `manage.py migrate --noinput`
- `manage.py collectstatic --noinput --clear`
- `gunicorn config.wsgi:application` (4 worker × 2 thread)
- Nginx reverse proxy: `/api/`, `/media/`, `/static/`, `/admin/` → backend

Faqat **`HOST_HTTP_PORT`** (default: 80) host'ga ochiladi. TLS uchun oldinga
Caddy/Cloudflare/AWS ALB qo'ying — nginx tag'ida `X-Forwarded-Proto` handling
allaqachon yoqilgan.

MinIO'ni container ichida ishga tushirish uchun (kichik on-prem deployment):

```bash
docker compose -f docker-compose.prod.yml --profile minio up -d --build
```

Aks holda `S3_ENDPOINT_URL`, `S3_ACCESS_KEY`, `S3_SECRET_KEY`ni haqiqiy AWS S3
qiymatlariga o'zgartiring.

## Testlar

```bash
# Backend
cd backend
python -m pytest --tb=short -q

# Frontend
cd frontend
npm test -- --run
```

CI (GitHub Actions) — `.github/workflows/ci.yml` — har commit uchun:

1. **backend** — ruff + pytest (postgres:16 + redis:7 service matrixi)
2. **frontend** — eslint + tsc + vitest + vite build
3. **compose** — dev + prod compose'ni `docker compose config` bilan tekshiradi

## Repo tuzilishi

```
dentacrm/
├── backend/                 # Django 5 + DRF (modular monolith)
├── frontend/                # React 18 + Vite + TS
│   ├── Dockerfile           # dev (Vite dev server)
│   ├── Dockerfile.prod      # multi-stage: node build → nginx serve
│   └── nginx.conf           # SPA + /api reverse-proxy shabloni
├── scripts/                 # init-postgres.sql, yordamchi skriptlar
├── docker-compose.yml       # dev stack
├── docker-compose.prod.yml  # prod stack
├── .env.example             # dev o'zgaruvchilari shabloni
├── .env.prod.example        # prod o'zgaruvchilari shabloni
└── README.md
```

Batafsil qatlamli tuzilma va acceptance criteria uchun tepadagi
`PROJECT_BRIEF.md` faylini ko'ring.

## Litsenziya

Ichki loyiha.
