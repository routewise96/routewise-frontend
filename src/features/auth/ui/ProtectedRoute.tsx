"use client"

import { useEffect, type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuthStore } from "@/shared/store"

interface ProtectedRouteProps {
  children: ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const token = useAuthStore((s) => s.token)
  const user = useAuthStore((s) => s.user)
  const router = useRouter()
  const pathname = usePathname()

  const isAuthenticated = !!(token || user)

  useEffect(() => {
    if (!isAuthenticated) {
      const redirect = encodeURIComponent(pathname || "/")
      router.replace(`/login?redirect=${redirect}`)
    }
  }, [isAuthenticated, router, pathname])

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  return <>{children}</>
}
