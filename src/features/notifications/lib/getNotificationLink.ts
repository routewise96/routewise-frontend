import type { Notification } from "@/shared/types/models"

export function getNotificationLink(n: Notification): string {
  if (n.target) {
    switch (n.target.type) {
      case "post":
        return `/post/${n.target.id}`
      case "user":
        return `/profile/${n.target.id}`
      case "booking":
        return "/bookings"
      case "place":
        return "/map"
      default:
        return "/notifications"
    }
  }
  const data = n.data ?? {}
  if (data.postId != null) return `/post/${data.postId}`
  if (data.userId != null) return `/profile/${data.userId}`
  return "/notifications"
}
