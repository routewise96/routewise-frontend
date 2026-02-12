"use client"

import { useQuery } from "@tanstack/react-query"
import { postsApi } from "@/shared/api"

export function usePost(id: string | number | undefined) {
  return useQuery({
    queryKey: ["post", id],
    queryFn: () => postsApi.getById(id!),
    enabled: id != null && id !== "",
  })
}
