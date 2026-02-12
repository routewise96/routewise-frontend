"use client"

import { useState, useEffect } from "react"
import { useAuthStore } from "@/shared/store"
import { getGeoWebSocketClient } from "@/shared/lib/geo-websocket"
import type { GeoUser } from "@/shared/lib/geo-websocket"

export type GeoStatus = "idle" | "connecting" | "connected" | "error"

export function useGeoWebSocket() {
  const token = useAuthStore((s) => s.token)
  const [friends, setFriends] = useState<GeoUser[]>([])
  const [myPosition, setMyPosition] = useState<{ lat: number; lng: number } | null>(null)
  const [status, setStatus] = useState<GeoStatus>("idle")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const client = getGeoWebSocketClient()
    return client.subscribe((state) => {
      setFriends(state.friends)
      setMyPosition(state.myPosition)
      setStatus(state.status as GeoStatus)
      setError(state.error)
    })
  }, [])

  return { friends, myPosition, status, error }
}
