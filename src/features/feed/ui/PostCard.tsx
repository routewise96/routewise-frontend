"use client"

import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
  MapPin,
  ImageIcon,
  Trash2,
  Pencil,
  Flag,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { ru, enUS } from "date-fns/locale"
import { useTranslations, useLocale } from "next-intl"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { PostCardPost } from "@/features/profile/lib/normalizePost"

interface PostCardProps {
  post: PostCardPost
  isAuthor?: boolean
  onToggleLike: (id: number) => void
  onToggleSave: (id: number) => void
  onOpenLogin?: () => void
}

function formatDate(timestamp: string, locale: string): string {
  if (!timestamp) return ""
  try {
    const date = new Date(timestamp)
    if (Number.isNaN(date.getTime())) return timestamp
    const localeFn = locale === "ru" ? ru : enUS
    return formatDistanceToNow(date, { addSuffix: true, locale: localeFn })
  } catch {
    return timestamp
  }
}

export function PostCard({
  post,
  isAuthor,
  onToggleLike,
  onToggleSave,
  onOpenLogin,
}: PostCardProps) {
  const t = useTranslations("feed")
  const locale = useLocale()
  const displayDate = formatDate(post.timestamp, locale)

  const handleLike = () => {
    if (onOpenLogin) {
      onOpenLogin()
      return
    }
    onToggleLike(post.id)
  }

  const handleSave = () => {
    if (onOpenLogin) {
      onOpenLogin()
      return
    }
    onToggleSave(post.id)
  }

  return (
    <article className="rounded-2xl border border-border bg-card overflow-hidden transition-colors hover:border-border/80">
      {/* Card Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <Link
          href={post.authorId != null ? `/profile/${post.authorId}` : `/profile/${post.username}`}
          className="flex items-center gap-3 hover:opacity-90"
        >
          <Avatar className="h-10 w-10 ring-2 ring-border">
            <AvatarImage src={post.avatarUrl} alt={post.username} />
            <AvatarFallback className="text-xs font-medium bg-muted text-foreground">
              {(post.username || "?").slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-semibold text-foreground">
              {post.username}
            </p>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              {post.location ? (
                <>
                  <MapPin className="h-3 w-3" />
                  <span>{post.location}</span>
                </>
              ) : (
                <span>{displayDate}</span>
              )}
            </div>
          </div>
        </Link>
        <div className="flex items-center gap-2">
          {post.location && (
            <span className="text-xs text-muted-foreground">{displayDate}</span>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                aria-label={t("more")}
              >
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="text-destructive focus:text-destructive">
                <Flag className="h-4 w-4 mr-2" />
                {t("report")}
              </DropdownMenuItem>
              {isAuthor && (
                <>
                  <DropdownMenuItem asChild>
                    <Link href={`/post/${post.id}/edit`}>
                      <Pencil className="h-4 w-4 mr-2" />
                      {t("edit")}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive focus:text-destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    {t("delete")}
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Post Image */}
      <div className="relative aspect-video w-full overflow-hidden bg-muted">
        {post.imageUrl ? (
          <Image
            src={post.imageUrl}
            alt={post.caption || "Post"}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 600px"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            <ImageIcon className="h-12 w-12" />
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="px-4 pt-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <button
              onClick={handleLike}
              className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all active:scale-90 ${
                post.liked
                  ? "text-destructive"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
              aria-label={post.liked ? t("unlike") : t("like")}
            >
              <Heart
                className={`h-5 w-5 transition-all ${
                  post.liked ? "fill-current scale-110" : ""
                }`}
              />
            </button>
            <Link
              href={`/post/${post.id}`}
              className="flex h-10 w-10 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              aria-label={t("comment")}
            >
              <MessageCircle className="h-5 w-5" />
            </Link>
            <button
              className="flex h-10 w-10 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              aria-label={t("repost")}
              title={t("repost")}
            >
              <Share2 className="h-5 w-5" />
            </button>
          </div>
          <button
            onClick={handleSave}
            className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all active:scale-90 ${
              post.saved
                ? "text-primary"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            }`}
            aria-label={post.saved ? t("unsave") : t("save")}
          >
            <Bookmark
              className={`h-5 w-5 ${post.saved ? "fill-current" : ""}`}
            />
          </button>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 py-2 text-sm">
          <span className="font-semibold text-foreground">
            {post.likes.toLocaleString()}{" "}
            <span className="font-normal text-muted-foreground">
              {post.likes === 1 ? t("likeCountOne") : t("likeCount")}
            </span>
          </span>
          <span className="font-semibold text-foreground">
            {post.comments}{" "}
            <span className="font-normal text-muted-foreground">
              {t("commentCount")}
            </span>
          </span>
        </div>

        {/* Caption */}
        <div className="pb-4">
          <p className="text-sm text-foreground leading-relaxed">
            <span className="font-semibold">{post.username}</span>{" "}
            {post.caption}
          </p>
          {post.hashtags && post.hashtags.length > 0 && (
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {post.hashtags.map((tag) => (
                <span
                  key={tag}
                  className="text-sm font-medium text-primary hover:text-primary/80 cursor-pointer transition-colors"
                >
                  {tag.startsWith("#") ? tag : `#${tag}`}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </article>
  )
}
