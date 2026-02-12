"use client"

import { AdminRoute } from "@/features/auth"
import { ReportsPage } from "@/features/admin/ui"

export default function Page() {
  return (
    <AdminRoute>
      <ReportsPage />
    </AdminRoute>
  )
}
