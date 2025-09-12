'use client';

import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export function createStompClient() {
  const base = process.env.NEXT_PUBLIC_API_BASE || '';
  const endpoint = `${base}/ws`;

  const client = new Client({
    webSocketFactory: () => new SockJS(endpoint),
    reconnectDelay: 2000,
    debug: (msg) => {
      if (process.env.NODE_ENV !== 'production') console.log('[STOMP]', msg);
    },
  });
  return client;
}
