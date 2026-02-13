"use client"

import dynamic from "next/dynamic"
import { Heart, Eye } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import type { Story } from "@/shared/api"

const ReactPlayer = dynamic(() => import("react-player/lazy"), { ssr: false })

interface StoryViewerDialogProps {
  open: boolean
  story: Story | null
  isLiked: boolean
  onOpenChange: (open: boolean) => void
  onToggleLike: () => void
}

function isVideo(url: string) {
  return /\.(mp4|mov|webm|m3u8)$/i.test(url)
}

export function StoryViewerDialog({
  open,
  story,
  isLiked,
  onOpenChange,
  onToggleLike,
}: StoryViewerDialogProps) {
  if (!story) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{story.place_name ?? "История"}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 md:grid-cols-[2fr,1fr]">
          <div className="overflow-hidden rounded-xl bg-black">
            {isVideo(story.media_url) ? (
              <ReactPlayer url={story.media_url} width="100%" height="100%" controls />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={story.media_url}
                alt={story.place_name ?? "story"}
                className="h-full w-full object-cover"
              />
            )}
          </div>
          <div className="space-y-4">
            {story.place_description && (
              <p className="text-sm text-muted-foreground">
                {story.place_description}
              </p>
            )}
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <Eye className="h-4 w-4" />
                {story.view_count}
              </span>
              <span className="inline-flex items-center gap-1">
                <Heart className={`h-4 w-4 ${isLiked ? "fill-primary text-primary" : ""}`} />
                {story.like_count}
              </span>
            </div>
            <Button
              variant={isLiked ? "secondary" : "outline"}
              size="sm"
              onClick={onToggleLike}
            >
              <Heart className={`h-4 w-4 ${isLiked ? "fill-primary text-primary" : ""}`} />
              {isLiked ? "Убрать лайк" : "Лайкнуть"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
