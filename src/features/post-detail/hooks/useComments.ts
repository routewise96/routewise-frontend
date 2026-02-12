"use client"

import { useInfiniteQuery } from "@tanstack/react-query"
import { commentsApi } from "@/shared/api"
import { extractComments } from "../lib/extractComments"

const DEFAULT_LIMIT = 20

export function useComments(postId: string | number | undefined) {
  return useInfiniteQuery({
    queryKey: ["post", postId, "comments"],
    queryFn: async ({ pageParam }) => {
      const res = await commentsApi.getByPost(
        postId!,
        pageParam as number,
        DEFAULT_LIMIT
      )
      return extractComments(res)
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < DEFAULT_LIMIT) return undefined
      return allPages.length + 1
    },
    enabled: postId != null && postId !== "",
  })
}
