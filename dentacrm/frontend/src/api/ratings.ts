/**
 * Ratings API — mirrors ``/api/v1/ratings/leaderboard/`` and
 * ``/api/v1/doctors/{id}/badges/``.
 */
import { request } from "./client";

export interface LeaderboardEntry {
  doctorId: string;
  firstName: string;
  lastName: string;
  specialization: string;
  totalPoints: number;
  entries: number;
  rank: number;
}

export interface DoctorBadge {
  id: string;
  doctorId: string;
  badge: {
    id: string;
    slug: string;
    name: string;
    description: string;
    icon: string;
  };
  period: string;
  awardedAt: string;
  totalPoints: number;
}

export function getLeaderboard(period?: string): Promise<LeaderboardEntry[]> {
  return request<LeaderboardEntry[]>({
    method: "GET",
    url: "/ratings/leaderboard/",
    params: period ? { period } : undefined,
  });
}

export function getDoctorBadges(doctorId: string): Promise<DoctorBadge[]> {
  return request<DoctorBadge[]>({
    method: "GET",
    url: `/doctors/${doctorId}/badges/`,
  });
}
