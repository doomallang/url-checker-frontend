"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useHealthLive } from "@/hooks/useHealthLive";

type Props = { healthCheckId: number };

// 카드 내부에서 최근 이벤트를 보관(스파크라인/업타임 계산용)
type Point = {
  t: number;
  latency: number | null;
  up: boolean;
  http?: number | null;
  err?: string | null;
};

const MAX_POINTS = 60; // 최근 60개만 유지 (약간의 히스토리)

export default function HealthLiveCard({ healthCheckId }: Props) {
  const { connected, last } = useHealthLive(healthCheckId);
  const [capture, setCapture] = useState(true);
  const [points, setPoints] = useState<Point[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // 새 이벤트 들어오면 히스토리에 누적
  useEffect(() => {
    if (!last || !capture) return;
    setPoints((prev) => {
      const p: Point = {
        t: last.observedAt,
        latency: last.latencyMs ?? null,
        up: last.status === "UP",
        http: last.httpCode ?? null,
        err: last.error ?? null,
      };
      const next = [...prev, p];
      if (next.length > MAX_POINTS) next.shift();
      return next;
    });
  }, [last, capture]);

  const lastPoint = useMemo(
    () => (points.length ? points[points.length - 1] : undefined),
    [points],
  );

  const uptimePercent = useMemo(() => {
    if (!points.length) return null;
    const ups = points.filter((p) => p.up).length;
    return Math.round((ups / points.length) * 1000) / 10; // 소수1자리
  }, [points]);

  const [maxLatency, minLatency] = useMemo(() => {
    const vals = points
      .map((p) => p.latency)
      .filter((v): v is number => v != null);
    if (!vals.length) return [0, 0] as const;
    return [Math.max(...vals), Math.min(...vals)] as const;
  }, [points]);

  const spark = useMemo(() => {
    const vals = points.map((p) => (p.latency == null ? null : p.latency));
    const has = vals.some((v) => v != null);
    if (!has) return { path: "", width: 0, height: 0 };

    const W = 280; // svg px
    const H = 56;
    const pad = 4;
    const xs = (i: number) => {
      if (points.length === 1) return pad;
      return pad + (i * (W - pad * 2)) / (points.length - 1);
    };

    const max = Math.max(...vals.filter((v): v is number => v != null));
    const min = Math.min(...vals.filter((v): v is number => v != null));
    const span = Math.max(1, max - min); // 0 나눗셈 방지

    const yFrom = (v: number) => {
      // 값이 클수록 높이(H) 쪽으로 내려가게
      const norm = (v - min) / span; // 0~1
      const y = pad + (1 - norm) * (H - pad * 2);
      return y;
    };

    let d = "";
    points.forEach((p, i) => {
      if (p.latency == null) return;
      const x = xs(i);
      const y = yFrom(p.latency);
      d += (d ? " L " : "M ") + `${x} ${y}`;
    });

    return { path: d, width: W, height: H };
  }, [points]);

  const statusColor =
    last?.status === "UP"
      ? "bg-emerald-500"
      : last?.status === "DOWN"
        ? "bg-rose-500"
        : "bg-gray-400";
  const statusText =
    last?.status === "UP"
      ? "UP"
      : last?.status === "DOWN"
        ? "DOWN"
        : last
          ? last.status
          : "UNKNOWN";

  const since = last?.observedAt ? timeAgo(last.observedAt) : "—";

  return (
    <div
      ref={containerRef}
      className="rounded-2xl border bg-white shadow-sm overflow-hidden"
    >
      {/* Header */}
      <div className="relative border-b">
        <div className="absolute inset-x-0 -top-6 h-20 bg-gradient-to-r from-indigo-500/15 via-purple-500/15 to-pink-500/15 blur-2xl -z-10" />
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="grid size-9 place-items-center rounded-xl bg-indigo-600 text-white shadow-sm">
              🩺
            </div>
            <div>
              <div className="text-xs text-gray-500">Health Check</div>
              <h3 className="text-lg font-semibold tracking-tight">
                #{healthCheckId}
              </h3>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <LiveChip connected={connected} />
            <button
              onClick={() => setCapture((s) => !s)}
              className={`text-xs rounded-full px-2 py-1 border ${
                capture
                  ? "bg-white hover:bg-gray-50"
                  : "bg-gray-900 text-white hover:bg-black"
              }`}
              title={capture ? "일시정지" : "재개"}
            >
              {capture ? "Pause" : "Resume"}
            </button>
            <button
              onClick={() => setPoints([])}
              className="text-xs rounded-full px-2 py-1 border bg-white hover:bg-gray-50"
              title="히스토리 초기화"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 grid gap-4 md:grid-cols-2">
        {/* Left: Stats */}
        <div className="grid grid-cols-3 gap-3">
          <StatTile
            label="Status"
            value={
              <span className="inline-flex items-center gap-2">
                <span
                  className={`inline-block size-2.5 rounded-full ${statusColor}`}
                />
                <b>{statusText}</b>
              </span>
            }
            sub={`Updated ${since}`}
          />
          <StatTile
            label="HTTP"
            value={<b>{last?.httpCode ?? "—"}</b>}
            sub={last?.err ? "Error" : "OK"}
            danger={!!(last && last.status !== "UP")}
          />
          <StatTile
            label="Latency"
            value={
              <span className="inline-flex items-baseline gap-1">
                <b>{last?.latencyMs ?? "—"}</b>
                <span className="text-xs text-gray-500">ms</span>
              </span>
            }
            sub={
              maxLatency
                ? `min ${minLatency ?? 0} · max ${maxLatency}`
                : last?.latencyMs != null
                  ? `now ${last.latencyMs} ms`
                  : "—"
            }
          />
          <div className="col-span-3">
            <StatTile
              label="Rolling Uptime"
              value={
                uptimePercent == null ? (
                  "—"
                ) : (
                  <span className="inline-flex items-baseline gap-1">
                    <b>{uptimePercent}</b>
                    <span className="text-xs text-gray-500">%</span>
                  </span>
                )
              }
              sub={`last ${points.length} events`}
              good={uptimePercent != null && uptimePercent >= 99.0}
              warn={uptimePercent != null && uptimePercent < 99.0}
            />
          </div>
        </div>

        {/* Right: Sparkline */}
        <div className="rounded-xl border bg-white p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium text-gray-700">
              Latency (recent)
            </div>
            <div className="text-xs text-gray-500">
              {points.length ? `${points.length} pts` : "no data"}
            </div>
          </div>
          <div className="h-[72px] grid">
            {spark.path ? (
              <svg
                width="100%"
                height={spark.height}
                viewBox={`0 0 ${spark.width} ${spark.height}`}
                preserveAspectRatio="none"
              >
                <path
                  d={spark.path}
                  fill="none"
                  stroke="currentColor"
                  className="text-indigo-600"
                  strokeWidth="2"
                />
                {/* 포인트 점(UP/ DOWN 색 구분) */}
                {points.map((p, i) => {
                  if (p.latency == null || !spark.path) return null;
                  const x =
                    points.length === 1
                      ? 4
                      : 4 + (i * (spark.width - 8)) / (points.length - 1);
                  // y 계산 동일 로직을 함수화하지 않고 근사치: min/max 기준 비율 치환
                  const max = Math.max(
                    ...points.map((pp) =>
                      pp.latency == null ? 0 : pp.latency,
                    ),
                  );
                  const min = Math.min(
                    ...points
                      .map((pp) => pp.latency)
                      .filter((v): v is number => v != null),
                  );
                  const span = Math.max(1, max - min);
                  const y =
                    4 + (1 - (p.latency - min) / span) * (spark.height - 8);
                  return (
                    <circle
                      key={i}
                      cx={x}
                      cy={y}
                      r="2"
                      className={p.up ? "fill-emerald-500" : "fill-rose-500"}
                    />
                  );
                })}
              </svg>
            ) : (
              <div className="text-xs text-gray-500 grid place-items-center">
                No latency yet
              </div>
            )}
          </div>

          {/* 최근 한 줄 로그 */}
          <div className="mt-2 text-xs text-gray-600">
            {lastPoint ? (
              <span>
                <b>{lastPoint.up ? "UP" : "DOWN"}</b> · HTTP{" "}
                {lastPoint.http ?? "—"} ·{" "}
                {lastPoint.latency != null ? `${lastPoint.latency} ms` : "—"} ·{" "}
                {timeAgo(lastPoint.t)}
                {lastPoint.err ? (
                  <span title={lastPoint.err} className="ml-1 text-rose-600">
                    (error)
                  </span>
                ) : null}
              </span>
            ) : (
              <span>—</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/** 상단 라이브 상태 칩 */
function LiveChip({ connected }: { connected: boolean }) {
  return connected ? (
    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 px-2 py-0.5 text-xs">
      <span className="size-1.5 rounded-full bg-emerald-500" />
      Live
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 text-gray-600 px-2 py-0.5 text-xs">
      <span className="size-1.5 rounded-full bg-gray-400 animate-pulse" />
      Connecting…
    </span>
  );
}

/** 작은 통계 타일 */
function StatTile({
  label,
  value,
  sub,
  danger,
  good,
  warn,
}: {
  label: string;
  value: React.ReactNode;
  sub?: string;
  danger?: boolean;
  good?: boolean;
  warn?: boolean;
}) {
  const ring = danger
    ? "ring-rose-200"
    : good
      ? "ring-emerald-200"
      : warn
        ? "ring-amber-200"
        : "ring-gray-200";

  return (
    <div className={`rounded-xl border bg-white p-3 ring-1 ${ring}`}>
      <div className="text-xs text-gray-500">{label}</div>
      <div className="text-base mt-0.5">{value}</div>
      {sub && <div className="text-[11px] text-gray-500 mt-0.5">{sub}</div>}
    </div>
  );
}

/** "n초 전" 포맷 */
function timeAgo(ts: number) {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 1) return "just now";
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  return `${h}h ago`;
}
