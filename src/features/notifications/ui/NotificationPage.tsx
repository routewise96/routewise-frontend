"use client"

import { useMemo } from "react"
import { useTranslations } from "next-intl"
import { format, isToday, isYesterday } from "date-fns"
import { ru } from "date-fns/locale"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  useNotifications,
  useMarkAsRead,
  useMarkAllAsRead,
} from "../hooks"
import { NotificationItem } from "./NotificationItem"
import type { Notification } from "@/shared/types/models"

function groupByDate(notifications: Notification[]) {
  const groups: { label: string; key: string; items: Notification[] }[] = [
    { label: "today", key: "today", items: [] },
    { label: "yesterday", key: "yesterday", items: [] },
    { label: "earlier", key: "earlier", items: [] },
  ]
  const earlier: Notification[] = []
  for (const n of notifications) {
    const date = new Date(n.createdAt)
    if (Number.isNaN(date.getTime())) {
      earlier.push(n)
    } else if (isToday(date)) {
      groups[0].items.push(n)
    } else if (isYesterday(date)) {
      groups[1].items.push(n)
    } else {
      earlier.push(n)
    }
  }
  if (earlier.length) groups[2].items = earlier
  return groups.filter((g) => g.items.length > 0)
}

export function NotificationPage() {
  const t = useTranslations("notifications")
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useNotifications(20)
  const markAsRead = useMarkAsRead()
  const markAllAsRead = useMarkAllAsRead()

  const notifications = useMemo(() => {
    if (!data?.pages) return []
    return data.pages.flat()
  }, [data])

  const groups = useMemo(() => {
    const sorted = [...notifications].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    return groupByDate(sorted)
  }, [notifications])

  const labelKey: Record<string, string> = {
    today: t("today"),
    yesterday: t("yesterday"),
    earlier: t("earlier"),
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">{t("title")}</h1>
        {notifications.some((n) => !n.read) && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => markAllAsRead.mutate()}
            disabled={markAllAsRead.isPending}
          >
            {markAllAsRead.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              t("markAllAsRead")
            )}
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <p className="py-12 text-center text-muted-foreground">{t("empty")}</p>
      ) : (
        <div className="space-y-6">
          {groups.map((group) => (
            <section key={group.key}>
              <h2 className="mb-3 text-sm font-semibold text-muted-foreground">
                {labelKey[group.key] ?? group.key}
              </h2>
              <div className="space-y-1 rounded-2xl border border-border bg-card overflow-hidden">
                {group.items.map((n) => (
                  <NotificationItem
                    key={n.id}
                    notification={n}
                    onMarkAsRead={(id) => markAsRead.mutate(id)}
                  />
                ))}
              </div>
            </section>
          ))}

          {hasNextPage && (
            <div className="flex justify-center py-4">
              <Button
                variant="outline"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
              >
                {isFetchingNextPage ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  t("loadMore")
                )}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
