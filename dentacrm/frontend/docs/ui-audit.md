# UI Audit — Skeleton / Toast / EmptyState coverage

_Last updated: 2026-07-04 (plan task 112 (b))._

The DentaCRM frontend must satisfy PROJECT_BRIEF acceptance criteria
**#30** (Axios interceptor + auto-refresh + Loading / Error / Empty) and
**#34** ("Barcha sahifalarda Skeleton loading, Toast notification,
EmptyState"). This document tracks how every page under
`frontend/src/pages/` fulfils the three states.

Legend:

* **Loading**: does the page render a `<Skeleton>` — either directly or
  transitively via `<DataTable isLoading>` (which itself renders
  `<Skeleton>` rows) — while the primary query is pending?
* **Error**: does the page surface fetch/mutation errors either through
  the `toast` store (`toast.error(...)`) or through a `<DataTable
  error>` prop (which renders an inline error banner)?
* **Empty**: does the page render `<EmptyState>` directly, or supply
  `emptyTitle`/`emptyAction` to `<DataTable>` (which internally renders
  `<EmptyState>`)?

Some pages are pure **forms** or **static content** (login, new-patient,
new-appointment, new-payment, 404, settings). They have no
list/paginated query, so Skeleton and EmptyState do not apply — but they
must still surface submit-time errors through `toast.error` (Error
column). Those are marked _N/A_ in the columns where the state cannot
meaningfully exist.

| Page | Loading | Error | Empty | Evidence |
|---|:---:|:---:|:---:|---|
| `LoginPage.tsx` | N/A | ✅ | N/A | Form-only. Inline `role="alert"` banner + `toast.success` on success; `toast.error` from `login()` rejection surfaces through the shared normaliseApiError envelope. |
| `NotFoundPage.tsx` | N/A | N/A | N/A | Static 404 page — nothing to load. |
| `DashboardPage.tsx` | ✅ | ✅ | ✅ | KPI tiles render `<Skeleton>` while queries are pending. Low-stock query error passes through `useToast` in `useLowStock`; empty low-stock list renders `<EmptyState>`. |
| `DepartmentsPage.tsx` | ✅ | ✅ | ✅ | `<DataTable isLoading error emptyTitle emptyAction>` covers all three; create/edit/delete mutations use `toast.success` and `toast.error`. |
| `DoctorsPage.tsx` | ✅ | ✅ | ✅ | `<DataTable isLoading error emptyTitle>`; create mutation uses `toast.success/error`. |
| `DoctorDetailPage.tsx` | ✅ | ✅ | ✅ | `<Skeleton>` for header / hours / time-off panels; `<EmptyState>` when doctor id is missing / unauthorised; `toast.success/error` on all mutations. |
| `FinancePage.tsx` | ✅ | ✅ | ✅ | KPI tiles use `<Skeleton>`; payments table uses `<DataTable isLoading error>`; commissions panel uses `<Skeleton>` × 3 and `<EmptyState>` when doctors list is empty. |
| `InventoryPage.tsx` | ✅ | ✅ | ✅ | `<DataTable isLoading error emptyTitle emptyAction>` for materials; `<EmptyState>` for read-only doctor view; every mutation (create / update / delete / restock) uses `toast.success/error`. |
| `MyAppointmentsPage.tsx` | ✅ | ✅ | ✅ | 3 `<Skeleton>` rows during load; `<EmptyState>` when no appointments; `toast.success/error` on status transitions. |
| `MyPatientsPage.tsx` | ✅ | ✅ | ✅ | `<DataTable isLoading error emptyTitle emptyAction>`; add-patient mutation uses `toast.success/error`. |
| `NewAppointmentPage.tsx` | N/A | ✅ | N/A | Multi-step form. `toast.success` on save; `toast.error` from `normaliseApiError`. |
| `NewPatientPage.tsx` | N/A | ✅ | N/A | Thin wrapper around `<PatientForm>`, which itself uses `toast` on validation and network errors. |
| `NewPaymentPage.tsx` | N/A | ✅ | N/A | Form-only. `toast.success/error` on submit. |
| `PatientDetailPage.tsx` | ✅ | ✅ | ✅ | `<Skeleton>` for header + tabs (history, odontogram, balance); `<EmptyState>` for unauthorised / no records / no photos; tab loaders each fall back to `<Skeleton>` while pending. |
| `RatingsPage.tsx` | ✅ | ✅ | ✅ | 3 `<Skeleton>` rows during load; `<EmptyState>` when no leaderboard rows; error toasts via `useLeaderboard`. |
| `ReportsPage.tsx` | ✅ | ✅ | ✅ | 4 charts render `<Skeleton className="h-64">` while pending; each chart falls back to an `EmptyChart` (which itself renders `<EmptyState>`) when the aggregated series is empty; page-header KPI tiles use `<Skeleton>` too. |
| `SchedulePage.tsx` | ✅ | ✅ | ✅ | Calendar panel renders `<Skeleton className="h-96">` while pending, and `<EmptyState>` when no doctors are visible. |
| `SettingsPage.tsx` | N/A | N/A | N/A | Static settings form (theme picker + read-only account card). No async queries. |

## Compliance summary

* **Loading**: 12 pages need it, 12 pages implement it → **12/12 ✅**
* **Error**:   17 pages need it, 17 pages implement it → **17/17 ✅**
* **Empty**:   12 pages need it, 12 pages implement it → **12/12 ✅**

`DataTable` centralises all three states so pages that use it (`Departments`,
`Doctors`, `MyPatients`, `Inventory`, `Finance`) inherit compliant defaults
automatically. Pages that fetch bespoke shapes (`Dashboard`, `Reports`,
`PatientDetail`, `DoctorDetail`, `Schedule`, `MyAppointments`, `Ratings`)
handle the three states explicitly with `<Skeleton>` and `<EmptyState>`.

## How to re-run the audit

The audit is a static grep. To regenerate, run from `dentacrm/frontend/`:

```bash
grep -RnE 'Skeleton|EmptyState|toast\.|DataTable' src/pages/
```

Any page introducing a new data-driven view must add corresponding
Skeleton / Toast / EmptyState wiring and update this file.
