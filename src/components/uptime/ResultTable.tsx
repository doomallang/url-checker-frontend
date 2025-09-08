"use client";
import { HealthCheckResultResponse } from "@/interfaces/interface.health.check";
import { StatusBadge } from "./StatCards";

export default function ResultTable({
  rows,
}: {
  rows: HealthCheckResultResponse[];
}) {
  const fmt = (iso: string) => new Date(iso).toLocaleTimeString();
  return (
    <div className="bg-white rounded-2xl shadow p-4 mt-6">
      <h2 className="text-lg font-medium mb-3">Recent Results</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500">
              <th className="py-2 pr-4">Time</th>
              <th className="py-2 pr-4">Status</th>
              <th className="py-2 pr-4">HTTP</th>
              <th className="py-2 pr-4">Latency</th>
              <th className="py-2">Error</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, idx) => (
              <tr key={r.id} className={idx % 2 ? "bg-gray-50/30" : undefined}>
                <td className="py-2 pr-4 whitespace-nowrap">
                  {fmt(r.observedAt)}
                </td>
                <td className="py-2 pr-4">
                  <StatusBadge status={r.status} />
                </td>
                <td className="py-2 pr-4">
                  {r.httpCode == null ? (
                    "—"
                  ) : (
                    <span
                      className={`font-mono ${r.httpCode >= 400 ? "text-rose-600" : "text-gray-700"}`}
                    >
                      {r.httpCode}
                    </span>
                  )}
                </td>
                <td className="py-2 pr-4">
                  {r.latencyMs != null ? `${r.latencyMs} ms` : "—"}
                </td>
                <td
                  className="py-2 text-gray-600 max-w-[420px] truncate"
                  title={r.errorMessage ?? undefined}
                >
                  {r.errorMessage ?? ""}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
