"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { shortsApi } from "@/shared/api"
import type { Comment } from "@/shared/types/models"

export function useShortComments(shortId: number | null) {
  return useQuery({
    queryKey: ["shorts", shortId, "comments"],
    queryFn: () => shortsApi.getComments(shortId!, 1, 50),
    enabled: shortId != null,
  })
}

export function useShortCreateComment(shortId: number | null) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (content: string) => shortsApi.createComment(shortId!, content),
    onSuccess: () => {
      if (shortId != null) {
        queryClient.invalidateQueries({ queryKey: ["shorts", shortId, "comments"] })
        queryClient.invalidateQueries({ queryKey: ["shorts", "feed"] })
      }
    },
  })
}
