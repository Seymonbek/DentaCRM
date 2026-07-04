/**
 * Appointments API — mirrors ``/api/v1/appointments/``.
 */
import { request } from "./client";
import type { AppointmentStatus, Paginated } from "@/types";

export interface AppointmentRecord {
  id: string;
  patientId: string;
  doctorId: string;
  departmentId: string;
  procedureTypeId: string | null;
  scheduledStart: string;
  scheduledEnd: string;
  status: AppointmentStatus;
  notes: string;
  patient?: {
    id: string;
    firstName: string;
    lastName: string;
    fullName?: string;
    phoneNumber?: string;
  } | null;
  doctor?: {
    id: string;
    firstName: string;
    lastName: string;
    specialization?: string;
  } | null;
}

export interface AppointmentListParams {
  doctor?: string;
  patient?: string;
  status?: AppointmentStatus;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  pageSize?: number;
}

export interface AppointmentInput {
  patientId: string;
  doctorId: string;
  departmentId: string;
  procedureTypeId?: string | null;
  scheduledStart: string;
  scheduledEnd: string;
  notes?: string;
}

export interface AvailableSlot {
  start: string;
  end: string;
}

function buildParams(input: AppointmentListParams): Record<string, string> {
  const p: Record<string, string> = {};
  if (input.doctor) p["doctor"] = input.doctor;
  if (input.patient) p["patient"] = input.patient;
  if (input.status) p["status"] = input.status;
  if (input.dateFrom) p["date_from"] = input.dateFrom;
  if (input.dateTo) p["date_to"] = input.dateTo;
  if (input.page && input.page > 0) p["page"] = String(input.page);
  if (input.pageSize && input.pageSize > 0)
    p["page_size"] = String(input.pageSize);
  return p;
}

export function listAppointments(
  input: AppointmentListParams = {},
): Promise<Paginated<AppointmentRecord>> {
  return request<Paginated<AppointmentRecord>>({
    method: "GET",
    url: "/appointments/",
    params: buildParams(input),
  });
}

export function getAppointment(id: string): Promise<AppointmentRecord> {
  return request<AppointmentRecord>({
    method: "GET",
    url: `/appointments/${id}/`,
  });
}

export function createAppointment(
  input: AppointmentInput,
): Promise<AppointmentRecord> {
  return request<AppointmentRecord>({
    method: "POST",
    url: "/appointments/",
    data: input,
  });
}

export function updateAppointment(
  id: string,
  input: Partial<AppointmentInput> & { status?: AppointmentStatus },
): Promise<AppointmentRecord> {
  return request<AppointmentRecord>({
    method: "PATCH",
    url: `/appointments/${id}/`,
    data: input,
  });
}

export function cancelAppointment(id: string): Promise<AppointmentRecord> {
  return request<AppointmentRecord>({
    method: "POST",
    url: `/appointments/${id}/cancel/`,
  });
}

export function getAvailableSlots(
  doctorId: string,
  date: string,
): Promise<AvailableSlot[]> {
  return request<AvailableSlot[]>({
    method: "GET",
    url: `/doctors/${doctorId}/available-slots/`,
    params: { date },
  });
}

export const APPOINTMENT_STATUS_LABELS: Record<AppointmentStatus, string> = {
  scheduled: "Rejalashtirilgan",
  confirmed: "Tasdiqlangan",
  in_progress: "Bajarilmoqda",
  completed: "Yakunlangan",
  cancelled: "Bekor qilingan",
  no_show: "Kelmadi",
};
