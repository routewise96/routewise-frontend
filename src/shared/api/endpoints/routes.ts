import apiClient from "../base"

export interface Waypoint {
  order: number
  lat: number
  lng: number
  name?: string
  description?: string
}

export interface UserRoute {
  id: string
  user_id: number
  title: string
  description: string
  distance?: number
  duration?: number
  waypoints: Waypoint[]
  created_at: string
  updated_at: string
  like_count: number
  save_count: number
  comment_count: number
  liked?: boolean
  is_liked?: boolean
  saved?: boolean
  is_saved?: boolean
  user?: {
    username: string
    avatar: string
    avatar_url?: string
    avatarUrl?: string
  }
}

export interface RouteComment {
  id: string
  user_id: number
  content: string
  created_at: string
  user?: {
    username: string
    avatar: string
    avatar_url?: string
    avatarUrl?: string
  }
}

export type CreateRoutePayload = Omit<
  UserRoute,
  | "id"
  | "user_id"
  | "created_at"
  | "updated_at"
  | "like_count"
  | "save_count"
  | "comment_count"
  | "liked"
  | "is_liked"
  | "saved"
  | "is_saved"
  | "user"
>

export const routesApi = {
  getList: (page = 1, limit = 10): Promise<UserRoute[]> =>
    apiClient.get(`/routes?page=${page}&limit=${limit}`).then((res) => res.data),

  getById: (id: string): Promise<UserRoute> => apiClient.get(`/routes/${id}`).then((res) => res.data),

  create: (data: CreateRoutePayload): Promise<{ id: string }> =>
    apiClient.post("/routes", data).then((res) => res.data),

  update: (id: string, data: Partial<UserRoute>) => apiClient.put(`/routes/${id}`, data).then((res) => res.data),

  delete: (id: string) => apiClient.delete(`/routes/${id}`).then((res) => res.data),

  like: (id: string) => apiClient.post(`/routes/${id}/like`).then((res) => res.data),

  unlike: (id: string) => apiClient.delete(`/routes/${id}/like`).then((res) => res.data),

  save: (id: string) => apiClient.post(`/routes/${id}/save`).then((res) => res.data),

  unsave: (id: string) => apiClient.delete(`/routes/${id}/save`).then((res) => res.data),

  getComments: (routeId: string): Promise<RouteComment[]> =>
    apiClient.get(`/routes/${routeId}/comments`).then((res) => res.data),

  addComment: (routeId: string, content: string) =>
    apiClient.post(`/routes/${routeId}/comments`, { content }).then((res) => res.data),
}
