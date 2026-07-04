/**
 * TanStack Query hooks for the appointments resource.
 */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  cancelAppointment,
  createAppointment,
  getAppointment,
  getAvailableSlots,
  listAppointments,
  updateAppointment,
  type AppointmentInput,
  type AppointmentListParams,
  type AppointmentRecord,
  type AvailableSlot,
} from "@/api/appointments";
import type { AppointmentStatus, Paginated } from "@/types";

export const appointmentsKeys = {
  all: ["appointments"] as const,
  lists: () => [...appointmentsKeys.all, "list"] as const,
  list: (params: AppointmentListParams) =>
    [...appointmentsKeys.lists(), params] as const,
  detail: (id: string) => [...appointmentsKeys.all, "detail", id] as const,
  slots: (doctorId: string, date: string) =>
    [...appointmentsKeys.all, "slots", doctorId, date] as const,
};

export function useAppointments(params: AppointmentListParams = {}) {
  return useQuery<Paginated<AppointmentRecord>>({
    queryKey: appointmentsKeys.list(params),
    queryFn: () => listAppointments(params),
    placeholderData: (previous) => previous,
  });
}

export function useAppointment(id: string | undefined) {
  return useQuery<AppointmentRecord>({
    queryKey: id
      ? appointmentsKeys.detail(id)
      : ["appointments", "disabled"],
    queryFn: () => getAppointment(id as string),
    enabled: Boolean(id),
  });
}

export function useAvailableSlots(
  doctorId: string | undefined,
  date: string | undefined,
) {
  return useQuery<AvailableSlot[]>({
    queryKey:
      doctorId && date
        ? appointmentsKeys.slots(doctorId, date)
        : ["appointments", "slots", "disabled"],
    queryFn: () => getAvailableSlots(doctorId as string, date as string),
    enabled: Boolean(doctorId && date),
  });
}

export function useCreateAppointment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: AppointmentInput) => createAppointment(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: appointmentsKeys.lists() });
    },
  });
}

export function useUpdateAppointmentStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: { id: string; status: AppointmentStatus }) =>
      updateAppointment(input.id, { status: input.status }),
    onSuccess: (updated) => {
      qc.invalidateQueries({ queryKey: appointmentsKeys.lists() });
      qc.setQueryData(appointmentsKeys.detail(updated.id), updated);
    },
  });
}

export function useCancelAppointment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => cancelAppointment(id),
    onSuccess: (updated) => {
      qc.invalidateQueries({ queryKey: appointmentsKeys.lists() });
      qc.setQueryData(appointmentsKeys.detail(updated.id), updated);
    },
  });
}
