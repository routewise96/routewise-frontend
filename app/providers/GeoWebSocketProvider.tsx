"use client"

import { useEffect } from "react"
import { useAuthStore } from "@/shared/store"
import { getGeoWebSocketClient } from "@/shared/lib/geo-websocket"

export function GeoWebSocketProvider({ children }: { children: React.ReactNode }) {
  const token = useAuthStore((s) => s.token)
  const client = getGeoWebSocketClient()

  useEffect(() => {
    client.connect(token ?? null)
    return () => {
      client.disconnect()
    }
  }, [token, client])

  return <>{children}</>
}
