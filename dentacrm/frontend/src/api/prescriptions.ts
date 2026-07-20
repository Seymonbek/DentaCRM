/**
 * Prescriptions and Prescription Templates API.
 */
import { request } from "./client";
import type { Paginated } from "@/types";

export interface PrescriptionTemplate {
  id: string;
  name: string;
  content: string;
  isActive: boolean;
  createdBy?: {
    id: string;
    firstName: string;
    lastName: string;
  } | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface Prescription {
  id: string;
  treatmentId: string;
  templateId: string | null;
  templateName: string | null;
  content: string;
  sentToTelegramAt: string | null;
  isSent: boolean;
  isActive: boolean;
  createdAt: string | null;
  createdBy?: {
    id: string;
    firstName: string;
    lastName: string;
  } | null;
}

export interface PrescriptionTemplateInput {
  name: string;
  content: string;
  isActive?: boolean;
}

export interface IssuePrescriptionInput {
  templateId?: string | null;
  content?: string;
  send?: boolean;
}

export function listPrescriptionTemplates(params?: {
  includeInactive?: boolean;
  search?: string;
}): Promise<PrescriptionTemplate[]> {
  // templates endpoint is non-paginated or custom-filtered
  return request<PrescriptionTemplate[]>({
    method: "GET",
    url: "/prescription-templates/",
    params: params ? {
      include_inactive: params.includeInactive ? "true" : undefined,
      search: params.search,
    } : undefined,
  });
}

export function createPrescriptionTemplate(
  input: PrescriptionTemplateInput,
): Promise<PrescriptionTemplate> {
  return request<PrescriptionTemplate>({
    method: "POST",
    url: "/prescription-templates/",
    data: input,
  });
}

export function updatePrescriptionTemplate(
  id: string,
  input: Partial<PrescriptionTemplateInput>,
): Promise<PrescriptionTemplate> {
  return request<PrescriptionTemplate>({
    method: "PATCH",
    url: `/prescription-templates/${id}/`,
    data: input,
  });
}

export function deletePrescriptionTemplate(id: string): Promise<void> {
  return request<void>({
    method: "DELETE",
    url: `/prescription-templates/${id}/`,
  });
}

export function listPrescriptions(params: {
  treatment?: string;
  patient?: string;
  doctor?: string;
  isSent?: boolean;
  page?: number;
  pageSize?: number;
}): Promise<Paginated<Prescription>> {
  return request<Paginated<Prescription>>({
    method: "GET",
    url: "/prescriptions/",
    params: {
      treatment: params.treatment,
      patient: params.patient,
      doctor: params.doctor,
      is_sent: params.isSent !== undefined ? String(params.isSent) : undefined,
      page: params.page,
      page_size: params.pageSize,
    },
  });
}

export function issuePrescription(
  treatmentId: string,
  input: IssuePrescriptionInput,
): Promise<Prescription> {
  return request<Prescription>({
    method: "POST",
    url: `/treatments/${treatmentId}/prescription/`,
    data: input,
  });
}

export function deletePrescription(id: string): Promise<void> {
  return request<void>({
    method: "DELETE",
    url: `/prescriptions/${id}/`,
  });
}
