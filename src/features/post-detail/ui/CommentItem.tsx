"use client"

import { Heart, MessageCircle, MoreHorizontal, Flag, Trash2 } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { ru, enUS } from "date-fns/locale"
import { useTranslations, useLocale } from "next-intl"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Comment } from "@/shared/types/models"

interface CommentItemProps {
  comment: Comment
  isAuthor: boolean
  onLike: () => void
  onReply: () => void
}

function formatDate(createdAt: string, locale: string): string {
  try {
    const date = new Date(createdAt)
    if (Number.isNaN(date.getTime())) return createdAt
    return formatDistanceToNow(date, { addSuffix: true, locale: locale === "ru" ? ru : enUS })
  } catch {
    return createdAt
  }
}

export function CommentItem({
  comment,
  isAuthor,
  onLike,
  onReply,
}: CommentItemProps) {
  const t = useTranslations("postDetail")
  const locale = useLocale()
  const authorName =
    comment.author?.username ?? `User ${comment.authorId}`

  return (
    <div className="flex gap-3 py-3">
      <Link
        href={comment.authorId ? `/profile/${comment.authorId}` : "#"}
        className="shrink-0"
      >
        <Avatar className="h-9 w-9">
          <AvatarImage
            src={comment.author?.avatarUrl ?? comment.author?.avatar_url}
          />
          <AvatarFallback className="text-xs">
            {authorName.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </Link>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <Link
            href={comment.authorId ? `/profile/${comment.authorId}` : "#"}
            className="text-sm font-semibold text-foreground hover:underline"
          >
            {authorName}
          </Link>
          <span className="text-xs text-muted-foreground">
            {formatDate(comment.createdAt, locale)}
          </span>
        </div>
        <p className="mt-0.5 text-sm text-foreground break-words">
          {comment.content}
        </p>
        <div className="mt-1 flex items-center gap-3">
          <button
            type="button"
            onClick={onLike}
            className={`flex items-center gap-1 text-xs transition-colors ${
              comment.isLiked
                ? "text-destructive"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Heart
              className={`h-3.5 w-3.5 ${comment.isLiked ? "fill-current" : ""}`}
            />
            {comment.likesCount > 0 && <span>{comment.likesCount}</span>}
          </button>
          <button
            type="button"
            onClick={onReply}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            {t("reply")}
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="rounded p-1 text-muted-foreground hover:bg-secondary hover:text-foreground"
                aria-label={t("more")}
              >
                <MoreHorizontal className="h-3.5 w-3.5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem className="text-destructive focus:text-destructive">
                <Flag className="h-4 w-4 mr-2" />
                {t("report")}
              </DropdownMenuItem>
              {isAuthor && (
                <DropdownMenuItem className="text-destructive focus:text-destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  {t("delete")}
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}
