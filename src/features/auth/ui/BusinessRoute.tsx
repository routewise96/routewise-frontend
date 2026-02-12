"use client"

import { useEffect, type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuthStore } from "@/shared/store"
import { ProtectedRoute } from "./ProtectedRoute"

interface BusinessRouteProps {
  children: ReactNode
}

export function BusinessRoute({ children }: BusinessRouteProps) {
  const user = useAuthStore((s) => s.user)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (user && user.role !== "business") {
      router.replace("/")
    }
  }, [user, router])

  if (user && user.role !== "business") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  return <ProtectedRoute>{children}</ProtectedRoute>
}
