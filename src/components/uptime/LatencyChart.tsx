"use client";
import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Line,
} from "recharts";

export default function LatencyChart({
  data,
  loading,
}: {
  data: { time: string; latency: number; status: string }[];
  loading: boolean;
}) {
  return (
    <div className="bg-white rounded-2xl shadow p-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-medium">Latency (ms)</h2>
        {loading && (
          <span className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-600">
            loading…
          </span>
        )}
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ left: 12, right: 12, top: 8, bottom: 8 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" minTickGap={24} />
            <YAxis />
            <Tooltip formatter={(v) => [`${v} ms`, "Latency"]} />
            <Line type="monotone" dataKey="latency" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 text-xs text-gray-500">
        Showing last {data.length} observations. Times are local.
      </div>
    </div>
  );
}
