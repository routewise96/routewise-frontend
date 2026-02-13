"use client"

import { Heart, Eye, StopCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { LiveStream } from "@/shared/api"

interface LiveInfoProps {
  stream: LiveStream
  isLiked: boolean
  isAuthor: boolean
  onToggleLike: () => void
  onStop: () => void
}

export function LiveInfo({
  stream,
  isLiked,
  isAuthor,
  onToggleLike,
  onStop,
}: LiveInfoProps) {
  const username = stream.user?.username ?? `user-${stream.user_id}`
  const avatar =
    stream.user?.avatarUrl ?? stream.user?.avatar_url ?? stream.user?.avatar

  return (
    <div className="rounded-2xl border border-border bg-card p-4 space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">
            {stream.status === "live" ? "В эфире" : "Эфир завершён"}
          </p>
          <h1 className="text-xl font-semibold text-foreground">{stream.title}</h1>
          {stream.description && (
            <p className="text-sm text-muted-foreground">{stream.description}</p>
          )}
        </div>
        {isAuthor && stream.status === "live" && (
          <Button variant="destructive" size="sm" onClick={onStop}>
            <StopCircle className="h-4 w-4" />
            Завершить
          </Button>
        )}
      </div>

      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src={avatar} />
            <AvatarFallback className="text-xs font-semibold bg-muted text-foreground">
              {username.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium text-foreground">@{username}</p>
            <p className="text-xs text-muted-foreground">Автор трансляции</p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Eye className="h-4 w-4" />
            {stream.viewer_count}
          </span>
          <span className="inline-flex items-center gap-1">
            <Heart className={`h-4 w-4 ${isLiked ? "fill-primary text-primary" : ""}`} />
            {stream.like_count}
          </span>
        </div>
        <Button variant={isLiked ? "secondary" : "outline"} size="sm" onClick={onToggleLike}>
          <Heart className={`h-4 w-4 ${isLiked ? "fill-primary text-primary" : ""}`} />
          {isLiked ? "Убрать лайк" : "Лайк"}
        </Button>
      </div>
    </div>
  )
}
