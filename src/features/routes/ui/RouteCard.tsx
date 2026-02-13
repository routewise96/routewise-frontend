"use client"

import Link from "next/link"
import { Heart, Bookmark } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { UserRoute } from "@/shared/api"

interface RouteCardProps {
  route: UserRoute
  isLiked: boolean
  isSaved: boolean
  onToggleLike: () => void
  onToggleSave: () => void
}

export function RouteCard({
  route,
  isLiked,
  isSaved,
  onToggleLike,
  onToggleSave,
}: RouteCardProps) {
  const username = route.user?.username ?? `user-${route.user_id}`
  const avatar =
    route.user?.avatarUrl ?? route.user?.avatar_url ?? route.user?.avatar

  return (
    <Card className="border-border/60 bg-card">
      <CardContent className="p-4 space-y-4">
        <Link href={`/routes/${route.id}`} className="block">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground">{route.title}</h3>
            {route.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {route.description}
              </p>
            )}
          </div>
        </Link>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{route.distance ? `${route.distance.toFixed(1)} км` : "Без данных"}</span>
          <span>{route.duration ? `${route.duration} мин` : ""}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-7 w-7">
              <AvatarImage src={avatar} />
              <AvatarFallback className="text-[10px] font-semibold bg-muted text-foreground">
                {username.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground">@{username}</span>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={onToggleLike}>
              <Heart className={`h-4 w-4 ${isLiked ? "fill-primary text-primary" : ""}`} />
            </Button>
            <Button variant="ghost" size="icon" onClick={onToggleSave}>
              <Bookmark className={`h-4 w-4 ${isSaved ? "fill-primary text-primary" : ""}`} />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
