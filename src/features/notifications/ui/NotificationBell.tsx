"use client"

import { Bell } from "lucide-react"
import { useUnreadCount } from "../hooks"
import { NotificationDropdown } from "./NotificationDropdown"

export function NotificationBell() {
  const { data: unreadCount = 0 } = useUnreadCount()

  return (
    <NotificationDropdown>
      <button
        type="button"
        className="relative flex h-10 w-10 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        aria-label="Уведомления"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>
    </NotificationDropdown>
  )
}
