/**
 * Inventory API — mirrors ``/api/v1/materials/`` on the backend.
 *
 * All payloads use camelCase, matching
 * :class:`apps.inventory.serializers.MaterialSerializer` on the server.
 * Stock quantities and prices are transported as strings ("50.000",
 * "120000.00") so the Decimal precision from the backend round-trips
 * without lossy IEEE-754 truncation.
 */
import { request } from "./client";
import type { Paginated } from "@/types";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export type MaterialUnit = "gram" | "piece" | "ml";
export type StockChangeReason = "usage" | "restock" | "adjustment";

export interface Material {
  id: string;
  name: string;
  unit: MaterialUnit;
  /** Decimal string — e.g. "50.000". */
  quantityInStock: string;
  /** Decimal string — e.g. "10.000". */
  minimumThreshold: string;
  /** Decimal string — e.g. "120000.00" — or null when not set. */
  unitCost: string | null;
  notes: string;
  isBelowThreshold: boolean;
  isActive: boolean;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface MaterialListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  belowThreshold?: boolean;
  includeInactive?: boolean;
  unit?: MaterialUnit;
  ordering?: string;
}

export interface MaterialInput {
  name: string;
  unit: MaterialUnit;
  quantityInStock?: string;
  minimumThreshold?: string;
  unitCost?: string | null;
  notes?: string;
  isActive?: boolean;
}

export interface MaterialStockLog {
  id: string;
  materialId: string;
  changeAmount: string;
  reason: StockChangeReason;
  resultingQuantity: string;
  relatedTreatmentId: string | null;
  relatedUsageId: string | null;
  performedBy: {
    id: string;
    firstName: string;
    lastName: string;
  } | null;
  note: string;
  createdAt: string | null;
}

export interface RestockInput {
  amount: string;
  note?: string;
}

// ---------------------------------------------------------------------------
// Query-string builder
// ---------------------------------------------------------------------------
function buildParams(input: MaterialListParams): Record<string, string> {
  const params: Record<string, string> = {};
  if (input.page && input.page > 0) params["page"] = String(input.page);
  if (input.pageSize && input.pageSize > 0) params["page_size"] = String(input.pageSize);
  if (input.search && input.search.trim()) params["search"] = input.search.trim();
  if (input.belowThreshold) params["below_threshold"] = "true";
  if (input.includeInactive) params["include_inactive"] = "true";
  if (input.unit) params["unit"] = input.unit;
  if (input.ordering) params["ordering"] = input.ordering;
  return params;
}

// ---------------------------------------------------------------------------
// Endpoints
// ---------------------------------------------------------------------------
export function listMaterials(
  input: MaterialListParams = {},
): Promise<Paginated<Material>> {
  return request<Paginated<Material>>({
    method: "GET",
    url: "/materials/",
    params: buildParams(input),
  });
}

export function getMaterial(id: string): Promise<Material> {
  return request<Material>({
    method: "GET",
    url: `/materials/${id}/`,
  });
}

export function createMaterial(input: MaterialInput): Promise<Material> {
  return request<Material>({
    method: "POST",
    url: "/materials/",
    data: input,
  });
}

export function updateMaterial(
  id: string,
  input: Partial<MaterialInput>,
): Promise<Material> {
  return request<Material>({
    method: "PATCH",
    url: `/materials/${id}/`,
    data: input,
  });
}

export function deleteMaterial(id: string): Promise<void> {
  return request<void>({
    method: "DELETE",
    url: `/materials/${id}/`,
  });
}

export function restockMaterial(id: string, input: RestockInput): Promise<Material> {
  return request<Material>({
    method: "PATCH",
    url: `/materials/${id}/restock/`,
    data: input,
  });
}

export function listMaterialLogs(
  id: string,
  page = 1,
  pageSize = 20,
): Promise<Paginated<MaterialStockLog>> {
  return request<Paginated<MaterialStockLog>>({
    method: "GET",
    url: `/materials/${id}/logs/`,
    params: { page: String(page), page_size: String(pageSize) },
  });
}
