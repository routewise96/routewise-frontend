"use client"

import { useMemo, useState } from "react"
import { useTranslations } from "next-intl"
import { ChevronDown, Loader2 } from "lucide-react"
import { useFeed, useLike, useUnlike, useSave, useUnsave } from "../hooks"
import { normalizePost } from "@/features/profile/lib/normalizePost"
import { useAuthStore } from "@/shared/store"
import { PostCard } from "./PostCard"
import { CommentSection } from "@/features/comments"
import { PostSkeleton } from "./PostSkeleton"
import { EmptyFeed } from "./EmptyFeed"
import { toast } from "sonner"

const FEED_LIMIT = 10

export interface FeedProps {
  onOpenLogin?: () => void
  onOpenRegister?: () => void
}

export function Feed({ onOpenLogin, onOpenRegister }: FeedProps) {
  const t = useTranslations("feed")
  const user = useAuthStore((s) => s.user)
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
    refetch,
  } = useFeed(FEED_LIMIT)

  const likeMutation = useLike()
  const unlikeMutation = useUnlike()
  const saveMutation = useSave()
  const unsaveMutation = useUnsave()
  const [openComments, setOpenComments] = useState<Set<number>>(new Set())

  const posts = useMemo(() => {
    if (!data?.pages) return []
    return data.pages.flat().map((p) => normalizePost(p, ""))
  }, [data])

  const handleToggleLike = (postId: number, currentlyLiked: boolean) => {
    if (!user) {
      onOpenLogin?.()
      return
    }
    if (currentlyLiked) {
      unlikeMutation.mutate(postId, {
        onError: () => toast.error(t("errorLike")),
      })
    } else {
      likeMutation.mutate(postId, {
        onError: () => toast.error(t("errorLike")),
      })
    }
  }

  const handleToggleSave = (postId: number, currentlySaved: boolean) => {
    if (!user) {
      onOpenLogin?.()
      return
    }
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

  const toggleComments = (postId: number) => {
    setOpenComments((prev) => {
      const next = new Set(prev)
      if (next.has(postId)) {
        next.delete(postId)
      } else {
        next.add(postId)
      }
      return next
    })
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-5">
        {Array.from({ length: 3 }).map((_, i) => (
          <PostSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-lg font-semibold text-foreground mb-2">
          {t("errorTitle")}
        </p>
        <p className="text-sm text-muted-foreground mb-4">
          {t("errorSubtitle")}
        </p>
        <button
          type="button"
          onClick={() => refetch()}
          className="rounded-xl border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground hover:bg-secondary"
        >
          {t("retry")}
        </button>
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <EmptyFeed
        isAuthenticated={!!user}
        onOpenLogin={onOpenLogin}
        onOpenRegister={onOpenRegister}
      />
    )
  }

  return (
    <>
      <div className="flex flex-col gap-5">
        {posts.map((post) => {
          const isOpen = openComments.has(post.id)
          return (
            <div key={post.id} className="space-y-3">
              <PostCard
                post={post}
                isAuthor={user?.id === post.authorId}
                onToggleLike={(id) => handleToggleLike(id, post.liked)}
                onToggleSave={(id) => handleToggleSave(id, post.saved)}
                onOpenLogin={!user ? onOpenLogin : undefined}
                onToggleComments={() => toggleComments(post.id)}
                commentsOpen={isOpen}
              />
              {isOpen && <CommentSection postId={post.id} />}
            </div>
          )
        })}
      </div>

      {hasNextPage && (
        <div className="flex justify-center py-8 pb-24 lg:pb-8">
          <button
            type="button"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="flex items-center gap-2 rounded-xl border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground transition-all hover:bg-secondary hover:border-primary/30 disabled:opacity-60 active:scale-95"
          >
            {isFetchingNextPage ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>{t("loading")}</span>
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4" />
                <span>{t("loadMore")}</span>
              </>
            )}
          </button>
        </div>
      )}
    </>
  )
}
