"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { usersApi } from "@/shared/api"
import type { NotificationSettings } from "@/shared/types/models"

export function useUpdateNotificationSettings() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (settings: Partial<NotificationSettings>) =>
      usersApi.updateNotificationSettings(settings),
    onMutate: async (newSettings) => {
      await queryClient.cancelQueries({ queryKey: ["notificationSettings"] })
      const previous = queryClient.getQueryData<NotificationSettings>(["notificationSettings"])
      queryClient.setQueryData<NotificationSettings>(["notificationSettings"], (old) =>
        old ? { ...old, ...newSettings } : (newSettings as NotificationSettings)
      )
      return { previous }
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["notificationSettings"], context.previous)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["notificationSettings"] })
    },
  })
}
