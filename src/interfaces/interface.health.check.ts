type HealthCheckRequest = {
  name: string;
  type: string; // "HTTP"
  url: string;
  intervalSeconds: number;
  thresholdN?: number;
  windowM?: number;
};

type HealthCheckResponse = {
  id: number;
  name: string;
  type: string;
  url: string;
  intervalSeconds: number;
  enabled: boolean;
};

type HealthSummaryResponse = {
  healthCheckId: number;
  window: "1h" | "24h" | string;
  uptimePercent: number;
  avgLatencyMs: number | null;
  latestStatus: "UP" | "DOWN" | "UNKNOWN" | string;
  latestHttpCode: number | null;
};

type HealthCheckResultResponse = {
  id: number;
  observedAt: string;
  status: "UP" | "DOWN" | "UNKNOWN" | string;
  httpCode: number | null;
  latencyMs: number | null;
  errorMessage: string | null;
};

export type {
  HealthCheckResponse,
  HealthSummaryResponse,
  HealthCheckResultResponse,
  HealthCheckRequest,
};
