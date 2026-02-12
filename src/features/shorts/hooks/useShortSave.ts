"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { shortsApi } from "@/shared/api"
import type { Short } from "@/shared/types/models"

function updateShortInCache(
  queryClient: ReturnType<typeof useQueryClient>,
  shortId: number,
  saved: boolean
) {
  queryClient.setQueriesData<{ pages: { data: Short[] }[] }>(
    { queryKey: ["shorts", "feed"] },
    (data) => {
      if (!data?.pages) return data
      return {
        ...data,
        pages: data.pages.map((page) => ({
          ...page,
          data: (page.data ?? []).map((s) =>
            s.id === shortId ? { ...s, saved, is_saved: saved } : s
          ),
        })),
      }
    }
  )
}

export function useShortSave() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (shortId: number) => shortsApi.save(shortId),
    onMutate: async (shortId) => {
      await queryClient.cancelQueries({ queryKey: ["shorts"] })
      updateShortInCache(queryClient, shortId, true)
    },
    onError: (_err, shortId) => {
      updateShortInCache(queryClient, shortId, false)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["shorts"] })
    },
  })
}

export function useShortUnsave() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (shortId: number) => shortsApi.unsave(shortId),
    onMutate: async (shortId) => {
      await queryClient.cancelQueries({ queryKey: ["shorts"] })
      updateShortInCache(queryClient, shortId, false)
    },
    onError: (_err, shortId) => {
      updateShortInCache(queryClient, shortId, true)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["shorts"] })
    },
  })
}
