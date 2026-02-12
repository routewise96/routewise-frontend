"use client"

import type { GeoPoint } from "../types/models"

const MAX_RECONNECT_ATTEMPTS = 10
const INITIAL_RECONNECT_DELAY = 1000
const POSITION_INTERVAL_MS = 5000

export interface GeoUserMessage {
  id: string
  userId?: number
  username: string
  name?: string
  avatar?: string
  avatarUrl?: string
  lat: number
  lng: number
  lastUpdate?: string
}

function getGeoWsUrl(): string {
  if (typeof window === "undefined") return ""
  const base =
    process.env.NEXT_PUBLIC_WS_URL ||
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/?$/, "") ||
    "https://routewise.ru"
  const url = base.replace(/^http/, "ws")
  return `${url}/geo/ws`
}

export interface GeoUser {
  id: string
  name: string
  username: string
  avatar?: string
  location: GeoPoint
  lastUpdate: string
}

type Status = "idle" | "connecting" | "connected" | "error"

type StateListener = (state: {
  friends: GeoUser[]
  myPosition: GeoPoint | null
  status: Status
  error: string | null
}) => void

class GeoWebSocketClient {
  private ws: WebSocket | null = null
  private token: string | null = null
  private listeners = new Set<StateListener>()
  private friends: GeoUser[] = []
  private myPosition: GeoPoint | null = null
  private status: Status = "idle"
  private error: string | null = null
  private reconnectAttempts = 0
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null
  private watchId: number | null = null
  private positionInterval: ReturnType<typeof setInterval> | null = null

  private notify() {
    const state = {
      friends: this.friends,
      myPosition: this.myPosition,
      status: this.status,
      error: this.error,
    }
    this.listeners.forEach((cb) => cb(state))
  }

  private setStatus(s: Status) {
    this.status = s
    this.notify()
  }

  private setError(e: string | null) {
    this.error = e
    this.notify()
  }

  private setFriends(list: GeoUser[]) {
    this.friends = list
    this.notify()
  }

  private updateFriend(id: string, lat: number, lng: number) {
    this.friends = this.friends.map((f) =>
      f.id === id ? { ...f, location: { lat, lng }, lastUpdate: new Date().toISOString() } : f
    )
    this.notify()
  }

  private addOrUpdateFriend(u: GeoUserMessage) {
    const id = String(u.userId ?? u.id)
    const geoUser: GeoUser = {
      id,
      name: u.name ?? u.username,
      username: u.username,
      avatar: u.avatar ?? u.avatarUrl,
      location: { lat: u.lat, lng: u.lng },
      lastUpdate: u.lastUpdate ?? new Date().toISOString(),
    }
    const idx = this.friends.findIndex((f) => f.id === id)
    if (idx >= 0) {
      this.friends = [...this.friends]
      this.friends[idx] = { ...this.friends[idx], ...geoUser }
    } else {
      this.friends = [...this.friends, geoUser]
    }
    this.notify()
  }

  private removeFriend(id: string) {
    this.friends = this.friends.filter((f) => f.id !== String(id))
    this.notify()
  }

  subscribe(listener: StateListener): () => void {
    this.listeners.add(listener)
    listener({
      friends: this.friends,
      myPosition: this.myPosition,
      status: this.status,
      error: this.error,
    })
    return () => this.listeners.delete(listener)
  }

  connect(token: string | null) {
    this.token = token
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }
    this.clearGeolocation()
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
    this.setFriends([])
    this.myPosition = null
    if (!token) {
      this.setStatus("idle")
      this.setError(null)
      return
    }
    this.connectInternal()
  }

  private connectInternal() {
    if (!this.token) return
    const url = `${getGeoWsUrl()}?token=${encodeURIComponent(this.token)}`
    this.setStatus("connecting")
    this.setError(null)
    try {
      this.ws = new WebSocket(url)
    } catch {
      this.setStatus("error")
      this.setError("Сервис геолокации временно недоступен")
      this.scheduleReconnect()
      return
    }
    this.ws.onopen = () => {
      this.reconnectAttempts = 0
      this.setStatus("connected")
      this.setError(null)
      this.startGeolocation()
    }
    this.ws.onclose = () => {
      this.ws = null
      if (this.token) {
        this.setStatus("error")
        this.scheduleReconnect()
      } else {
        this.setStatus("idle")
      }
    }
    this.ws.onerror = () => {
      this.setStatus("error")
      this.setError("Сервис геолокации временно недоступен")
    }
    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data as string) as {
          type?: string
          users?: GeoUserMessage[]
          userId?: string | number
          lat?: number
          lng?: number
        } & GeoUserMessage
        const normalizeList = (users: GeoUserMessage[]) =>
          users.map((u) => ({
            id: String(u.userId ?? u.id),
            name: u.name ?? u.username,
            username: u.username,
            avatar: u.avatar ?? u.avatarUrl,
            location: { lat: u.lat, lng: u.lng },
            lastUpdate: u.lastUpdate ?? new Date().toISOString(),
          }))
        if ((data.type === "users" || data.type === "friends:update") && Array.isArray(data.users)) {
          this.setFriends(normalizeList(data.users))
        } else if (
          (data.type === "update" || data.type === "friend:join") &&
          (data.userId != null || data.id != null)
        ) {
          const id = String(data.userId ?? data.id)
          if (data.lat != null && data.lng != null) {
            this.updateFriend(id, data.lat, data.lng)
          } else {
            this.addOrUpdateFriend(data as GeoUserMessage)
          }
        } else if (
          (data.type === "leave" || data.type === "friend:leave") &&
          (data.userId != null || data.id != null)
        ) {
          this.removeFriend(String(data.userId ?? data.id))
        }
      } catch {
        // ignore
      }
    }
  }

  private scheduleReconnect() {
    if (!this.token || this.reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) return
    const delay = Math.min(
      INITIAL_RECONNECT_DELAY * 2 ** this.reconnectAttempts,
      30000
    )
    this.reconnectAttempts++
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null
      this.connectInternal()
    }, delay)
  }

  private sendPosition(lat: number, lng: number) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: "position", lat, lng }))
    }
  }

  private startGeolocation() {
    if (!("geolocation" in navigator)) {
      this.setError("Геолокация не поддерживается вашим браузером")
      return
    }
    this.watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const lat = pos.coords.latitude
        const lng = pos.coords.longitude
        this.myPosition = { lat, lng }
        this.sendPosition(lat, lng)
        this.notify()
      },
      () => {
        this.setError(
          "Нет доступа к геолокации. Разрешите доступ в настройках браузера."
        )
      },
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 15000 }
    )
    this.positionInterval = setInterval(() => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude
          const lng = pos.coords.longitude
          this.myPosition = { lat, lng }
          this.sendPosition(lat, lng)
          this.notify()
        },
        () => {},
        { maximumAge: 5000 }
      )
    }, POSITION_INTERVAL_MS)
  }

  private clearGeolocation() {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId)
      this.watchId = null
    }
    if (this.positionInterval) {
      clearInterval(this.positionInterval)
      this.positionInterval = null
    }
  }

  disconnect() {
    this.connect(null)
  }
}

let geoWsInstance: GeoWebSocketClient | null = null

export function getGeoWebSocketClient(): GeoWebSocketClient {
  if (!geoWsInstance) geoWsInstance = new GeoWebSocketClient()
  return geoWsInstance
}
