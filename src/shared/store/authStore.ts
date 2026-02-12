"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { User } from "../types/models"

interface AuthState {
  token: string | null
  user: User | null
  isAuthenticated: boolean
  setAuth: (token: string | null, user: User | null) => void
  login: (token: string, user: User) => void
  logout: () => void
  setUser: (user: User | null) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      setAuth: (token, user) =>
        set({
          token,
          user,
          isAuthenticated: !!(token && user),
        }),
      login: (token, user) =>
        set({
          token,
          user,
          isAuthenticated: true,
        }),
      logout: () =>
        set({
          token: null,
          user: null,
          isAuthenticated: false,
        }),
      setUser: (user) =>
        set((s) => ({
          user,
          isAuthenticated: !!(s.token && user),
        })),
    }),
    { name: "routewise-auth", partialize: (s) => ({ token: s.token, user: s.user }) }
  )
)
