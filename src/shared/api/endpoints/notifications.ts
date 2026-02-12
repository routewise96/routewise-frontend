import apiClient from "../base"
import type { Notification, PaginatedResponse } from "../../types/api"

export const notificationsApi = {
  getUnreadCount: (): Promise<{ count: number }> =>
    apiClient.get("/notifications/unread").then((r) => r.data),

  getAll: (page = 1, limit?: number): Promise<PaginatedResponse<Notification>> =>
    apiClient
      .get("/notifications", { params: { page, ...(limit && { limit }) } })
      .then((r) => r.data),

  markAsRead: (id: string | number): Promise<{ success: boolean }> =>
    apiClient.post(`/notifications/${id}/read`).then((r) => r.data),

  markAllAsRead: (): Promise<{ success: boolean }> =>
    apiClient.post("/notifications/read-all").then((r) => r.data),
}
