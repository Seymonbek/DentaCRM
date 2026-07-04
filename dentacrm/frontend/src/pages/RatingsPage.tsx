import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";

import { getLeaderboard, type LeaderboardEntry } from "@/api/ratings";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";

export function RatingsPage(): JSX.Element {
  const currentMonth = format(new Date(), "yyyy-MM");
  const [period, setPeriod] = useState<string>(currentMonth);

  const leaderboard = useQuery<LeaderboardEntry[]>({
    queryKey: ["ratings", "leaderboard", period],
    queryFn: () => getLeaderboard(period || undefined),
  });

  return (
    <section aria-labelledby="page-title" className="mx-auto max-w-4xl">
      <div className="mb-6">
        <h1
          id="page-title"
          className="text-2xl font-semibold text-slate-900"
        >
          Reyting
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Shifokorlarning oylik ballari va reyting o'rni.
        </p>
      </div>

      <div className="mb-4 flex items-end gap-3">
        <div>
          <Label htmlFor="period">Davr (YYYY-MM)</Label>
          <Input
            id="period"
            type="month"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
          />
        </div>
      </div>

      {leaderboard.isLoading && (
        <div className="space-y-2" aria-hidden="true">
          <Skeleton className="h-14" />
          <Skeleton className="h-14" />
          <Skeleton className="h-14" />
        </div>
      )}

      {!leaderboard.isLoading && (leaderboard.data ?? []).length === 0 && (
        <EmptyState
          title="Ma'lumot yo'q"
          description="Tanlangan davr uchun reyting bo'sh."
        />
      )}

      {!leaderboard.isLoading && (leaderboard.data ?? []).length > 0 && (
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">O'rni</th>
                <th className="px-4 py-3">Shifokor</th>
                <th className="px-4 py-3">Mutaxassislik</th>
                <th className="px-4 py-3 text-right">Yozuvlar</th>
                <th className="px-4 py-3 text-right">Ballar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {leaderboard.data?.map((row) => (
                <tr key={row.doctorId} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-semibold text-slate-900">
                    {row.rank}
                  </td>
                  <td className="px-4 py-3 text-slate-900">
                    {row.firstName} {row.lastName}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {row.specialization || "—"}
                  </td>
                  <td className="px-4 py-3 text-right text-slate-600">
                    {row.entries}
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-brand-700">
                    {row.totalPoints}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
