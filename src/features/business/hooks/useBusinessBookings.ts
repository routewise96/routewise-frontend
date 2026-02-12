"use client"

import { useInfiniteQuery } from "@tanstack/react-query"
import { businessApi } from "@/shared/api"
import type { BusinessBookingsParams } from "@/shared/api/endpoints/business"

const PAGE_SIZE = 10

export function useBusinessBookings(
  params?: Omit<BusinessBookingsParams, "page">
) {
  return useInfiniteQuery({
    queryKey: ["business", "bookings", params?.status],
    queryFn: ({ pageParam = 1 }) =>
      businessApi.getBookings({
        page: pageParam,
        limit: PAGE_SIZE,
        status: params?.status,
      }),
    getNextPageParam: (lastPage) => {
      const meta = lastPage?.meta
      if (!meta) return undefined
      const page = meta.page ?? 1
      const limit = meta.limit ?? PAGE_SIZE
      const total = meta.total ?? 0
      if (page * limit >= total) return undefined
      return page + 1
    },
    initialPageParam: 1,
  })
}
