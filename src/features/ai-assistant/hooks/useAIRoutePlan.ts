"use client"

import { useMutation } from "@tanstack/react-query"
import { aiApi } from "@/shared/api"
import type { GeoPoint } from "@/shared/types/models"
import type { RoutePlan } from "@/shared/types/models"

export function useAIRoutePlan() {
  return useMutation({
    mutationFn: (params: {
      start: GeoPoint
      end?: GeoPoint
      interests?: string[]
    }) => aiApi.planRoute(params),
  })
}

export type { RoutePlan }
