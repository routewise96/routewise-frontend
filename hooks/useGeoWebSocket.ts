"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { useAuth } from "@/features/auth"

export interface GeoUser {
  userId: number
  username: string
  avatarUrl?: string
  lat: number
  lng: number
}

const GEO_WS_URL =
  (process.env.NEXT_PUBLIC_API_URL || "https://routewise.ru")
    .replace(/^http/, "ws") + "/geo/ws"

export function useGeoWebSocket() {
  const { user, token } = useAuth()
  const [users, setUsers] = useState<GeoUser[]>([])
  const [myPosition, setMyPosition] = useState<{ lat: number; lng: number } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [connected, setConnected] = useState(false)
  const wsRef = useRef<WebSocket | null>(null)
  const watchRef = useRef<number | null>(null)

  const sendPosition = useCallback(
    (lat: number, lng: number) => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(
          JSON.stringify({ type: "position", lat, lng })
        )
      }
    },
    []
  )

  useEffect(() => {
    if (!user || !token) return

    // Setup WebSocket
    try {
      const ws = new WebSocket(`${GEO_WS_URL}?token=${token}`)
      wsRef.current = ws

      ws.onopen = () => {
        setConnected(true)
        setError(null)
      }

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          if (data.type === "users" && Array.isArray(data.users)) {
            setUsers(data.users)
          } else if (data.type === "update" && data.userId) {
            setUsers((prev) => {
              const idx = prev.findIndex((u) => u.userId === data.userId)
              if (idx >= 0) {
                const copy = [...prev]
                copy[idx] = { ...copy[idx], lat: data.lat, lng: data.lng }
                return copy
              }
              return [...prev, data as GeoUser]
            })
          } else if (data.type === "leave" && data.userId) {
            setUsers((prev) => prev.filter((u) => u.userId !== data.userId))
          }
        } catch {
          // ignore malformed messages
        }
      }

      ws.onerror = () => {
        setError("Сервис геолокации временно недоступен")
        setConnected(false)
      }

      ws.onclose = () => {
        setConnected(false)
      }
    } catch {
      setError("Сервис геолокации временно недоступен")
    }

    // Setup geolocation
    if ("geolocation" in navigator) {
      watchRef.current = navigator.geolocation.watchPosition(
        (pos) => {
          const { latitude: lat, longitude: lng } = pos.coords
          setMyPosition({ lat, lng })
          sendPosition(lat, lng)
        },
        () => {
          setError("Нет доступа к геолокации. Разрешите доступ в настройках браузера.")
        },
        { enableHighAccuracy: true, maximumAge: 10000, timeout: 15000 }
      )

      // Send position every 5 seconds
      const interval = setInterval(() => {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            sendPosition(pos.coords.latitude, pos.coords.longitude)
          },
          () => {},
          { maximumAge: 5000 }
        )
      }, 5000)

      return () => {
        if (watchRef.current !== null) {
          navigator.geolocation.clearWatch(watchRef.current)
        }
        clearInterval(interval)
        wsRef.current?.close()
      }
    } else {
      setError("Геолокация не поддерживается вашим браузером")
    }

    return () => {
      if (watchRef.current !== null) {
        navigator.geolocation.clearWatch(watchRef.current)
      }
      wsRef.current?.close()
    }
  }, [user, token, sendPosition])

  return { users, myPosition, error, connected }
}
