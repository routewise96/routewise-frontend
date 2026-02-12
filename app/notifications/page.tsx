"use client"

import { useCallback } from "react"
import useSWR from "swr"
import {
  Bell,
  Heart,
  MessageCircle,
  UserPlus,
  CheckCheck,
  Loader2,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { toast } from "sonner"

import { AppShell } from "@/components/AppShell"
import { useAuth } from "@/components/auth/AuthProvider"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { api } from "@/lib/api"

function getNotificationIcon(type: string) {
  switch (type) {
    case "like":
      return <Heart className="h-4 w-4 text-destructive" />
    case "comment":
      return <MessageCircle className="h-4 w-4 text-primary" />
    case "follow":
      return <UserPlus className="h-4 w-4 text-green-500" />
    default:
      return <Bell className="h-4 w-4 text-muted-foreground" />
  }
}

export default function NotificationsPage() {
  const { user } = useAuth()

  const { data, isLoading, error, mutate } = useSWR(
    user ? "/notifications" : null,
    () => api.notifications.all(),
  )

  const notifications = Array.isArray(data)
    ? data
    : data?.data || data?.notifications || []

  const handleMarkRead = useCallback(
    async (id: number) => {
      try {
        await api.notifications.markRead(id)
        mutate()
      } catch {
        toast.error("Ошибка")
      }
    },
    [mutate]
  )

  const handleMarkAllRead = useCallback(async () => {
    try {
      await api.notifications.markAllRead()
      mutate()
      toast.success("Все уведомления прочитаны")
    } catch {
      toast.error("Ошибка")
    }
  }, [mutate])

  return (
    <AppShell>
      <div className="mx-auto max-w-2xl px-4 py-6">
        <div className="flex items-center justify-between pb-6">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            <h1 className="text-xl font-bold text-foreground">Уведомления</h1>
          </div>
          {notifications.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllRead}
              className="text-primary"
            >
              <CheckCheck className="mr-1.5 h-4 w-4" />
              Прочитать все
            </Button>
          )}
        </div>

        {!user ? (
          <div className="rounded-2xl border border-border bg-card p-8 text-center">
            <Bell className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-lg font-semibold text-foreground mb-2">
              Войдите в аккаунт
            </h2>
            <p className="text-sm text-muted-foreground">
              Чтобы просмотреть уведомления, необходимо авторизоваться.
            </p>
          </div>
        ) : isLoading ? (
          <div className="flex flex-col gap-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-border bg-card p-8 text-center">
            <Bell className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-sm text-muted-foreground">
              Не удалось загрузить уведомления.
            </p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-8 text-center">
            <Bell className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-lg font-semibold text-foreground mb-2">
              Нет уведомлений
            </h2>
            <p className="text-sm text-muted-foreground">
              Когда кто-то взаимодействует с вашим контентом, вы увидите это здесь.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            {notifications.map((n: Record<string, unknown>) => {
              const isRead = Boolean(n.read || n.isRead)
              return (
                <button
                  key={n.id as number}
                  onClick={() => !isRead && handleMarkRead(n.id as number)}
                  className={`flex items-start gap-3 rounded-xl p-3 text-left transition-colors hover:bg-secondary w-full ${
                    !isRead ? "bg-primary/5" : ""
                  }`}
                >
                  <div className="relative flex-shrink-0">
                    <Image
                      src={
                        (n.senderAvatarUrl as string) ||
                        (n.sender as Record<string, unknown>)?.avatarUrl as string ||
                        "https://i.pravatar.cc/150?img=4"
                      }
                      alt="Пользователь"
                      width={40}
                      height={40}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-card">
                      {getNotificationIcon((n.type as string) || "")}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground">
                      <span className="font-semibold">
                        {(n.senderUsername as string) ||
                          (n.sender as Record<string, unknown>)?.username as string ||
                          "Пользователь"}
                      </span>{" "}
                      {(n.message as string) || (n.text as string) || "взаимодействовал с вашим контентом"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {n.createdAt
                        ? new Date(n.createdAt as string).toLocaleDateString("ru-RU", {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : ""}
                    </p>
                  </div>
                  {!isRead && (
                    <div className="mt-1.5 h-2.5 w-2.5 flex-shrink-0 rounded-full bg-primary" />
                  )}
                </button>
              )
            })}
          </div>
        )}
      </div>
    </AppShell>
  )
}
