/**
 * TanStack Query hooks for the ``inventory`` resource.
 *
 * Keeps query-key shapes centralised (``materialsKeys``) so cache
 * invalidation stays consistent across create / update / restock /
 * delete mutations.
 */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createMaterial,
  deleteMaterial,
  getMaterial,
  listMaterialLogs,
  listMaterials,
  restockMaterial,
  updateMaterial,
  type Material,
  type MaterialInput,
  type MaterialListParams,
  type MaterialStockLog,
  type RestockInput,
} from "@/api/inventory";
import type { Paginated } from "@/types";

// ---------------------------------------------------------------------------
// Query keys
// ---------------------------------------------------------------------------
export const materialsKeys = {
  all: ["materials"] as const,
  lists: () => [...materialsKeys.all, "list"] as const,
  list: (params: MaterialListParams) =>
    [...materialsKeys.lists(), params] as const,
  details: () => [...materialsKeys.all, "detail"] as const,
  detail: (id: string) => [...materialsKeys.details(), id] as const,
  logs: (id: string, page: number, pageSize: number) =>
    [...materialsKeys.detail(id), "logs", page, pageSize] as const,
};

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------
export function useMaterials(params: MaterialListParams = {}) {
  return useQuery<Paginated<Material>>({
    queryKey: materialsKeys.list(params),
    queryFn: () => listMaterials(params),
    placeholderData: (previous) => previous,
  });
}

export function useMaterial(id: string | undefined) {
  return useQuery<Material>({
    queryKey: id ? materialsKeys.detail(id) : ["materials", "disabled"],
    queryFn: () => getMaterial(id as string),
    enabled: Boolean(id),
  });
}

export function useMaterialLogs(
  id: string | undefined,
  page = 1,
  pageSize = 20,
) {
  return useQuery<Paginated<MaterialStockLog>>({
    queryKey: id ? materialsKeys.logs(id, page, pageSize) : ["materials", "logs", "disabled"],
    queryFn: () => listMaterialLogs(id as string, page, pageSize),
    enabled: Boolean(id),
  });
}

// ---------------------------------------------------------------------------
// Mutations
// ---------------------------------------------------------------------------
export function useCreateMaterial() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: MaterialInput) => createMaterial(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: materialsKeys.lists() });
    },
  });
}

export function useUpdateMaterial(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: Partial<MaterialInput>) => updateMaterial(id, input),
    onSuccess: (updated) => {
      qc.invalidateQueries({ queryKey: materialsKeys.lists() });
      qc.setQueryData(materialsKeys.detail(id), updated);
    },
  });
}

export function useDeleteMaterial() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteMaterial(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: materialsKeys.lists() });
    },
  });
}

export function useRestockMaterial(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: RestockInput) => restockMaterial(id, input),
    onSuccess: (updated) => {
      qc.invalidateQueries({ queryKey: materialsKeys.lists() });
      qc.setQueryData(materialsKeys.detail(id), updated);
      qc.invalidateQueries({ queryKey: materialsKeys.detail(id) });
    },
  });
}
