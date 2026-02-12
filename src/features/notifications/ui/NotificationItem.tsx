"use client"

import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { ru, enUS } from "date-fns/locale"
import { useTranslations, useLocale } from "next-intl"
import {
  Heart,
  MessageCircle,
  UserPlus,
  Share2,
  AtSign,
  Bell,
  MapPin,
  Sparkles,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { Notification } from "@/shared/types/models"
import { getNotificationLink } from "../lib/getNotificationLink"

const TYPE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  like: Heart,
  comment: MessageCircle,
  follow: UserPlus,
  repost: Share2,
  mention: AtSign,
  system: Bell,
  geo: MapPin,
  ai: Sparkles,
}

function formatTime(createdAt: string, locale: string): string {
  try {
    const date = new Date(createdAt)
    if (Number.isNaN(date.getTime())) return createdAt
    return formatDistanceToNow(date, { addSuffix: true, locale: locale === "ru" ? ru : enUS })
  } catch {
    return createdAt
  }
}

interface NotificationItemProps {
  notification: Notification
  onMarkAsRead?: (id: number) => void
}

export function NotificationItem({
  notification,
  onMarkAsRead,
}: NotificationItemProps) {
  const t = useTranslations("notifications")
  const locale = useLocale()
  const Icon = TYPE_ICONS[notification.type] ?? Bell
  const href = getNotificationLink(notification)
  const actorName =
    notification.actor?.username ??
    (notification as { actor?: { name?: string } }).actor?.name ??
    ""

  const handleClick = () => {
    if (!notification.read && onMarkAsRead) {
      onMarkAsRead(notification.id)
    }
  }

  const typeKey = notification.type in TYPE_ICONS ? notification.type : "system"
  const typeLabel = t(`types.${typeKey}`)

  return (
    <Link
      href={href}
      onClick={handleClick}
      className={`flex gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-secondary ${
        !notification.read ? "bg-primary/5" : ""
      }`}
    >
      <Avatar className="h-10 w-10 shrink-0">
        <AvatarImage
          src={
            notification.actor?.avatarUrl ??
            (notification.actor as { avatar?: string })?.avatar
          }
        />
        <AvatarFallback className="text-xs">
          {(actorName || "?").slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <p className="text-sm text-foreground">
          <span className="font-semibold">{actorName || t("types.system")}</span>{" "}
          {notification.title || typeLabel}
        </p>
        {notification.body && (
          <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
            {notification.body}
          </p>
        )}
        <p className="mt-1 text-xs text-muted-foreground">
          {formatTime(notification.createdAt, locale)}
        </p>
      </div>
      <div className="shrink-0 self-center text-muted-foreground">
        <Icon className="h-4 w-4" />
      </div>
    </Link>
  )
}
