"use client";

import { useEffect, useState } from "react";
import { useStomp } from "@/hooks/useStomp";
import type { ChatMessage } from "@/interfaces/interface.ws";

function normalize(m: ChatMessage): ChatMessage {
  const ts =
    typeof (m as any).timestamp === "string"
      ? Number((m as any).timestamp)
      : (m as any).timestamp;
  return { ...m, timestamp: Number.isFinite(ts) ? ts : Date.now() };
}

export function useChatRoom(roomId: string, me: string) {
  const { connected, subscribe, publish } = useStomp();
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // 1) 방 변경 시 과거 히스토리 로드
  useEffect(() => {
    let aborted = false;

    (async () => {
      try {
        const base = process.env.NEXT_PUBLIC_API_BASE ?? "";
        const url = `${base}/api/chat/history?roomId=${encodeURIComponent(roomId)}&limit=100`;
        const res = await fetch(url, { credentials: "include" });
        if (!res.ok) {
          console.error("[chat][history] http", res.status);
          if (!aborted) setMessages([]);
          return;
        }
        const ct = res.headers.get("content-type") || "";
        if (!ct.includes("application/json")) {
          console.error("[chat][history] not json", ct);
          if (!aborted) setMessages([]);
          return;
        }
        const raw = (await res.json()) as ChatMessage[];
        const data = raw
          .map(normalize)
          .sort((a, b) => a.timestamp - b.timestamp);
        if (!aborted) {
          setMessages(data);
          console.log("[chat][history]", data.length);
        }
      } catch (e) {
        console.error("[chat][history] failed", e);
        if (!aborted) setMessages([]);
      }
    })();

    return () => {
      aborted = true;
      setMessages([]);
    };
  }, [roomId]);

  // 2) 구독 + JOIN 브로드캐스트
  useEffect(() => {
    if (!connected) return;

    const sub = subscribe(`/topic/rooms/${roomId}`, (msg) => {
      try {
        const payload = normalize(JSON.parse(msg.body) as ChatMessage);
        // 간단 중복 키: sender|timestamp|content
        const keyOf = (m: ChatMessage) =>
          `${m.sender}|${m.timestamp}|${m.content}`;
        setMessages((prev) => {
          const seen = new Set(prev.map(keyOf));
          if (seen.has(keyOf(payload))) return prev;
          return [...prev, payload];
        });
        console.log("[chat][recv]", payload);
      } catch (e) {
        console.error("[chat][recv] parse error", e, msg.body);
      }
    });

    publish("/app/chat.send", {
      roomId,
      sender: me,
      content: `${me} joined`,
      timestamp: Date.now(),
      type: "JOIN",
    });

    return () => sub?.unsubscribe();
  }, [connected, roomId, me, subscribe, publish]);

  const send = (content: string) => {
    const c = content.trim();
    if (!c) return;
    publish("/app/chat.send", {
      roomId,
      sender: me,
      content: c,
      timestamp: Date.now(),
      type: "CHAT",
    });
  };

  return { connected, messages, send };
}
