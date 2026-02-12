import apiClient from "../base"
import type { User, PaginatedResponse } from "../../types/api"
import type { Post, NotificationSettings } from "../../types/models"

const isDev = typeof process !== "undefined" && process.env.NODE_ENV === "development"

const mockNotificationSettings: NotificationSettings = {
  like: true,
  comment: true,
  follow: true,
  repost: true,
  mention: true,
  geo: false,
  ai: true,
  system: true,
}

export const usersApi = {
  getMe: (): Promise<User> => apiClient.get("/users/me").then((r) => r.data),

  getById: (id: string | number): Promise<User> =>
    apiClient.get(`/users/${id}`).then((r) => r.data),

  updateMe: (data: FormData | Partial<User>): Promise<User> =>
    apiClient.put("/users/me", data).then((r) => r.data),

  follow: (userId: string | number): Promise<{ success: boolean }> =>
    apiClient.post(`/users/${userId}/follow`).then((r) => r.data),

  unfollow: (userId: string | number): Promise<{ success: boolean }> =>
    apiClient.delete(`/users/${userId}/follow`).then((r) => r.data),

  getFollowers: (userId: string | number, page = 1): Promise<PaginatedResponse<User>> =>
    apiClient.get(`/users/${userId}/followers`, { params: { page } }).then((r) => r.data),

  getFollowing: (userId: string | number, page = 1): Promise<PaginatedResponse<User>> =>
    apiClient.get(`/users/${userId}/following`, { params: { page } }).then((r) => r.data),

  getSavedPosts: (page = 1): Promise<PaginatedResponse<Post>> =>
    apiClient.get("/users/me/saved", { params: { page } }).then((r) => r.data),

  search: (q: string): Promise<User[]> => {
    if (!q.trim()) return Promise.resolve([])
    return apiClient
      .get("/search", { params: { q: q.trim(), type: "users" } })
      .then((r) => {
        const data = r.data
        if (Array.isArray(data)) return data as User[]
        if (data?.users) return data.users as User[]
        if (data?.data) return data.data as User[]
        return []
      })
      .catch(() => [])
  },

  getNotificationSettings: (): Promise<NotificationSettings> =>
    apiClient.get("/users/me/notifications/settings").then((r) => r.data).catch((err) => {
      if (isDev) {
        console.warn("[MOCK] usersApi.getNotificationSettings called")
        return mockNotificationSettings
      }
      return Promise.reject(err)
    }),

  updateNotificationSettings: (settings: Partial<NotificationSettings>): Promise<NotificationSettings> =>
    apiClient.patch("/users/me/notifications/settings", settings).then((r) => r.data).catch((err) => {
      if (isDev) {
        console.warn("[MOCK] usersApi.updateNotificationSettings called")
        return { ...mockNotificationSettings, ...settings }
      }
      return Promise.reject(err)
    }),
}
