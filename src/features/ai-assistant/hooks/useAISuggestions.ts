"use client"

import { useQuery } from "@tanstack/react-query"
import { aiApi } from "@/shared/api"
import type { GeoPoint } from "@/shared/types/models"

export function useAISuggestions(context?: { query?: string; location?: GeoPoint }) {
  return useQuery({
    queryKey: ["ai", "suggestions", context?.query, context?.location],
    queryFn: () => aiApi.getSuggestions(context),
    staleTime: 60_000,
  })
}
