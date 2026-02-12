"use client"

import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ShortsPlayer } from "./ShortsPlayer"
import { ShortsActions } from "./ShortsActions"
import type { NormalizedShort } from "../lib/normalizeShort"

interface ShortsSlideProps {
  short: NormalizedShort
  isActive: boolean
  shouldLoad: boolean
  onLike: () => void
  onComment: () => void
  onSave: () => void
  onRepost: () => void
}

export function ShortsSlide({
  short,
  isActive,
  shouldLoad,
  onLike,
  onComment,
  onSave,
  onRepost,
}: ShortsSlideProps) {
  const avatarUrl = short.avatarUrl ?? short.author?.avatarUrl
  const username = short.username ?? short.author?.username ?? ""

  return (
    <div className="relative flex min-h-[100dvh] w-full flex-shrink-0 snap-start snap-always items-center justify-center bg-black">
      <ShortsPlayer
        videoUrl={short.videoUrl}
        isActive={isActive}
        shouldLoad={shouldLoad}
      />
      <div className="absolute inset-0 flex flex-col justify-end p-4 pb-24">
        <div className="flex items-end gap-3">
          <Link
            href={short.authorId ? `/profile/${short.authorId}` : "#"}
            className="flex items-center gap-2"
          >
            <Avatar className="h-10 w-10 border-2 border-white">
              <AvatarImage src={avatarUrl} />
              <AvatarFallback className="bg-primary text-white text-xs">
                {(username || "?").slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="font-semibold text-white drop-shadow-md">
              @{username}
            </span>
          </Link>
        </div>
        {short.caption && (
          <p className="mt-2 line-clamp-2 max-w-[70%] text-sm text-white drop-shadow-md">
            {short.caption}
          </p>
        )}
      </div>
      <div className="absolute bottom-24 right-4 z-10">
        <ShortsActions
          short={short}
          onLike={onLike}
          onComment={onComment}
          onSave={onSave}
          onRepost={onRepost}
        />
      </div>
    </div>
  )
}
