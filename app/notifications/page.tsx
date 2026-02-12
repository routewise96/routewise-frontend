"use client"

import { ProtectedRoute } from "@/features/auth"
import { NotificationPage } from "@/features/notifications"
import { AppShell } from "@/components/AppShell"

export default function NotificationsPage() {
  return (
    <ProtectedRoute>
      <AppShell>
        <div className="mx-auto max-w-2xl px-4 py-6 lg:px-6">
          <NotificationPage />
        </div>
      </AppShell>
    </ProtectedRoute>
  )
}
