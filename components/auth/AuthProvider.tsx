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

  // Restore session from localStorage on mount
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
    }
    setIsLoading(false)
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const data = await api.auth.login(email, password)
    const newToken = data.token || data.access_token
    const userData: User = data.user || {
      id: data.id || data.userId,
      username: data.username || email.split("@")[0],
      email: data.email || email,
      avatarUrl: data.avatarUrl || data.avatar_url,
      bio: data.bio,
    }
    localStorage.setItem("token", newToken)
    localStorage.setItem("user", JSON.stringify(userData))
    setToken(newToken)
    setUser(userData)
  }, [])

  const register = useCallback(
    async (username: string, email: string, password: string) => {
      const data = await api.auth.register(username, email, password)
      // Auto-login after registration if token is returned
      if (data.token || data.access_token) {
        const newToken = data.token || data.access_token
        const userData: User = data.user || {
          id: data.id || data.userId,
          username: data.username || username,
          email: data.email || email,
          avatarUrl: data.avatarUrl || data.avatar_url,
          bio: data.bio,
        }
        localStorage.setItem("token", newToken)
        localStorage.setItem("user", JSON.stringify(userData))
        setToken(newToken)
        setUser(userData)
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
