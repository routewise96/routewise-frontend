"use client"

import Link from "next/link"
import { Video } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { LiveStream } from "@/shared/api"

interface LiveCardProps {
  stream: LiveStream
}

export function LiveCard({ stream }: LiveCardProps) {
  const username = stream.user?.username ?? `user-${stream.user_id}`
  const avatar =
    stream.user?.avatarUrl ?? stream.user?.avatar_url ?? stream.user?.avatar

  return (
    <Card className="overflow-hidden border-border/60 bg-card hover:border-primary/40 transition-colors">
      <Link href={`/live/${stream.id}`} className="block">
        <div className="relative h-40 w-full bg-gradient-to-br from-muted/60 to-muted flex items-center justify-center">
          <div className="flex items-center gap-2 rounded-full bg-background/70 px-3 py-1 text-xs font-medium text-foreground">
            <Video className="h-3.5 w-3.5 text-primary" />
            LIVE
          </div>
        </div>
        <CardContent className="space-y-3 p-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarImage src={avatar} />
              <AvatarFallback className="text-xs font-semibold bg-muted text-foreground">
                {username.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-semibold text-foreground">{stream.title}</p>
              <p className="text-xs text-muted-foreground">@{username}</p>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{stream.viewer_count} зрителей</span>
            <span>{stream.like_count} лайков</span>
          </div>
        </CardContent>
      </Link>
    </Card>
  )
}
