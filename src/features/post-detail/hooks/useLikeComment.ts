"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { commentsApi } from "@/shared/api"
import type { Comment } from "@/shared/types/models"

function updateCommentInCache(
  queryClient: ReturnType<typeof useQueryClient>,
  postId: string | number,
  commentId: number,
  updater: (c: Comment) => Comment
) {
  queryClient.setQueriesData<{ pages: Comment[][]; pageParams: unknown[] }>(
    { queryKey: ["post", postId, "comments"] },
    (data) => {
      if (!data) return data
      return {
        ...data,
        pages: data.pages.map((page) =>
          page.map((c) => (c.id === commentId ? updater(c) : c))
        ),
      }
    }
  )
}

export function useLikeComment(postId: string | number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (commentId: number) => commentsApi.like(commentId),
    onMutate: async (commentId) => {
      await queryClient.cancelQueries({
        queryKey: ["post", postId, "comments"],
      })
      const previous = queryClient.getQueriesData({
        queryKey: ["post", postId, "comments"],
      })
      updateCommentInCache(queryClient, postId, commentId, (c) => ({
        ...c,
        isLiked: true,
        likesCount: c.likesCount + 1,
      }))
      return { previous }
    },
    onError: (_, __, context) => {
      if (context?.previous) {
        context.previous.forEach(([key, data]) =>
          queryClient.setQueryData(key, data)
        )
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["post", postId, "comments"] })
    },
  })
}

export function useUnlikeComment(postId: string | number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (commentId: number) => commentsApi.unlike(commentId),
    onMutate: async (commentId) => {
      await queryClient.cancelQueries({
        queryKey: ["post", postId, "comments"],
      })
      const previous = queryClient.getQueriesData({
        queryKey: ["post", postId, "comments"],
      })
      updateCommentInCache(queryClient, postId, commentId, (c) => ({
        ...c,
        isLiked: false,
        likesCount: Math.max(0, c.likesCount - 1),
      }))
      return { previous }
    },
    onError: (_, __, context) => {
      if (context?.previous) {
        context.previous.forEach(([key, data]) =>
          queryClient.setQueryData(key, data)
        )
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["post", postId, "comments"] })
    },
  })
}
