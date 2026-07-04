/**
 * TanStack Query hooks for the treatments resource.
 *
 * ``patientsKeys`` is invalidated on every mutation because the patient
 * detail view (timeline, odontogram, balance) reflects treatment data.
 */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createToothRecord,
  createTreatment,
  deleteTreatment,
  getTreatment,
  listToothRecords,
  listTreatmentPhotos,
  listTreatments,
  updateTreatment,
  uploadTreatmentPhoto,
  type PhotoUploadInput,
  type ToothRecord,
  type ToothRecordInput,
  type TreatmentInput,
  type TreatmentListParams,
  type TreatmentPhoto,
  type TreatmentRecord,
  type TreatmentUpdateInput,
} from "@/api/treatments";
import type { Paginated } from "@/types";

// ---------------------------------------------------------------------------
// Query keys
// ---------------------------------------------------------------------------
export const treatmentsKeys = {
  all: ["treatments"] as const,
  lists: () => [...treatmentsKeys.all, "list"] as const,
  list: (params: TreatmentListParams) =>
    [...treatmentsKeys.lists(), params] as const,
  details: () => [...treatmentsKeys.all, "detail"] as const,
  detail: (id: string) => [...treatmentsKeys.details(), id] as const,
  photos: (id: string) => [...treatmentsKeys.detail(id), "photos"] as const,
  toothRecords: (id: string) =>
    [...treatmentsKeys.detail(id), "tooth-records"] as const,
};

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------
export function useTreatments(params: TreatmentListParams = {}) {
  return useQuery<Paginated<TreatmentRecord>>({
    queryKey: treatmentsKeys.list(params),
    queryFn: () => listTreatments(params),
    placeholderData: (previous) => previous,
  });
}

export function useTreatment(id: string | undefined) {
  return useQuery<TreatmentRecord>({
    queryKey: id ? treatmentsKeys.detail(id) : ["treatments", "disabled"],
    queryFn: () => getTreatment(id as string),
    enabled: Boolean(id),
  });
}

export function useTreatmentPhotos(id: string | undefined) {
  return useQuery<TreatmentPhoto[]>({
    queryKey: id ? treatmentsKeys.photos(id) : ["treatments", "photos", "disabled"],
    queryFn: () => listTreatmentPhotos(id as string),
    enabled: Boolean(id),
  });
}

export function useToothRecords(id: string | undefined) {
  return useQuery<ToothRecord[]>({
    queryKey: id
      ? treatmentsKeys.toothRecords(id)
      : ["treatments", "tooth-records", "disabled"],
    queryFn: () => listToothRecords(id as string),
    enabled: Boolean(id),
  });
}

// ---------------------------------------------------------------------------
// Mutations
// ---------------------------------------------------------------------------
function invalidatePatientScopedQueries(
  qc: ReturnType<typeof useQueryClient>,
  patientId: string | undefined,
): void {
  qc.invalidateQueries({ queryKey: treatmentsKeys.lists() });
  if (patientId) {
    qc.invalidateQueries({ queryKey: ["patients", patientId] });
    qc.invalidateQueries({
      queryKey: ["payments", "patient-balance", patientId],
    });
  }
}

export function useCreateTreatment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: TreatmentInput) => createTreatment(input),
    onSuccess: (treatment) => {
      invalidatePatientScopedQueries(qc, treatment.patientId);
      qc.setQueryData(treatmentsKeys.detail(treatment.id), treatment);
    },
  });
}

export function useUpdateTreatment(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: TreatmentUpdateInput) => updateTreatment(id, input),
    onSuccess: (treatment) => {
      invalidatePatientScopedQueries(qc, treatment.patientId);
      qc.setQueryData(treatmentsKeys.detail(id), treatment);
    },
  });
}

export function useDeleteTreatment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteTreatment(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: treatmentsKeys.lists() });
    },
  });
}

export function useCreateToothRecord(treatmentId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: ToothRecordInput) =>
      createToothRecord(treatmentId, input),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: treatmentsKeys.toothRecords(treatmentId),
      });
      qc.invalidateQueries({ queryKey: treatmentsKeys.detail(treatmentId) });
    },
  });
}

export function useUploadTreatmentPhoto(treatmentId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: PhotoUploadInput) =>
      uploadTreatmentPhoto(treatmentId, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: treatmentsKeys.photos(treatmentId) });
      qc.invalidateQueries({ queryKey: treatmentsKeys.detail(treatmentId) });
    },
  });
}
