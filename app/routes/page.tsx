"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { toast } from "sonner"
import { AppShell } from "@/components/AppShell"
import { Button } from "@/components/ui/button"
import { RouteCard } from "@/features/routes"
import { routesApi, type UserRoute } from "@/shared/api"
import { useAuth } from "@/features/auth"

const PAGE_LIMIT = 9

export default function RoutesPage() {
  const { user } = useAuth()
  const [routes, setRoutes] = useState<UserRoute[]>([])
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  const loadRoutes = useCallback(
    async (pageToLoad: number, mode: "replace" | "append") => {
      try {
        const data = await routesApi.getList(pageToLoad, PAGE_LIMIT)
        setHasMore(data.length >= PAGE_LIMIT)
        setRoutes((prev) => (mode === "append" ? [...prev, ...data] : data))
      } catch (error) {
        const message =
          typeof error === "object" && error && "message" in error
            ? String((error as { message?: string }).message)
            : "Не удалось загрузить маршруты"
        toast.error(message)
      } finally {
        setIsLoading(false)
        setIsLoadingMore(false)
      }
    },
    []
  )

  useEffect(() => {
    loadRoutes(1, "replace")
  }, [loadRoutes])

  const handleLoadMore = () => {
    if (!hasMore) return
    setIsLoadingMore(true)
    const nextPage = page + 1
    setPage(nextPage)
    loadRoutes(nextPage, "append")
  }

  const updateRoute = (id: string, updater: (route: UserRoute) => UserRoute) => {
    setRoutes((prev) => prev.map((route) => (route.id === id ? updater(route) : route)))
  }

  const handleToggleLike = async (route: UserRoute) => {
    if (!user) {
      toast.error("Войдите, чтобы ставить лайки")
      return
    }
    const liked = route.liked ?? route.is_liked ?? false
    try {
      if (liked) {
        await routesApi.unlike(route.id)
        updateRoute(route.id, (r) => ({
          ...r,
          is_liked: false,
          liked: false,
          like_count: Math.max(r.like_count - 1, 0),
        }))
      } else {
        await routesApi.like(route.id)
        updateRoute(route.id, (r) => ({
          ...r,
          is_liked: true,
          liked: true,
          like_count: r.like_count + 1,
        }))
      }
    } catch {
      toast.error("Не удалось обновить лайк")
    }
  }

  const handleToggleSave = async (route: UserRoute) => {
    if (!user) {
      toast.error("Войдите, чтобы сохранять маршруты")
      return
    }
    const saved = route.saved ?? route.is_saved ?? false
    try {
      if (saved) {
        await routesApi.unsave(route.id)
        updateRoute(route.id, (r) => ({
          ...r,
          is_saved: false,
          saved: false,
          save_count: Math.max(r.save_count - 1, 0),
        }))
      } else {
        await routesApi.save(route.id)
        updateRoute(route.id, (r) => ({
          ...r,
          is_saved: true,
          saved: true,
          save_count: r.save_count + 1,
        }))
      }
    } catch {
      toast.error("Не удалось обновить сохранение")
    }
  }

  const cards = useMemo(() => {
    return routes.map((route) => ({
      route,
      isLiked: route.liked ?? route.is_liked ?? false,
      isSaved: route.saved ?? route.is_saved ?? false,
    }))
  }, [routes])

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl px-4 py-6 space-y-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Маршруты</h1>
            <p className="text-sm text-muted-foreground">
              Идеи путешествий от сообщества RouteWise
            </p>
          </div>
          <Button asChild>
            <Link href="/routes/create">Создать маршрут</Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="h-44 rounded-xl bg-muted animate-pulse" />
            ))}
          </div>
        ) : routes.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
            Пока нет опубликованных маршрутов
          </div>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {cards.map(({ route, isLiked, isSaved }) => (
                <RouteCard
                  key={route.id}
                  route={route}
                  isLiked={isLiked}
                  isSaved={isSaved}
                  onToggleLike={() => handleToggleLike(route)}
                  onToggleSave={() => handleToggleSave(route)}
                />
              ))}
            </div>
            {hasMore && (
              <div className="flex justify-center">
                <Button variant="outline" onClick={handleLoadMore} disabled={isLoadingMore}>
                  {isLoadingMore ? "Загрузка..." : "Загрузить ещё"}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </AppShell>
  )
}
