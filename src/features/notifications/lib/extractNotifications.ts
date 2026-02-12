import type { Notification } from "@/shared/types/models"

export function extractNotifications(data: unknown): Notification[] {
  if (Array.isArray(data)) return data as Notification[]
  if (data && typeof data === "object") {
    const o = data as Record<string, unknown>
    if (Array.isArray(o.notifications)) return o.notifications as Notification[]
    if (Array.isArray(o.data)) return o.data as Notification[]
    if (Array.isArray(o.items)) return o.items as Notification[]
  }
  return []
}
