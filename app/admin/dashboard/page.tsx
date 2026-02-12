"use client"

import { AdminRoute } from "@/features/auth"
import { AdminDashboardPage } from "@/features/admin/ui"

export default function Page() {
  return (
    <AdminRoute>
      <AdminDashboardPage />
    </AdminRoute>
  )
}
