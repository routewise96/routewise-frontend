"use client"

import { create } from "zustand"

interface NotificationState {
  unreadCount: number
  wsStatus: "idle" | "connecting" | "connected" | "error"
  setUnreadCount: (n: number) => void
  setWsStatus: (status: NotificationState["wsStatus"]) => void
}

export const useNotificationStore = create<NotificationState>()((set) => ({
  unreadCount: 0,
  wsStatus: "idle",
  setUnreadCount: (unreadCount) => set({ unreadCount }),
  setWsStatus: (wsStatus) => set({ wsStatus }),
}))
