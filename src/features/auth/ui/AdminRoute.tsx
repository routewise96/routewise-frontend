"use client"

import { useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/shared/store"
import { ProtectedRoute } from "./ProtectedRoute"

interface AdminRouteProps {
  children: ReactNode
}

export function AdminRoute({ children }: AdminRouteProps) {
  const user = useAuthStore((s) => s.user)
  const router = useRouter()

  useEffect(() => {
    if (user && user.role !== "admin") {
      router.replace("/")
    }
  }, [user, router])

  if (user && user.role !== "admin") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  return <ProtectedRoute>{children}</ProtectedRoute>
}
