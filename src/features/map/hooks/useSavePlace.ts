"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { QueryClient } from "@tanstack/react-query"
import { geoApi } from "@/shared/api"
import type { Place } from "@/shared/types/models"

function updatePlaceInCache(
  queryClient: QueryClient,
  placeId: string,
  isSaved: boolean
) {
  queryClient.setQueriesData<Place[]>(
    { queryKey: ["places"] },
    (old) =>
      Array.isArray(old) ? old.map((p) => (p.id === placeId ? { ...p, isSaved } : p)) : old
  )
  queryClient.setQueriesData<Place[]>(
    { queryKey: ["search-places"] },
    (old) =>
      Array.isArray(old) ? old.map((p) => (p.id === placeId ? { ...p, isSaved } : p)) : old
  )
}

export function useSavePlace() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (placeId: string) => geoApi.savePlace(placeId),
    onMutate: async (placeId) => {
      await queryClient.cancelQueries({ queryKey: ["places"] })
      await queryClient.cancelQueries({ queryKey: ["search-places"] })
      updatePlaceInCache(queryClient, placeId, true)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["places"] })
      queryClient.invalidateQueries({ queryKey: ["search-places"] })
      queryClient.invalidateQueries({ queryKey: ["saved-places"] })
    },
    onError: (_err, placeId) => {
      updatePlaceInCache(queryClient, placeId, false)
    },
  })
}

export function useUnsavePlace() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (placeId: string) => geoApi.unsavePlace(placeId),
    onMutate: async (placeId) => {
      await queryClient.cancelQueries({ queryKey: ["places"] })
      await queryClient.cancelQueries({ queryKey: ["search-places"] })
      updatePlaceInCache(queryClient, placeId, false)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["places"] })
      queryClient.invalidateQueries({ queryKey: ["search-places"] })
      queryClient.invalidateQueries({ queryKey: ["saved-places"] })
    },
    onError: (_err, placeId) => {
      updatePlaceInCache(queryClient, placeId, true)
    },
  })
}
