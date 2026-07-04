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

## Tez ishga tushirish (dev)

```bash
# 1. Envni sozlash
cp .env.example .env

# 2. Butun stackni ko'tarish
docker compose up --build

# 3. Backend migratsiya + demo ma'lumot (birinchi safar)
docker compose exec backend python manage.py migrate
docker compose exec backend python manage.py seed_demo_data --fresh
```

Ishga tushgandan keyin:

| Xizmat             | URL                                    |
|--------------------|----------------------------------------|
| Frontend (Vite)    | http://localhost:5173                  |
| Backend API        | http://localhost:8000/api/v1/          |
| Swagger docs       | http://localhost:8000/api/docs/        |
| MinIO console      | http://localhost:9001 (minioadmin/…)   |
| Postgres           | localhost:5432                         |
| Redis              | localhost:6379                         |

## Repo tuzilishi

```
dentacrm/
├── backend/            # Django 5 + DRF (modular monolith)
├── frontend/           # React 18 + Vite + TS
├── scripts/            # init-postgres.sql, yordamchi skriptlar
├── docker-compose.yml  # dev stack
├── .env.example        # o'zgaruvchilar shabloni
└── README.md
```

Batafsil qatlamli tuzilma va acceptance criteria uchun tepadagi
`PROJECT_BRIEF.md` faylini ko'ring.

## Litsenziya

Ichki loyiha.
