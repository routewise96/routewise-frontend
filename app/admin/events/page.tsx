"use client"

import { AdminRoute } from "@/features/auth"
import { AdminEventsPage } from "@/features/admin/ui"

export default function Page() {
  return (
    <AdminRoute>
      <AdminEventsPage />
    </AdminRoute>
  )
}
