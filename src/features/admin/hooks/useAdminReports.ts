"use client"

import { useInfiniteQuery } from "@tanstack/react-query"
import { adminApi } from "@/shared/api"
import type { AdminReportsParams } from "@/shared/api"

const PAGE = 20

export function useAdminReports(params?: Omit<AdminReportsParams, "page">) {
  return useInfiniteQuery({
    queryKey: ["admin", "reports", params?.status],
    queryFn: ({ pageParam = 1 }) => adminApi.getReports({ ...params, page: pageParam }),
    getNextPageParam: (last) => {
      const m = last?.meta
      if (!m) return undefined
      if ((m.page ?? 1) * (m.limit ?? PAGE) >= (m.total ?? 0)) return undefined
      return (m.page ?? 1) + 1
    },
    initialPageParam: 1,
  })
}
