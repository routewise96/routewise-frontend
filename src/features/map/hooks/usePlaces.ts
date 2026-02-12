"use client"

import { useQuery } from "@tanstack/react-query"
import { geoApi } from "@/shared/api"
import type { BBox, PlaceFilters } from "@/shared/api/endpoints/geo"

const STALE_TIME_MS = 60_000

export function usePlaces(bbox: BBox | null, filters?: PlaceFilters) {
  return useQuery({
    queryKey: ["places", bbox, filters],
    queryFn: () => geoApi.getPlaces(bbox!, filters),
    enabled: bbox != null,
    staleTime: STALE_TIME_MS,
  })
}
