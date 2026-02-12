"use client"

import {
  createContext,
  useContext,
  useEffect,
  useCallback,
  useState,
  type ReactNode,
} from "react"
import { useAuthStore } from "@/shared/store"
import { authApi } from "@/shared/api"
import { usersApi } from "@/shared/api"
import type { User } from "@/shared/types/models"

function normalizeUser(data: Record<string, unknown>): User {
  return {
    id: (data.id as number) ?? 0,
    username: (data.username as string) ?? "",
    email: (data.email as string) ?? "",
    avatarUrl: (data.avatarUrl as string) ?? (data.avatar_url as string),
    bio: data.bio as string | undefined,
  }
}

interface AuthContextValue {
  user: User | null
  token: string | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (username: string, email: string, password: string) => Promise<void>
  logout: () => void
  setUser: (user: User | null) => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const token = useAuthStore((s) => s.token)
  const user = useAuthStore((s) => s.user)
  const loginStore = useAuthStore((s) => s.login)
  const logoutStore = useAuthStore((s) => s.logout)
  const setUserStore = useAuthStore((s) => s.setUser)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (token) {
      usersApi
        .getMe()
        .then((me) => {
          setUserStore(normalizeUser(me as unknown as Record<string, unknown>))
        })
        .catch(() => {})
    }
    setIsLoading(false)
  }, [token, setUserStore])

  const login = useCallback(
    async (email: string, password: string) => {
      const data = await authApi.login({ email, password })
      const newToken = data.token ?? data.access_token
      if (!newToken) throw new Error("No token")
      let userData: User
      try {
        const me = await usersApi.getMe()
        userData = normalizeUser(me as unknown as Record<string, unknown>)
      } catch {
        const u = data.user as Record<string, unknown> | undefined
        userData = u ? normalizeUser(u) : normalizeUser({ username: email.split("@")[0], email })
      }
      loginStore(newToken, userData)
    },
    [loginStore]
  )

  const register = useCallback(
    async (username: string, email: string, password: string) => {
      const data = await authApi.register({ username, email, password })
      const newToken = data.token ?? data.access_token
      if (!newToken) return
      let userData: User
      try {
        const me = await usersApi.getMe()
        userData = normalizeUser(me as unknown as Record<string, unknown>)
      } catch {
        const u = data.user as Record<string, unknown> | undefined
        userData = u ? normalizeUser(u) : normalizeUser({ username, email })
      }
      loginStore(newToken, userData)
    },
    [loginStore]
  )

  const logout = useCallback(() => {
    logoutStore()
  }, [logoutStore])

  const setUser = useCallback(
    (u: User | null) => {
      setUserStore(u)
    },
    [setUserStore]
  )

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        logout,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
