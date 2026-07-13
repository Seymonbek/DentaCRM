import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Medal, Trophy } from "lucide-react";

import { getLeaderboard, type LeaderboardEntry } from "@/api/ratings";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { PageHeader } from "@/components/layout/PageHeader";
import { cn } from "@/lib/utils";

const MEDAL_COLORS = [
  "text-yellow-500",  // 1st
  "text-slate-400",   // 2nd
  "text-amber-600",   // 3rd
];

export function RatingsPage(): JSX.Element {
  const currentMonth = format(new Date(), "yyyy-MM");
  const [period, setPeriod] = useState<string>(currentMonth);

  const leaderboard = useQuery<LeaderboardEntry[]>({
    queryKey: ["ratings", "leaderboard", period],
    queryFn:  () => getLeaderboard(period || undefined),
  });

  const rows = leaderboard.data ?? [];

  return (
    <section aria-labelledby="ratings-title" className="max-w-3xl space-y-6">
      <PageHeader
        title="Reyting"
        description="Shifokorlarning oylik ballari va reyting o'rni."
        actions={
          <div>
            <Label htmlFor="rating-period" className="sr-only">Davr</Label>
            <Input
              id="rating-period"
              type="month"
              value={period}
              className="w-44"
              onChange={(e) => setPeriod(e.target.value)}
            />
          </div>
        }
      />

      {/* Podium — top 3 */}
      {!leaderboard.isLoading && rows.length >= 3 && (
        <div className="grid grid-cols-3 gap-3">
          {rows.slice(0, 3).map((row, i) => (
            <div
              key={row.doctorId}
              className={cn(
                "card flex flex-col items-center gap-2 p-5 text-center",
                i === 0 ? "ring-2 ring-yellow-400/40 shadow-md" : "",
              )}
            >
              <Medal
                className={cn("h-6 w-6", MEDAL_COLORS[i] ?? "text-fg-3")}
                aria-hidden="true"
              />
              <span className="text-xs font-bold text-fg-3">#{row.rank}</span>
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-600/10 text-brand-600 dark:bg-brand-600/20 dark:text-brand-400 text-sm font-bold">
                {row.firstName?.[0]}{row.lastName?.[0]}
              </div>
              <div>
                <p className="text-[13px] font-semibold text-fg leading-tight">{row.firstName} {row.lastName}</p>
                <p className="text-xs text-fg-3">{row.specialization || "—"}</p>
              </div>
              <span className="text-xl font-bold text-brand-600 dark:text-brand-400">{row.totalPoints}</span>
              <span className="text-[10px] text-fg-3">ball</span>
            </div>
          ))}
        </div>
      )}

      {/* Full table */}
      <div className="card overflow-hidden">
        {leaderboard.isLoading ? (
          <div className="p-4 space-y-2" aria-hidden="true">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-14 w-full rounded-lg" />
            ))}
          </div>
        ) : rows.length === 0 ? (
          <EmptyState
            title="Ma'lumot yo'q"
            description="Tanlangan davr uchun reyting bo'sh."
            icon={<Trophy className="h-6 w-6" aria-hidden="true" />}
          />
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-2/60">
                {["#", "Shifokor", "Mutaxassislik", "Yozuvlar", "Ballar"].map((h, i) => (
                  <th
                    key={h}
                    className={cn(
                      "px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-fg-3",
                      i >= 3 ? "text-right" : "text-left",
                    )}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr
                  key={row.doctorId}
                  className="border-b border-border-2 last:border-none transition-colors hover:bg-surface-2/60"
                >
                  <td className="px-4 py-3 w-10">
                    <span className={cn(
                      "flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold",
                      i === 0 ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                      : i === 1 ? "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
                      : i === 2 ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                      : "bg-surface-2 text-fg-3",
                    )}>
                      {row.rank}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-600/10 text-brand-600 dark:text-brand-400 text-[11px] font-bold">
                        {row.firstName?.[0]}{row.lastName?.[0]}
                      </span>
                      <span className="font-medium text-fg">{row.firstName} {row.lastName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-fg-3">{row.specialization || "—"}</td>
                  <td className="px-4 py-3 text-right text-fg-2">{row.entries}</td>
                  <td className="px-4 py-3 text-right font-bold text-brand-600 dark:text-brand-400">
                    {row.totalPoints}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
