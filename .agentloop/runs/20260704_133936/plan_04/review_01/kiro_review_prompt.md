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

1

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
Batch fs_read operation with [38;5;141m2[0m operations[38;5;244m (using tool: read)[0m

↱ Operation 1: Reading file: [38;5;141m/home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/agentloop.toml[0m, all lines
↱ Operation 2: Reading file: [38;5;141m/home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/README.md[0m, all lines
[38;5;10m ✓ [0mSuccessfully read [38;5;244m2687 bytes[0m from /home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/agentloop.toml

[38;5;10m ✓ [0mSuccessfully read [38;5;244m11933 bytes[0m from /home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/README.md

 ⋮ 

[38;5;244m- [0mSummary: 2 operations processed, 2 successful, 0 failed
[38;5;244m - Completed in 0.0s[0m

I will run the following command: [38;5;141mls -la dentacrm/backend/.venv/bin/python 2>&1 | head -5[0m[38;5;244m (using tool: shell)[0m
Purpose: Check venv exists

Reading file: [38;5;141m/home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/Makefile[0m, all lines[38;5;244m (using tool: read)[0mlrwxrwxrwx 1 seymonbek seymonbek 7 Jul  4 13:56 dentacrm/backend/.venv/bin/python -> python3
[38;5;244m - Completed in 0.12s[0m


[38;5;10m ✓ [0mSuccessfully read [38;5;244m4526 bytes[0m from /home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/Makefile
[38;5;244m - Completed in 0.0s[0m

I will run the following command: [38;5;141m./.venv/bin/python -c "import pytest; print(pytest.__version__)" 2>&1[0m (in [38;5;141mdentacrm/backend[0m)[38;5;244m (using tool: shell)[0m
Purpose: Check pytest availability in venv

I will run the following command: [38;5;141mgrep -nE '\{|\|\|' agentloop.toml | grep -iE 'command|pytest|test' 2>&1 || echo "No compound guards found in test commands"[0m[38;5;244m (using tool: shell)[0m
Purpose: Verify T114 acceptance criterion #2

8.3.3
[38;5;244m - Completed in 0.315s[0m

No compound guards found in test commands
[38;5;244m - Completed in 0.11s[0m

[38;5;141m> [0mBoth T114 changes and the T115 log row are already in place. I need to actually run the parsed commands one more time to confirm both go green from a fresh invocation, then declare done=true.[0m[0m
I will run the following command: [38;5;141mpython3 -c "import tomllib; cfg = tomllib.load(open('agentloop.toml','rb')); tests = cfg['project']['tests']; print('BACKEND:', tests[0]['command']); print('FRONTEND:', tests[1]['command'])"[0m[38;5;244m (using tool: shell)[0m
Purpose: Parse commands the same way runner does

BACKEND: ./.venv/bin/python -m pytest --tb=short -q
FRONTEND: npm run test -- --run
[38;5;244m - Completed in 0.84s[0m

I will run the following command: [38;5;141mbash -lc "$(python3 -c "import tomllib;print(tomllib.load(open('../../agentloop.toml','rb'))['project']['tests'][1]['command'])")" 2>&1 | tail -40[0m (in [38;5;141mdentacrm/frontend[0m)[38;5;244m (using tool: shell)[0m
Purpose: Run frontend tests via parsed agentloop.toml command


> dentacrm-frontend@0.1.0 test
> vitest run --run


 RUN  v2.1.1 /home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/frontend

 ✓ src/api/client.test.ts  (5 tests) 17ms
 ✓ src/store/stores.test.ts  (8 tests) 29ms
 ✓ src/app/RoleGuard.test.tsx  (5 tests) 120ms
 ✓ src/components/ui/Pagination.test.tsx  (4 tests) 231ms
 ✓ src/components/ui/DataTable.test.tsx  (6 tests) 260ms
 ✓ src/components/odontogram/Odontogram.test.tsx  (6 tests) 631ms
 ✓ src/pages/DoctorDetailPage.test.tsx  (1 test) 323ms
 ✓ src/pages/LoginPage.test.tsx  (4 tests) 590ms
 ✓ src/pages/ReportsPage.test.tsx  (2 tests) 411ms

 Test Files  9 passed (9)
      Tests  41 passed (41)
   Start at  00:52:26
   Duration  4.97s (transform 1.24s, setup 5.71s, collect 4.38s, tests 2.61s, environment 12.56s, prepare 5.63s)

[38;5;244m - Completed in 6.106s[0m

[38;5;141m> [0mFrontend green (41/41). Now backend (this will take ~13 minutes):[0m[0m
I will run the following command: [38;5;141mbash -lc "$(python3 -c "import tomllib;print(tomllib.load(open('../../agentloop.toml','rb'))['project']['tests'][0]['command'])")" 2>&1 | tail -30[0m (in [38;5;141mdentacrm/backend[0m)[38;5;244m (using tool: shell)[0m
Purpose: Run backend pytest via parsed agentloop.toml command

........................................................................ [ 16%]
........................................................................ [ 32%]
........................................................................ [ 49%]
........................................................................ [ 65%]
........................................................................ [ 82%]
........................................................................ [ 98%]
......                                                                   [100%]
438 passed in 791.77s (0:13:11)
[38;5;244m - Completed in 794.472s[0m

[38;5;141m> [0mBoth parsed commands executed green. Now I'll append a fresh row to the verification log documenting this cycle:[0m[0m
I will run the following command: [38;5;141mgit rev-parse --short HEAD 2>&1[0m[38;5;244m (using tool: shell)[0m
Purpose: Get current commit hash

6c927ce
[38;5;244m - Completed in 0.12s[0m

Reading file: [38;5;141m/home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/README.md[0m, from line [38;5;141m222[0m to end of file[38;5;244m (using tool: read)[0m
[38;5;10m ✓ [0mSuccessfully read [38;5;244m1545 bytes[0m from /home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/README.md
[38;5;244m - Completed in 0.0s[0m

I'll modify the following file: [38;5;141mdentacrm/README.md[0m[38;5;244m (using tool: write)[0m
Purpose: Add third fresh verification row for task 115 completion

[48;2;43;48;59m[39m  223, 223[0m:[39m[48;2;43;48;59m [38;2;192;197;206m|[38;2;192;197;206m 2026-07-05 ([38;2;163;190;140m`[38;2;163;190;140m6c927ce[38;2;163;190;140m`[38;2;192;197;206m, task 114-115) [38;2;192;197;206m|[38;2;192;197;206m Runner-parsed avtomatik sikl: [38;2;163;190;140m`[38;2;163;190;140mpython3 -c "tomllib.load('agentloop.toml')"[38;2;163;190;140m`[38;2;192;197;206m → backend [38;2;163;190;140m`[38;2;163;190;140m./.venv/bin/python -m pytest --tb=short -q[38;2;163;190;140m`[38;2;192;197;206m ([38;2;235;203;139m**[38;2;235;203;139m438 passed[38;2;235;203;139m**[38;2;192;197;206m in 13m14s) va frontend [38;2;163;190;140m`[38;2;163;190;140mnpm run test -- --run[38;2;163;190;140m`[38;2;192;197;206m ([38;2;235;203;139m**[38;2;235;203;139m41 passed[38;2;235;203;139m**[38;2;192;197;206m in 4.94s), ikkalasi ham [38;2;163;190;140m`[38;2;163;190;140mbash -lc[38;2;163;190;140m`[38;2;192;197;206m orqali. [38;2;163;190;140m`[38;2;163;190;140magentloop.toml[38;2;163;190;140m`[38;2;192;197;206m da compound [38;2;163;190;140m`[38;2;163;190;140m{ [ -x … ] && PY=… \|\| PY=python3; }[38;2;163;190;140m`[38;2;192;197;206m guard olib tashlandi, uning o'rniga explicit [38;2;163;190;140m`[38;2;163;190;140m./.venv/bin/python[38;2;163;190;140m`[38;2;192;197;206m yozildi (venv endi hard requirement — masking silent fallback yo'q). [38;2;192;197;206m|[38;2;192;197;206m ✅ Avtomatik runner tsikli — backend (venv pytest) + frontend (vitest) ikkalasi ham [38;2;163;190;140m`[38;2;163;190;140magentloop.toml[38;2;163;190;140m`[38;2;192;197;206m dan parse qilingan buyruqlar bilan yashil. [38;2;192;197;206m|[K
[0m[48;2;40;67;43m[39m+      224[0m:[39m[48;2;24;38;30m [38;2;192;197;206m|[38;2;192;197;206m 2026[38;2;192;197;206m-[38;2;192;197;206m07[38;2;192;197;206m-[38;2;192;197;206m05 (`6c927ce`, task 115 re[38;2;192;197;206m-[38;2;192;197;206mverify) [38;2;192;197;206m|[38;2;192;197;206m Fresh runner[38;2;192;197;206m-[38;2;192;197;206mparsed cycle[38;2;192;197;206m:[38;2;192;197;206m `bash [38;2;192;197;206m-[38;2;192;197;206mlc "$(python3 [38;2;192;197;206m-[38;2;192;197;206mc 'tomllib.load(agentloop.toml)…')"` frontend (**41 passed** in 4.97s) va backend (**438 passed** in 791.77s / 13m11s), ikkalasi ham exit 0. Konfiguratsiya[38;2;192;197;206m-[38;2;192;197;206mparsed test path stabil — ikki ketma[38;2;192;197;206m-[38;2;192;197;206mket avtomatik sikl bir xil natija bermoqda. Automated runner cycle — backend (venv pytest) + frontend (vitest) both green from parsed agentloop.toml commands. [38;2;192;197;206m|[38;2;192;197;206m ✅ done=true — barcha 43 acceptance criteria bajarilgan, ikkala manual (`make check`) va avtomatik (`agentloop.toml`[38;2;192;197;206m-[38;2;192;197;206mparsed) test yo'llari yashil. [38;2;192;197;206m|[K
[0m[48;2;43;48;59m[39m  224, 225[0m:[39m[48;2;43;48;59m [K
[0m[48;2;43;48;59m[39m  225, 226[0m:[39m[48;2;43;48;59m [38;2;143;161;179m##[38;2;192;197;206m [38;2;143;161;179mLitsenziya[K
[0m[K
Updating: [38;5;141mdentacrm/README.md[0m
[38;5;244m - Completed in 0.1s[0m

I will run the following command: [38;5;141mgrep -nE '\{|\|\|' agentloop.toml | grep -iE 'command\s*=|pytest' 2>&1 || echo "OK: no compound guards in any command line"[0m[38;5;244m (using tool: shell)[0m
Purpose: Re-verify T114 AC #2

Reading file: [38;5;141m/home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/README.md[0m, from line [38;5;141m221[0m to end of file[38;5;244m (using tool: read)[0mOK: no compound guards in any command line
[38;5;244m - Completed in 0.12s[0m


[38;5;10m ✓ [0mSuccessfully read [38;5;244m2714 bytes[0m from /home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/README.md
[38;5;244m - Completed in 0.0s[0m

[38;5;141m> [0mAll acceptance criteria for T114 and T115 satisfied. Summary of what was verified:[0m[0m
[0m[0m
- T114 AC #1: [38;5;10magentloop.toml[0m uses [38;5;10m./.venv/bin/python -m pytest --tb=short -q[0m in both [38;5;10mtest_command[0m (top-level) and [38;5;10m[[project.tests]] backend.command[0m — already in place from prior work.[0m[0m
- T114 AC #2: [38;5;10mgrep -E '\{|\|\|'[0m on the two test-command lines returns nothing (only the pipe in verification-log prose triggers matches elsewhere — the actual command lines are clean).[0m[0m
- T114 AC #3: Fresh invocation of the parsed backend command from repo root: [38;5;10m438 passed in 791.77s[0m, exit 0. Last 30 lines of output captured above.[0m[0m
- T115 AC #1: Both [38;5;10m[[project.tests]][0m commands, parsed via [38;5;10mtomllib.load(open('agentloop.toml','rb'))['project']['tests'][N]['command'][0m and executed under [38;5;10mbash -lc[0m, exit 0 in the same session (frontend 4.97s, backend 13m11s).[0m[0m
- T115 AC #2: Third row appended to the [38;5;10m## Verification log[0m table in [38;5;10mdentacrm/README.md[0m with today's date (2026-07-05), commit hash ([38;5;10m6c927ce[0m), and the one-liner stating both suites are green from parsed agentloop.toml commands.[0m[0m
[0m[0m
Fresh test evidence (last-30-line tail of each parsed-command invocation):[0m[0m
[0m[0m
Frontend (parsed from [38;5;10magentloop.toml[0m):[0m[0m
[38;5;10mTest Files  9 passed (9)
     Tests  41 passed (41)
  Duration  4.97s
[0m[0m[0m
[0m[0m
Backend (parsed from [38;5;10magentloop.toml[0m):[0m[0m
[38;5;10m........................................................................ [ 82%]
........................................................................ [ 98%]
......                                                                   [100%]
438 passed in 791.77s (0:13:11)
[0m[0m[0m
[0m[0m
done=true — all 43 acceptance criteria met, both manual ([38;5;10mmake check[0m) and automated ([38;5;10magentloop.toml[0m-parsed) test paths green.[0m[0m
[0m[0m
[1mjson
[0m[38;5;10m{
  "state": "complete",
  "summary": "Verified T114 + T115 end-to-end. Fresh runner-parsed cycle executed both [[project.tests]] entries from agentloop.toml via bash -lc: frontend 41/41 passed in 4.97s, backend 438/438 passed in 13m11s, both exit 0. Appended a third row to dentacrm/README.md verification log documenting the automated runner cycle. Confirmed no compound guards remain in the two test-command lines and the explicit ./.venv/bin/python invocation is the only path (no python3 silent fallback).",
  "files_changed": ["dentacrm/README.md"],
  "verification": "1) python3 -c \"import tomllib; …\" prints parsed backend + frontend commands correctly. 2) bash -lc \"$(parsed frontend command)\" → 41 passed in 4.97s, exit 0. 3) bash -lc \"$(parsed backend command)\" → 438 passed in 791.77s, exit 0. 4) grep -E '\\{|\\|\\|' agentloop.toml on the two command= lines: no matches. 5) Verification-log table in dentacrm/README.md now has 3 rows for 2026-07-05 including the fresh runner re-verify entry.",
  "next_suggested_task": "Flip done=true in the next planner cycle — all 43 acceptance criteria are met and both manual (`make check`) and automated (`agentloop.toml`-parsed) test paths are green. Optionally, the orchestrator can proceed to auto-discovery / git-push per its normal completion flow.",
  "blockers": []
}
[0m
STDERR:
[32mAll tools are now trusted ([0m[31m![0m[32m). Kiro will execute tools without asking for confirmation.[0m
Agents can sometimes do unexpected things so understand the risks.

Learn more at [38;5;141mhttps://kiro.dev/docs/cli/chat/security/#using-tools-trust-all-safely[0m



[38;5;252m[0m[?25l[?25l[0m[0m[?25l[0m[?25l[?25l[0m[0m[?25l[0m[?25l[?25l[0m[0m[?25l[0m[?25l[0m[0m[?25l[0m[?25l[0m[0m[?25l[0m[?25l[0m[0m[?25l[0m[?25l[0m[0m[?25l[0m[?25l[0m[0m[?25l[0m[?25l[0m[0m[?25l[0m[?25l[?25l[0m[0m[?25l[0m[0m[0m
[38;5;8m
 ▸ Credits: 4.29 • Time: 14m 45s

[0m[1G[0m[0m[?25h


## Repository Snapshot

## git_status
```text
 M .github/workflows/ci.yml
 M agentloop.toml
 M dentacrm/README.md
 M dentacrm/backend/tests/test_reports.py
 M dentacrm/frontend/package-lock.json
 M dentacrm/frontend/package.json
 M dentacrm/frontend/src/components/odontogram/Odontogram.test.tsx
?? dentacrm/Makefile
?? dentacrm/backend/tests/test_rbac_matrix.py
?? dentacrm/frontend/docs/
?? dentacrm/frontend/e2e/
?? dentacrm/frontend/playwright.config.ts

```

## git_diff_stat
```text
 .github/workflows/ci.yml                           | 28 ++++++-
 agentloop.toml                                     | 15 +++-
 dentacrm/README.md                                 | 95 +++++++++++++++++++++-
 dentacrm/backend/tests/test_reports.py             | 12 ++-
 dentacrm/frontend/package-lock.json                | 64 +++++++++++++++
 dentacrm/frontend/package.json                     |  5 +-
 .../src/components/odontogram/Odontogram.test.tsx  | 59 +++++++++++++-
 7 files changed, 267 insertions(+), 11 deletions(-)

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
dentacrm/docker-compose.prod.yml
dentacrm/docker-compose.yml
dentacrm/.env
dentacrm/.env.example
dentacrm/.env.prod.example
dentacrm/frontend/Dockerfile
dentacrm/frontend/Dockerfile.prod
dentacrm/frontend/.dockerignore
dentacrm/frontend/.env.example
dentacrm/frontend/.eslintrc.cjs
dentacrm/frontend/.gitignore
dentacrm/frontend/index.html
dentacrm/frontend/nginx.conf
dentacrm/frontend/package.json
dentacrm/frontend/package-lock.json
dentacrm/frontend/playwright.config.ts
dentacrm/frontend/postcss.config.js
dentacrm/frontend/README.md
dentacrm/frontend/tailwind.config.js
dentacrm/frontend/tsconfig.json
dentacrm/frontend/tsconfig.node.json
dentacrm/frontend/vite.config.ts
dentacrm/frontend/vitest.setup.ts
dentacrm/.gitignore
dentacrm/Makefile
dentacrm/README.md
dentacrm/scripts/init-postgres.sql
.env.example
examples/todo_app/agentloop.toml
examples/todo_app/PROJECT_BRIEF.md
.github/workflows/ci.yml
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
── backend (❌) ──
STDERR:
bash: line 1: python: command not found

── frontend (✅) ──
STDOUT:
> dentacrm-frontend@0.1.0 test
> vitest run --run


 RUN  v2.1.1 /home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/frontend

 ✓ src/api/client.test.ts  (5 tests) 17ms
 ✓ src/store/stores.test.ts  (8 tests) 27ms
 ✓ src/app/RoleGuard.test.tsx  (5 tests) 107ms
 ✓ src/components/ui/Pagination.test.tsx  (4 tests) 161ms
 ✓ src/components/ui/DataTable.test.tsx  (6 tests) 254ms
 ✓ src/components/odontogram/Odontogram.test.tsx  (6 tests) 581ms
 ✓ src/pages/DoctorDetailPage.test.tsx  (1 test) 268ms
 ✓ src/pages/LoginPage.test.tsx  (4 tests) 523ms
 ✓ src/pages/ReportsPage.test.tsx  (2 tests) 394ms

 Test Files  9 passed (9)
      Tests  41 passed (41)
   Start at  01:06:34
   Duration  4.92s (transform 1.39s, setup 5.96s, collect 4.48s, tests 2.33s, environment 12.51s, prepare 6.17s)

```

## Test Output

── backend (❌) ──
STDERR:
bash: line 1: python: command not found

── frontend (✅) ──
STDOUT:
> dentacrm-frontend@0.1.0 test
> vitest run --run


 RUN  v2.1.1 /home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/frontend

 ✓ src/api/client.test.ts  (5 tests) 17ms
 ✓ src/store/stores.test.ts  (8 tests) 27ms
 ✓ src/app/RoleGuard.test.tsx  (5 tests) 107ms
 ✓ src/components/ui/Pagination.test.tsx  (4 tests) 161ms
 ✓ src/components/ui/DataTable.test.tsx  (6 tests) 254ms
 ✓ src/components/odontogram/Odontogram.test.tsx  (6 tests) 581ms
 ✓ src/pages/DoctorDetailPage.test.tsx  (1 test) 268ms
 ✓ src/pages/LoginPage.test.tsx  (4 tests) 523ms
 ✓ src/pages/ReportsPage.test.tsx  (2 tests) 394ms

 Test Files  9 passed (9)
      Tests  41 passed (41)
   Start at  01:06:34
   Duration  4.92s (transform 1.39s, setup 5.96s, collect 4.48s, tests 2.33s, environment 12.51s, prepare 6.17s)


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
