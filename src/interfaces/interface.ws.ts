export type HealthEvent = {
  healthCheckId: number;
  status: 'UP' | 'DOWN' | 'UNKNOWN';
  httpCode?: number | null;
  latencyMs?: number | null;
  error?: string | null;
  observedAt: number; // epoch millis
};

export type ChatMessage = {
  roomId: string;     // 예: 'hc-123'
  sender: string;
  content: string;
  timestamp: number;
  type: 'CHAT' | 'JOIN' | 'LEAVE';
};
