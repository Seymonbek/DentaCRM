/**
 * Treatments API — mirrors ``/api/v1/treatments/``.
 *
 * The backend serializers (``apps.treatments.serializers``) emit
 * camelCase payloads. Nested ``photos`` and ``toothRecords`` are
 * embedded in the treatment detail response and are also individually
 * addressable via the nested actions.
 */
import { request } from "./client";
import type { Paginated } from "@/types";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export type TreatmentStage = "in_progress" | "completed";
export type PaymentStatus = "unpaid" | "partial" | "paid";
export type PhotoType = "before" | "after" | "xray";

export type ToothProcedure =
  | "filling"
  | "root_canal"
  | "extraction"
  | "crown"
  | "implant"
  | "cleaning"
  | "whitening";

export type ToothStatus = "healthy" | "treated" | "missing" | "planned";

export interface TreatmentPhoto {
  id: string;
  treatmentId: string;
  photoType: PhotoType;
  imageUrl: string | null;
  thumbnailPath: string | null;
  caption: string;
  uploadedAt: string | null;
  uploadedBy: {
    id: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
  } | null;
  isActive: boolean;
}

export interface ToothRecord {
  id: string;
  treatmentId?: string;
  toothNumber: number;
  procedure: ToothProcedure;
  status: ToothStatus;
  notes: string;
  isActive?: boolean;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface TreatmentRecord {
  id: string;
  patientId: string;
  doctorId: string;
  departmentId: string;
  appointmentId: string | null;
  procedureTypeId: string | null;
  diagnosis: string;
  description: string;
  price: string;
  paymentStatus: PaymentStatus;
  stage: TreatmentStage;
  isActive?: boolean;
  createdAt: string | null;
  updatedAt: string | null;
  patient?: {
    id: string;
    firstName: string;
    lastName: string;
    fullName?: string;
    phoneNumber?: string;
  } | null;
  doctor?: {
    id: string;
    user?: {
      id: string;
      firstName: string;
      lastName: string;
      phoneNumber?: string;
    } | null;
    specialization?: string;
  } | null;
  department?: { id: string; name: string } | null;
  procedureType?: {
    id: string;
    name: string;
    defaultPrice?: string;
  } | null;
  appointment?: {
    id: string;
    scheduledStart: string | null;
    scheduledEnd: string | null;
    status: string;
  } | null;
  photos?: TreatmentPhoto[];
  toothRecords?: ToothRecord[];
}

export interface TreatmentListParams {
  patient?: string;
  doctor?: string;
  department?: string;
  page?: number;
  pageSize?: number;
  paymentStatus?: PaymentStatus;
  stage?: TreatmentStage;
}

/**
 * Input for POST /treatments/. The backend accepts both camelCase and
 * snake_case field names — we send camelCase so it lines up with every
 * other API module in the project.
 */
export interface TreatmentInput {
  patientId: string;
  doctorId: string;
  departmentId: string;
  procedureTypeId?: string | null;
  appointmentId?: string | null;
  diagnosis: string;
  description?: string;
  /** Decimal string, e.g. ``"150000.00"``. */
  price: string;
  paymentStatus?: PaymentStatus;
  stage?: TreatmentStage;
}

export interface TreatmentUpdateInput {
  diagnosis?: string;
  description?: string;
  price?: string;
  paymentStatus?: PaymentStatus;
  stage?: TreatmentStage;
  procedureTypeId?: string | null;
  isActive?: boolean;
}

export interface ToothRecordInput {
  toothNumber: number;
  procedure: ToothProcedure;
  status?: ToothStatus;
  notes?: string;
}

export interface PhotoUploadInput {
  photoType: PhotoType;
  file: File;
  caption?: string;
}

// ---------------------------------------------------------------------------
// Query-string builder
// ---------------------------------------------------------------------------
function buildParams(input: TreatmentListParams): Record<string, string> {
  const params: Record<string, string> = {};
  if (input.patient) params["patient"] = input.patient;
  if (input.doctor) params["doctor"] = input.doctor;
  if (input.department) params["department"] = input.department;
  if (input.page && input.page > 0) params["page"] = String(input.page);
  if (input.pageSize && input.pageSize > 0)
    params["page_size"] = String(input.pageSize);
  if (input.paymentStatus) params["payment_status"] = input.paymentStatus;
  if (input.stage) params["stage"] = input.stage;
  return params;
}

// ---------------------------------------------------------------------------
// Endpoints — treatments
// ---------------------------------------------------------------------------
export function listTreatments(
  input: TreatmentListParams = {},
): Promise<Paginated<TreatmentRecord>> {
  return request<Paginated<TreatmentRecord>>({
    method: "GET",
    url: "/treatments/",
    params: buildParams(input),
  });
}

export function getTreatment(id: string): Promise<TreatmentRecord> {
  return request<TreatmentRecord>({
    method: "GET",
    url: `/treatments/${id}/`,
  });
}

export function createTreatment(
  input: TreatmentInput,
): Promise<TreatmentRecord> {
  return request<TreatmentRecord>({
    method: "POST",
    url: "/treatments/",
    data: input,
  });
}

export function updateTreatment(
  id: string,
  input: TreatmentUpdateInput,
): Promise<TreatmentRecord> {
  return request<TreatmentRecord>({
    method: "PATCH",
    url: `/treatments/${id}/`,
    data: input,
  });
}

export function deleteTreatment(id: string): Promise<void> {
  return request<void>({
    method: "DELETE",
    url: `/treatments/${id}/`,
  });
}

// ---------------------------------------------------------------------------
// Nested — tooth records
// ---------------------------------------------------------------------------
export function listToothRecords(
  treatmentId: string,
): Promise<ToothRecord[]> {
  return request<ToothRecord[]>({
    method: "GET",
    url: `/treatments/${treatmentId}/tooth-records/`,
  });
}

export function createToothRecord(
  treatmentId: string,
  input: ToothRecordInput,
): Promise<ToothRecord> {
  return request<ToothRecord>({
    method: "POST",
    url: `/treatments/${treatmentId}/tooth-records/`,
    data: {
      toothNumber: input.toothNumber,
      procedure: input.procedure,
      status: input.status ?? "planned",
      notes: input.notes ?? "",
    },
  });
}

export function cloneOdontogram(
  treatmentId: string,
): Promise<ToothRecord[]> {
  return request<ToothRecord[]>({
    method: "POST",
    url: `/treatments/${treatmentId}/clone-odontogram/`,
  });
}

// ---------------------------------------------------------------------------
// Nested — treatment photos
// ---------------------------------------------------------------------------
export function listTreatmentPhotos(
  treatmentId: string,
): Promise<TreatmentPhoto[]> {
  return request<TreatmentPhoto[]>({
    method: "GET",
    url: `/treatments/${treatmentId}/photos/`,
  });
}

export function uploadTreatmentPhoto(
  treatmentId: string,
  input: PhotoUploadInput,
): Promise<TreatmentPhoto> {
  const form = new FormData();
  form.append("photoType", input.photoType);
  form.append("image", input.file);
  if (input.caption) form.append("caption", input.caption);
  return request<TreatmentPhoto>({
    method: "POST",
    url: `/treatments/${treatmentId}/photos/`,
    data: form,
    headers: { "Content-Type": "multipart/form-data" },
  });
}

// ---------------------------------------------------------------------------
// Human-readable labels
// ---------------------------------------------------------------------------
export const TOOTH_PROCEDURE_LABELS: Record<ToothProcedure, string> = {
  filling: "Plomba",
  root_canal: "Kanal davolash",
  extraction: "Olib tashlash",
  crown: "Koronka",
  implant: "Implant",
  cleaning: "Tozalash",
  whitening: "Oqartirish",
};

export const TOOTH_STATUS_LABELS: Record<ToothStatus, string> = {
  healthy: "Sog'lom",
  treated: "Davolangan",
  missing: "Yo'q",
  planned: "Rejalashtirilgan",
};

export const PHOTO_TYPE_LABELS: Record<PhotoType, string> = {
  before: "Davolashdan oldin",
  after: "Davolashdan keyin",
  xray: "Rentgen",
};

export const STAGE_LABELS: Record<TreatmentStage, string> = {
  in_progress: "Davom etmoqda",
  completed: "Yakunlangan",
};

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  unpaid: "To'lanmagan",
  partial: "Qisman to'langan",
  paid: "To'langan",
};

/** Sorted FDI tooth numbers for form dropdowns. */
export const FDI_TOOTH_NUMBERS: readonly number[] = [
  11, 12, 13, 14, 15, 16, 17, 18, 21, 22, 23, 24, 25, 26, 27, 28, 31, 32, 33,
  34, 35, 36, 37, 38, 41, 42, 43, 44, 45, 46, 47, 48,
];
