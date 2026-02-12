"use client"

import { useMutation } from "@tanstack/react-query"
import { geoApi } from "@/shared/api"

export function useRoute() {
  return useMutation({
    mutationFn: ({
      start,
      end,
    }: {
      start: { lat: number; lng: number }
      end: { lat: number; lng: number }
    }) => geoApi.getRoute(start, end),
  })
}
