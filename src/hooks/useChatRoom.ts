// src/hooks/useChatRoom.ts
"use client";

import { useEffect, useState } from "react";
import { useStomp } from "@/hooks/useStomp";
import type { ChatMessage } from "@/interfaces/interface.ws";

const base = process.env.NEXT_PUBLIC_API_BASE?.replace(/\/$/, "") || "";

export function useChatRoom(roomId: string, me: string) {
  const { connected, subscribe, publish } = useStomp();
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // 1) 방 변경 시 과거 히스토리 로드
  useEffect(() => {
    let aborted = false;
    (async () => {
      try {
        // 백엔드가 같은 도메인이라면 그대로 /api/..., 아니면 BASE_URL을 붙이세요.
        const res = await fetch(
          `${base}/api/chat/history?roomId=${encodeURIComponent(roomId)}&limit=100`,
          {
            credentials: "include",
          },
        );
        const data = (await res.json()) as ChatMessage[];
        if (!aborted) {
          // 서버는 시간순 저장(RPUSH)이므로 이미 오름차순일 가능성이 큼.
          // 혹시 몰라 timestamp로 한번 정렬 보정:
          data.sort((a, b) => a.timestamp - b.timestamp);
          setMessages(data);
        }
      } catch (e) {
        console.error("load history failed", e);
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
      const payload = JSON.parse(msg.body) as ChatMessage;
      // 중복 방지(간단 hash)
      setMessages((prev) => {
        const key = (m: ChatMessage) =>
          `${m.sender}|${m.timestamp}|${m.content}`;
        const seen = new Set(prev.map(key));
        if (seen.has(key(payload))) return prev;
        return [...prev, payload];
      });
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
