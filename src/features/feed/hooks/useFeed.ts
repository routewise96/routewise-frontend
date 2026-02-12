"use client"

import { useInfiniteQuery } from "@tanstack/react-query"
import { postsApi } from "@/shared/api"
import { extractPosts } from "../lib/extractPosts"

const DEFAULT_LIMIT = 10

export function useFeed(limit = DEFAULT_LIMIT) {
  return useInfiniteQuery({
    queryKey: ["feed", limit],
    queryFn: async ({ pageParam }) => {
      const res = await postsApi.feed(pageParam as number, limit)
      return extractPosts(res)
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < limit) return undefined
      return allPages.length + 1
    },
  })
}
