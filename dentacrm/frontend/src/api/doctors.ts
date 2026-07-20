/**
 * Doctors API — mirrors ``/api/v1/doctors/``.
 */
import { request } from "./client";
import type { Paginated } from "@/types";

export interface DoctorUser {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  role: string;
}

export interface DoctorDepartmentRef {
  id: string;
  name: string;
}

export interface DoctorWorkingHour {
  id: string;
  doctorId: string;
  weekday: number;
  weekdayLabel: string;
  startTime: string;
  endTime: string;
}

export interface DoctorRecord {
  id: string;
  user: DoctorUser | null;
  departments: DoctorDepartmentRef[];
  specialization: string;
  bio: string;
  commissionBasis: "from_total" | "from_net";
  defaultCommissionRate: string | null;
  canViewOtherDoctors: boolean;
  isActive: boolean;
  workingHours: DoctorWorkingHour[];
  createdAt: string | null;
  updatedAt: string | null;
}

export interface DoctorListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  department?: string;
  ordering?: string;
  includeInactive?: boolean;
}

export interface DoctorCreateInput {
  user: {
    phoneNumber: string;
    firstName: string;
    lastName: string;
    password: string;
    role?: "doctor" | "bosh_shifokor";
  };
  departmentIds?: string[];
  specialization?: string;
  bio?: string;
  commissionBasis?: "from_total" | "from_net";
  defaultCommissionRate?: string | number;
  canViewOtherDoctors?: boolean;
}

export interface DoctorUpdateInput {
  departmentIds?: string[];
  specialization?: string;
  bio?: string;
  commissionBasis?: "from_total" | "from_net";
  defaultCommissionRate?: string | number;
  canViewOtherDoctors?: boolean;
  isActive?: boolean;
}

function buildParams(input: DoctorListParams): Record<string, string> {
  const params: Record<string, string> = {};
  if (input.page && input.page > 0) params["page"] = String(input.page);
  if (input.pageSize && input.pageSize > 0) params["page_size"] = String(input.pageSize);
  if (input.search && input.search.trim()) params["search"] = input.search.trim();
  if (input.department) params["department"] = input.department;
  if (input.ordering) params["ordering"] = input.ordering;
  if (input.includeInactive) params["include_inactive"] = "true";
  return params;
}

export function listDoctors(
  input: DoctorListParams = {},
): Promise<Paginated<DoctorRecord>> {
  return request<Paginated<DoctorRecord>>({
    method: "GET",
    url: "/doctors/",
    params: buildParams(input),
  });
}

export function getDoctor(id: string): Promise<DoctorRecord> {
  return request<DoctorRecord>({
    method: "GET",
    url: `/doctors/${id}/`,
  });
}

export function createDoctor(input: DoctorCreateInput): Promise<DoctorRecord> {
  return request<DoctorRecord>({
    method: "POST",
    url: "/doctors/",
    data: input,
  });
}

export function updateDoctor(
  id: string,
  input: DoctorUpdateInput,
): Promise<DoctorRecord> {
  return request<DoctorRecord>({
    method: "PATCH",
    url: `/doctors/${id}/`,
    data: input,
  });
}

export function deleteDoctor(id: string): Promise<void> {
  return request<void>({
    method: "DELETE",
    url: `/doctors/${id}/`,
  });
}

// ---------------------------------------------------------------------------
// Nested resources — working hours, time off, available slots.
//
// Backend routes (see ``apps.doctors.views.DoctorProfileViewSet``):
//   GET/POST   /doctors/{id}/working-hours/
//   DELETE     /doctors/{id}/working-hours/{entryId}/
//   GET/POST   /doctors/{id}/time-off/
//   DELETE     /doctors/{id}/time-off/{entryId}/
//   GET        /doctors/{id}/available-slots/?date=YYYY-MM-DD
// ---------------------------------------------------------------------------

export interface DoctorTimeOff {
  id: string;
  doctorId: string;
  dateStart: string; // YYYY-MM-DD
  dateEnd: string;
  reason: string;
}

export interface WorkingHourInput {
  weekday: number;
  startTime: string; // HH:MM
  endTime: string; // HH:MM
}

export interface TimeOffInput {
  dateStart: string;
  dateEnd: string;
  reason?: string;
}

export interface AvailableSlot {
  start: string; // HH:MM
  end: string;
}

export interface AvailableSlotsResponse {
  doctorId: string;
  date: string;
  slots: AvailableSlot[];
}

export function listWorkingHours(
  doctorId: string,
): Promise<DoctorWorkingHour[]> {
  return request<DoctorWorkingHour[]>({
    method: "GET",
    url: `/doctors/${doctorId}/working-hours/`,
  });
}

export function createWorkingHour(
  doctorId: string,
  input: WorkingHourInput,
): Promise<DoctorWorkingHour> {
  return request<DoctorWorkingHour>({
    method: "POST",
    url: `/doctors/${doctorId}/working-hours/`,
    data: input,
  });
}

export function deleteWorkingHour(
  doctorId: string,
  entryId: string,
): Promise<void> {
  return request<void>({
    method: "DELETE",
    url: `/doctors/${doctorId}/working-hours/${entryId}/`,
  });
}

export function listTimeOff(doctorId: string): Promise<DoctorTimeOff[]> {
  return request<DoctorTimeOff[]>({
    method: "GET",
    url: `/doctors/${doctorId}/time-off/`,
  });
}

export function createTimeOff(
  doctorId: string,
  input: TimeOffInput,
): Promise<DoctorTimeOff> {
  return request<DoctorTimeOff>({
    method: "POST",
    url: `/doctors/${doctorId}/time-off/`,
    data: input,
  });
}

export function deleteTimeOff(
  doctorId: string,
  entryId: string,
): Promise<void> {
  return request<void>({
    method: "DELETE",
    url: `/doctors/${doctorId}/time-off/${entryId}/`,
  });
}

export function getAvailableSlots(
  doctorId: string,
  date: string,
  slotMinutes = 30,
): Promise<AvailableSlotsResponse> {
  return request<AvailableSlotsResponse>({
    method: "GET",
    url: `/doctors/${doctorId}/available-slots/`,
    params: { date, slot_minutes: String(slotMinutes) },
  });
}

export interface ProcedureType {
  id: string;
  name: string;
  department: {
    id: string;
    name: string | null;
  };
  defaultDurationMinutes: number;
  defaultPrice: string;
  commissionRateOverride: string | null;
  isActive: boolean;
}

export function listProcedureTypes(): Promise<ProcedureType[]> {
  return request<ProcedureType[]>({
    method: "GET",
    url: "/procedure-types/",
  });
}

/** Localised weekday labels (Mon–Sun order, index 0 = Monday). */
export const WEEKDAY_LABELS: readonly string[] = [
  "Dushanba",
  "Seshanba",
  "Chorshanba",
  "Payshanba",
  "Juma",
  "Shanba",
  "Yakshanba",
];

