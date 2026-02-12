"use client"

import { useInfiniteQuery } from "@tanstack/react-query"
import { usersApi } from "@/shared/api"
import type { Post } from "@/shared/types/models"

function extractPosts(data: unknown): Post[] {
  if (Array.isArray(data)) return data as Post[]
  if (data && typeof data === "object") {
    const o = data as Record<string, unknown>
    if (Array.isArray(o.posts)) return o.posts as Post[]
    if (Array.isArray(o.data)) return o.data as Post[]
    if (Array.isArray(o.items)) return o.items as Post[]
  }
  return []
}

export function useSavedPosts() {
  return useInfiniteQuery({
    queryKey: ["user", "me", "saved"],
    queryFn: async ({ pageParam }) => {
      const res = await usersApi.getSavedPosts(pageParam as number)
      return extractPosts(res)
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < 10) return undefined
      return allPages.length + 1
    },
  })
}
