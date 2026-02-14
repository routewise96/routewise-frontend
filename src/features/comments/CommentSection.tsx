"use client"

import { useMemo, useState } from "react"
import { useTranslations } from "next-intl"
import { useAuthStore } from "@/shared/store"
import type { Comment } from "@/shared/types/models"
import {
  useComments,
  useCreateComment,
  useLikeComment,
  useUnlikeComment,
} from "@/features/post-detail/hooks"
import { CommentList } from "@/features/post-detail/ui/CommentList"
import { CommentForm } from "@/features/post-detail/ui/CommentForm"

interface CommentSectionProps {
  postId: number
}

export function CommentSection({ postId }: CommentSectionProps) {
  const t = useTranslations("postDetail")
  const user = useAuthStore((s) => s.user)
  const [replyTo, setReplyTo] = useState<Comment | null>(null)

  const {
    data: commentsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useComments(postId)
  const createComment = useCreateComment(postId)
  const likeComment = useLikeComment(postId)
  const unlikeComment = useUnlikeComment(postId)

  const comments = useMemo(() => {
    if (!commentsData?.pages) return []
    return commentsData.pages.flat()
  }, [commentsData])

  const handleSubmitComment = async (content: string) => {
    await createComment.mutateAsync({
      content,
      parentId: replyTo?.id,
    })
  }

  return (
    <section className="rounded-2xl border border-border bg-card p-4 space-y-4">
      <h3 className="text-sm font-semibold text-foreground">{t("comments")}</h3>
      <div className="max-h-72 overflow-y-auto">
        <CommentList
          comments={comments}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          onLoadMore={() => fetchNextPage()}
          currentUserId={user?.id}
          onLike={(id) => likeComment.mutate(id)}
          onUnlike={(id) => unlikeComment.mutate(id)}
          onReply={setReplyTo}
        />
      </div>
      {user ? (
        <CommentForm
          onSubmit={handleSubmitComment}
          replyTo={replyTo?.author?.username ?? null}
          onCancelReply={() => setReplyTo(null)}
        />
      ) : (
        <p className="text-xs text-muted-foreground">
          {t("comment")} доступен после входа
        </p>
      )}
    </section>
  )
}
