import apiClient from "../base"

export type ServiceHealth = "online" | "offline" | "degraded"

export interface ServiceStatus {
  name: string
  status: ServiceHealth
  details?: string
  latency_ms?: number
}

export interface KafkaLag {
  consumer_group: string
  topic: string
  partition?: number
  lag: number
}

export interface StatusMetrics {
  rps?: number
  error_rate?: number
  errors?: number
}

export interface StatusResponse {
  services: ServiceStatus[]
  kafka?: KafkaLag[]
  metrics?: StatusMetrics
  updated_at?: string
  source?: "api" | "mock"
}

const mockStatus: StatusResponse = {
  source: "mock",
  updated_at: new Date().toISOString(),
  services: [
    { name: "api-gateway", status: "online", latency_ms: 42 },
    { name: "users-service", status: "online", latency_ms: 58 },
    { name: "posts-service", status: "degraded", latency_ms: 180, details: "Высокая задержка" },
    { name: "media-service", status: "online", latency_ms: 73 },
    { name: "geo-service", status: "offline", details: "Нет ответа" },
  ],
  kafka: [
    { consumer_group: "posts-consumer", topic: "posts-events", partition: 0, lag: 12 },
    { consumer_group: "notifications-consumer", topic: "notifications", partition: 2, lag: 4 },
  ],
  metrics: {
    rps: 152.4,
    error_rate: 0.7,
    errors: 12,
  },
}

export const statusApi = {
  getStatus: (): Promise<StatusResponse> =>
    apiClient
      .get("/v1/status")
      .then((res) => ({ ...(res.data as StatusResponse), source: "api" as const }))
      .catch(() => mockStatus),
}
