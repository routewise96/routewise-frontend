"use client"

import { AppShell } from "@/components/AppShell"
import { ProtectedRoute } from "@/features/auth"
import { AIChatPage } from "@/features/ai-assistant"

export default function AssistantPage() {
  return (
    <ProtectedRoute>
      <AppShell>
        <AIChatPage />
      </AppShell>
    </ProtectedRoute>
  )
}
