"use client"

import { useCallback, useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { useParams } from "next/navigation"
import { toast } from "sonner"
import { Heart, Eye } from "lucide-react"
import { AppShell } from "@/components/AppShell"
import { ProtectedRoute } from "@/features/auth"
import { Button } from "@/components/ui/button"
import { storiesApi, type Story } from "@/shared/api"

const ReactPlayer = dynamic(() => import("react-player/lazy"), { ssr: false })

function isVideo(url: string) {
  return /\.(mp4|mov|webm|m3u8)$/i.test(url)
}

export default function StoryPage() {
  const params = useParams<{ id: string }>()
  const storyId = params?.id
  const [story, setStory] = useState<Story | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isLiked, setIsLiked] = useState(false)

  const loadStory = useCallback(async () => {
    if (!storyId) return
    try {
      const data = await storiesApi.getById(storyId)
      setStory(data)
      setIsLiked(!!(data.liked ?? data.is_liked))
    } catch (error) {
      const message =
        typeof error === "object" && error && "message" in error
          ? String((error as { message?: string }).message)
          : "Не удалось загрузить историю"
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }, [storyId])

  useEffect(() => {
    loadStory()
  }, [loadStory])

  const handleToggleLike = async () => {
    if (!story) return
    try {
      if (isLiked) {
        await storiesApi.unlike(story.id)
        setIsLiked(false)
        setStory({ ...story, like_count: Math.max(story.like_count - 1, 0) })
      } else {
        await storiesApi.like(story.id)
        setIsLiked(true)
        setStory({ ...story, like_count: story.like_count + 1 })
      }
    } catch {
      toast.error("Не удалось обновить лайк")
    }
  }

  return (
    <ProtectedRoute>
      <AppShell>
        <div className="mx-auto max-w-4xl px-4 py-6 space-y-6">
          {isLoading || !story ? (
            <div className="h-[360px] rounded-2xl bg-muted animate-pulse" />
          ) : (
            <>
              <div className="overflow-hidden rounded-2xl border border-border bg-black">
                {isVideo(story.media_url) ? (
                  <ReactPlayer url={story.media_url} width="100%" height="100%" controls />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={story.media_url}
                    alt={story.place_name ?? "История"}
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
              <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
                <div>
                  <h1 className="text-xl font-semibold text-foreground">
                    {story.place_name ?? "История"}
                  </h1>
                  {story.place_description && (
                    <p className="mt-2 text-sm text-muted-foreground">
                      {story.place_description}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
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
                  onClick={handleToggleLike}
                >
                  <Heart className={`h-4 w-4 ${isLiked ? "fill-primary text-primary" : ""}`} />
                  {isLiked ? "Убрать лайк" : "Лайкнуть"}
                </Button>
              </div>
            </>
          )}
        </div>
      </AppShell>
    </ProtectedRoute>
  )
}
