"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { authApi } from "@/shared/api"
import { usersApi } from "@/shared/api"
import { useAuthStore } from "@/shared/store"
import type { User } from "@/shared/types/models"

function normalizeUser(data: Record<string, unknown>): User {
  return {
    id: (data.id as number) ?? 0,
    username: (data.username as string) ?? "",
    email: (data.email as string) ?? "",
    avatarUrl: (data.avatarUrl as string) ?? (data.avatar_url as string),
    bio: data.bio as string | undefined,
  }
}

export function useRegister(redirectTo?: string) {
  const queryClient = useQueryClient()
  const router = useRouter()
  const loginStore = useAuthStore((s) => s.login)

  return useMutation({
    mutationFn: (data: { username: string; email: string; password: string }) =>
      authApi.register(data),
    onSuccess: async (data, variables) => {
      const token = data.token ?? data.access_token
      if (!token) return
      let user: User
      try {
        const me = await usersApi.getMe()
        user = normalizeUser(me as unknown as Record<string, unknown>)
      } catch {
        const u = data.user as Record<string, unknown> | undefined
        user = u
          ? normalizeUser(u)
          : normalizeUser({
              id: 0,
              username: variables.username,
              email: variables.email,
            })
      }
      loginStore(token, user)
      queryClient.clear()
      if (redirectTo) router.replace(redirectTo)
    },
  })
}
