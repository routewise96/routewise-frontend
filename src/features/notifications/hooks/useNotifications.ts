"use client"

import { useInfiniteQuery } from "@tanstack/react-query"
import { notificationsApi } from "@/shared/api"
import { extractNotifications } from "../lib/extractNotifications"

const DEFAULT_LIMIT = 20

export function useNotifications(limit = DEFAULT_LIMIT) {
  return useInfiniteQuery({
    queryKey: ["notifications", limit],
    queryFn: async ({ pageParam }) => {
      const res = await notificationsApi.getAll(pageParam as number, limit)
      return extractNotifications(res)
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < limit) return undefined
      return allPages.length + 1
    },
  })
}
