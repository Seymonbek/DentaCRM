/**
 * TanStack Query hooks for the ``payments`` resource.
 *
 * Query keys are centralised in :data:`paymentsKeys` so mutation
 * ``onSuccess`` handlers can invalidate every affected slice without
 * hand-rolling key arrays.
 */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createPayment,
  getDoctorCommissionsSummary,
  getPatientBalance,
  getPayment,
  listDoctorCommissions,
  listPayments,
  voidPayment,
  type CommissionRangeParams,
  type PaymentInput,
  type PaymentListParams,
} from "@/api/payments";
import type {
  CommissionRecord,
  CommissionSummary,
  Paginated,
  PatientBalance,
  Payment,
} from "@/types";

// ---------------------------------------------------------------------------
// Query keys
// ---------------------------------------------------------------------------
export const paymentsKeys = {
  all: ["payments"] as const,
  lists: () => [...paymentsKeys.all, "list"] as const,
  list: (params: PaymentListParams) =>
    [...paymentsKeys.lists(), params] as const,
  details: () => [...paymentsKeys.all, "detail"] as const,
  detail: (id: string) => [...paymentsKeys.details(), id] as const,
  patientBalance: (patientId: string) =>
    [...paymentsKeys.all, "patient-balance", patientId] as const,
  doctorCommissions: (doctorId: string, range: CommissionRangeParams) =>
    [...paymentsKeys.all, "doctor-commissions", doctorId, range] as const,
  doctorCommissionsSummary: (
    doctorId: string,
    range: CommissionRangeParams,
  ) => [...paymentsKeys.all, "doctor-commissions-summary", doctorId, range] as const,
};

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------
export function usePayments(params: PaymentListParams = {}) {
  return useQuery<Paginated<Payment>>({
    queryKey: paymentsKeys.list(params),
    queryFn: () => listPayments(params),
    placeholderData: (previous) => previous,
  });
}

export function usePayment(id: string | undefined) {
  return useQuery<Payment>({
    queryKey: id ? paymentsKeys.detail(id) : ["payments", "disabled"],
    queryFn: () => getPayment(id as string),
    enabled: Boolean(id),
  });
}

export function usePatientBalance(patientId: string | undefined) {
  return useQuery<PatientBalance>({
    queryKey: patientId
      ? paymentsKeys.patientBalance(patientId)
      : ["payments", "patient-balance", "disabled"],
    queryFn: () => getPatientBalance(patientId as string),
    enabled: Boolean(patientId),
  });
}

export function useDoctorCommissions(
  doctorId: string | undefined,
  range: CommissionRangeParams = {},
) {
  return useQuery<CommissionRecord[]>({
    queryKey: doctorId
      ? paymentsKeys.doctorCommissions(doctorId, range)
      : ["payments", "doctor-commissions", "disabled"],
    queryFn: () => listDoctorCommissions(doctorId as string, range),
    enabled: Boolean(doctorId),
  });
}

export function useDoctorCommissionsSummary(
  doctorId: string | undefined,
  range: CommissionRangeParams = {},
) {
  return useQuery<CommissionSummary>({
    queryKey: doctorId
      ? paymentsKeys.doctorCommissionsSummary(doctorId, range)
      : ["payments", "doctor-commissions-summary", "disabled"],
    queryFn: () => getDoctorCommissionsSummary(doctorId as string, range),
    enabled: Boolean(doctorId),
  });
}

// ---------------------------------------------------------------------------
// Mutations
// ---------------------------------------------------------------------------
export function useCreatePayment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: PaymentInput) => createPayment(input),
    onSuccess: (payment) => {
      qc.invalidateQueries({ queryKey: paymentsKeys.lists() });
      qc.invalidateQueries({
        queryKey: paymentsKeys.patientBalance(payment.patientId),
      });
    },
  });
}

export function useVoidPayment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => voidPayment(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: paymentsKeys.lists() });
      qc.invalidateQueries({
        queryKey: [...paymentsKeys.all, "patient-balance"],
      });
    },
  });
}
