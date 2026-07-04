/**
 * TanStack Query hooks for the doctors resource.
 */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createDoctor,
  deleteDoctor,
  getDoctor,
  listDoctors,
  updateDoctor,
  type DoctorCreateInput,
  type DoctorListParams,
  type DoctorRecord,
  type DoctorUpdateInput,
} from "@/api/doctors";
import type { Paginated } from "@/types";

export const doctorsKeys = {
  all: ["doctors"] as const,
  lists: () => [...doctorsKeys.all, "list"] as const,
  list: (params: DoctorListParams) => [...doctorsKeys.lists(), params] as const,
  details: () => [...doctorsKeys.all, "detail"] as const,
  detail: (id: string) => [...doctorsKeys.details(), id] as const,
};

export function useDoctors(params: DoctorListParams = {}) {
  return useQuery<Paginated<DoctorRecord>>({
    queryKey: doctorsKeys.list(params),
    queryFn: () => listDoctors(params),
    placeholderData: (previous) => previous,
  });
}

export function useDoctor(id: string | undefined) {
  return useQuery<DoctorRecord>({
    queryKey: id ? doctorsKeys.detail(id) : ["doctors", "disabled"],
    queryFn: () => getDoctor(id as string),
    enabled: Boolean(id),
  });
}

export function useCreateDoctor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: DoctorCreateInput) => createDoctor(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: doctorsKeys.lists() });
    },
  });
}

export function useUpdateDoctor(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: DoctorUpdateInput) => updateDoctor(id, input),
    onSuccess: (updated) => {
      qc.invalidateQueries({ queryKey: doctorsKeys.lists() });
      qc.setQueryData(doctorsKeys.detail(id), updated);
    },
  });
}

export function useDeleteDoctor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteDoctor(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: doctorsKeys.lists() });
    },
  });
}

// ---------------------------------------------------------------------------
// Nested — working hours + time off + available slots
// ---------------------------------------------------------------------------
import {
  createTimeOff,
  createWorkingHour,
  deleteTimeOff,
  deleteWorkingHour,
  getAvailableSlots,
  listTimeOff,
  listWorkingHours,
  type AvailableSlotsResponse,
  type DoctorTimeOff,
  type DoctorWorkingHour,
  type TimeOffInput,
  type WorkingHourInput,
} from "@/api/doctors";

export const doctorScheduleKeys = {
  workingHours: (doctorId: string) =>
    [...doctorsKeys.detail(doctorId), "working-hours"] as const,
  timeOff: (doctorId: string) =>
    [...doctorsKeys.detail(doctorId), "time-off"] as const,
  slots: (doctorId: string, date: string) =>
    [...doctorsKeys.detail(doctorId), "slots", date] as const,
};

export function useWorkingHours(doctorId: string | undefined) {
  return useQuery<DoctorWorkingHour[]>({
    queryKey: doctorId
      ? doctorScheduleKeys.workingHours(doctorId)
      : ["doctor-working-hours", "disabled"],
    queryFn: () => listWorkingHours(doctorId as string),
    enabled: Boolean(doctorId),
  });
}

export function useCreateWorkingHour(doctorId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: WorkingHourInput) => createWorkingHour(doctorId, input),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: doctorScheduleKeys.workingHours(doctorId),
      });
      // Doctor detail response embeds working hours — refresh that too.
      qc.invalidateQueries({ queryKey: doctorsKeys.detail(doctorId) });
    },
  });
}

export function useDeleteWorkingHour(doctorId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (entryId: string) => deleteWorkingHour(doctorId, entryId),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: doctorScheduleKeys.workingHours(doctorId),
      });
      qc.invalidateQueries({ queryKey: doctorsKeys.detail(doctorId) });
    },
  });
}

export function useTimeOff(doctorId: string | undefined) {
  return useQuery<DoctorTimeOff[]>({
    queryKey: doctorId
      ? doctorScheduleKeys.timeOff(doctorId)
      : ["doctor-time-off", "disabled"],
    queryFn: () => listTimeOff(doctorId as string),
    enabled: Boolean(doctorId),
  });
}

export function useCreateTimeOff(doctorId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: TimeOffInput) => createTimeOff(doctorId, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: doctorScheduleKeys.timeOff(doctorId) });
    },
  });
}

export function useDeleteTimeOff(doctorId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (entryId: string) => deleteTimeOff(doctorId, entryId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: doctorScheduleKeys.timeOff(doctorId) });
    },
  });
}

export function useAvailableSlots(
  doctorId: string | undefined,
  date: string | undefined,
  slotMinutes = 30,
) {
  return useQuery<AvailableSlotsResponse>({
    queryKey:
      doctorId && date
        ? doctorScheduleKeys.slots(doctorId, date)
        : ["doctor-slots", "disabled"],
    queryFn: () => getAvailableSlots(doctorId as string, date as string, slotMinutes),
    enabled: Boolean(doctorId && date),
  });
}
