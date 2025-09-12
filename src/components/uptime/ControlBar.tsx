"use client";
import { HealthCheckResponse } from "@/interfaces/interface.health.check";
import { Pencil, Plus, Power, Trash2 } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";

type Props = {
  checks: HealthCheckResponse[];
  selectedId: number | null;
  onChangeSelected: (id: number | null) => void;
  onRefresh: () => void;
  onCreate: () => void;
  onEdit: () => void;
  onToggle: () => void;
  onDelete: () => void;
  selected: HealthCheckResponse | null;
};

export default function ControlBar({
  checks,
  selectedId,
  onChangeSelected,
  onRefresh,
  onCreate,
  onEdit,
  onToggle,
  onDelete,
  selected,
}: Props) {
  const { auth } = useAuth();
  return (
    <div className="flex items-center justify-between rounded-2xl border bg-white/70 backdrop-blur px-4 py-3 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="size-8 rounded-xl bg-indigo-600 text-white grid place-items-center shadow-sm">
          ⏱
        </div>
        <div>
          <h1 className="text-xl font-semibold tracking-tight">
            Uptime Dashboard
          </h1>
          <p className="text-xs text-gray-500">
            Monitor latency, uptime, errors at a glance
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {auth.token && (
          <>
            <button
              onClick={onCreate}
              className="flex items-center gap-1 text-sm rounded-full px-3 py-2 bg-white border hover:bg-gray-50"
            >
              <Plus className="w-4 h-4" /> New
            </button>
            <button
              onClick={onEdit}
              disabled={!selected}
              className="flex items-center gap-1 text-sm rounded-full px-3 py-2 bg-white border hover:bg-gray-50 disabled:opacity-50"
            >
              <Pencil className="w-4 h-4" /> Edit
            </button>
            <button
              onClick={onToggle}
              disabled={!selected}
              className="flex items-center gap-1 text-sm rounded-full px-3 py-2 bg-white border hover:bg-gray-50 disabled:opacity-50"
            >
              <Power className="w-4 h-4" /> Toggle
            </button>
            <button
              onClick={onDelete}
              disabled={!selected}
              className="flex items-center gap-1 text-sm rounded-full px-3 py-2 bg-white border hover:bg-gray-50 disabled:opacity-50 text-rose-600"
            >
              <Trash2 className="w-4 h-4" /> Delete
            </button>
          </>
        )}

        <button
          onClick={onRefresh}
          className="text-sm rounded-full px-3 py-2 bg-white border hover:bg-gray-50"
        >
          Refresh
        </button>

        <div className="flex items-center gap-3">
          <select
            value={selectedId ?? ""}
            onChange={(e) => onChangeSelected(Number(e.target.value))}
            className="border rounded-full px-4 py-2 bg-white shadow-sm text-sm hover:bg-gray-50"
          >
            {!checks.length && <option>Loading…</option>}
            {checks.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} {c.enabled ? "" : "(disabled)"}
              </option>
            ))}
          </select>
          {selected && (
            <>
              <Link
                href={`/uptime/${selected.id}`} // ✅ 동적 라우트 이동
                className="text-sm rounded-full px-3 py-2 bg-indigo-600 text-white hover:bg-indigo-700"
              >
                Live
              </Link>
              <Link
                href={selected.url}
                target="_blank"
                className="text-sm rounded-full px-3 py-2 bg-gray-900 text-white hover:bg-black"
              >
                Open target
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
