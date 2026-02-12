"use client"

import { useQuery } from "@tanstack/react-query"
import { notificationsApi } from "@/shared/api"

export function useUnreadCount() {
  return useQuery({
    queryKey: ["notifications", "unread"],
    queryFn: () => notificationsApi.getUnreadCount(),
    select: (res) => res?.count ?? (res as { unreadCount?: number })?.unreadCount ?? 0,
  })
}
