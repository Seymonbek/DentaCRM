# DentaCRM — To'liq Loyiha va Dizayn Hujjati
> Google Stitch bilan qayta dizayn qilish uchun tayyorlangan to'liq texnik ma'lumotnoma

---

## 1. LOYIHA UMUMIY KO'RINISHI

**Nomi:** DentaCRM — Stomatologiya klinikasi boshqaruv tizimi  
**Stack:**
- **Frontend:** React 18 + TypeScript + Vite + TailwindCSS 3 + Zustand + React Query
- **Backend:** Django 4 + Django REST Framework + PostgreSQL + Redis + Celery
- **Infra:** Docker Compose, MinIO (fayl saqlash), Telegram bot
- **Port:** Frontend → `http://localhost:5173`, Backend API → `http://localhost:8000`

---

## 2. FOYDALANUVCHI ROLLARI VA RUXSATLAR

| Rol | Uzbekcha | Imkoniyatlar |
|-----|----------|--------------|
| `bosh_shifokor` | Bosh shifokor | Hamma narsa: shifokorlar, moliya, bo'limlar, omborxona, hisobotlar |
| `doctor` | Shifokor | Faqat o'z navbatlari, bemorlari, omborxona ko'rish |
| `administrator` | Administrator | Navbat berish, bemor qo'shish, omborxona, jadval |

---

## 3. SAHIFALAR RO'YXATI VA ROUTES

| Route | Component | Foydalanuvchi | Tavsif |
|-------|-----------|---------------|--------|
| `/login` | `LoginPage` | Hamma | Kirish sahifasi |
| `/dashboard` | `DashboardPage` | Hamma | Bosh sahifa (3 tab) |
| `/departments` | `DepartmentsPage` | bosh_shifokor | Bo'limlar CRUD |
| `/doctors` | `DoctorsPage` | bosh_shifokor | Shifokorlar CRUD |
| `/doctors/:id` | `DoctorDetailPage` | bosh_shifokor | Shifokor kartochkasi |
| `/finance` | `FinancePage` | bosh_shifokor | Moliya va komissiyalar |
| `/reports` | `ReportsPage` | bosh_shifokor | Hisobotlar |
| `/my-appointments` | `MyAppointmentsPage` | doctor | O'z navbatlari |
| `/my-patients` | `MyPatientsPage` | doctor, bosh_shifokor, admin | Bemorlar |
| `/inventory` | `InventoryPage` | Hamma | Omborxona |
| `/ratings` | `RatingsPage` | bosh_shifokor, doctor | Reyting |
| `/schedule` | `SchedulePage` | bosh_shifokor, admin | Jadval |
| `/patients/new` | `NewPatientPage` | bosh_shifokor, admin | Yangi bemor |
| `/appointments/new` | `NewAppointmentPage` | bosh_shifokor, admin | Navbat berish |
| `/payments/new` | `NewPaymentPage` | Hamma | To'lov qo'shish |
| `/patients/:id` | `PatientDetailPage` | Hamma | Bemor kartochkasi |
| `/settings` | `SettingsPage` | Hamma | Sozlamalar + 2FA |

---

## 4. HOZIRGI DIZAYN TIZIMI

### 4.1 Rang Palitasi (CSS Variables)

```
LIGHT MODE:
--color-bg:        hsl(198 33% 97%)   /* Juda och slate-blue */
--color-surface:   hsl(0 0% 100%)     /* Oq */
--color-surface-2: hsl(198 20% 94%)   /* Ikkinchi fon */
--color-surface-3: hsl(198 18% 90%)   /* Uchinchi fon */
--color-border:    hsl(198 15% 86%)   /* Chegara */
--color-fg:        hsl(215 45% 10%)   /* Asosiy matn */
--color-fg-2:      hsl(215 25% 30%)   /* Ikkinchi matn */
--color-fg-3:      hsl(215 16% 50%)   /* Uchinchi matn (muted) */
--color-primary:   hsl(173 80% 40%)   /* Brand: Teal */

DARK MODE:
--color-bg:        hsl(200 35% 6%)    /* Juda qorong'i */
--color-surface:   hsl(200 28% 9%)
--color-surface-2: hsl(200 25% 12%)
--color-surface-3: hsl(200 23% 15%)
--color-border:    hsl(200 20% 17%)
--color-fg:        hsl(210 40% 97%)
--color-fg-2:      hsl(215 20% 75%)
--color-fg-3:      hsl(215 16% 48%)
--color-primary:   hsl(173 80% 45%)

SEMANTIC COLORS:
--color-success:   hsl(155 65% 35%)   /* Yashil */
--color-warning:   hsl(35 90% 48%)    /* Sariq */
--color-danger:    hsl(3 88% 56%)     /* Qizil */
```

### 4.2 Brand Rang Tizimi (Tailwind)

```
brand-50:  #f0fdfa
brand-400: #2dd4bf  (teal-400)
brand-500: #14b8a6  (teal-500) ← ASOSIY BRAND RANG
brand-600: #0d9488  (teal-600)
brand-700: #0f766e
```

### 4.3 Tipografiya

```
Headings font: "Outfit" (Google Fonts) — font-display
Body font:     "Inter" (Google Fonts) — font-sans
Base size: 14px, line-height: 1.5
h1-h6: font-weight 700, letter-spacing -0.02em
```

### 4.4 Glassmorphism Tizimi

**Hozirgi Glass stillar:**
```
Light glass:
  --glass-bg: rgba(255, 255, 255, 0.72)
  --glass-border: rgba(255, 255, 255, 0.85)
  --glass-blur: 24px
  --glass-saturate: 190%

Dark glass (visionOS style):
  --glass-bg: rgba(11, 23, 31, 0.72)
  --glass-border: rgba(255, 255, 255, 0.06)
  --glass-blur: 28px
  --glass-saturate: 160%
```

**CSS klasslar:**
- `.glass` — oddiy glass effekt
- `.glass-card` — border-radius: 22px, hover: lift + glow
- `.card` — standart karta (border-radius: 18px)
- `.card-interactive` — bosiladigan karta
- `.liquid-glass` — specular shine bilan glass (sidebar, header)

### 4.5 Karta Va Shadow Tizimi

```
--shadow-sm:   0 1px 2px rgba(0,0,0,0.03), 0 2px 8px rgba(0,0,0,0.03)
--shadow-md:   0 4px 16px rgba(0,0,0,0.05), 0 1px 4px rgba(0,0,0,0.03)
--shadow-lg:   0 12px 40px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.04)
--shadow-glow: 0 0 32px -4px rgba(13, 148, 136, 0.28)  ← Teal glow
```

### 4.6 Border Radius Tizimi

```
sm:   6px
DEFAULT: 8px
md:   10px
lg:   12px
xl:   16px
2xl:  20px
3xl:  24px  (glass-card)
4xl:  32px
999px (pill badges)
```

### 4.7 Animatsiyalar

```
fade-up:   from translateY(14px) → 0, opacity 0→1, 300ms
scale-in:  from scale(0.94) → 1, 220ms
shimmer:   skeleton loading
pulse-soft: 2.5s, opacity 1→0.4→1 (online dot, bildirishnoma badge)
orb-1/2/3:  20-25s aurora background aylantirish
gradient-shift: 5s brand gradient animatsiyasi
toast-slide: translateX(30px) → 0
ripple:    iPhone tap effekti

Transition timing: cubic-bezier(0.16, 1, 0.3, 1)  ← "ease-spring"
```

### 4.8 Badge Tizimi

```
.badge         — bazaviy pill (border-radius: 999px, padding: 3px 10px)
.badge-green   — muvaffaqiyat (success color)
.badge-amber   — ogohlantirish (warning color)
.badge-danger  — xato (danger color)
.badge-blue    — ma'lumot
.badge-violet  — teal-violet gradient
.badge-muted   — kulrang
```

---

## 5. LAYOUT ARXITEKTURASI

### 5.1 AppShell

```
<div class="flex min-h-screen bg-bg">
  <Sidebar />                       ← Fixed/sticky, left
  <div class="flex flex-1 flex-col">
    <Header />                      ← Sticky top, h-[60px]
    <main class="flex-1 p-5 sm:p-7 lg:p-8">
      <Outlet />                    ← Sahifa kontent
    </main>
  </div>
</div>
```

### 5.2 Sidebar

**O'lchamlar:**
- Kengaytirilgan: `w-[240px]`
- Yig'ilgan: `w-[70px]`
- Mobile: `fixed`, toggle bilan

**Vizual stil:**
```
background: linear-gradient(180deg, hsl(200 35% 5%) 0%, hsl(200 30% 3%) 100%)
border-right: 1px solid rgba(255,255,255,0.06)
```

**Tarkib (yuqoridan pastga):**
1. **Logo zona** (h-[60px]):
   - Teal gradient kvadrat (36x36px, border-radius: xl)
   - "DentaCRM" yozuvi (Outfit font, teal accent harflar)
   - "Klinika tizimi" subtitle
   - Desktop collapse button ([-right-3] pozitsiyada)
2. **Nav items** (flex-1, overflow-y-auto):
   - Sections: "Asosiy", "Bemorlar", "Boshqaruv", "Tizim"
   - Active item: teal gradient bg + teal-300 matn + border
   - Inactive: text-white/45, hover → text-white/80
3. **Profile footer**:
   - Avatar (teal gradient, initials)
   - Ism/rol
   - Online dot (animate-pulse-soft, emerald)
   - Dropdown: Sozlamalar + Chiqish

**Nav items ro'yxati (rol bo'yicha):**
```
bosh_shifokor (hammasi):
  Dashboard → /dashboard
  Bo'limlar → /departments
  Shifokorlar → /doctors
  Moliya → /finance
  Hisobotlar → /reports
  Bemorlar → /my-patients
  Omborxona → /inventory
  Reyting → /ratings
  Jadval → /schedule
  Bemor qo'shish → /patients/new
  Navbat berish → /appointments/new
  To'lov → /payments/new
  Sozlamalar → /settings

doctor:
  Dashboard, Navbatlarim, Bemorlar, Omborxona, Reyting, Sozlamalar

administrator:
  Dashboard, Bemorlar, Omborxona, Jadval, Bemor qo'shish, Navbat, To'lov, Sozlamalar
```

### 5.3 Header (h-[60px])

**Vizual stil:**
```
background: linear-gradient(180deg, hsl(200 35% 5% / 0.95) 0%, hsl(200 30% 3% / 0.9) 100%)
border-bottom: 1px solid rgba(255,255,255,0.06)
backdrop-filter: blur(20px)
```

**Tarkib (chap → o'ng):**
1. Mobile hamburger (lg:hidden)
2. Search trigger (md:flex):
   - Placeholder: "Qidirish…"
   - ⌘K / Ctrl+K shortcut badges
   - Hover: teal border
3. Flex spacer
4. Bildirishnomalar (Bell icon):
   - Unread badge: teal, animate-pulse-soft
   - Dropdown (320px wide): real API data, mark as read
5. Divider
6. User avatar + ism/rol
7. Settings icon button
8. Logout button (hover: red)

---

## 6. SAHIFALAR TAFSILOTI

### 6.1 LoginPage

**Layout:** Full screen centered, dark bg  
**Background:**
```
gradient: 135deg, #020617 → #0f172a → #082f49
+ 3 ta ambient orb (teal va sky rang):
  orb-1: 700px, top-left, rgba(13,148,136,0.55)
  orb-2: 600px, bottom-right, rgba(14,165,233,0.45)
  orb-3: 400px, center-right, rgba(20,184,166,0.30)
+ Grid overlay: 48x48px, opacity 0.04
```

**Card:**
- max-w-[400px], glass card
- background: rgba(15, 23, 42, 0.65), blur 24px
- border: 1px solid rgba(255,255,255,0.10)

**Tarkib:**
1. "Xavfsiz kirish" floating badge (teal border)
2. Logo: 64x64px, teal gradient, tooth SVG + Sparkles
3. "DentaCRM" title (teal accent)
4. Form:
   - Telefon (Phone icon, +998 format)
   - Parol (Lock icon)
   - Error banner (red, animate-in)
   - Submit button (btn-gradient, h-12)
5. "Parolni unutdingizmi? Administratorga murojaat qiling."

### 6.2 DashboardPage

**3 ta tab:**

**Tab 1: Bosh sahifa (Overview)**
- Greeting: "Xayrli tong/kun/kech, [Ism]! 👋"
- Bugungi sana
- "Klinika Faol" live indicator (teal, animate-pulse-soft)
- Klinika ish oqimi (5 qadam stepper):
  1. Bemor qo'shish
  2. Navbat belgilash
  3. Qabulni boshlash
  4. Davolash & To'lov
  5. Omborxona & Zaxira
- KPI kartalar (4 ta grid):
  - bosh_shifokor: Bemorlar, Shifokorlar, Bo'limlar, Kam zaxira
  - doctor: Bemorlar, Bugungi navbatlarim, Bugungi umumiy, Kam zaxira
- Bugungi navbatlar timeline (lg:col-span-2)
- Kam zaxira widget (lg:col-span-1)
- Quick action kartalar

**Tab 2: Omborxona boshqaruvi**
- Search + filter
- DataTable: material, miqdor, holat, narx

**Tab 3: Ma'muriyat (bosh_shifokor va admin)**
- Sistem statistikasi

**KPI Card dizayni:**
```
Tone → iconBg + iconColor + glow:
  teal:  from-teal-600/20, text-teal-500,   rgba(13,148,136,0.25)
  green: from-emerald-600/20, text-emerald-400, rgba(16,185,129,0.25)
  amber: from-amber-600/20, text-amber-400, rgba(245,158,11,0.25)
  rose:  from-rose-600/20, text-rose-400,   rgba(244,63,94,0.25)
  sky:   from-sky-600/20, text-sky-400,     rgba(14,165,233,0.25)
```

### 6.3 DoctorsPage

- PageHeader: "Shifokorlar" + "Yangi shifokor" button
- Filters: search (2 col), bo'lim dropdown
- DataTable: Shifokor (avatar+ism), Mutaxassilik, Bo'limlar, Komissiya%, Holati
- Row click → `/doctors/:id`
- CreateDoctorModal: ism, familiya, tel, parol, mutaxassilik, rol, komissiya%, bo'limlar (checkbox)

### 6.4 DoctorDetailPage

- Shifokor profili, jadval, davolash tarixi

### 6.5 FinancePage

- KPI (4ta): Tushum, Jami to'lovlar, To'lov turlari, Faol shifokorlar
- To'lovlar DataTable: sana, miqdor, turi, qabul qilgan, izoh
- Shifokor komissiyalari jadvali (joriy oy)

### 6.6 InventoryPage

- Kam zaxira banner (ogohlantirish, amber)
- Filters: search, "Faqat kam qolganlar" checkbox
- DataTable: nomi, zaxirada (dona/gramm/ml), holati, narxi, yangilangan
- Row actions (bosh_shifokor): To'ldirish, Tahrirlash, O'chirish
- Modals: Material yaratish/tahrirlash, Restock, Confirm delete

### 6.7 SettingsPage

- 2 column layout
- Chap (md:col-span-2):
  - Shaxsiy profil formi (ism, familiya, tel readonly, Telegram Chat ID)
  - Mavzu tanlovi (3 karta: Light, Dark, System)
- O'ng:
  - Xavfsizlik (2FA toggle, Telegram orqali kod)
  - Hisob ma'lumotlari

### 6.8 PatientDetailPage

- Bemor ma'lumotlari
- Odontogram (tish kartasi)
- Davolash tarixi
- Navbatlar

---

## 7. UI KOMPONENTLAR

### Button

```typescript
Variants: "primary" | "secondary" | "outline" | "ghost" | "destructive"
Sizes:    "sm" | "default" | "lg" | "icon"

primary   → btn-gradient class (teal gradient, specular shine)
secondary → surface-2 bg
outline   → border only
ghost     → transparent
destructive → danger color
```

### Input

```
border-radius: 12px
border: 1px solid hsl(--color-border)
focus: border-primary + ring (3px, primary/15)
invalid: border-danger
padding: 9px 14px
```

### Modal

```
Backdrop: black/60, blur(16px)
Dialog: card + shadow-lg, rounded-3xl
Header, Body (scrollable), Footer
Sizes: sm (400px), md (540px, default), lg (680px)
```

### DataTable

```
thead: bg-surface-2, text-xs uppercase
tbody rows: hover:bg-surface-2/50
Sortable columns (up/down icons)
Loading: skeleton rows
Empty state support
Row actions support
```

### GlobalSearch (⌘K)

```
Trigger: Header search button OR ⌘K/Ctrl+K
Modal: full screen backdrop blur(14px)
Panel: max-w-[640px], dark glass, border-radius: 22px
Teal specular line at top
Searches: patients + doctors simultaneously
Keyboard: ↑↓ navigate, Enter open, Esc close
Min 2 chars to search
```

### Toast Notifications

```
Position: bottom-right
Types: success (green glow), error (red), warning (amber), info (teal)
Animation: toast-slide (translateX + scale)
Auto-dismiss timeout
```

### Pagination

```
Previous/Next + page numbers
Current page highlighted (teal)
```

---

## 8. BACKEND APPS (Django)

| App | Endpoint prefix | Tavsif |
|-----|-----------------|--------|
| `accounts` | `/api/v1/auth/` | Login, logout, refresh, profil, 2FA |
| `patients` | `/api/v1/patients/` | Bemorlar CRUD |
| `doctors` | `/api/v1/doctors/` | Shifokorlar, komissiya |
| `departments` | `/api/v1/departments/` | Bo'limlar |
| `scheduling` | `/api/v1/appointments/` | Navbatlar |
| `treatments` | `/api/v1/treatments/` | Davolashlar |
| `payments` | `/api/v1/payments/` | To'lovlar |
| `inventory` | `/api/v1/materials/` | Omborxona |
| `odontogram` | `/api/v1/odontogram/` | Tish kartasi |
| `prescriptions` | `/api/v1/prescriptions/` | Retseptlar |
| `ratings` | `/api/v1/ratings/` | Reyting |
| `reports` | `/api/v1/reports/` | Hisobotlar |
| `notifications` | `/api/v1/notifications/` | Bildirishnomalar |
| `telegram_bot` | — | Telegram integratsiya |

---

## 9. FRONTEND STATE MANAGEMENT

### authStore (Zustand)
```typescript
state: { user, status, token }
actions: login(), logout(), hydrate(), setUser()
user.role: "bosh_shifokor" | "doctor" | "administrator"
```

### uiStore (Zustand)
```typescript
state: {
  sidebarOpen: boolean,
  sidebarCollapsed: boolean,
  theme: "light" | "dark" | "system"
}
actions: toggleSidebar(), setSidebar(), toggleSidebarCollapsed(), setTheme()
```

### notificationStore (toast)
```typescript
toast.success(message, title?)
toast.error(message, title?)
toast.warning(message, title?)
toast.info(message, title?)
```

---

## 10. MAVJUD DIZAYN MUAMMOLARI

1. **Sidebar** har doim dark mode — sahifa theme ga bog'liq emas
2. **Header** ham dark mode — light mode da kontrast yo'q
3. **Appointment statusi**lar real-time yangilanmaydi
4. **Mobile** tajriba sidebar overlay bilan murakkab
5. **Dashboard** juda ko'p ma'lumot — scroll kerak
6. **FinancePage** jadval (commissions) oddiy `<table>` — DataTable emas

---

## 11. DIZAYN QARORLAR (Muhim)

- **Dark mode birinchi** — Sidebar va Header doim dark
- **iOS glassmorphism** — Apple visionOS inspiratsiyasi
- **"ease-spring"** — `cubic-bezier(0.16, 1, 0.3, 1)` barcha animatsiyalarda
- **Font pairing** — Outfit (display/headings) + Inter (body)
- **Teal brand** — `#14b8a6` (teal-500) asosiy brand rang
- **No placeholder code** — hamma sahifa real API data bilan ishlaydi
- **Role-based nav** — sidebar role ga qarab filter qiladi
- **2FA via Telegram** — ikki bosqichli autentifikatsiya Telegram orqali

---

## 12. DOCKER SERVICES

```yaml
dentacrm-postgres:   PostgreSQL 16
dentacrm-redis:      Redis 7
dentacrm-backend:    Django, port 8000
dentacrm-frontend:   Vite dev server, port 5173
dentacrm-celery-worker: Background tasks
dentacrm-celery-beat:   Periodic tasks (eslatmalar)
dentacrm-minio:      File storage (S3 compatible)
dentacrm-bot:        Telegram bot (token kerak)
```

---

## 13. GOOGLE STITCH UCHUN QAYTA DIZAYN TAVSIYALARI

### Nima o'zgartirish kerak:
1. **Sidebar** — Light mode da ham ishlashi kerak
2. **Header** — Glassmorphism light versiyasi
3. **Dashboard KPI kartalar** — Yanada vizual, animatsiyali
4. **Mobile layout** — Bottom navigation bar
5. **Color system** — Yangi palette yoki teal ni saqlab qolish
6. **Login page** — Yangi background animatsiyasi
7. **Tables** — Yanada premium DataTable ko'rinishi

### Nima saqlab qolish kerak:
- Route structure (barcha yo'llar)
- Role-based access
- API integration points
- Component nomenclature
- Toast notification system
- GlobalSearch ⌘K UX

---

*Hujjat yaratildi: 2026-07-20*  
*Muallif: DentaCRM AI Agent*
