/**
 * Patients API — mirrors ``/api/v1/patients/``.
 */
import { request } from "./client";
import type { Paginated } from "@/types";

export interface PatientCreator {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

export interface PatientRecord {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  phoneNumber: string;
  gender: "male" | "female" | null;
  address: string;
  notes: string;
  telegramChatId: number | null;
  isActive: boolean;
  createdAt: string | null;
  updatedAt: string | null;
  createdBy: PatientCreator | null;
}

export interface PatientHistoryEvent {
  id: string;
  type: "appointment" | "treatment" | "payment" | "prescription" | "note";
  occurredAt: string;
  title: string;
  summary?: string;
  meta?: Record<string, unknown>;
}

export interface PatientOdontogramTooth {
  toothNumber: number;
  status: "healthy" | "treated" | "missing" | "planned";
  procedure?: string | null;
  notes?: string;
}

export interface PatientListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  ordering?: string;
  includeInactive?: boolean;
}

export interface PatientInput {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  gender?: "male" | "female" | null;
  address?: string;
  notes?: string;
  telegramChatId?: number | null;
  isActive?: boolean;
}

function buildParams(input: PatientListParams): Record<string, string> {
  const params: Record<string, string> = {};
  if (input.page && input.page > 0) params["page"] = String(input.page);
  if (input.pageSize && input.pageSize > 0) params["page_size"] = String(input.pageSize);
  if (input.search && input.search.trim()) params["search"] = input.search.trim();
  if (input.ordering) params["ordering"] = input.ordering;
  if (input.includeInactive) params["include_inactive"] = "true";
  return params;
}

export function listPatients(
  input: PatientListParams = {},
): Promise<Paginated<PatientRecord>> {
  return request<Paginated<PatientRecord>>({
    method: "GET",
    url: "/patients/",
    params: buildParams(input),
  });
}

export function getPatient(id: string): Promise<PatientRecord> {
  return request<PatientRecord>({
    method: "GET",
    url: `/patients/${id}/`,
  });
}

export function createPatient(input: PatientInput): Promise<PatientRecord> {
  return request<PatientRecord>({
    method: "POST",
    url: "/patients/",
    data: input,
  });
}

export function updatePatient(
  id: string,
  input: Partial<PatientInput>,
): Promise<PatientRecord> {
  return request<PatientRecord>({
    method: "PATCH",
    url: `/patients/${id}/`,
    data: input,
  });
}

export function deletePatient(id: string): Promise<void> {
  return request<void>({
    method: "DELETE",
    url: `/patients/${id}/`,
  });
}

export function getPatientHistory(
  patientId: string,
): Promise<PatientHistoryEvent[]> {
  // T123: the endpoint now returns the standard pagination envelope
  // (`{count, next, previous, results}`). Callers of `getPatientHistory`
  // still expect a flat array, so we transparently unwrap `.results`
  // here — keeps `PatientDetailPage` and any other consumer unchanged.
  // We request `page_size=100` to fetch the whole timeline in one call
  // (matches the previous flat-list contract). If we later need true
  // infinite scroll, callers should switch to `Paginated<...>` directly.
  return request<Paginated<PatientHistoryEvent>>({
    method: "GET",
    url: `/patients/${patientId}/history/`,
    params: { page_size: 100 },
  }).then((res) => res.results);
}

export function getPatientOdontogram(
  patientId: string,
): Promise<PatientOdontogramTooth[]> {
  return request<PatientOdontogramTooth[]>({
    method: "GET",
    url: `/patients/${patientId}/odontogram/`,
  });
}
