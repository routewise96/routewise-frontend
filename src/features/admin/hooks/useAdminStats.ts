"use client"

import { useQuery } from "@tanstack/react-query"
import { adminApi } from "@/shared/api"

export function useAdminStats() {
  return useQuery({
    queryKey: ["admin", "stats"],
    queryFn: () => adminApi.getStats(),
    staleTime: 60000,
  })
}
