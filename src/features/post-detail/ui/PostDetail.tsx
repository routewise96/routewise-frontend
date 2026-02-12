"use client"

import { useMemo, useState } from "react"
import { useTranslations } from "next-intl"
import { PostCard } from "@/features/feed"
import { normalizePost } from "@/features/profile/lib/normalizePost"
import { useLike, useUnlike, useSave, useUnsave } from "@/features/feed"
import { useAuthStore } from "@/shared/store"
import type { Post } from "@/shared/types/models"
import { toast } from "sonner"
import { CommentList } from "./CommentList"
import { CommentForm } from "./CommentForm"
import { useComments, useCreateComment, useLikeComment, useUnlikeComment } from "../hooks"
import type { Comment } from "@/shared/types/models"

interface PostDetailProps {
  post: Post
  onNotFound?: () => void
}

export function PostDetail({ post }: PostDetailProps) {
  const t = useTranslations("postDetail")
  const user = useAuthStore((s) => s.user)
  const normalized = useMemo(() => normalizePost(post, ""), [post])

  const likeMutation = useLike()
  const unlikeMutation = useUnlike()
  const saveMutation = useSave()
  const unsaveMutation = useUnsave()

  const {
    data: commentsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useComments(post.id)
  const createComment = useCreateComment(post.id)
  const likeComment = useLikeComment(post.id)
  const unlikeComment = useUnlikeComment(post.id)

  const [replyTo, setReplyTo] = useState<Comment | null>(null)

  const comments = useMemo(() => {
    if (!commentsData?.pages) return []
    return commentsData.pages.flat()
  }, [commentsData])

  const handleToggleLike = (postId: number, currentlyLiked: boolean) => {
    if (!user) return
    if (currentlyLiked) {
      unlikeMutation.mutate(postId, { onError: () => toast.error(t("errorLike")) })
    } else {
      likeMutation.mutate(postId, { onError: () => toast.error(t("errorLike")) })
    }
  }

  const handleToggleSave = (postId: number, currentlySaved: boolean) => {
    if (!user) return
    if (currentlySaved) {
      unsaveMutation.mutate(postId, {
        onError: () => toast.error(t("errorSave")),
      })
    } else {
      saveMutation.mutate(postId, {
        onError: () => toast.error(t("errorSave")),
      })
    }
  }

  const handleSubmitComment = async (content: string) => {
    await createComment.mutateAsync({
      content,
      parentId: replyTo?.id,
    })
  }

  return (
    <div className="space-y-6">
      <PostCard
        post={normalized}
        isAuthor={user?.id === post.authorId || user?.id === post.author?.id}
        onToggleLike={(id) => handleToggleLike(id, normalized.liked)}
        onToggleSave={(id) => handleToggleSave(id, normalized.saved)}
      />

      <section className="rounded-2xl border border-border bg-card p-4">
        <h2 className="mb-4 text-lg font-semibold text-foreground">
          {t("comments")} {post.comments ?? post.comments_count ?? comments.length}
        </h2>

        {user && (
          <div className="mb-4">
            <CommentForm
              onSubmit={handleSubmitComment}
              replyTo={replyTo?.author?.username ?? null}
              onCancelReply={() => setReplyTo(null)}
            />
          </div>
        )}

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
      </section>
    </div>
  )
}
