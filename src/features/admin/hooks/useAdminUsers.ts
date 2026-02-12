"use client"

import { useInfiniteQuery } from "@tanstack/react-query"
import { adminApi } from "@/shared/api"
import type { AdminUsersParams } from "@/shared/api"

const PAGE = 20

export function useAdminUsers(params?: Omit<AdminUsersParams, "page">) {
  return useInfiniteQuery({
    queryKey: ["admin", "users", params?.search, params?.role],
    queryFn: ({ pageParam = 1 }) => adminApi.getUsers({ ...params, page: pageParam }),
    getNextPageParam: (last) => {
      const m = last?.meta
      if (!m) return undefined
      if ((m.page ?? 1) * (m.limit ?? PAGE) >= (m.total ?? 0)) return undefined
      return (m.page ?? 1) + 1
    },
    initialPageParam: 1,
  })
}
