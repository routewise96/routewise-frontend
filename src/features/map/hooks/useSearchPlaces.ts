"use client"

import { useMutation } from "@tanstack/react-query"
import { geoApi } from "@/shared/api"

export function useSearchPlaces() {
  return useMutation({
    mutationFn: (q: string) => geoApi.searchPlaces(q),
  })
}
