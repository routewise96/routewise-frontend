import apiClient from "../base"
import type { PaginatedResponse } from "../../types/api"

export interface EventRecord {
  event_id: string
  event_type: string
  timestamp: string
  source_service: string
  version: number
  payload: Record<string, unknown>
}

export interface EventsQuery {
  page?: number
  limit?: number
  type?: string
  from?: string
  to?: string
}

const mockEvents: EventRecord[] = Array.from({ length: 42 }).map((_, index) => {
  const types = ["user.created", "post.created", "comment.created", "media.uploaded", "route.created"]
  const services = ["users-service", "posts-service", "comments-service", "media-service", "routes-service"]
  const type = types[index % types.length]
  const service = services[index % services.length]
  const createdAt = new Date(Date.now() - index * 60 * 60 * 1000).toISOString()
  return {
    event_id: `evt_${(index + 1).toString().padStart(4, "0")}`,
    event_type: type,
    timestamp: createdAt,
    source_service: service,
    version: 1,
    payload: {
      id: index + 1,
      entity: type.split(".")[0],
      message: "Mock event payload",
    },
  }
})

function filterEvents(data: EventRecord[], query: EventsQuery) {
  let filtered = data
  if (query.type && query.type !== "all") {
    filtered = filtered.filter((item) => item.event_type === query.type)
  }
  if (query.from) {
    const fromDate = new Date(query.from)
    filtered = filtered.filter((item) => new Date(item.timestamp) >= fromDate)
  }
  if (query.to) {
    const toDate = new Date(query.to)
    filtered = filtered.filter((item) => new Date(item.timestamp) <= toDate)
  }
  return filtered
}

export const eventsApi = {
  getEvents: (query: EventsQuery = {}): Promise<PaginatedResponse<EventRecord>> =>
    apiClient
      .get("/v1/events", { params: query })
      .then((res) => res.data as PaginatedResponse<EventRecord>)
      .catch(() => {
        const page = query.page ?? 1
        const limit = query.limit ?? 20
        const filtered = filterEvents(mockEvents, query)
        const start = (page - 1) * limit
        const data = filtered.slice(start, start + limit)
        return {
          data,
          meta: {
            page,
            limit,
            total: filtered.length,
            hasMore: start + limit < filtered.length,
          },
        }
      }),

  replayEvents: (eventIds: string[], topic?: string) =>
    apiClient
      .post("/v1/events/replay", { event_ids: eventIds, topic })
      .then((res) => res.data)
      .catch(() => ({ success: true })),
}
