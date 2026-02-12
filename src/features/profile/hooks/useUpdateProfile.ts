"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { usersApi } from "@/shared/api"
import { useAuthStore } from "@/shared/store"
import { userProfileQueryKey } from "./useUserProfile"

export function useUpdateProfile() {
  const queryClient = useQueryClient()
  const setUser = useAuthStore((s) => s.setUser)

  return useMutation({
    mutationFn: (data: FormData) => usersApi.updateMe(data),
    onSuccess: (updated) => {
      const user = {
        id: updated.id,
        username: updated.username ?? "",
        email: updated.email ?? "",
        avatarUrl: (updated as { avatarUrl?: string; avatar_url?: string }).avatarUrl ?? (updated as { avatar_url?: string }).avatar_url,
        bio: updated.bio,
      }
      setUser(user)
      queryClient.setQueryData(userProfileQueryKey(undefined), updated)
      queryClient.invalidateQueries({ queryKey: ["user", "me"] })
    },
  })
}
