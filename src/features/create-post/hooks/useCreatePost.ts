"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { postsApi } from "@/shared/api"
import type { Post } from "@/shared/types/models"

export function useCreatePost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (formData: FormData) => postsApi.create(formData),
    onSuccess: (newPost) => {
      queryClient.invalidateQueries({ queryKey: ["feed"] })
      queryClient.setQueriesData<{ pages: Post[][]; pageParams: unknown[] }>(
        { queryKey: ["feed"] },
        (old) => {
          if (!old) return old
          const firstPage = [newPost as Post, ...(old.pages[0] ?? [])]
          return {
            ...old,
            pages: [firstPage, ...old.pages.slice(1)],
          }
        }
      )
      queryClient.setQueryData(["post", newPost.id], newPost)
    },
  })
}
