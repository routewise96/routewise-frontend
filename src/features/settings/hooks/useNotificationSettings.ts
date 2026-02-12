"use client"

import { useQuery } from "@tanstack/react-query"
import { usersApi } from "@/shared/api"

export function useNotificationSettings() {
  return useQuery({
    queryKey: ["notificationSettings"],
    queryFn: () => usersApi.getNotificationSettings(),
    staleTime: 60_000,
  })
}
