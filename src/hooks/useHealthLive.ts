"use client";

import { useEffect, useState } from "react";
import { useStomp } from "@/hooks/useStomp";
import type { HealthEvent } from "@/interfaces/interface.ws";

export function useHealthLive(healthCheckId: number) {
  const { connected, subscribe } = useStomp();
  const [last, setLast] = useState<HealthEvent | null>(null);

  useEffect(() => {
    if (!connected) return;
    const sub = subscribe(`/topic/health/${healthCheckId}`, (msg) => {
      setLast(JSON.parse(msg.body) as HealthEvent);
    });
    return () => sub?.unsubscribe();
  }, [connected, healthCheckId, subscribe]); // ✅ 안정 함수만 의존

  return { connected, last };
}
