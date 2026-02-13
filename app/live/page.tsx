"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { toast } from "sonner"
import { AppShell } from "@/components/AppShell"
import { Button } from "@/components/ui/button"
import { ProtectedRoute } from "@/features/auth"
import { LiveCard } from "@/features/live"
import { liveApi, type LiveStream } from "@/shared/api"

export default function LivePage() {
  const [streams, setStreams] = useState<LiveStream[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchStreams = useCallback(async () => {
    try {
      const data = await liveApi.getActive()
      setStreams(data.filter((s) => s.status === "live"))
    } catch (error) {
      const message =
        typeof error === "object" && error && "message" in error
          ? String((error as { message?: string }).message)
          : "Не удалось загрузить эфиры"
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStreams()
    const interval = setInterval(fetchStreams, 10_000)
    return () => clearInterval(interval)
  }, [fetchStreams])

  return (
    <ProtectedRoute>
      <AppShell>
        <div className="mx-auto max-w-5xl px-4 py-6 space-y-6">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Прямые эфиры</h1>
              <p className="text-sm text-muted-foreground">
                Смотрите трансляции путешественников прямо сейчас
              </p>
            </div>
            <Button asChild>
              <Link href="/live/create">Начать эфир</Link>
            </Button>
          </div>

          {isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div
                  key={idx}
                  className="h-48 rounded-xl bg-muted animate-pulse"
                />
              ))}
            </div>
          ) : streams.length === 0 ? (
            <div className="rounded-2xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
              Сейчас нет активных эфиров
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {streams.map((stream) => (
                <LiveCard key={stream.id} stream={stream} />
              ))}
            </div>
          )}
        </div>
      </AppShell>
    </ProtectedRoute>
  )
}
