"use client"

import dynamic from "next/dynamic"
import { AppShell } from "@/components/AppShell"
import { ProtectedRoute } from "@/features/auth"

const MapPageContent = dynamic(
  () =>
    import("@/features/map/ui/MapPageContent").then((m) => m.MapPageContent),
  { ssr: false }
)

export default function MapPage() {
  return (
    <ProtectedRoute>
      <AppShell>
        <MapPageContent />
      </AppShell>
    </ProtectedRoute>
  )
}
