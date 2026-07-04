/**
 * Central TypeScript type surface for DentaCRM.
 *
 * These types mirror the backend contract described in PROJECT_BRIEF.md
 * (Section "TypeScript Interfaces") and MUST stay camelCase to match the
 * DRF serializers' ``to_representation`` output.
 */

/** RBAC roles — mirrors ``apps.accounts.models.User.Role`` values. */
export type UserRole = "bosh_shifokor" | "doctor" | "administrator";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  role: UserRole;
}

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  gender?: "male" | "female" | null;
  address?: string | null;
  notes?: string | null;
}

export interface Doctor {
  id: string;
  user: User;
  departments: string[];
  specialization: string;
  commissionBasis: "from_total" | "from_net";
}

export type AppointmentStatus =
  | "scheduled"
  | "confirmed"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "no_show";

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  scheduledStart: string; // ISO 8601
  scheduledEnd: string; // ISO 8601
  status: AppointmentStatus;
}

export type ToothProcedure =
  | "filling"
  | "root_canal"
  | "extraction"
  | "crown"
  | "implant"
  | "cleaning"
  | "whitening";

export type ToothStatus = "healthy" | "treated" | "missing" | "planned";

export interface ToothRecord {
  toothNumber: number;
  procedure: ToothProcedure;
  status: ToothStatus;
  notes?: string | null;
}

export interface Treatment {
  id: string;
  appointmentId: string;
  diagnosis: string;
  price: number | string;
  paymentStatus: "unpaid" | "partial" | "paid";
  toothRecords: ToothRecord[];
}

export interface Material {
  id: string;
  name: string;
  unit: "gram" | "piece" | "ml";
  quantityInStock: number | string;
  minimumThreshold: number | string;
}

export type PaymentMethod = "cash" | "card" | "payme" | "click" | "bank_transfer";

export interface Payment {
  id: string;
  treatmentId: string;
  patientId: string;
  amount: number | string;
  method: PaymentMethod;
  note?: string;
  receivedBy?: {
    id: string;
    firstName: string;
    lastName: string;
  } | null;
  isActive?: boolean;
  createdAt?: string;
}

export interface PatientBalance {
  patientId: string;
  totalBilled: string;
  totalPaid: string;
  balance: string;
}

export interface CommissionRecord {
  id: string;
  doctorId: string;
  treatmentId: string;
  amount: string;
  rate: string;
  basis: "from_total" | "from_net";
  baseAmount: string;
  materialCost: string;
  calculatedAt: string;
}

export interface CommissionSummary {
  doctorId: string;
  count: number;
  totalAmount: string;
  dateFrom: string | null;
  dateTo: string | null;
}

// ---------------------------------------------------------------------------
// API envelope shapes
// ---------------------------------------------------------------------------
export interface Paginated<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface ApiErrorPayload {
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}

export interface TokenPair {
  access: string;
  refresh: string;
  user: User;
}
