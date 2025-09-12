"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Client, IMessage, StompSubscription } from "@stomp/stompjs";
import { createStompClient } from "@/lib/ws";

export function useStomp() {
  const clientRef = useRef<Client | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const client = createStompClient();
    let alive = true;

    client.onConnect = () => alive && setConnected(true);
    client.onStompError = () => alive && setConnected(false);
    client.onWebSocketClose = () => alive && setConnected(false);

    client.activate();
    clientRef.current = client;

    return () => {
      alive = false;
      void client.deactivate(); // cleanup은 Promise 반환 X
      clientRef.current = null;
    };
  }, []);

  // ✅ 안정적인 함수 (렌더마다 새로 안 만들어짐)
  const subscribe = useCallback(
    (
      destination: string,
      cb: (msg: IMessage) => void,
    ): StompSubscription | null => {
      const c = clientRef.current;
      if (!c || !c.connected) return null; // 상태 확인은 실제 client에 묻기
      return c.subscribe(destination, cb);
    },
    [],
  );

  const publish = useCallback((destination: string, body: any) => {
    const c = clientRef.current;
    if (!c || !c.connected) return;
    c.publish({ destination, body: JSON.stringify(body) });
  }, []);

  return { connected, subscribe, publish };
}
