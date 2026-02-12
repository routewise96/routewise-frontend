"use client"

import { AdminRoute } from "@/features/auth"
import { UsersPage } from "@/features/admin/ui"

export default function Page() {
  return (
    <AdminRoute>
      <UsersPage />
    </AdminRoute>
  )
}
