"use client"

import { useInfiniteQuery } from "@tanstack/react-query"
import { adminApi } from "@/shared/api"
import type { AdminPostsParams } from "@/shared/api"

const PAGE = 20

export function useAdminPosts(params?: Omit<AdminPostsParams, "page">) {
  return useInfiniteQuery({
    queryKey: ["admin", "posts", params?.search, params?.reported],
    queryFn: ({ pageParam = 1 }) => adminApi.getPosts({ ...params, page: pageParam }),
    getNextPageParam: (last) => {
      const m = last?.meta
      if (!m) return undefined
      if ((m.page ?? 1) * (m.limit ?? PAGE) >= (m.total ?? 0)) return undefined
      return (m.page ?? 1) + 1
    },
    initialPageParam: 1,
  })
}
