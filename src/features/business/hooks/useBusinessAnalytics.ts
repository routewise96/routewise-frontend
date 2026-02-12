"use client"

import { useQuery } from "@tanstack/react-query"
import { businessApi } from "@/shared/api"

export type AnalyticsPeriod = "day" | "week" | "month" | "year"

export function useBusinessAnalytics(period: AnalyticsPeriod = "week") {
  return useQuery({
    queryKey: ["business", "analytics", period],
    queryFn: () => businessApi.getAnalytics(period),
    staleTime: 120000,
  })
}
