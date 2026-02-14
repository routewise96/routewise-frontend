"use client"

import { AdminRoute } from "@/features/auth"
import { AdminStatusPage } from "@/features/admin/ui"

export default function Page() {
  return (
    <AdminRoute>
      <AdminStatusPage />
    </AdminRoute>
  )
}
