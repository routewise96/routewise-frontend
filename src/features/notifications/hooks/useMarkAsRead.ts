"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { notificationsApi } from "@/shared/api"
import type { Notification } from "@/shared/types/models"

export function useMarkAsRead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string | number) => notificationsApi.markAsRead(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["notifications"] })
      await queryClient.cancelQueries({ queryKey: ["notifications", "unread"] })
      const previousLists = queryClient.getQueriesData({ queryKey: ["notifications"] })
      const previousUnread = queryClient.getQueryData(["notifications", "unread"])
      queryClient.setQueriesData<{ pages: Notification[][]; pageParams: unknown[] }>(
        { queryKey: ["notifications"] },
        (old) => {
          if (!old) return old
          return {
            ...old,
            pages: old.pages.map((page) =>
              page.map((n) => (n.id === id ? { ...n, read: true } : n))
            ),
          }
        }
      )
      queryClient.setQueryData(["notifications", "unread"], (c: number) =>
        typeof c === "number" ? Math.max(0, c - 1) : 0
      )
      return { previousLists, previousUnread }
    },
    onError: (_, __, context) => {
      context?.previousLists?.forEach(([key, data]) =>
        queryClient.setQueryData(key, data)
      )
      if (context?.previousUnread !== undefined) {
        queryClient.setQueryData(["notifications", "unread"], context.previousUnread)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] })
      queryClient.invalidateQueries({ queryKey: ["notifications", "unread"] })
    },
  })
}
