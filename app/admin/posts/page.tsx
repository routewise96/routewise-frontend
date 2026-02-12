"use client"

import { AdminRoute } from "@/features/auth"
import { PostsPage } from "@/features/admin/ui"

export default function Page() {
  return (
    <AdminRoute>
      <PostsPage />
    </AdminRoute>
  )
}
