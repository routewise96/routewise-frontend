"use client"

import dynamic from "next/dynamic"
import { MapPin, Wifi, WifiOff, Users } from "lucide-react"
import { AppShell } from "@/components/AppShell"
import { useAuth } from "@/components/auth/AuthProvider"
import { useGeoWebSocket } from "@/hooks/useGeoWebSocket"
import { Skeleton } from "@/components/ui/skeleton"

const MapView = dynamic(() => import("@/components/MapView"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center">
      <Skeleton className="h-full w-full" />
    </div>
  ),
})

export default function MapPage() {
  const { user } = useAuth()
  const { users, myPosition, error, connected } = useGeoWebSocket()

  return (
    <AppShell>
      <div className="flex flex-col" style={{ height: "calc(100vh - 57px)" }}>
        {/* Map Status Bar */}
        <div className="flex items-center justify-between border-b border-border bg-card px-4 py-2.5">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            <h1 className="text-sm font-bold text-foreground">Карта путешественников</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                {users.length} онлайн
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              {connected ? (
                <Wifi className="h-3.5 w-3.5 text-green-500" />
              ) : (
                <WifiOff className="h-3.5 w-3.5 text-destructive" />
              )}
              <span className="text-xs text-muted-foreground">
                {connected ? "Подключено" : "Отключено"}
              </span>
            </div>
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="border-b border-destructive/20 bg-destructive/10 px-4 py-2.5">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {/* Not logged in */}
        {!user && (
          <div className="border-b border-border bg-card px-4 py-2.5">
            <p className="text-sm text-muted-foreground">
              Войдите в аккаунт, чтобы видеть других путешественников и делиться своей геолокацией.
            </p>
          </div>
        )}

        {/* Map */}
        <div className="flex-1 relative">
          <MapView users={users} myPosition={myPosition} />
        </div>
      </div>
    </AppShell>
  )
}
