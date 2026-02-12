"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { shortsApi } from "@/shared/api"
import type { Short } from "@/shared/types/models"

function updateShortInCache(
  queryClient: ReturnType<typeof useQueryClient>,
  shortId: number,
  updater: (s: Short) => Short
) {
  queryClient.setQueriesData<{ pages: { data: Short[] }[] }>(
    { queryKey: ["shorts", "feed"] },
    (data) => {
      if (!data?.pages) return data
      return {
        ...data,
        pages: data.pages.map((page) => ({
          ...page,
          data: (page.data ?? []).map((s) => (s.id === shortId ? updater(s) : s)),
        })),
      }
    }
  )
}

export function useShortLike() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (shortId: number) => shortsApi.like(shortId),
    onMutate: async (shortId) => {
      await queryClient.cancelQueries({ queryKey: ["shorts"] })
      updateShortInCache(queryClient, shortId, (s) => ({
        ...s,
        liked: true,
        likes: (s.likes ?? s.likes_count ?? 0) + 1,
      }))
    },
    onError: (_err, shortId) => {
      updateShortInCache(queryClient, shortId, (s) => ({
        ...s,
        liked: false,
        likes: Math.max(0, (s.likes ?? s.likes_count ?? 0) - 1),
      }))
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["shorts"] })
    },
  })
}

export function useShortUnlike() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (shortId: number) => shortsApi.unlike(shortId),
    onMutate: async (shortId) => {
      await queryClient.cancelQueries({ queryKey: ["shorts"] })
      updateShortInCache(queryClient, shortId, (s) => ({
        ...s,
        liked: false,
        likes: Math.max(0, (s.likes ?? s.likes_count ?? 0) - 1),
      }))
    },
    onError: (_err, shortId) => {
      updateShortInCache(queryClient, shortId, (s) => ({
        ...s,
        liked: true,
        likes: (s.likes ?? s.likes_count ?? 0) + 1,
      }))
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["shorts"] })
    },
  })
}
