/**
 * Departments API — mirrors ``/api/v1/departments/``.
 *
 * The backend serializer returns camelCase payloads
 * (:mod:`apps.departments.serializers.DepartmentSerializer`); we accept
 * the same shape on the way back in so the request/response round-trip
 * stays symmetric.
 */
import { request } from "./client";
import type { Paginated } from "@/types";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface DepartmentActor {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

export interface Department {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: string | null;
  updatedAt: string | null;
  createdBy: DepartmentActor | null;
}

export interface DepartmentListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  includeInactive?: boolean;
  ordering?: string;
}

export interface DepartmentInput {
  name: string;
  description?: string;
  isActive?: boolean;
}

// ---------------------------------------------------------------------------
// Endpoints
// ---------------------------------------------------------------------------
function buildParams(input: DepartmentListParams): Record<string, string> {
  const params: Record<string, string> = {};
  if (input.page && input.page > 0) params["page"] = String(input.page);
  if (input.pageSize && input.pageSize > 0) params["page_size"] = String(input.pageSize);
  if (input.search && input.search.trim()) params["search"] = input.search.trim();
  if (input.includeInactive) params["include_inactive"] = "true";
  if (input.ordering) params["ordering"] = input.ordering;
  return params;
}

export function listDepartments(
  input: DepartmentListParams = {},
): Promise<Paginated<Department>> {
  return request<Paginated<Department>>({
    method: "GET",
    url: "/departments/",
    params: buildParams(input),
  });
}

export function getDepartment(id: string): Promise<Department> {
  return request<Department>({
    method: "GET",
    url: `/departments/${id}/`,
  });
}

export function createDepartment(input: DepartmentInput): Promise<Department> {
  return request<Department>({
    method: "POST",
    url: "/departments/",
    data: input,
  });
}

export function updateDepartment(
  id: string,
  input: Partial<DepartmentInput>,
): Promise<Department> {
  return request<Department>({
    method: "PATCH",
    url: `/departments/${id}/`,
    data: input,
  });
}

export function deleteDepartment(id: string): Promise<void> {
  return request<void>({
    method: "DELETE",
    url: `/departments/${id}/`,
  });
}
