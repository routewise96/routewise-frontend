"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { postsApi } from "@/shared/api"
import type { Post } from "@/shared/types/models"

function updatePostInCache(
  queryClient: ReturnType<typeof useQueryClient>,
  postId: number,
  updater: (post: Post) => Post
) {
  queryClient.setQueriesData<{ pages: Post[][]; pageParams: unknown[] }>(
    { queryKey: ["feed"] },
    (data) => {
      if (!data) return data
      return {
        ...data,
        pages: data.pages.map((page) =>
          page.map((p) => (p.id === postId ? updater(p) : p))
        ),
      }
    }
  )
  queryClient.setQueryData<Post>(["post", postId], (post) =>
    post ? updater(post) : post
  )
}

export function useSave() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (postId: number) => postsApi.save(postId),
    onMutate: async (postId) => {
      await queryClient.cancelQueries({ queryKey: ["feed"] })
      await queryClient.cancelQueries({ queryKey: ["post", postId] })
      const previousFeed = queryClient.getQueriesData({ queryKey: ["feed"] })
      const previousPost = queryClient.getQueryData(["post", postId])
      updatePostInCache(queryClient, postId, (p) => ({ ...p, saved: true }))
      return { previousFeed, previousPost, postId }
    },
    onError: (_, postId, context) => {
      if (context?.previousFeed) {
        context.previousFeed.forEach(([key, data]) =>
          queryClient.setQueryData(key, data)
        )
      }
      const id = context?.postId ?? postId
      if (context?.previousPost !== undefined && id != null) {
        queryClient.setQueryData(["post", id], context.previousPost)
      }
    },
    onSettled: (_, __, postId) => {
      queryClient.invalidateQueries({ queryKey: ["feed"] })
      queryClient.invalidateQueries({ queryKey: ["post", postId] })
      queryClient.invalidateQueries({ queryKey: ["user", "me", "saved"] })
    },
  })
}
