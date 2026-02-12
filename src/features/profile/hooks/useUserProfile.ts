"use client"

import { useQuery } from "@tanstack/react-query"
import { usersApi } from "@/shared/api"

const queryKey = (id: string | undefined) => ["user", id ?? "me"] as const

export function useUserProfile(id?: string) {
  return useQuery({
    queryKey: queryKey(id),
    queryFn: () => (id ? usersApi.getById(id) : usersApi.getMe()),
    enabled: id !== undefined || true,
  })
}

export { queryKey as userProfileQueryKey }
