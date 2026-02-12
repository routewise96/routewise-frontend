"use client"

import { Header } from "@/components/Header"
import { Sidebar } from "@/components/Sidebar"
import { BottomNav } from "@/components/BottomNav"

interface AppShellProps {
  children: React.ReactNode
  onPostCreated?: () => void
}

export function AppShell({ children, onPostCreated }: AppShellProps) {
  return (
    <div className="min-h-screen bg-background">
      <Header onPostCreated={onPostCreated} />
      <Sidebar />
      <main className="lg:pl-60 xl:pl-64 pb-20 lg:pb-0">{children}</main>
      <BottomNav />
    </div>
  )
}
