"use client";
import { Activity, Circle, Clock3, Gauge } from "lucide-react";
import { HealthSummaryResponse } from "@/interfaces/interface.health.check";

export default function StatCards({
  summary1h,
  summary24h,
}: {
  summary1h: HealthSummaryResponse | null;
  summary24h: HealthSummaryResponse | null;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="rounded-2xl border bg-white p-4 shadow-sm">
        <div className="text-sm text-gray-500 mb-1">Latest</div>
        <div className="flex items-center gap-3">
          <StatusBadge status={summary1h?.latestStatus} />
          <span className="text-sm text-gray-500">
            {summary1h?.latestHttpCode
              ? `HTTP ${summary1h.latestHttpCode}`
              : "—"}
          </span>
        </div>
      </div>
      <StatCard
        title="Uptime (1h)"
        value={summary1h ? `${summary1h.uptimePercent.toFixed(1)}%` : "-"}
        helper={
          summary1h?.avgLatencyMs != null
            ? `Avg ${summary1h.avgLatencyMs.toFixed(1)} ms`
            : "Avg —"
        }
        icon="gauge"
      />
      <StatCard
        title="Uptime (24h)"
        value={summary24h ? `${summary24h.uptimePercent.toFixed(1)}%` : "-"}
        helper={
          summary24h?.avgLatencyMs != null
            ? `Avg ${summary24h.avgLatencyMs.toFixed(1)} ms`
            : "Avg —"
        }
        icon="clock"
      />
    </div>
  );
}

function StatCard({
  title,
  value,
  helper,
  icon = "activity",
}: {
  title: string;
  value: string;
  helper?: string;
  icon?: "activity" | "gauge" | "clock";
}) {
  const Icon = icon === "gauge" ? Gauge : icon === "clock" ? Clock3 : Activity;
  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm hover:shadow-md transition">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Icon className="size-4 text-gray-400" /> {title}
      </div>
      <div className="mt-1 text-2xl font-semibold">{value}</div>
      {helper && <div className="text-xs text-gray-500 mt-1">{helper}</div>}
    </div>
  );
}

export function StatusBadge({ status }: { status?: string }) {
  const base =
    "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium";
  if (status === "UP")
    return (
      <span className={`${base} bg-emerald-50 text-emerald-700`}>
        <Circle className="size-3 fill-emerald-500 text-emerald-500" /> UP
      </span>
    );
  if (status === "DOWN")
    return (
      <span className={`${base} bg-rose-50 text-rose-700`}>
        <Circle className="size-3 fill-rose-500 text-rose-500" /> DOWN
      </span>
    );
  return (
    <span className={`${base} bg-gray-100 text-gray-600`}>
      <Circle className="size-3 fill-gray-400 text-gray-400" /> UNKNOWN
    </span>
  );
}
