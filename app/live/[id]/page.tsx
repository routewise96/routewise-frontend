"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import dynamic from "next/dynamic"
import { useParams } from "next/navigation"
import { toast } from "sonner"
import { AppShell } from "@/components/AppShell"
import { ProtectedRoute, useAuth } from "@/features/auth"
import { LiveChat, LiveInfo } from "@/features/live"
import { liveApi, type ChatMessage, type LiveStream } from "@/shared/api"

const ReactPlayer = dynamic(() => import("react-player/lazy"), { ssr: false })

export default function LiveWatchPage() {
  const params = useParams<{ id: string }>()
  const streamId = params?.id
  const { user } = useAuth()

  const [stream, setStream] = useState<LiveStream | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isChatLoading, setIsChatLoading] = useState(false)
  const [chatPage, setChatPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [isLiked, setIsLiked] = useState(false)

  const isAuthor = useMemo(
    () => !!(user && stream && user.id === stream.user_id),
    [user, stream]
  )

  const fetchStream = useCallback(async () => {
    if (!streamId) return
    try {
      const data = await liveApi.getById(streamId)
      setStream(data)
      setIsLiked(!!(data.liked ?? data.is_liked))
    } catch (error) {
      const message =
        typeof error === "object" && error && "message" in error
          ? String((error as { message?: string }).message)
          : "Не удалось загрузить эфир"
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }, [streamId])

  const fetchMessages = useCallback(
    async (page: number, mode: "replace" | "prepend") => {
      if (!streamId) return
      setIsChatLoading(true)
      try {
        const data = await liveApi.getMessages(streamId, page, 50)
        setHasMore(data.length >= 50)
        setMessages((prev) => {
          if (mode === "replace") return data
          const merged = [...data, ...prev]
          const seen = new Set<string>()
          return merged.filter((msg) => {
            if (seen.has(msg.id)) return false
            seen.add(msg.id)
            return true
          })
        })
      } catch (error) {
        const message =
          typeof error === "object" && error && "message" in error
            ? String((error as { message?: string }).message)
            : "Не удалось загрузить чат"
        toast.error(message)
      } finally {
        setIsChatLoading(false)
      }
    },
    [streamId]
  )

  useEffect(() => {
    fetchStream()
  }, [fetchStream])

  useEffect(() => {
    if (!streamId) return
    setChatPage(1)
    fetchMessages(1, "replace")
  }, [streamId, fetchMessages])

  useEffect(() => {
    if (!stream || stream.status !== "live") return
    const interval = setInterval(fetchStream, 10_000)
    return () => clearInterval(interval)
  }, [stream, fetchStream])

  const handleToggleLike = async () => {
    if (!stream) return
    try {
      if (isLiked) {
        await liveApi.unlike(stream.id)
        setIsLiked(false)
        setStream((prev) =>
          prev
            ? { ...prev, like_count: Math.max(prev.like_count - 1, 0) }
            : prev
        )
      } else {
        await liveApi.like(stream.id)
        setIsLiked(true)
        setStream((prev) =>
          prev ? { ...prev, like_count: prev.like_count + 1 } : prev
        )
      }
    } catch {
      toast.error("Не удалось обновить лайк")
    }
  }

  const handleStop = async () => {
    if (!stream) return
    try {
      await liveApi.stop(stream.id)
      setStream({ ...stream, status: "ended" })
      toast.success("Эфир завершён")
    } catch {
      toast.error("Не удалось завершить эфир")
    }
  }

  const handleSendMessage = async (message: string) => {
    if (!stream || stream.status !== "live") return
    try {
      await liveApi.sendMessage(stream.id, message)
      await fetchMessages(1, "replace")
      setChatPage(1)
    } catch {
      toast.error("Не удалось отправить сообщение")
    }
  }

  const handleLoadMore = async () => {
    if (!hasMore || isChatLoading) return
    const next = chatPage + 1
    await fetchMessages(next, "prepend")
    setChatPage(next)
  }

  return (
    <ProtectedRoute>
      <AppShell>
        <div className="mx-auto max-w-6xl px-4 py-6 space-y-6">
          {isLoading || !stream ? (
            <div className="h-[360px] rounded-2xl bg-muted animate-pulse" />
          ) : (
            <>
              <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
                <div className="space-y-4">
                  <div className="relative aspect-video overflow-hidden rounded-2xl border border-border bg-black">
                    {stream.status === "ended" ? (
                      <div className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">
                        Эфир завершён
                      </div>
                    ) : (
                      <ReactPlayer
                        url={stream.playback_url}
                        width="100%"
                        height="100%"
                        controls
                        playing
                      />
                    )}
                  </div>
                  <LiveInfo
                    stream={stream}
                    isLiked={isLiked}
                    isAuthor={isAuthor}
                    onToggleLike={handleToggleLike}
                    onStop={handleStop}
                  />
                </div>
                <div className="h-[600px] lg:h-auto">
                  <LiveChat
                    messages={messages}
                    isLoading={isChatLoading}
                    hasMore={hasMore}
                    onLoadMore={handleLoadMore}
                    onSend={handleSendMessage}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </AppShell>
    </ProtectedRoute>
  )
}
