"use client"

import Link from "next/link"
import { useTranslations } from "next-intl"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import type { User } from "@/shared/types/models"
import { FollowButton } from "./FollowButton"

interface FollowingListProps {
  users: User[]
  isLoading: boolean
  currentUserId?: number
  hasNextPage?: boolean
  onLoadMore?: () => void
  isFetchingNextPage?: boolean
}

export function FollowingList({
  users,
  isLoading,
  currentUserId,
  hasNextPage,
  onLoadMore,
  isFetchingNextPage,
}: FollowingListProps) {
  const t = useTranslations("profile")

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 rounded-xl p-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-4 flex-1 max-w-[120px]" />
          </div>
        ))}
      </div>
    )
  }

  if (users.length === 0) {
    return (
      <p className="py-12 text-center text-muted-foreground">{t("noFollowing")}</p>
    )
  }

  return (
    <div className="space-y-2">
      {users.map((u) => (
        <Link
          key={u.id}
          href={`/profile/${u.id}`}
          className="flex items-center gap-3 rounded-xl p-3 hover:bg-secondary transition-colors"
        >
          <Avatar className="h-10 w-10">
            <AvatarImage src={u.avatarUrl ?? (u as { avatar_url?: string }).avatar_url} alt={u.username} />
            <AvatarFallback className="text-xs font-medium bg-muted text-foreground">
              {(u.username ?? "?").slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">{u.username}</p>
            {u.bio && (
              <p className="text-xs text-muted-foreground truncate max-w-xs">{u.bio}</p>
            )}
          </div>
          {currentUserId != null && u.id !== currentUserId && (
            <div onClick={(e) => e.preventDefault()}>
              <FollowButton
                userId={u.id}
                initialIsFollowing={u.isFollowing ?? false}
                size="sm"
              />
            </div>
          )}
        </Link>
      ))}
      {hasNextPage && onLoadMore && (
        <div className="flex justify-center py-4">
          <button
            type="button"
            onClick={onLoadMore}
            disabled={isFetchingNextPage}
            className="text-sm font-medium text-primary hover:underline disabled:opacity-50"
          >
            {isFetchingNextPage ? "..." : t("loadMore")}
          </button>
        </div>
      )}
    </div>
  )
}
