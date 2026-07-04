/**
 * TanStack Query hooks for the patients resource.
 */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createPatient,
  deletePatient,
  getPatient,
  listPatients,
  updatePatient,
  type PatientInput,
  type PatientListParams,
  type PatientRecord,
} from "@/api/patients";
import type { Paginated } from "@/types";

export const patientsKeys = {
  all: ["patients"] as const,
  lists: () => [...patientsKeys.all, "list"] as const,
  list: (params: PatientListParams) => [...patientsKeys.lists(), params] as const,
  details: () => [...patientsKeys.all, "detail"] as const,
  detail: (id: string) => [...patientsKeys.details(), id] as const,
};

export function usePatients(params: PatientListParams = {}) {
  return useQuery<Paginated<PatientRecord>>({
    queryKey: patientsKeys.list(params),
    queryFn: () => listPatients(params),
    placeholderData: (previous) => previous,
  });
}

export function usePatient(id: string | undefined) {
  return useQuery<PatientRecord>({
    queryKey: id ? patientsKeys.detail(id) : ["patients", "disabled"],
    queryFn: () => getPatient(id as string),
    enabled: Boolean(id),
  });
}

export function useCreatePatient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: PatientInput) => createPatient(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: patientsKeys.lists() });
    },
  });
}

export function useUpdatePatient(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: Partial<PatientInput>) => updatePatient(id, input),
    onSuccess: (updated) => {
      qc.invalidateQueries({ queryKey: patientsKeys.lists() });
      qc.setQueryData(patientsKeys.detail(id), updated);
    },
  });
}

export function useDeletePatient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deletePatient(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: patientsKeys.lists() });
    },
  });
}
