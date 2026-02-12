"use client"

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react"
import { api } from "@/lib/api"

export interface User {
  id: number
  username: string
  email: string
  avatarUrl?: string
  bio?: string
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
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Restore session from localStorage on mount; refresh profile from API when token exists
  useEffect(() => {
    const savedToken = localStorage.getItem("token")
    const savedUser = localStorage.getItem("user")
    if (savedToken) {
      setToken(savedToken)
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser))
        } catch {
          // corrupted user data
        }
      }
      api.users
        .getMe()
        .then((me) => {
          const userData: User = {
            id: me.id,
            username: me.username ?? "",
            email: me.email ?? "",
            avatarUrl: me.avatarUrl ?? me.avatar_url,
            bio: me.bio,
          }
          setUser(userData)
          localStorage.setItem("user", JSON.stringify(userData))
        })
        .catch(() => {})
    }
    setIsLoading(false)
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const data = await api.auth.login(email, password)
    const newToken = data.token || data.access_token
    localStorage.setItem("token", newToken)
    setToken(newToken)
    try {
      const me = await api.users.getMe()
      const userData: User = {
        id: me.id ?? data.user?.id ?? data.id,
        username: me.username ?? data.user?.username ?? email.split("@")[0],
        email: me.email ?? data.user?.email ?? email,
        avatarUrl: me.avatarUrl ?? me.avatar_url ?? data.user?.avatarUrl,
        bio: me.bio ?? data.user?.bio,
      }
      localStorage.setItem("user", JSON.stringify(userData))
      setUser(userData)
    } catch {
      const userData: User = data.user || {
        id: data.id ?? data.userId,
        username: data.username ?? email.split("@")[0],
        email: data.email ?? email,
        avatarUrl: data.avatarUrl ?? data.avatar_url,
        bio: data.bio,
      }
      localStorage.setItem("user", JSON.stringify(userData))
      setUser(userData)
    }
  }, [])

  const register = useCallback(
    async (username: string, email: string, password: string) => {
      const data = await api.auth.register(username, email, password)
      if (data.token || data.access_token) {
        const newToken = data.token || data.access_token
        localStorage.setItem("token", newToken)
        setToken(newToken)
        try {
          const me = await api.users.getMe()
          const userData: User = {
            id: me.id ?? data.user?.id ?? data.id,
            username: me.username ?? data.user?.username ?? username,
            email: me.email ?? data.user?.email ?? email,
            avatarUrl: me.avatarUrl ?? me.avatar_url ?? data.user?.avatarUrl,
            bio: me.bio ?? data.user?.bio,
          }
          localStorage.setItem("user", JSON.stringify(userData))
          setUser(userData)
        } catch {
          const userData: User = data.user || {
            id: data.id ?? data.userId,
            username: data.username ?? username,
            email: data.email ?? email,
            avatarUrl: data.avatarUrl ?? data.avatar_url,
            bio: data.bio,
          }
          localStorage.setItem("user", JSON.stringify(userData))
          setUser(userData)
        }
      }
    },
    []
  )

  const logout = useCallback(() => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setToken(null)
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider
      value={{ user, token, isLoading, login, register, logout, setUser }}
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
