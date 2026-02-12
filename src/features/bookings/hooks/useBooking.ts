"use client"

import { useQuery } from "@tanstack/react-query"
import { bookingsApi } from "@/shared/api"

export function useBooking(id: string | null) {
  return useQuery({
    queryKey: ["booking", id],
    queryFn: () => bookingsApi.getById(id!),
    enabled: !!id,
  })
}
