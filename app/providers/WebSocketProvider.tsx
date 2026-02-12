"use client"

import { useEffect, useRef } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { useAuthStore } from "@/shared/store"
import { getWebSocketClient } from "@/shared/lib/websocket"

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient()
  const token = useAuthStore((s) => s.token)
  const client = getWebSocketClient()
  const invalidateRef = useRef(() => {
    queryClient.invalidateQueries({ queryKey: ["notifications"] })
    queryClient.invalidateQueries({ queryKey: ["notifications", "unread"] })
  })

  invalidateRef.current = () => {
    queryClient.invalidateQueries({ queryKey: ["notifications"] })
    queryClient.invalidateQueries({ queryKey: ["notifications", "unread"] })
  }

  useEffect(() => {
    client.connect(token ?? null)
    return () => {
      if (!token) client.disconnect()
    }
  }, [token, client])

  useEffect(() => {
    const unsubNew = client.on("notification:new", () => {
      invalidateRef.current()
    })
    const unsubRead = client.on("notification:read", () => {
      invalidateRef.current()
    })
    const unsubReadAll = client.on("notification:read-all", () => {
      invalidateRef.current()
    })
    return () => {
      unsubNew()
      unsubRead()
      unsubReadAll()
    }
  }, [client])

  return <>{children}</>
}
