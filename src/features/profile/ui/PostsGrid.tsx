"use client"

import Link from "next/link"
import Image from "next/image"
import { useTranslations } from "next-intl"
import { ImageIcon } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import type { PostCardPost } from "@/features/profile/lib/normalizePost"

interface PostsGridProps {
  posts: PostCardPost[]
  isLoading: boolean
  hasNextPage?: boolean
  onLoadMore?: () => void
  isFetchingNextPage?: boolean
  onToggleLike?: (id: number) => void
  onToggleSave?: (id: number) => void
}

export function PostsGrid({
  posts,
  isLoading,
  hasNextPage,
  onLoadMore,
  isFetchingNextPage,
}: PostsGridProps) {
  const t = useTranslations("profile")

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="aspect-square rounded-xl" />
        ))}
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <p className="py-12 text-center text-muted-foreground">{t("noPosts")}</p>
    )
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.map((post) => (
          <Link key={post.id} href={`/post/${post.id}`} className="block aspect-square relative overflow-hidden rounded-xl bg-muted">
            {post.imageUrl ? (
              <Image
                src={post.imageUrl}
                alt={post.caption || "Post"}
                fill
                className="object-cover"
                sizes="(max-width:640px) 100vw, 33vw"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                <ImageIcon className="h-12 w-12" />
              </div>
            )}
          </Link>
        ))}
      </div>
      {hasNextPage && onLoadMore && (
        <div className="flex justify-center py-4">
          <button
            type="button"
            onClick={onLoadMore}
            disabled={isFetchingNextPage}
            className="rounded-xl border border-border bg-card px-6 py-2 text-sm font-medium hover:bg-secondary disabled:opacity-50"
          >
            {isFetchingNextPage ? "..." : t("loadMore")}
          </button>
        </div>
      )}
    </div>
  )
}
