import apiClient from "../base"
import type {
  AIMessage,
  AISuggestion,
  RoutePlan,
  GeoPoint,
} from "../../types/models"

const isDev =
  typeof process !== "undefined" && process.env.NODE_ENV === "development"

function devWarn(method: string) {
  if (isDev) {
    console.warn(`[MOCK] aiApi.${method} called - using stub`)
  }
}

/** Request body for chat endpoint */
export interface ChatRequest {
  messages: AIMessage[]
  stream?: boolean
}

/** Response from chat endpoint */
export interface ChatResponse {
  id: string
  message: AIMessage
  suggestions?: AISuggestion[]
}

/**
 * AI Assistant API.
 * In dev mode uses stubs when backend is unavailable.
 */
export const aiApi = {
  /**
   * Send message and get assistant reply (streaming or one-shot).
   */
  chat: (data: ChatRequest): Promise<ChatResponse> =>
    apiClient
      .post<ChatResponse>("/ai/chat", data)
      .then((r) => r.data)
      .catch((err) => {
        if (isDev) {
          devWarn("chat")
          const userMsg = data.messages[data.messages.length - 1]
          const stubMessage: AIMessage = {
            id: `stub-${Date.now()}`,
            role: "assistant",
            content:
              "Привет! Я AI-ассистент RouteWise. Спросите о маршрутах, бронированиях или достопримечательностях. (Ответ заглушки)",
            timestamp: new Date().toISOString(),
          }
          return Promise.resolve({
            id: `res-${Date.now()}`,
            message: stubMessage,
            suggestions: [
              {
                id: "s1",
                title: "Построить маршрут",
                description: "От точки А до точки Б",
                action: { type: "route", payload: {} },
              },
              {
                id: "s2",
                title: "Найти отели",
                action: { type: "search", payload: { q: "отели" } },
              },
            ],
          })
        }
        return Promise.reject(err)
      }),

  /**
   * Get quick suggestion chips (e.g. on chat open).
   */
  getSuggestions: (context?: {
    query?: string
    location?: GeoPoint
  }): Promise<AISuggestion[]> =>
    apiClient
      .get<AISuggestion[]>("/ai/suggestions", { params: context })
      .then((r) => (Array.isArray(r.data) ? r.data : []))
      .catch((err) => {
        if (isDev) {
          devWarn("getSuggestions")
          return [
            { id: "1", title: "Построить маршрут", action: { type: "route" } },
            { id: "2", title: "Забронировать", action: { type: "book" } },
            { id: "3", title: "Найти места", action: { type: "search" } },
          ]
        }
        return Promise.reject(err)
      }),

  /**
   * Plan route via AI (start, optional end, interests).
   */
  planRoute: (params: {
    start: GeoPoint
    end?: GeoPoint
    interests?: string[]
  }): Promise<RoutePlan> =>
    apiClient
      .post<RoutePlan>("/ai/route/plan", params)
      .then((r) => r.data)
      .catch((err) => {
        if (isDev) {
          devWarn("planRoute")
          return {
            start: params.start,
            end: params.end,
            distance: 5000,
            duration: 600,
            steps: [
              {
                instruction: "Выйдите из начальной точки",
                distance: 500,
                duration: 60,
              },
              {
                instruction: "Следуйте до конечной точки",
                distance: 4500,
                duration: 540,
              },
            ],
          }
        }
        return Promise.reject(err)
      }),
}
