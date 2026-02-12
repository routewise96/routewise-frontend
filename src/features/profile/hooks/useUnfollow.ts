"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { usersApi } from "@/shared/api"
import { useAuthStore } from "@/shared/store"

export function useUnfollow(userId: string | number) {
  const queryClient = useQueryClient()
  const currentUserId = useAuthStore((s) => s.user?.id)

  return useMutation({
    mutationFn: () => usersApi.unfollow(userId),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["user", String(userId)] })
      await queryClient.cancelQueries({ queryKey: ["user", userId, "followers"] })
      if (currentUserId != null) {
        await queryClient.cancelQueries({ queryKey: ["user", currentUserId, "following"] })
      }
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["user", String(id)] })
      queryClient.invalidateQueries({ queryKey: ["user", id, "followers"] })
      queryClient.invalidateQueries({ queryKey: ["user", id, "following"] })
      if (currentUserId != null) {
        queryClient.invalidateQueries({ queryKey: ["user", currentUserId, "following"] })
      }
    },
  })
}
