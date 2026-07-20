/**
 * TanStack Query hooks for prescriptions and prescription templates.
 */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  listPrescriptionTemplates,
  createPrescriptionTemplate,
  updatePrescriptionTemplate,
  deletePrescriptionTemplate,
  listPrescriptions,
  issuePrescription,
  deletePrescription,
  type PrescriptionTemplateInput,
  type IssuePrescriptionInput,
  type PrescriptionTemplate,
  type Prescription,
} from "@/api/prescriptions";
import type { Paginated } from "@/types";

export const prescriptionsKeys = {
  all: ["prescriptions"] as const,
  lists: () => [...prescriptionsKeys.all, "list"] as const,
  list: (params: Parameters<typeof listPrescriptions>[0]) =>
    [...prescriptionsKeys.lists(), params] as const,
  templatesAll: ["prescription-templates"] as const,
  templatesLists: () => [...prescriptionsKeys.templatesAll, "list"] as const,
  templatesList: (params?: Parameters<typeof listPrescriptionTemplates>[0]) =>
    [...prescriptionsKeys.templatesLists(), params] as const,
};

export function usePrescriptionTemplates(params?: Parameters<typeof listPrescriptionTemplates>[0]) {
  return useQuery<PrescriptionTemplate[]>({
    queryKey: prescriptionsKeys.templatesList(params),
    queryFn: () => listPrescriptionTemplates(params),
  });
}

export function useCreatePrescriptionTemplate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: PrescriptionTemplateInput) => createPrescriptionTemplate(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: prescriptionsKeys.templatesLists() });
    },
  });
}

export function useUpdatePrescriptionTemplate(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: Partial<PrescriptionTemplateInput>) =>
      updatePrescriptionTemplate(id, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: prescriptionsKeys.templatesLists() });
    },
  });
}

export function useDeletePrescriptionTemplate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deletePrescriptionTemplate(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: prescriptionsKeys.templatesLists() });
    },
  });
}

export function usePrescriptions(params: Parameters<typeof listPrescriptions>[0]) {
  return useQuery<Paginated<Prescription>>({
    queryKey: prescriptionsKeys.list(params),
    queryFn: () => listPrescriptions(params),
    placeholderData: (previous) => previous,
  });
}

export function useIssuePrescription(treatmentId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: IssuePrescriptionInput) => issuePrescription(treatmentId, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: prescriptionsKeys.lists() });
      qc.invalidateQueries({ queryKey: ["patients"] }); // to update timeline
      qc.invalidateQueries({ queryKey: ["treatments", "detail", treatmentId] });
    },
  });
}

export function useDeletePrescription() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deletePrescription(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: prescriptionsKeys.lists() });
      qc.invalidateQueries({ queryKey: ["patients"] });
    },
  });
}
