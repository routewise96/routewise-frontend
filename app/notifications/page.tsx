"use client"

import { AppShell } from "@/components/AppShell"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"

export default function NotificationsPage() {
  return (
    <ProtectedRoute>
      <AppShell>
        <div className="flex min-h-[60vh] items-center justify-center px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Уведомления</h1>
            <p className="text-muted-foreground">Скоро появится. Мы работаем над этим.</p>
          </div>
        </div>
      </AppShell>
    </ProtectedRoute>
  )
}
