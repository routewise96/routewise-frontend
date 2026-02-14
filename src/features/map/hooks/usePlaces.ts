"use client"

import { useQuery } from "@tanstack/react-query"
import { geoApi, placesApi } from "@/shared/api"
import type { BBox, PlaceFilters } from "@/shared/api/endpoints/geo"
import type { Place } from "@/shared/types/models"
import type { PlaceResponse } from "@/shared/api"

const STALE_TIME_MS = 60_000

export function usePlaces(bbox: BBox | null, filters?: PlaceFilters) {
  return useQuery({
    queryKey: ["places", bbox, filters],
    queryFn: async () => {
      const bboxValue = `${bbox!.minLng},${bbox!.minLat},${bbox!.maxLng},${bbox!.maxLat}`
      const normalize = (item: PlaceResponse): Place => ({
        id: String(item.id),
        name: item.name,
        address: item.address,
        lat: item.lat,
        lng: item.lng ?? item.lon ?? 0,
        category: item.category as Place["category"],
      })
      try {
        const data = await placesApi.getPlacesByBBox(bboxValue, 200)
        return data.map(normalize)
      } catch {
        return geoApi.getPlaces(bbox!, filters)
      }
    },
    enabled: bbox != null,
    staleTime: STALE_TIME_MS,
  })
}
