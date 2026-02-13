import apiClient from "../base"

export interface LiveStream {
  id: string
  user_id: number
  title: string
  description: string
  stream_key?: string
  playback_url: string
  status: "offline" | "live" | "ended"
  started_at: string
  ended_at?: string
  viewer_count: number
  like_count: number
  liked?: boolean
  is_liked?: boolean
  user?: {
    username: string
    avatar: string
    avatar_url?: string
    avatarUrl?: string
  }
}

export interface ChatMessage {
  id: string
  user_id: number
  username: string
  avatar?: string
  message: string
  created_at: string
}

export const liveApi = {
  getActive: (): Promise<LiveStream[]> => apiClient.get("/live").then((res) => res.data),

  getById: (id: string): Promise<LiveStream> => apiClient.get(`/live/${id}`).then((res) => res.data),

  start: (data: { title: string; description: string }): Promise<{ id: string; stream_key: string; ingest_url: string }> =>
    apiClient.post("/live/start", data).then((res) => res.data),

  stop: (id: string) => apiClient.post(`/live/stop/${id}`).then((res) => res.data),

  like: (id: string) => apiClient.post(`/live/${id}/like`).then((res) => res.data),

  unlike: (id: string) => apiClient.delete(`/live/${id}/like`).then((res) => res.data),

  getMessages: (id: string, page = 1, limit = 50): Promise<ChatMessage[]> =>
    apiClient.get(`/live/${id}/messages?page=${page}&limit=${limit}`).then((res) => res.data),

  sendMessage: (id: string, message: string) =>
    apiClient.post(`/live/${id}/message`, { message }).then((res) => res.data),
}
