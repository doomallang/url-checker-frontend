"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { apiDelete, apiGet, apiPost, apiPut } from "@/lib/api";
import {
  HealthCheckRequest,
  HealthCheckResponse,
  HealthCheckResultResponse,
  HealthSummaryResponse,
} from "@/interfaces/interface.health.check";
import { useAuth } from "@/components/AuthProvider";

export function useUptime() {
  const { auth } = useAuth();

  // 상태
  const [checks, setChecks] = useState<HealthCheckResponse[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [summary1h, setSummary1h] = useState<HealthSummaryResponse | null>(
    null,
  );
  const [summary24h, setSummary24h] = useState<HealthSummaryResponse | null>(
    null,
  );
  const [recent, setRecent] = useState<HealthCheckResultResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [polling, setPolling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 폴링
  const BASE_POLL_MS = 30_000;
  const MAX_POLL_MS = 5 * 60_000;
  const [pollMs, setPollMs] = useState(BASE_POLL_MS);

  // 모달/폼
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<HealthCheckRequest>({
    name: "",
    type: "HTTP",
    url: "",
    intervalSeconds: 60,
    thresholdN: 1,
    windowM: 3,
  });

  const selected = useMemo(
    () => checks.find((c) => c.id === selectedId) ?? null,
    [checks, selectedId],
  );

  // 목록
  const loadList = useCallback(async () => {
    const data = await apiGet<HealthCheckResponse[]>(`/api/v1/health/check`);
    setChecks(data);
    if (!selectedId && data.length) setSelectedId(data[0].id);
  }, [selectedId]);

  // 단건 데이터
  const loadSelected = useCallback(async (id: number) => {
    setLoading(true);
    try {
      const [s1h, s24h, rec] = await Promise.all([
        apiGet<HealthSummaryResponse>(
          `/api/v1/health/check/${id}/summary?window=1h`,
        ),
        apiGet<HealthSummaryResponse>(
          `/api/v1/health/check/${id}/summary?window=24h`,
        ),
        apiGet<HealthCheckResultResponse[]>(
          `/api/v1/health/check/${id}/result?limit=120`,
        ),
      ]);
      setSummary1h(s1h);
      setSummary24h(s24h);
      setRecent(rec);
      setError(null);
      setPollMs(BASE_POLL_MS);
    } catch (e: any) {
      setError(e.message ?? String(e));
      setPollMs((prev) => Math.min(prev * 2, MAX_POLL_MS));
    } finally {
      setLoading(false);
    }
  }, []);

  // 초기 로드
  useEffect(() => {
    loadList().catch((e) => setError(String(e)));
  }, [loadList]);

  // 선택 변경시 로드
  useEffect(() => {
    if (!selectedId) return;
    loadSelected(selectedId);
  }, [selectedId, loadSelected]);

  // 폴링
  useEffect(() => {
    if (!selectedId) return;
    let timer: ReturnType<typeof setInterval> | null = null;
    const tick = () => {
      if (document.hidden) return;
      setPolling(true);
      loadSelected(selectedId).finally(() => setPolling(false));
    };
    timer = setInterval(tick, pollMs);
    const onVis = () => {
      if (!document.hidden) tick();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      if (timer) clearInterval(timer);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [selectedId, pollMs, loadSelected]);

  // ---- 관리 액션 ----
  const requireAuth = () => {
    if (!auth.token) {
      setError("로그인이 필요합니다.");
      return false;
    }
    return true;
  };

  const openCreate = () => {
    setEditingId(null);
    setForm({
      name: "",
      type: "HTTP",
      url: "",
      intervalSeconds: 60,
      thresholdN: 1,
      windowM: 3,
    });
    setModalOpen(true);
  };

  const openEdit = () => {
    if (!selected) return;
    setEditingId(selected.id);
    setForm({
      name: selected.name,
      type: selected.type,
      url: selected.url,
      intervalSeconds: selected.intervalSeconds,
      thresholdN: 1,
      windowM: 3,
    });
    setModalOpen(true);
  };

  const submitUpsert = async () => {
    if (!requireAuth()) return;
    if (editingId == null) {
      await apiPost(`/api/v1/health/check`, {
        name: form.name,
        type: form.type,
        url: form.url,
        intervalSeconds: form.intervalSeconds,
      });
    } else {
      await apiPut(`/api/v1/health/check/${editingId}`, {
        name: form.name,
        type: form.type,
        url: form.url,
        intervalSeconds: form.intervalSeconds,
        thresholdN: form.thresholdN,
        windowM: form.windowM,
      });
    }
    await loadList();
    if (editingId) setSelectedId(editingId);
    setModalOpen(false);
  };

  const toggleEnabled = async () => {
    if (!requireAuth() || !selected) return;
    await apiPut(`/api/v1/health/check/${selected.id}/toggle`, {});
    await loadList();
    await loadSelected(selected.id);
  };

  const remove = async () => {
    if (!requireAuth() || !selected) return;
    if (!confirm(`Delete "${selected.name}"?`)) return;
    await apiDelete(`/api/v1/health/check/${selected.id}`);
    await loadList();
    const refreshed =
      await apiGet<HealthCheckResponse[]>(`/api/v1/health/check`);
    setChecks(refreshed);
    setSelectedId(refreshed.length ? refreshed[0].id : null);
    setSummary1h(null);
    setSummary24h(null);
    setRecent([]);
  };

  // 차트 데이터
  const chartData = useMemo(
    () =>
      [...recent]
        .slice()
        .reverse()
        .map((r) => ({
          time: new Date(r.observedAt).toLocaleTimeString(),
          latency: r.latencyMs ?? 0,
          status: r.status,
        })),
    [recent],
  );

  return {
    // 데이터
    checks,
    selectedId,
    setSelectedId,
    selected,
    summary1h,
    summary24h,
    recent,
    chartData,
    loading,
    polling,
    error,
    setError,

    // 폴링
    reloadSelected: () => selectedId && loadSelected(selectedId),

    // 모달/폼
    modalOpen,
    setModalOpen,
    editingId,
    form,
    setForm,

    // 액션
    openCreate,
    openEdit,
    submitUpsert,
    toggleEnabled,
    remove,
  };
}
