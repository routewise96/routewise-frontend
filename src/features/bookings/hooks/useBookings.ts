"use client"

import { useInfiniteQuery } from "@tanstack/react-query"
import { bookingsApi } from "@/shared/api"
import type { BookingsParams } from "@/shared/api/endpoints/bookings"

const PAGE_SIZE = 10

export function useBookings(params?: Omit<BookingsParams, "page" | "limit">) {
  return useInfiniteQuery({
    queryKey: ["bookings", params?.status],
    queryFn: ({ pageParam = 1 }) =>
      bookingsApi.getAll({
        page: pageParam,
        limit: PAGE_SIZE,
        status: params?.status,
      }),
    getNextPageParam: (lastPage) => {
      const meta = lastPage?.meta
      if (!meta) return undefined
      const hasMore =
        meta.hasMore ?? (meta.page ?? 1) * (meta.limit ?? PAGE_SIZE) < (meta.total ?? 0)
      if (!hasMore) return undefined
      return (meta.page ?? 1) + 1
    },
    initialPageParam: 1,
  })
}
