"use client"

import { useQuery } from "@tanstack/react-query"
import { businessApi } from "@/shared/api"

export function useBusinessDashboard() {
  return useQuery({
    queryKey: ["business", "dashboard"],
    queryFn: () => businessApi.getDashboard(),
    staleTime: 60000,
  })
}
