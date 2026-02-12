"use client"

import { useMemo } from "react"
import { useTranslations } from "next-intl"
import { Loader2 } from "lucide-react"
import type { Comment } from "@/shared/types/models"
import { CommentItem } from "./CommentItem"

interface CommentListProps {
  comments: Comment[]
  hasNextPage?: boolean
  isFetchingNextPage?: boolean
  onLoadMore?: () => void
  currentUserId?: number
  onLike: (commentId: number) => void
  onUnlike: (commentId: number) => void
  onReply: (comment: Comment) => void
}

export function CommentList({
  comments,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
  currentUserId,
  onLike,
  onUnlike,
  onReply,
}: CommentListProps) {
  const t = useTranslations("postDetail")

  const sorted = useMemo(() => {
    return [...comments].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  }, [comments])

  if (comments.length === 0) {
    return (
      <p className="py-6 text-center text-sm text-muted-foreground">
        {t("noComments")}
      </p>
    )
  }

  return (
    <div className="divide-y divide-border">
      {sorted.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          isAuthor={currentUserId === comment.authorId}
          onLike={() =>
            comment.isLiked ? onUnlike(comment.id) : onLike(comment.id)
          }
          onReply={() => onReply(comment)}
        />
      ))}
      {hasNextPage && onLoadMore && (
        <div className="flex justify-center py-4">
          <button
            type="button"
            onClick={onLoadMore}
            disabled={isFetchingNextPage}
            className="text-sm font-medium text-primary hover:underline disabled:opacity-50"
          >
            {isFetchingNextPage ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                {t("loading")}
              </span>
            ) : (
              t("loadMoreComments")
            )}
          </button>
        </div>
      )}
    </div>
  )
}
