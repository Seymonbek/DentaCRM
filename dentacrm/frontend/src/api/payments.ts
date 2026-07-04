/**
 * Payments API — mirrors ``/api/v1/payments/``,
 * ``/api/v1/patients/{id}/balance/`` and
 * ``/api/v1/doctors/{id}/commissions/`` on the backend.
 *
 * Decimal fields are transported as strings (e.g. ``"250000.00"``) so
 * the server-side Decimal precision round-trips without lossy
 * IEEE-754 truncation. camelCase field names match the DRF
 * ``to_representation`` output.
 */
import { request } from "./client";
import type {
  CommissionRecord,
  CommissionSummary,
  Paginated,
  PatientBalance,
  Payment,
  PaymentMethod,
} from "@/types";

// ---------------------------------------------------------------------------
// List / query params
// ---------------------------------------------------------------------------
export interface PaymentListParams {
  page?: number;
  pageSize?: number;
  method?: PaymentMethod;
  treatment?: string;
  patient?: string;
  ordering?: string;
}

export interface PaymentInput {
  treatmentId: string;
  amount: string;
  method: PaymentMethod;
  note?: string;
}

export interface CommissionRangeParams {
  from?: string;
  to?: string;
}

// ---------------------------------------------------------------------------
// Query-string builder
// ---------------------------------------------------------------------------
function buildParams(input: PaymentListParams): Record<string, string> {
  const params: Record<string, string> = {};
  if (input.page && input.page > 0) params["page"] = String(input.page);
  if (input.pageSize && input.pageSize > 0)
    params["page_size"] = String(input.pageSize);
  if (input.method) params["method"] = input.method;
  if (input.treatment) params["treatment"] = input.treatment;
  if (input.patient) params["patient"] = input.patient;
  if (input.ordering) params["ordering"] = input.ordering;
  return params;
}

function buildRangeParams(
  input: CommissionRangeParams,
): Record<string, string> {
  const params: Record<string, string> = {};
  if (input.from) params["from"] = input.from;
  if (input.to) params["to"] = input.to;
  return params;
}

// ---------------------------------------------------------------------------
// Endpoints — payments
// ---------------------------------------------------------------------------
export function listPayments(
  input: PaymentListParams = {},
): Promise<Paginated<Payment>> {
  return request<Paginated<Payment>>({
    method: "GET",
    url: "/payments/",
    params: buildParams(input),
  });
}

export function createPayment(input: PaymentInput): Promise<Payment> {
  return request<Payment>({
    method: "POST",
    url: "/payments/",
    data: input,
  });
}

export function getPayment(id: string): Promise<Payment> {
  return request<Payment>({ method: "GET", url: `/payments/${id}/` });
}

export function voidPayment(id: string): Promise<void> {
  return request<void>({ method: "DELETE", url: `/payments/${id}/` });
}

// ---------------------------------------------------------------------------
// Endpoints — patient balance & doctor commissions
// ---------------------------------------------------------------------------
export function getPatientBalance(patientId: string): Promise<PatientBalance> {
  return request<PatientBalance>({
    method: "GET",
    url: `/patients/${patientId}/balance/`,
  });
}

export function listDoctorCommissions(
  doctorId: string,
  input: CommissionRangeParams = {},
): Promise<CommissionRecord[]> {
  return request<CommissionRecord[]>({
    method: "GET",
    url: `/doctors/${doctorId}/commissions/`,
    params: buildRangeParams(input),
  });
}

export function getDoctorCommissionsSummary(
  doctorId: string,
  input: CommissionRangeParams = {},
): Promise<CommissionSummary> {
  return request<CommissionSummary>({
    method: "GET",
    url: `/doctors/${doctorId}/commissions/summary/`,
    params: buildRangeParams(input),
  });
}

// ---------------------------------------------------------------------------
// Human-readable labels
// ---------------------------------------------------------------------------
export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  cash: "Naqd",
  card: "Karta",
  payme: "Payme",
  click: "Click",
  bank_transfer: "Bank o'tkazmasi",
};

export const PAYMENT_METHOD_OPTIONS: readonly {
  value: PaymentMethod;
  label: string;
}[] = [
  { value: "cash", label: PAYMENT_METHOD_LABELS.cash },
  { value: "card", label: PAYMENT_METHOD_LABELS.card },
  { value: "payme", label: PAYMENT_METHOD_LABELS.payme },
  { value: "click", label: PAYMENT_METHOD_LABELS.click },
  { value: "bank_transfer", label: PAYMENT_METHOD_LABELS.bank_transfer },
];
