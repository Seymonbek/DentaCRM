/**
 * TanStack Query hooks for the departments resource.
 */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createDepartment,
  deleteDepartment,
  getDepartment,
  listDepartments,
  updateDepartment,
  type Department,
  type DepartmentInput,
  type DepartmentListParams,
} from "@/api/departments";
import type { Paginated } from "@/types";

// ---------------------------------------------------------------------------
// Query keys
// ---------------------------------------------------------------------------
export const departmentsKeys = {
  all: ["departments"] as const,
  lists: () => [...departmentsKeys.all, "list"] as const,
  list: (params: DepartmentListParams) =>
    [...departmentsKeys.lists(), params] as const,
  details: () => [...departmentsKeys.all, "detail"] as const,
  detail: (id: string) => [...departmentsKeys.details(), id] as const,
};

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------
export function useDepartments(params: DepartmentListParams = {}) {
  return useQuery<Paginated<Department>>({
    queryKey: departmentsKeys.list(params),
    queryFn: () => listDepartments(params),
    placeholderData: (previous) => previous,
  });
}

export function useDepartment(id: string | undefined) {
  return useQuery<Department>({
    queryKey: id ? departmentsKeys.detail(id) : ["departments", "disabled"],
    queryFn: () => getDepartment(id as string),
    enabled: Boolean(id),
  });
}

// ---------------------------------------------------------------------------
// Mutations
// ---------------------------------------------------------------------------
export function useCreateDepartment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: DepartmentInput) => createDepartment(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: departmentsKeys.lists() });
    },
  });
}

export function useUpdateDepartment(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: Partial<DepartmentInput>) => updateDepartment(id, input),
    onSuccess: (updated) => {
      qc.invalidateQueries({ queryKey: departmentsKeys.lists() });
      qc.setQueryData(departmentsKeys.detail(id), updated);
    },
  });
}

export function useDeleteDepartment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteDepartment(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: departmentsKeys.lists() });
    },
  });
}
