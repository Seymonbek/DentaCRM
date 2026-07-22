# Role: Code Reviewer

You are the strict code reviewer. You review builder output against PROJECT_BRIEF.md acceptance criteria. Do NOT edit files.

## Review Dimensions

### 1. Correctness
- Does it match PROJECT_BRIEF.md acceptance criteria?
- Is the logic correct?
- Does the data flow work end-to-end?

### 2. Type Safety
- TypeScript: no `any` types
- Python: type hints on functions, Pydantic models for I/O

### 3. Security
- Auth on protected endpoints
- Input validation
- No secrets in code
- SQL injection prevention

### 4. Error Handling
- Consistent error format
- Graceful failures
- User-friendly messages

### 5. Testing
- Core logic has tests
- Tests pass

## Review Cycle

2

## Project Brief

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
- `ToothRecord`: `treatment` FK, `tooth_number` (IntegerField, FDI: 11-48), `procedure` (choices: filling/root_canal/extraction/crown/implant/cleaning/whitening), `status` (choices: healthy/treated/missing/planned), `notes`

### prescriptions app
- `PrescriptionTemplate`: `name`, `content` (TextField), `created_by` FK
- `Prescription`: `treatment` FK, `template` FK (nullable), `content` (TextField), `sent_to_telegram_at` (nullable DateTimeField)

### inventory app
- `Material`: `name`, `unit` (choices: gram/piece/ml), `quantity_in_stock` (DecimalField), `minimum_threshold` (DecimalField), `unit_cost` (nullable DecimalField)
- `MaterialUsage`: `treatment` FK, `material` FK, `quantity_used` (DecimalField)
- `MaterialStockLog`: `material` FK, `change_amount`, `reason` (choices: usage/restock/adjustment), `related_treatment` FK (nullable)

### payments app
- `Payment`: `treatment` FK, `patient` FK, `amount` (DecimalField), `method` (choices: cash/card/payme/click/bank_transfer), `received_by` FK(User), `created_at`
- `CommissionRecord`: `doctor` FK, `treatment` FK, `amount` (DecimalField), `basis` (CharField), `calculated_at`
- **Komissiya formulasi:** rate = procedure_type.commission_rate_override or doctor.default_commission_rate; base = price (from_total) or price - material_cost (from_net); commission = base * rate / 100

### ratings app
- `ScoreLog`: `doctor` FK, `points` (IntegerField), `reason` (choices: new_patient/treatment_completed/photo_uploaded/activity_streak)
- `Badge`: `name`, `description`, `icon`
- `DoctorBadge`: `doctor` FK, `badge` FK, `period` (CharField), `awarded_at`

### notifications app
- `NotificationLog`: `user` FK (nullable), `patient` FK (nullable), `type` (CharField), `channel` (default: telegram), `message`, `status` (choices: pending/sent/failed), `sent_at` (nullable)

### reports app
- Modelsiz — faqat aggregate selectors: kunlik/oylik statistika, eng ko'p muolaja, shifokor unumdorligi, daromad dinamikasi. Redis cache (5 daqiqa TTL).

---

## API Endpoints

Barcha endpointlar `/api/v1/` prefiksi bilan. Auth: `Authorization: Bearer <access_token>`.

### Auth
- `POST /auth/login/` — telefon+parol → access+refresh token
- `POST /auth/refresh/` — refresh token yangilash
- `GET /auth/me/` — joriy user profili

### Departments
- `GET/POST /departments/` — ro'yxat/yaratish (bosh_shifokor)
- `PATCH/DELETE /departments/{id}/` — tahrirlash/o'chirish

### Doctors
- `GET/POST /doctors/` — ro'yxat/yaratish (bosh_shifokor)
- `GET/PATCH /doctors/{id}/` — profil
- `GET/POST /doctors/{id}/working-hours/` — ish jadvali
- `GET/POST /doctors/{id}/time-off/` — dam olish kunlari
- `GET /doctors/{id}/available-slots/?date=YYYY-MM-DD` — bo'sh vaqtlar

### Procedure Types
- `GET/POST /procedure-types/` — filtrlash: `?department=`

### Patients
- `GET/POST /patients/` — ro'yxat/yaratish; filtrlash: `?search=` (ism/telefon)
- `GET/PATCH /patients/{id}/` — kartochka
- `GET /patients/{id}/history/` — davolanish tarixi (timeline)
- `GET /patients/{id}/odontogram/` — tish formulasi holati

### Scheduling
- `GET/POST /appointments/` — filtrlash: `?doctor=&status=&date_from=&date_to=`
- `PATCH /appointments/{id}/` — status o'zgartirish
- `POST /appointments/{id}/cancel/` — bekor qilish

### Treatments
- `GET/POST /treatments/` — filtrlash: `?patient=&doctor=`
- `PATCH /treatments/{id}/` — tahrirlash
- `POST /treatments/{id}/photos/` — rasm yuklash (multipart/form-data)
- `POST /treatments/{id}/tooth-records/` — tish yozuvi qo'shish

### Prescriptions
- `GET/POST /prescription-templates/` — shablonlar
- `POST /treatments/{id}/prescription/` — retsept yaratish va yuborish

### Inventory
- `GET/POST /materials/` — materiallar; filtrlash: `?below_threshold=true`
- `PATCH /materials/{id}/restock/` — to'ldirish
- `GET /materials/{id}/logs/` — tarix

### Payments
- `GET/POST /payments/` — filtrlash: `?method=`
- `GET /patients/{id}/balance/` — qarzdorlik
- `GET /doctors/{id}/commissions/?from=&to=` — komissiya hisobi

### Ratings
- `GET /ratings/leaderboard/` — reyting jadvali; filtrlash: `?period=2026-07`
- `GET /doctors/{id}/badges/` — nishonlar

### Reports (bosh_shifokor only)
- `GET /reports/dashboard/?period=day|week|month` — umumiy statistika
- `GET /reports/revenue/` — daromad
- `GET /reports/procedures/` — muolajalar statistikasi
- `GET /reports/departments/` — bo'limlar bo'yicha

### Pagination format (barcha list endpointlar):
```json
{ "count": 42, "next": "...?page=2", "previous": null, "results": [...] }
```

### Error format (barcha xatolar):
```json
{ "error": { "code": "VALIDATION_ERROR", "message": "...", "details": {} } }
```

---

## RBAC (Role-Based Access Control)

| Amal | bosh_shifokor | doctor | administrator |
|---|---|---|---|
| Bemor ro'yxatga olish/navbat | ✅ | ❌ | ✅ |
| Ish jadvalini boshqarish | ✅ (hammasi) | faqat o'ziniki | ✅ |
| Davolanish yozuvi | ✅ | ✅ | ❌ |
| To'lov qabul qilish | ✅ | ✅ | ✅ |
| Barcha shifokorlar ishini ko'rish | ✅ | can_view_other_doctors=True bo'lsa | ❌ |
| Shifokor/bo'lim qo'shish-o'chirish | ✅ | ❌ | ❌ |
| Umumiy moliyaviy hisobot | ✅ | ❌ | ❌ |

Permission klasslari: `IsBoshShifokor`, `IsDoctor`, `IsAdministrator`, `IsOwnerDoctorOrPermitted`

---

## Telegram Bot (Aiogram 3.x)

Ikki oqim:
1. **Xodimlar** — telegram_chat_id orqali bildirishnoma (yangi bemor, to'lov, low stock, reyting)
2. **Bemorlar** — bir tomonlama (eslatma 1 kun/2 soat oldin, retsept, follow-up taklifnoma)

Fayl tuzilishi:
```
apps/telegram_bot/
├── bot.py                # Bot(), Dispatcher()
├── routers/{staff.py, patient.py}
├── states.py             # FSM: PhoneVerification
├── middlewares.py        # throttling, logging
├── keyboards.py
└── dispatcher_runner.py  # polling (dev) / webhook (prod)
```

---

## Celery Tasks

| Task | Trigger | Vazifa |
|---|---|---|
| send_appointment_reminder_1day | Beat, har soat | Ertangi navbat eslatmasi |
| send_appointment_reminder_2hour | Beat, har 15 daq | 2 soat qolgan eslatma |
| send_followup_invite | Beat, kuniga 1 | Profilaktik muddat o'tgan bemorlar |
| check_low_stock | Signal (MaterialUsage) | Material kam qolganda ogohlantirish |
| send_notification | Signal | NotificationLog + Telegram yuborish |
| generate_dashboard_cache | Beat, har 5 daq | Aggregate'larni Redis'da yangilash |
| backup_database | Beat, kuniga 1 | pg_dump → S3/MinIO |
| process_treatment_photo | Signal | Thumbnail generatsiya (300px) |

---

## Frontend Architecture

### Routing
| Route | Sahifa | Ruxsat |
|---|---|---|
| `/login` | LoginPage | Hammaga |
| `/dashboard` | DashboardPage | bosh_shifokor |
| `/departments` | DepartmentsPage | bosh_shifokor |
| `/doctors`, `/doctors/:id` | DoctorsPage, DoctorDetailPage | bosh_shifokor |
| `/finance` | FinancePage | bosh_shifokor |
| `/inventory` | InventoryPage | bosh_shifokor (to'liq), doctor (faqat sarflash) |
| `/ratings` | RatingsPage | bosh_shifokor, doctor |
| `/settings` | SettingsPage | hammasi |
| `/my-appointments` | MyAppointmentsPage | doctor |
| `/my-patients`, `/patients/:id` | MyPatientsPage, PatientDetailPage | doctor, administrator |
| `/schedule` | SchedulePage | administrator |
| `/patients/new` | NewPatientPage | administrator |
| `/appointments/new` | NewAppointmentPage | administrator |
| `/payments/new` | NewPaymentPage | administrator |

### Key Components
- `AppShell`, `Sidebar`, `Header`, `RoleGuard`, `Breadcrumbs` (layout)
- `DataTable` (sort/pagination), `Pagination`, `Modal`, `ConfirmDialog`, `Toast`, `Skeleton`, `EmptyState` (UI)
- `Odontogram` — 32 tishli interaktiv SVG (FDI raqamlash)
- `ScheduleCalendar` — kun/hafta ko'rinishi, bo'sh slot tanlash
- `PatientTimeline` — xronologik tarix
- `StatsCharts` — Recharts grafiklari
- `PatientForm`, `AppointmentForm`, `TreatmentForm`, `PaymentForm`, `RestockForm`, `WorkingHoursEditor` (React Hook Form + Zod)

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

### UI/UX Design
31. ✅ 3 ta theme ishlaydi: Light, Dark, System (auto-detect)
32. ✅ Theme tanlash Settings sahifasida, localStorage'da saqlanadi
33. ✅ Sidebar — collapse qilinadigan, ikonkali, active state highlight
34. ✅ Barcha sahifalarda Skeleton loading, Toast notification, EmptyState
35. ✅ Forms — validation error ko'rinishi (qizil border + xabar), focus ring
36. ✅ Modals — backdrop blur, mobile'da bottom-sheet
37. ✅ Responsive — mobile, tablet, desktop breakpoints
38. ✅ Sahifalar orasida mantiqiy oqim (bemor → davolanish → to'lov)
39. ✅ Odontogram rangli belgilar (yashil/sariq/ko'k/qizil)
40. ✅ Professional CRM ko'rinishi — Inter font, design tokens, consistent spacing

### Integration
41. ✅ Telegram bot — xodim bildirishnomalari + bemor eslatmalari ishlaydi
42. ✅ End-to-end: login → navbat → davolanish → to'lov oqimi ishlaydi
43. ✅ docker-compose up bilan butun tizim bir komandada ishga tushadi

---

## UI/UX Design Requirements

### Theme System (3 ta mavzu)
Tizim 3 xil theme'ni qo'llab-quvvatlashi kerak, foydalanuvchi Settings sahifasidan tanlaydi:
1. **Light** — oq fon, ko'k primary rang (#2563EB), professional CRM ko'rinishi
2. **Dark** — qorong'i fon (#0F172A), ko'k primary (#3B82F6), ko'zni toliqtirmaydigan
3. **System** — operatsion tizim sozlamasiga qarab avtomatik tanlanadi (prefers-color-scheme)

Theme `localStorage` da saqlanadi va `<html class="dark">` orqali Tailwind dark mode bilan ishlaydi. Sahifa yangilanganda theme saqlanib qoladi.

### Design System (ranglar va tipografiya)

```
Primary:    #2563EB (light) / #3B82F6 (dark)
Success:    #16A34A (light) / #22C55E (dark)
Warning:    #D97706 (light) / #F59E0B (dark)
Danger:     #DC2626 (light) / #EF4444 (dark)
Background: #FFFFFF (light) / #0F172A (dark)
Surface:    #F8FAFC (light) / #1E293B (dark)
Border:     #E2E8F0 (light) / #334155 (dark)
Text:       #1E293B (light) / #E2E8F0 (dark)
Muted:      #64748B (light va dark)

Font: Inter (Google Fonts) — heading: 600-700 weight, body: 400
Border radius: 8px (card), 6px (input/button)
Spacing: 4px grid system (gap-1 = 4px, gap-2 = 8px, ...)
Shadow: sm (card), md (modal/dropdown)
```

### Zamonaviy CRM dizayn qoidalari

1. **Sidebar navigation** — chap tomonda doim ko'rinadigan, ikonkali, active state bilan. Collapse qilinadigan (kichik ekranda hamburger menu)
2. **Dashboard** — KPI kartochkalar (Kunlik bemorlar, Daromad, Navbatlar soni, Low stock) + grafiklar pastda
3. **DataTable** — zebra-striping, hover effect, sortable columns, inline actions (edit/delete ikonka)
4. **Forms** — floating label yoki label-above, focus ring animatsiyasi, error state qizil border + xabar
5. **Cards** — border, shadow-sm, rounded-lg, yetarli padding (p-5 yoki p-6)
6. **Modals** — backdrop blur, scale-in animatsiya, mobile'da bottom-sheet ko'rinishida
7. **Toast notifications** — o'ng yuqorida, auto-dismiss (5s), slide-in animatsiya
8. **Empty states** — illustratsiya (SVG ikonka) + tavsif matn + action button
9. **Loading** — Skeleton shimmer effect (pulse animatsiya emas, skeleton)
10. **Transitions** — sahifalar orasida fade, sidebar toggle smooth, modal open/close scale
11. **Responsive** — 3 breakpoint: mobile (<768), tablet (768-1024), desktop (>1024)
12. **Odontogram** — rangli tish belgilari: yashil (sog'lom), sariq (rejalashtirilgan), ko'k (davolangan), qizil (yo'q/olib tashlangan)
13. **Calendar** — drag-and-drop yo'q, faqat click-to-select, current-time indicator (qizil chiziq)
14. **Patient card** — chap tarafda asosiy info, o'ng tarafda tabs (Tarix, Odontogram, To'lovlar, Rasmlar)
15. **Accessibility** — focus-visible ring, aria-label, keyboard navigable

### Sahifalar UX oqimi (bir-biriga bog'liq)

```
Login → Role asosida redirect:
  bosh_shifokor → /dashboard (KPI + grafik)
  doctor → /my-appointments (bugungi navbatlar)
  administrator → /schedule (umumiy jadval)

Sidebar linklaridan boshqa sahifalarga o'tish.
Har sahifadagi amallar boshqa sahifaga olib boradi:
  Bemorlar ro'yxati → Bemor kartochkasi → Davolanish yozuvi
  Jadval → Navbat qo'shish → Shifokor tanlash → Slot tanlash
  Davolanish → To'lov qo'shish → Payment success toast
```

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


## Builder Output

STDOUT:
Reading directory: [38;5;141m/home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm[0m[38;5;244m (using tool: read, max depth: 3, max entries: 500, excluding: defaults)[0m
[38;5;10m ✓ [0mSuccessfully read directory [38;5;141m/home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm[0m [38;5;244m(421 entries)[0m
[38;5;244m - Completed in 0.16s[0m

Batch fs_read operation with [38;5;141m11[0m operations[38;5;244m (using tool: read)[0m

↱ Operation 1: Reading file: [38;5;141m/home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/apps/inventory/models.py[0m, all lines
↱ Operation 2: Reading file: [38;5;141m/home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/apps/inventory/signals.py[0m, all lines
↱ Operation 3: Reading file: [38;5;141m/home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/apps/inventory/__init__.py[0m, all lines
↱ Operation 4: Reading file: [38;5;141m/home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/apps/inventory/apps.py[0m, all lines
↱ Operation 5: Reading file: [38;5;141m/home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/apps/inventory/services.py[0m, all lines
↱ Operation 6: Reading file: [38;5;141m/home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/apps/inventory/views.py[0m, all lines
↱ Operation 7: Reading file: [38;5;141m/home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/apps/inventory/urls.py[0m, all lines
↱ Operation 8: Reading file: [38;5;141m/home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/apps/inventory/permissions.py[0m, all lines
↱ Operation 9: Reading file: [38;5;141m/home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/apps/inventory/selectors.py[0m, all lines
↱ Operation 10: Reading file: [38;5;141m/home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/apps/inventory/serializers.py[0m, all lines
↱ Operation 11: Reading file: [38;5;141m/home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/tests/test_inventory.py[0m, all lines
[38;5;10m ✓ [0mSuccessfully read [38;5;244m10238 bytes[0m from /home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/apps/inventory/models.py

[38;5;10m ✓ [0mSuccessfully read [38;5;244m1212 bytes[0m from /home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/apps/inventory/signals.py

[38;5;10m ✓ [0mSuccessfully read [38;5;244m815 bytes[0m from /home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/apps/inventory/__init__.py

[38;5;10m ✓ [0mSuccessfully read [38;5;244m669 bytes[0m from /home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/apps/inventory/apps.py

[38;5;10m ✓ [0mSuccessfully read [38;5;244m13419 bytes[0m from /home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/apps/inventory/services.py

[38;5;10m ✓ [0mSuccessfully read [38;5;244m9323 bytes[0m from /home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/apps/inventory/views.py

[38;5;10m ✓ [0mSuccessfully read [38;5;244m657 bytes[0m from /home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/apps/inventory/urls.py

[38;5;10m ✓ [0mSuccessfully read [38;5;244m3080 bytes[0m from /home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/apps/inventory/permissions.py

[38;5;10m ✓ [0mSuccessfully read [38;5;244m2795 bytes[0m from /home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/apps/inventory/selectors.py

[38;5;10m ✓ [0mSuccessfully read [38;5;244m13516 bytes[0m from /home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/apps/inventory/serializers.py

[38;5;10m ✓ [0mSuccessfully read [38;5;244m20123 bytes[0m from /home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/backend/tests/test_inventory.py

 ⋮ 

[38;5;244m- [0mSummary: 11 operations processed, 11 successful, 0 failed
[38;5;244m - Completed in 0.0s[0m

Batch fs_read operation with [38;5;141m7[0m operations[38;5;244m (using tool: read)[0m

↱ Operation 1: Reading file: [38;5;141m/home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/frontend/src/store/uiStore.ts[0m, all lines
↱ Operation 2: Reading file: [38;5;141m/home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/frontend/tailwind.config.js[0m, all lines
↱ Operation 3: Reading file: [38;5;141m/home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/frontend/src/app/ThemeProvider.tsx[0m, all lines
↱ Operation 4: Reading file: [38;5;141m/home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/frontend/src/pages/SettingsPage.tsx[0m, all lines
↱ Operation 5: Reading file: [38;5;141m/home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/frontend/src/index.css[0m, all lines
↱ Operation 6: Reading file: [38;5;141m/home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/.gitignore[0m, all lines
↱ Operation 7: Reading file: [38;5;141m/home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/.gitignore[0m, all lines
[38;5;10m ✓ [0mSuccessfully read [38;5;244m5329 bytes[0m from /home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/frontend/src/store/uiStore.ts

[38;5;10m ✓ [0mSuccessfully read [38;5;244m4608 bytes[0m from /home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/frontend/tailwind.config.js

[38;5;10m ✓ [0mSuccessfully read [38;5;244m2646 bytes[0m from /home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/frontend/src/app/ThemeProvider.tsx

[38;5;10m ✓ [0mSuccessfully read [38;5;244m6276 bytes[0m from /home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/frontend/src/pages/SettingsPage.tsx

[38;5;10m ✓ [0mSuccessfully read [38;5;244m4937 bytes[0m from /home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/frontend/src/index.css

[38;5;10m ✓ [0mSuccessfully read [38;5;244m349 bytes[0m from /home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/.gitignore

[38;5;10m ✓ [0mSuccessfully read [38;5;244m861 bytes[0m from /home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/.gitignore

 ⋮ 

[38;5;244m- [0mSummary: 7 operations processed, 7 successful, 0 failed
[38;5;244m - Completed in 0.1s[0m

I will run the following command: [38;5;141mgit ls-files | grep -E "(db\.sqlite3|media/)" | head -20[0m[38;5;244m (using tool: shell)[0m
Purpose: Check if db.sqlite3 or media/ files are tracked in git

I will run the following command: [38;5;141mgit status --short | head -40[0m[38;5;244m (using tool: shell)[0m
Purpose: Check git status

[38;5;244m - Completed in 0.5s[0m

 M .gitignore
 M agentloop.toml
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
?? dentacrm/backend/apps/inventory/
?? dentacrm/backend/apps/notifications/
?? dentacrm/backend/apps/odontogram/
?? dentacrm/backend/apps/patients/
?? dentacrm/backend/apps/payments/
?? dentacrm/backend/apps/prescriptions/
?? dentacrm/backend/apps/ratings/
?? dentacrm/backend/apps/scheduling/
?? dentacrm/backend/apps/treatments/
?? dentacrm/backend/tests/test_accounts.py
?? dentacrm/backend/tests/test_core.py
?? dentacrm/backend/tests/test_departments.py
?? dentacrm/backend/tests/test_doctors.py
?? dentacrm/backend/tests/test_inventory.py
?? dentacrm/backend/tests/test_notifications.py
?? dentacrm/backend/tests/test_odontogram.py
?? dentacrm/backend/tests/test_patients.py
?? dentacrm/backend/tests/test_payments.py
?? dentacrm/backend/tests/test_prescriptions.py
?? dentacrm/backend/tests/test_ratings.py
?? dentacrm/backend/tests/test_scheduling.py
?? dentacrm/backend/tests/test_treatments.py
?? dentacrm/frontend/.env.example
?? dentacrm/frontend/.gitignore
?? dentacrm/frontend/index.html
[38;5;244m - Completed in 0.7s[0m

I will run the following command: [38;5;141mgit ls-files --cached | grep -iE "(db\.sqlite3|/media/|\.pyc$)" | head[0m[38;5;244m (using tool: shell)[0m
Purpose: Check cached db.sqlite3 or media files in git

I will run the following command: [38;5;141mls dentacrm/backend/apps/inventory/migrations/ 2>&1[0m[38;5;244m (using tool: shell)[0m
Purpose: Check inventory migrations

[38;5;244m - Completed in 0.11s[0m

0001_initial.py
__init__.py
__pycache__
[38;5;244m - Completed in 0.6s[0m

I will run the following command: [38;5;141m.venv/bin/python manage.py check 2>&1 | tail -30[0m (in [38;5;141mdentacrm/backend[0m)[38;5;244m (using tool: shell)[0m
Purpose: Django system check

System check identified no issues (0 silenced).
[38;5;244m - Completed in 0.801s[0m

I will run the following command: [38;5;141m.venv/bin/python manage.py makemigrations --dry-run --check 2>&1 | tail -20[0m (in [38;5;141mdentacrm/backend[0m)[38;5;244m (using tool: shell)[0m
Purpose: Check if there are pending migrations

No changes detected
[38;5;244m - Completed in 0.883s[0m

I will run the following command: [38;5;141m.venv/bin/pytest -q --no-header 2>&1 | tail -80[0m (in [38;5;141mdentacrm/backend[0m)[38;5;244m (using tool: shell)[0m
Purpose: Run backend tests

........................................................................ [ 18%]
........................................................................ [ 37%]
........................................................................ [ 55%]
........................................................................ [ 74%]
........................................................................ [ 92%]
.............................                                            [100%]
389 passed in 209.54s (0:03:29)
[38;5;244m - Completed in 210.517s[0m

I will run the following command: [38;5;141mls node_modules > /dev/null 2>&1 && echo "modules installed" || echo "modules NOT installed"[0m (in [38;5;141mdentacrm/frontend[0m)[38;5;244m (using tool: shell)[0m
Purpose: Check if npm modules are installed

Reading file: [38;5;141m/home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/frontend/package.json[0m, all lines[38;5;244m (using tool: read)[0mmodules installed
[38;5;244m - Completed in 0.11s[0m


[38;5;10m ✓ [0mSuccessfully read [38;5;244m1811 bytes[0m from /home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-templ
...[middle truncated by orchestrator]...
m[39m+     18[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206m__future__[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206mannotations[K
[0m[48;2;40;67;43m[39m+     19[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     20[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206mdatetime[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206mdate[38;2;192;197;206m,[38;2;192;197;206m [38;2;192;197;206mdatetime[38;2;192;197;206m,[38;2;192;197;206m [38;2;192;197;206mtime[38;2;192;197;206m,[38;2;192;197;206m [38;2;192;197;206mtimedelta[K
[0m[48;2;40;67;43m[39m+     21[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206mdecimal[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206mDecimal[K
[0m[48;2;40;67;43m[39m+     22[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206mtyping[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206mAny[38;2;192;197;206m,[38;2;192;197;206m [38;2;192;197;206mIterable[38;2;192;197;206m,[38;2;192;197;206m [38;2;192;197;206mLiteral[K
[0m[48;2;40;67;43m[39m+     23[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     24[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206mdjango[38;2;192;197;206m.[38;2;192;197;206mdb[38;2;192;197;206m.[38;2;192;197;206mmodels[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206mCount[38;2;192;197;206m,[38;2;192;197;206m [38;2;192;197;206mDecimalField[38;2;192;197;206m,[38;2;192;197;206m [38;2;192;197;206mF[38;2;192;197;206m,[38;2;192;197;206m [38;2;192;197;206mQ[38;2;192;197;206m,[38;2;192;197;206m [38;2;192;197;206mSum[38;2;192;197;206m,[38;2;192;197;206m [38;2;192;197;206mValue[K
[0m[48;2;40;67;43m[39m+     25[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206mdjango[38;2;192;197;206m.[38;2;192;197;206mdb[38;2;192;197;206m.[38;2;192;197;206mmodels[38;2;192;197;206m.[38;2;192;197;206mfunctions[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206mCoalesce[38;2;192;197;206m,[38;2;192;197;206m [38;2;192;197;206mTruncDate[38;2;192;197;206m,[38;2;192;197;206m [38;2;192;197;206mTruncMonth[K
[0m[48;2;40;67;43m[39m+     26[0m:[39m[48;2;24;38;30m [38;2;180;142;173mfrom[38;2;192;197;206m [38;2;192;197;206mdjango[38;2;192;197;206m.[38;2;192;197;206mutils[38;2;192;197;206m [38;2;180;142;173mimport[38;2;192;197;206m [38;2;192;197;206mtimezone[K
[0m[48;2;40;67;43m[39m+     27[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     28[0m:[39m[48;2;24;38;30m [38;2;101;115;126m#[38;2;101;115;126m ---------------------------------------------------------------------------[K
[0m[48;2;40;67;43m[39m+     29[0m:[39m[48;2;24;38;30m [38;2;101;115;126m# Constants[K
[0m[48;2;40;67;43m[39m+     30[0m:[39m[48;2;24;38;30m [38;2;101;115;126m# ---------------------------------------------------------------------------[K
[0m[48;2;40;67;43m[39m+     31[0m:[39m[48;2;24;38;30m [38;2;101;115;126mPeriod = Literal["day", "week", "month"][K
[0m[48;2;40;67;43m[39m+     32[0m:[39m[48;2;24;38;30m [38;2;101;115;126mVALID_PERIODS: tuple[Period, ...] = ("day", "week", "month")[K
[0m[48;2;40;67;43m[39m+     33[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     34[0m:[39m[48;2;24;38;30m [38;2;101;115;126m_ZERO = Decimal("0.00")[K
[0m[48;2;40;67;43m[39m+     35[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     36[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     37[0m:[39m[48;2;24;38;30m [38;2;101;115;126m# ---------------------------------------------------------------------------[K
[0m[48;2;40;67;43m[39m+     38[0m:[39m[48;2;24;38;30m [38;2;101;115;126m# Helpers[K
[0m[48;2;40;67;43m[39m+     39[0m:[39m[48;2;24;38;30m [38;2;101;115;126m# ---------------------------------------------------------------------------[K
[0m[48;2;40;67;43m[39m+     40[0m:[39m[48;2;24;38;30m [38;2;101;115;126mdef _tz_now() -> datetime:[K
[0m[48;2;40;67;43m[39m+     41[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    return timezone.localtime(timezone.now())[K
[0m[48;2;40;67;43m[39m+     42[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     43[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     44[0m:[39m[48;2;24;38;30m [38;2;101;115;126mdef _iso(value: datetime | date | None) -> str | None:[K
[0m[48;2;40;67;43m[39m+     45[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    if value is None:[K
[0m[48;2;40;67;43m[39m+     46[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        return None[K
[0m[48;2;40;67;43m[39m+     47[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    if isinstance(value, datetime):[K
[0m[48;2;40;67;43m[39m+     48[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        return value.isoformat()[K
[0m[48;2;40;67;43m[39m+     49[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    return value.isoformat()[K
[0m[48;2;40;67;43m[39m+     50[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     51[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     52[0m:[39m[48;2;24;38;30m [38;2;101;115;126mdef period_range(period: Period, *, at: datetime | None = None) -> tuple[datetime, datetime]:[K
[0m[48;2;40;67;43m[39m+     53[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    """Return the ``[start, end)`` bounds of a named period.[K
[0m[48;2;40;67;43m[39m+     54[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     55[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    * ``day``   — from ``at.date()`` 00:00 to next day 00:00.[K
[0m[48;2;40;67;43m[39m+     56[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    * ``week``  — from ISO Monday 00:00 to next Monday 00:00.[K
[0m[48;2;40;67;43m[39m+     57[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    * ``month`` — from the 1st 00:00 to the 1st of the next month 00:00.[K
[0m[48;2;40;67;43m[39m+     58[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     59[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    All bounds are timezone-aware in ``settings.TIME_ZONE``.[K
[0m[48;2;40;67;43m[39m+     60[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    """[K
[0m[48;2;40;67;43m[39m+     61[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    if period not in VALID_PERIODS:[K
[0m[48;2;40;67;43m[39m+     62[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        raise ValueError(f"period must be one of {VALID_PERIODS}, got {period!r}")[K
[0m[48;2;40;67;43m[39m+     63[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     64[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    tz = timezone.get_current_timezone()[K
[0m[48;2;40;67;43m[39m+     65[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    now = timezone.localtime(at or timezone.now())[K
[0m[48;2;40;67;43m[39m+     66[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    today = now.date()[K
[0m[48;2;40;67;43m[39m+     67[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     68[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    if period == "day":[K
[0m[48;2;40;67;43m[39m+     69[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        start_date = today[K
[0m[48;2;40;67;43m[39m+     70[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        end_date = today + timedelta(days=1)[K
[0m[48;2;40;67;43m[39m+     71[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    elif period == "week":[K
[0m[48;2;40;67;43m[39m+     72[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        # ISO week: Monday = 0[K
[0m[48;2;40;67;43m[39m+     73[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        start_date = today - timedelta(days=today.weekday())[K
[0m[48;2;40;67;43m[39m+     74[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        end_date = start_date + timedelta(days=7)[K
[0m[48;2;40;67;43m[39m+     75[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    else:  # month[K
[0m[48;2;40;67;43m[39m+     76[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        start_date = today.replace(day=1)[K
[0m[48;2;40;67;43m[39m+     77[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        # Move to first of the next month[K
[0m[48;2;40;67;43m[39m+     78[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        if start_date.month == 12:[K
[0m[48;2;40;67;43m[39m+     79[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            end_date = start_date.replace(year=start_date.year + 1, month=1)[K
[0m[48;2;40;67;43m[39m+     80[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        else:[K
[0m[48;2;40;67;43m[39m+     81[0m:[39m[48;2;24;38;30m [38;2;101;115;126m            end_date = start_date.replace(month=start_date.month + 1)[K
[0m[48;2;40;67;43m[39m+     82[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     83[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    start = timezone.make_aware(datetime.combine(start_date, time.min), tz)[K
[0m[48;2;40;67;43m[39m+     84[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    end = timezone.make_aware(datetime.combine(end_date, time.min), tz)[K
[0m[48;2;40;67;43m[39m+     85[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    return start, end[K
[0m[48;2;40;67;43m[39m+     86[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     87[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     88[0m:[39m[48;2;24;38;30m [38;2;101;115;126m# ---------------------------------------------------------------------------[K
[0m[48;2;40;67;43m[39m+     89[0m:[39m[48;2;24;38;30m [38;2;101;115;126m# Revenue[K
[0m[48;2;40;67;43m[39m+     90[0m:[39m[48;2;24;38;30m [38;2;101;115;126m# ---------------------------------------------------------------------------[K
[0m[48;2;40;67;43m[39m+     91[0m:[39m[48;2;24;38;30m [38;2;101;115;126mdef revenue_between(start: datetime, end: datetime) -> Decimal:[K
[0m[48;2;40;67;43m[39m+     92[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    """Sum of active payments received in the half-open interval."""[K
[0m[48;2;40;67;43m[39m+     93[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    from apps.payments.models import Payment[K
[0m[48;2;40;67;43m[39m+     94[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+     95[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    result = Payment.objects.filter([K
[0m[48;2;40;67;43m[39m+     96[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        is_active=True, created_at__gte=start, created_at__lt=end,[K
[0m[48;2;40;67;43m[39m+     97[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    ).aggregate(total=Coalesce(Sum("amount"), Value(_ZERO, output_field=DecimalField(max_digits=14, decimal_places=2))))[K
[0m[48;2;40;67;43m[39m+     98[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    return result["total"] or _ZERO[K
[0m[48;2;40;67;43m[39m+     99[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    100[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    101[0m:[39m[48;2;24;38;30m [38;2;101;115;126mdef revenue_by_day(start: datetime, end: datetime) -> list[dict[str, Any]]:[K
[0m[48;2;40;67;43m[39m+    102[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    """Series of ``{date, amount}`` payments grouped by day."""[K
[0m[48;2;40;67;43m[39m+    103[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    from apps.payments.models import Payment[K
[0m[48;2;40;67;43m[39m+    104[0m:[39m[48;2;24;38;30m [K
[0m[48;2;40;67;43m[39m+    105[0m:[39m[48;2;24;38;30m [38;2;101;115;126m    rows = ([K
[0m[48;2;40;67;43m[39m+    106[0m:[39m[48;2;24;38;30m [38;2;101;115;126m        Payment.objects.filter([K
[0m[48;2;40;67;43m[39m+    107[0m:[39m[48;2;24;38;3
...[truncated by orchestrator]

## Repository Snapshot

## git_status
```text
 M .gitignore
 M agentloop.toml
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
?? dentacrm/backend/apps/inventory/
?? dentacrm/backend/apps/notifications/
?? dentacrm/backend/apps/odontogram/
?? dentacrm/backend/apps/patients/
?? dentacrm/backend/apps/payments/
?? dentacrm/backend/apps/prescriptions/
?? dentacrm/backend/apps/ratings/
?? dentacrm/backend/apps/reports/
?? dentacrm/backend/apps/scheduling/
?? dentacrm/backend/apps/treatments/
?? dentacrm/backend/tests/conftest.py
?? dentacrm/backend/tests/test_accounts.py
?? dentacrm/backend/tests/test_core.py
?? dentacrm/backend/tests/test_departments.py
?? dentacrm/backend/tests/test_doctors.py
?? dentacrm/backend/tests/test_inventory.py
?? dentacrm/backend/tests/test_notifications.py
?? dentacrm/backend/tests/test_odontogram.py
?? dentacrm/backend/tests/test_patients.py
?? dentacrm/backend/tests/test_payments.py
?? dentacrm/backend/tests/test_prescriptions.py
?? dentacrm/backend/tests/test_ratings.py
?? dentacrm/backend/tests/test_reports.py
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
 .gitignore                               | 13 ++++++
 agentloop.toml                           | 25 ++++++-----
 dentacrm/backend/config/settings/base.py | 29 ++++++++++--
 dentacrm/backend/config/urls.py          | 75 +++++++++++++++++++++++++++++++-
 dentacrm/frontend/.dockerignore          | 15 ++++---
 dentacrm/frontend/Dockerfile             | 24 +++-------
 dentacrm/frontend/README.md              | 40 +++++++++++++++--
 dentacrm/frontend/package.json           | 57 ++++++++++++++++++++++--
 dentacrm/frontend/placeholder-server.mjs | 43 ------------------
 9 files changed, 229 insertions(+), 92 deletions(-)

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

## latest_test_output
```text
No test_command configured; skipped.
```

## Test Output

No test_command configured; skipped.

## Instructions

- Real issues → verdict: "needs_work"
- Everything solid → verdict: "pass"
- Fundamentally broken → verdict: "blocked"
- Be SPECIFIC: name files, line numbers, exact problems

Return ONLY valid JSON:

```json
{
  "verdict": "pass | needs_work | blocked",
  "confidence": 0.85,
  "acceptance_criteria_met": ["list of met criteria"],
  "acceptance_criteria_remaining": ["list of unmet criteria"],
  "defects": [
    {"severity": "critical|high|medium|low", "file": "path", "line": 0, "description": "what's wrong", "fix": "how to fix"}
  ],
  "next_tasks": [
    {"priority": 1, "task": "description", "files": ["path"]}
  ],
  "verification_commands": ["command"],
  "builder_prompt": "Direct, specific instruction for the builder."
}
```
