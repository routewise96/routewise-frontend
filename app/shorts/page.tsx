"use client"

import { AppShell } from "@/components/AppShell"
import { ProtectedRoute } from "@/features/auth"
import { ShortsFeed } from "@/features/shorts"

export default function ShortsPage() {
  return (
    <ProtectedRoute>
      <AppShell>
        <div className="fixed inset-0 top-[57px] left-0 right-0 bottom-0 z-0 lg:left-60 xl:left-64 lg:top-0">
          <ShortsFeed />
        </div>
      </AppShell>
    </ProtectedRoute>
  )
}
