"use client"

type Listener = (payload: unknown) => void
type StatusListener = (status: "idle" | "connecting" | "connected" | "error") => void

function getWsUrl(): string {
  if (typeof window === "undefined") return ""
  const api = process.env.NEXT_PUBLIC_API_URL || "https://routewise.ru/api"
  const url = new URL(api)
  const protocol = url.protocol === "https:" ? "wss:" : "ws:"
  return `${protocol}//${url.host}${url.pathname.replace(/\/api\/?$/, "")}/ws`
}

const MAX_RECONNECT_ATTEMPTS = 10
const INITIAL_RECONNECT_DELAY = 1000

class WebSocketClient {
  private ws: WebSocket | null = null
  private token: string | null = null
  private listeners = new Map<string, Set<Listener>>()
  private statusListeners = new Set<StatusListener>()
  private status: "idle" | "connecting" | "connected" | "error" = "idle"
  private reconnectAttempts = 0
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null

  private setStatus(s: typeof this.status) {
    this.status = s
    this.statusListeners.forEach((l) => l(s))
  }

  on(event: string, cb: Listener): () => void {
    if (!this.listeners.has(event)) this.listeners.set(event, new Set())
    this.listeners.get(event)!.add(cb)
    return () => this.listeners.get(event)?.delete(cb)
  }

  onStatus(cb: StatusListener): () => void {
    this.statusListeners.add(cb)
    cb(this.status)
    return () => this.statusListeners.delete(cb)
  }

  getStatus() {
    return this.status
  }

  connect(token: string | null) {
    this.token = token
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
    if (!token) {
      this.setStatus("idle")
      return
    }
    this.connectInternal()
  }

  private connectInternal() {
    if (!this.token) return
    const url = `${getWsUrl()}?token=${encodeURIComponent(this.token)}`
    this.setStatus("connecting")
    try {
      this.ws = new WebSocket(url)
    } catch {
      this.setStatus("error")
      this.scheduleReconnect()
      return
    }
    this.ws.onopen = () => {
      this.reconnectAttempts = 0
      this.setStatus("connected")
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
    }
    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data as string) as {
          event?: string
          payload?: unknown
        }
        const eventName = data.event ?? "message"
        const payload = data.payload ?? data
        this.listeners.get(eventName)?.forEach((cb) => cb(payload))
        this.listeners.get("*")?.forEach((cb) => cb({ event: eventName, ...data }))
      } catch {
        // ignore parse errors
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

  disconnect() {
    this.connect(null)
  }
}

let instance: WebSocketClient | null = null

export function getWebSocketClient(): WebSocketClient {
  if (!instance) instance = new WebSocketClient()
  return instance
}

export function useWebSocket() {
  return getWebSocketClient()
}
