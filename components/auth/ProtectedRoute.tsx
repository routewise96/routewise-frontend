"use client"

import { useEffect, type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "./AuthProvider"

interface ProtectedRouteProps {
  children: ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, token, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (isLoading) return
    const isAuthenticated = !!(token || user)
    if (!isAuthenticated) {
      const redirect = encodeURIComponent(pathname || "/")
      router.replace(`/login?redirect=${redirect}`)
    }
  }, [isLoading, token, user, router, pathname])

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  const isAuthenticated = !!(token || user)
  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}
