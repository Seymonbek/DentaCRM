import { useQuery } from "@tanstack/react-query";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  getDepartmentsReport,
  getProceduresReport,
  getRevenueReport,
  type ReportPeriod,
} from "@/api/reports";
import { Skeleton } from "@/components/ui/Skeleton";

const CHART_TTL = 5 * 60 * 1000;

const PIE_COLORS = [
  "#2563eb",
  "#16a34a",
  "#d97706",
  "#dc2626",
  "#7c3aed",
  "#0891b2",
];

interface StatsChartsProps {
  period?: ReportPeriod;
}

export function StatsCharts({ period = "week" }: StatsChartsProps): JSX.Element {
  const revenue = useQuery({
    queryKey: ["reports", "revenue", period],
    queryFn: () => getRevenueReport(period),
    staleTime: CHART_TTL,
  });
  const procedures = useQuery({
    queryKey: ["reports", "procedures", period],
    queryFn: () => getProceduresReport(period),
    staleTime: CHART_TTL,
  });
  const departments = useQuery({
    queryKey: ["reports", "departments", period],
    queryFn: () => getDepartmentsReport(period),
    staleTime: CHART_TTL,
  });

  const revenueSeries =
    revenue.data?.byDay?.map((row) => ({
      date: row.date,
      amount: Number(row.amount),
    })) ?? [];
  const procedureRows =
    procedures.data?.items?.map((row) => ({
      name: row.procedure,
      count: row.count,
    })) ?? [];
  const departmentRows =
    departments.data?.items?.map((row) => ({
      name: row.department,
      revenue: Number(row.revenue),
    })) ?? [];

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <ChartCard title="Daromad dinamikasi" description={`Period: ${period}`}>
        {revenue.isLoading ? (
          <Skeleton className="h-64 w-full" />
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={revenueSeries}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#2563eb"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </ChartCard>

      <ChartCard title="Muolajalar bo'yicha" description="Eng ko'p bajarilgan">
        {procedures.isLoading ? (
          <Skeleton className="h-64 w-full" />
        ) : procedureRows.length === 0 ? (
          <EmptyChart />
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={procedureRows}
                dataKey="count"
                nameKey="name"
                outerRadius={90}
                label
              >
                {procedureRows.map((_row, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </ChartCard>

      <ChartCard
        title="Bo'limlar bo'yicha daromad"
        description="Bo'lim kesimida"
      >
        {departments.isLoading ? (
          <Skeleton className="h-64 w-full" />
        ) : departmentRows.length === 0 ? (
          <EmptyChart />
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={departmentRows}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip />
              <Bar dataKey="revenue" fill="#16a34a" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </ChartCard>
    </div>
  );
}

function ChartCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}): JSX.Element {
  return (
    <article className="card p-4">
      <header className="mb-3">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        {description ? (
          <p className="text-xs text-muted-foreground">{description}</p>
        ) : null}
      </header>
      {children}
    </article>
  );
}

function EmptyChart(): JSX.Element {
  return (
    <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
      Ma'lumot yo'q
    </div>
  );
}
