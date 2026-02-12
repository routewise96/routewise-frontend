"use client"

import { Polyline } from "react-leaflet"
import type { Route } from "@/shared/types/models"

interface RouteLayerProps {
  route: Route | null
}

export function RouteLayer({ route }: RouteLayerProps) {
  if (!route || route.geometry.length < 2) return null
  return (
    <Polyline
      positions={route.geometry.map(([lat, lng]) => [lat, lng] as [number, number])}
      pathOptions={{ color: "var(--primary)", weight: 5, opacity: 0.8 }}
    />
  )
}
