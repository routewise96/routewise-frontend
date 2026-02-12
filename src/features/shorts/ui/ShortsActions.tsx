"use client"

import { useTranslations } from "next-intl"
import { Heart, MessageCircle, Bookmark, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { NormalizedShort } from "../lib/normalizeShort"

interface ShortsActionsProps {
  short: NormalizedShort
  onLike: () => void
  onComment: () => void
  onSave: () => void
  onRepost: () => void
}

export function ShortsActions({
  short,
  onLike,
  onComment,
  onSave,
  onRepost,
}: ShortsActionsProps) {
  const t = useTranslations("shorts")

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex flex-col items-center gap-1">
        <Button
          size="icon"
          variant="ghost"
          className="h-12 w-12 rounded-full bg-white/10 text-white hover:bg-white/20"
          onClick={onLike}
          aria-label={t("like")}
        >
          <Heart
            className={`h-7 w-7 ${short.liked ? "fill-red-500 text-red-500" : ""}`}
          />
        </Button>
        <span className="text-xs text-white/90">{short.likes}</span>
      </div>
      <div className="flex flex-col items-center gap-1">
        <Button
          size="icon"
          variant="ghost"
          className="h-12 w-12 rounded-full bg-white/10 text-white hover:bg-white/20"
          onClick={onComment}
          aria-label={t("comment")}
        >
          <MessageCircle className="h-7 w-7" />
        </Button>
        <span className="text-xs text-white/90">{short.comments}</span>
      </div>
      <div className="flex flex-col items-center gap-1">
        <Button
          size="icon"
          variant="ghost"
          className="h-12 w-12 rounded-full bg-white/10 text-white hover:bg-white/20"
          onClick={onSave}
          aria-label={t("save")}
        >
          <Bookmark
            className={`h-7 w-7 ${short.saved ? "fill-white text-white" : ""}`}
          />
        </Button>
      </div>
      <div className="flex flex-col items-center gap-1">
        <Button
          size="icon"
          variant="ghost"
          className="h-12 w-12 rounded-full bg-white/10 text-white hover:bg-white/20"
          onClick={onRepost}
          aria-label={t("repost")}
        >
          <Share2 className="h-7 w-7" />
        </Button>
      </div>
    </div>
  )
}
