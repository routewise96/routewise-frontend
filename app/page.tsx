"use client"

import { useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import useSWR from "swr"
import { api } from "@/lib/api"
import { Header } from "@/components/Header"
import { Sidebar } from "@/components/Sidebar"
import { BottomNav } from "@/components/BottomNav"
import {
  RecommendationsPanel,
  type Destination,
} from "@/components/RecommendationsPanel"
import { Feed } from "@/features/feed"
import { LoginDialog, RegisterDialog } from "@/features/auth"

function normalizeDestination(raw: Record<string, unknown>): Destination {
  return {
    id: (raw.id as number) ?? 0,
    name: (raw.name as string) || "",
    country: (raw.country as string) || "",
    imageUrl: (raw.imageUrl as string) || (raw.image_url as string) || "",
    rating: (raw.rating as number) || 0,
  }
}

export default function FeedPage() {
  const queryClient = useQueryClient()
  const [loginOpen, setLoginOpen] = useState(false)
  const [registerOpen, setRegisterOpen] = useState(false)

  const { data: destinations = [], isLoading: destLoading } = useSWR(
    "destinations",
    async () => {
      try {
        const data = await api.recommendations.destinations()
        const arr = Array.isArray(data)
          ? data
          : Array.isArray(data?.destinations)
            ? data.destinations
            : []
        return arr.map((d: Record<string, unknown>) => normalizeDestination(d))
      } catch {
        return []
      }
    },
    { revalidateOnFocus: false }
  )

  const { data: trending = [], isLoading: trendLoading } = useSWR(
    "trending",
    async () => {
      try {
        const data = await api.recommendations.hashtags()
        const arr = Array.isArray(data)
          ? data
          : Array.isArray(data?.hashtags)
            ? data.hashtags
            : Array.isArray(data?.tags)
              ? data.tags
              : []
        return arr.map((t: string | Record<string, unknown>) =>
          typeof t === "string" ? t : (t.name as string) || (t.tag as string) || ""
        )
      } catch {
        return []
      }
    },
    { revalidateOnFocus: false }
  )

  function refreshFeed() {
    queryClient.invalidateQueries({ queryKey: ["feed"] })
  }

  function switchToRegister() {
    setLoginOpen(false)
    setRegisterOpen(true)
  }
  function switchToLogin() {
    setRegisterOpen(false)
    setLoginOpen(true)
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header onPostCreated={refreshFeed} />
      <Sidebar />

      <div className="lg:pl-60 xl:pl-64">
        <main className="mx-auto flex max-w-6xl gap-6 px-4 py-6 lg:px-6">
          <div className="flex-1 min-w-0">
            <Feed
              onOpenLogin={() => setLoginOpen(true)}
              onOpenRegister={() => setRegisterOpen(true)}
            />
          </div>

          <RecommendationsPanel
            destinations={destinations}
            trending={trending}
            isLoading={destLoading || trendLoading}
          />
        </main>
      </div>

      <BottomNav />

      <LoginDialog
        open={loginOpen}
        onOpenChange={setLoginOpen}
        onSwitchToRegister={switchToRegister}
      />
      <RegisterDialog
        open={registerOpen}
        onOpenChange={setRegisterOpen}
        onSwitchToLogin={switchToLogin}
      />
    </div>
  )
}
