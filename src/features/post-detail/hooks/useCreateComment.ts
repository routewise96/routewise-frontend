"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { commentsApi } from "@/shared/api"
import type { Comment } from "@/shared/types/models"
import { useAuthStore } from "@/shared/store"

export function useCreateComment(postId: string | number) {
  const queryClient = useQueryClient()
  const user = useAuthStore((s) => s.user)

  return useMutation({
    mutationFn: ({
      content,
      parentId,
    }: {
      content: string
      parentId?: number
    }) => commentsApi.create(postId, content.trim(), parentId),
    onMutate: async ({ content }) => {
      await queryClient.cancelQueries({
        queryKey: ["post", postId, "comments"],
      })
      const previous = queryClient.getQueriesData({
        queryKey: ["post", postId, "comments"],
      })
      const optimisticComment: Comment = {
        id: -Date.now(),
        postId: Number(postId),
        authorId: user?.id ?? 0,
        author: user
          ? {
              id: user.id,
              username: user.username,
              email: user.email,
              avatarUrl: user.avatarUrl,
            }
          : undefined,
        content: content.trim(),
        likesCount: 0,
        isLiked: false,
        createdAt: new Date().toISOString(),
      }
      queryClient.setQueriesData<{
        pages: Comment[][]
        pageParams: unknown[]
      }>({ queryKey: ["post", postId, "comments"] }, (old) => {
        if (!old) return old
        const firstPage = [optimisticComment, ...(old.pages[0] ?? [])]
        return { ...old, pages: [firstPage, ...old.pages.slice(1)] }
      })
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
      queryClient.invalidateQueries({ queryKey: ["post", postId] })
    },
  })
}
