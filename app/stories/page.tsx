"use client"

import dynamic from "next/dynamic"
import { AppShell } from "@/components/AppShell"
import { ProtectedRoute } from "@/features/auth"

const StoriesMapContent = dynamic(
  () => import("@/features/stories").then((m) => m.StoriesMapContent),
  { ssr: false }
)

export default function StoriesPage() {
  return (
    <ProtectedRoute>
      <AppShell>
        <StoriesMapContent />
      </AppShell>
    </ProtectedRoute>
  )
}
