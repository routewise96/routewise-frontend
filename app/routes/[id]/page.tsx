"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { MapContainer, Marker, Polyline, Popup, TileLayer } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import { toast } from "sonner"
import { Heart, Bookmark, Pencil, Trash2 } from "lucide-react"
import { AppShell } from "@/components/AppShell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { routesApi, type RouteComment, type UserRoute } from "@/shared/api"
import { useAuth } from "@/features/auth"
import { fixLeafletDefaultIcon } from "@/features/map/lib/leaflet-icons"

fixLeafletDefaultIcon()

const DEFAULT_CENTER: [number, number] = [55.7558, 37.6173]

function numberIcon(index: number) {
  return L.divIcon({
    html: `<div style="width:26px;height:26px;border-radius:999px;background:#111827;color:#F9FAFB;font-size:12px;display:flex;align-items:center;justify-content:center;border:2px solid #6366F1;">${index + 1}</div>`,
    className: "route-number-icon",
    iconSize: [26, 26],
    iconAnchor: [13, 26],
    popupAnchor: [0, -24],
  })
}

export default function RouteDetailPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const { user } = useAuth()
  const routeId = params?.id
  const [route, setRoute] = useState<UserRoute | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isLiked, setIsLiked] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [comments, setComments] = useState<RouteComment[]>([])
  const [commentText, setCommentText] = useState("")
  const [isCommentLoading, setIsCommentLoading] = useState(false)

  const isAuthor = useMemo(() => {
    return !!(user && route && user.id === route.user_id)
  }, [user, route])

  const sortedWaypoints = useMemo(() => {
    if (!route) return []
    return [...route.waypoints].sort((a, b) => a.order - b.order)
  }, [route])

  const mapCenter = useMemo<[number, number]>(() => {
    if (sortedWaypoints.length > 0) {
      return [sortedWaypoints[0].lat, sortedWaypoints[0].lng]
    }
    return DEFAULT_CENTER
  }, [sortedWaypoints])

  const loadRoute = useCallback(async () => {
    if (!routeId) return
    try {
      const data = await routesApi.getById(routeId)
      setRoute(data)
      setIsLiked(!!(data.liked ?? data.is_liked))
      setIsSaved(!!(data.saved ?? data.is_saved))
    } catch (error) {
      const message =
        typeof error === "object" && error && "message" in error
          ? String((error as { message?: string }).message)
          : "Не удалось загрузить маршрут"
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }, [routeId])

  const loadComments = useCallback(async () => {
    if (!routeId) return
    try {
      setIsCommentLoading(true)
      const data = await routesApi.getComments(routeId)
      setComments(data)
    } catch {
      toast.error("Не удалось загрузить комментарии")
    } finally {
      setIsCommentLoading(false)
    }
  }, [routeId])

  useEffect(() => {
    loadRoute()
    loadComments()
  }, [loadRoute, loadComments])

  const handleToggleLike = async () => {
    if (!route) return
    if (!user) {
      toast.error("Войдите, чтобы ставить лайки")
      return
    }
    try {
      if (isLiked) {
        await routesApi.unlike(route.id)
        setIsLiked(false)
        setRoute({ ...route, like_count: Math.max(route.like_count - 1, 0) })
      } else {
        await routesApi.like(route.id)
        setIsLiked(true)
        setRoute({ ...route, like_count: route.like_count + 1 })
      }
    } catch {
      toast.error("Не удалось обновить лайк")
    }
  }

  const handleToggleSave = async () => {
    if (!route) return
    if (!user) {
      toast.error("Войдите, чтобы сохранять маршруты")
      return
    }
    try {
      if (isSaved) {
        await routesApi.unsave(route.id)
        setIsSaved(false)
        setRoute({ ...route, save_count: Math.max(route.save_count - 1, 0) })
      } else {
        await routesApi.save(route.id)
        setIsSaved(true)
        setRoute({ ...route, save_count: route.save_count + 1 })
      }
    } catch {
      toast.error("Не удалось обновить сохранение")
    }
  }

  const handleDelete = async () => {
    if (!route) return
    try {
      await routesApi.delete(route.id)
      toast.success("Маршрут удалён")
      router.push("/routes")
    } catch {
      toast.error("Не удалось удалить маршрут")
    }
  }

  const handleAddComment = async () => {
    if (!route || !commentText.trim()) return
    try {
      await routesApi.addComment(route.id, commentText.trim())
      setCommentText("")
      loadComments()
    } catch {
      toast.error("Не удалось отправить комментарий")
    }
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl px-4 py-6 space-y-6">
        {isLoading || !route ? (
          <div className="h-[360px] rounded-2xl bg-muted animate-pulse" />
        ) : (
          <>
            <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
              <div className="space-y-4">
                <div className="overflow-hidden rounded-2xl border border-border">
                  <MapContainer center={mapCenter} zoom={12} className="h-[420px] w-full">
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {sortedWaypoints.map((point, idx) => (
                      <Marker key={`${point.order}-${point.lat}`} position={[point.lat, point.lng]} icon={numberIcon(idx)}>
                        <Popup>
                          <div className="text-sm font-medium">{point.name ?? `Точка ${idx + 1}`}</div>
                          {point.description && (
                            <div className="text-xs text-muted-foreground">{point.description}</div>
                          )}
                        </Popup>
                      </Marker>
                    ))}
                    {sortedWaypoints.length > 1 && (
                      <Polyline positions={sortedWaypoints.map((p) => [p.lat, p.lng] as [number, number])} />
                    )}
                  </MapContainer>
                </div>
                <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h1 className="text-2xl font-semibold text-foreground">{route.title}</h1>
                      {route.description && (
                        <p className="mt-2 text-sm text-muted-foreground">{route.description}</p>
                      )}
                    </div>
                    {isAuthor && (
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toast.message("Редактирование скоро будет доступно")}
                        >
                          <Pencil className="h-4 w-4" />
                          Редактировать
                        </Button>
                        <Button variant="destructive" size="sm" onClick={handleDelete}>
                          <Trash2 className="h-4 w-4" />
                          Удалить
                        </Button>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <span>{route.distance ? `${route.distance.toFixed(1)} км` : "Дистанция не указана"}</span>
                    <span>{route.duration ? `${route.duration} мин` : "Время не указано"}</span>
                    <span>{route.like_count} лайков</span>
                    <span>{route.save_count} сохранений</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant={isLiked ? "secondary" : "outline"} size="sm" onClick={handleToggleLike}>
                      <Heart className={`h-4 w-4 ${isLiked ? "fill-primary text-primary" : ""}`} />
                      {isLiked ? "Убрать лайк" : "Лайкнуть"}
                    </Button>
                    <Button variant={isSaved ? "secondary" : "outline"} size="sm" onClick={handleToggleSave}>
                      <Bookmark className={`h-4 w-4 ${isSaved ? "fill-primary text-primary" : ""}`} />
                      {isSaved ? "Убрать из сохранённых" : "Сохранить"}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-card p-6 space-y-4 h-fit">
                <h2 className="text-lg font-semibold text-foreground">Комментарии</h2>
                {user && (
                  <div className="flex items-center gap-2">
                    <Input
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Написать комментарий..."
                    />
                    <Button onClick={handleAddComment} disabled={!commentText.trim()}>
                      Отправить
                    </Button>
                  </div>
                )}
                {isCommentLoading ? (
                  <div className="text-sm text-muted-foreground">Загрузка...</div>
                ) : comments.length === 0 ? (
                  <div className="text-sm text-muted-foreground">Пока нет комментариев</div>
                ) : (
                  <div className="space-y-3">
                    {comments.map((comment) => (
                      <div key={comment.id} className="rounded-xl border border-border bg-background p-3">
                        <div className="text-sm font-medium text-foreground">
                          {comment.user?.username ?? "Пользователь"}
                        </div>
                        <p className="text-sm text-muted-foreground">{comment.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </AppShell>
  )
}
