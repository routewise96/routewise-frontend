"use client"

import { useInfiniteQuery } from "@tanstack/react-query"
import { usersApi } from "@/shared/api"
import type { User } from "@/shared/types/models"

function extractUsers(data: unknown): User[] {
  if (Array.isArray(data)) return data as User[]
  if (data && typeof data === "object") {
    const o = data as Record<string, unknown>
    if (Array.isArray(o.data)) return o.data as User[]
    if (Array.isArray(o.items)) return o.items as User[]
  }
  return []
}

export function useFollowers(userId: string | number | undefined) {
  return useInfiniteQuery({
    queryKey: ["user", userId, "followers"],
    queryFn: async ({ pageParam }) => {
      if (userId == null) return []
      const res = await usersApi.getFollowers(userId, pageParam as number)
      return extractUsers(res)
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < 20) return undefined
      return allPages.length + 1
    },
    enabled: userId != null,
  })
}
