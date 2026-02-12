"use client"

import { useInfiniteQuery } from "@tanstack/react-query"
import { shortsApi } from "@/shared/api"

const PAGE_SIZE = 5

export function useShortsFeed() {
  return useInfiniteQuery({
    queryKey: ["shorts", "feed"],
    queryFn: ({ pageParam = 1 }) => shortsApi.feed(pageParam, PAGE_SIZE),
    getNextPageParam: (lastPage) => {
      const meta = lastPage?.meta
      const data = lastPage?.data ?? lastPage?.posts ?? []
      if (meta?.hasMore === false) return undefined
      const nextPage = (meta?.page ?? 1) + 1
      return data.length < PAGE_SIZE ? undefined : nextPage
    },
    initialPageParam: 1,
  })
}
