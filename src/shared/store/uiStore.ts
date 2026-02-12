"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

type Theme = "light" | "dark" | "system"

interface UIState {
  theme: Theme
  sidebarOpen: boolean
  modals: Record<string, boolean>
  setTheme: (theme: Theme) => void
  setSidebarOpen: (open: boolean) => void
  openModal: (key: string) => void
  closeModal: (key: string) => void
  toggleModal: (key: string) => void
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      theme: "system",
      sidebarOpen: true,
      modals: {},
      setTheme: (theme) => set({ theme }),
      setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
      openModal: (key) =>
        set((s) => ({ modals: { ...s.modals, [key]: true } })),
      closeModal: (key) =>
        set((s) => ({ modals: { ...s.modals, [key]: false } })),
      toggleModal: (key) =>
        set((s) => ({ modals: { ...s.modals, [key]: !s.modals[key] } })),
    }),
    { name: "routewise-ui", partialize: (s) => ({ theme: s.theme, sidebarOpen: s.sidebarOpen }) }
  )
)
