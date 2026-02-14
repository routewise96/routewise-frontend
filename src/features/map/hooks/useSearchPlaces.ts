"use client"

import { useMutation } from "@tanstack/react-query"
import { geoApi, placesApi } from "@/shared/api"
import type { Place } from "@/shared/types/models"
import type { PlaceResponse } from "@/shared/api"

export function useSearchPlaces() {
  return useMutation({
    mutationFn: async (q: string): Promise<Place[]> => {
      const normalize = (item: PlaceResponse): Place => ({
        id: String(item.id),
        name: item.name,
        address: item.address,
        lat: item.lat,
        lng: item.lng ?? item.lon ?? 0,
        category: item.category as Place["category"],
      })
      try {
        const data = await placesApi.searchPlaces(q, 20)
        return data.map(normalize)
      } catch {
        return geoApi.searchPlaces(q)
      }
    },
  })
}
