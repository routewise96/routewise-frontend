"use client"

import { useState, useCallback } from "react"
import useSWR from "swr"
import { ChevronDown, Loader2, LogIn } from "lucide-react"
import { toast } from "sonner"

import { api } from "@/lib/api"
import { useAuth } from "@/components/auth/AuthProvider"
import { Header } from "@/components/Header"
import { Sidebar } from "@/components/Sidebar"
import { BottomNav } from "@/components/BottomNav"
import { PostCard, type Post } from "@/components/PostCard"
import {
  RecommendationsPanel,
  type Destination,
} from "@/components/RecommendationsPanel"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { LoginDialog } from "@/components/auth/LoginDialog"
import { RegisterDialog } from "@/components/auth/RegisterDialog"

// --- Helpers to normalize API response ---

function normalizePost(raw: Record<string, unknown>): Post {
  return {
    id: (raw.id as number) ?? 0,
    username:
      (raw.username as string) ||
      ((raw.author as Record<string, unknown>)?.username as string) ||
      "traveler",
    avatarUrl:
      (raw.avatarUrl as string) ||
      (raw.avatar_url as string) ||
      ((raw.author as Record<string, unknown>)?.avatarUrl as string) ||
      ((raw.author as Record<string, unknown>)?.avatar_url as string) ||
      `https://i.pravatar.cc/150?img=${((raw.id as number) ?? 0) % 70}`,
    location: (raw.location as string) || "",
    timestamp: (raw.timestamp as string) || (raw.created_at as string) || "",
    imageUrl:
      (raw.imageUrl as string) ||
      (raw.image_url as string) ||
      `https://picsum.photos/600/400?random=${raw.id}`,
    caption: (raw.caption as string) || (raw.text as string) || "",
    hashtags: (raw.hashtags as string[]) || (raw.tags as string[]) || [],
    likes: (raw.likes as number) || (raw.likes_count as number) || 0,
    comments: (raw.comments as number) || (raw.comments_count as number) || 0,
    liked: (raw.liked as boolean) || (raw.is_liked as boolean) || false,
    saved: (raw.saved as boolean) || (raw.is_saved as boolean) || false,
  }
}

function normalizeDestination(raw: Record<string, unknown>): Destination {
  return {
    id: (raw.id as number) ?? 0,
    name: (raw.name as string) || "",
    country: (raw.country as string) || "",
    imageUrl:
      (raw.imageUrl as string) ||
      (raw.image_url as string) ||
      `https://picsum.photos/112/112?random=${raw.id}`,
    rating: (raw.rating as number) || 0,
  }
}

// --- Feed page ---

export default function FeedPage() {
  const { user, token } = useAuth()
  const [page, setPage] = useState(1)
  const [allPosts, setAllPosts] = useState<Post[]>([])
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [loginOpen, setLoginOpen] = useState(false)
  const [registerOpen, setRegisterOpen] = useState(false)

  // Refresh feed (called after creating a post)
  function refreshFeed() {
    setPage(1)
    setAllPosts([])
    setHasMore(true)
    feedMutate()
  }

  // Fetch initial page of posts
  const { isLoading: feedLoading, error: feedError, mutate: feedMutate } = useSWR(
    "feed-page-1",
    async () => {
      const data = await api.posts.feed(1)
      const posts = Array.isArray(data)
        ? data
        : Array.isArray(data?.posts)
          ? data.posts
          : Array.isArray(data?.data)
            ? data.data
            : []
      const normalized = posts.map((p: Record<string, unknown>) =>
        normalizePost(p)
      )
      setAllPosts(normalized)
      setHasMore(normalized.length >= 10)
      return normalized
    },
    { revalidateOnFocus: false }
  )

  // Fetch recommendations
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

  // Load more posts
  const handleLoadMore = useCallback(async () => {
    setLoadingMore(true)
    try {
      const nextPage = page + 1
      const data = await api.posts.feed(nextPage)
      const posts = Array.isArray(data)
        ? data
        : Array.isArray(data?.posts)
          ? data.posts
          : Array.isArray(data?.data)
            ? data.data
            : []
      const normalized = posts.map((p: Record<string, unknown>) =>
        normalizePost(p)
      )
      if (normalized.length === 0) {
        setHasMore(false)
      } else {
        setAllPosts((prev) => [...prev, ...normalized])
        setPage(nextPage)
        if (normalized.length < 10) setHasMore(false)
      }
    } catch {
      toast.error("Ошибка загрузки постов")
    } finally {
      setLoadingMore(false)
    }
  }, [page])

  // Toggle like
  async function toggleLike(id: number) {
    if (!token) {
      setLoginOpen(true)
      return
    }

    const post = allPosts.find((p) => p.id === id)
    if (!post) return

    // Optimistic update
    setAllPosts((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              liked: !p.liked,
              likes: p.liked ? p.likes - 1 : p.likes + 1,
            }
          : p
      )
    )

    try {
      if (post.liked) {
        await api.posts.unlike(id)
      } else {
        await api.posts.like(id)
      }
    } catch {
      // Revert on error
      setAllPosts((prev) =>
        prev.map((p) =>
          p.id === id
            ? {
                ...p,
                liked: post.liked,
                likes: post.likes,
              }
            : p
        )
      )
      toast.error("Не удалось обновить лайк")
    }
  }

  // Toggle save
  async function toggleSave(id: number) {
    if (!token) {
      setLoginOpen(true)
      return
    }

    const post = allPosts.find((p) => p.id === id)
    if (!post) return

    // Optimistic update
    setAllPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, saved: !p.saved } : p))
    )

    try {
      if (post.saved) {
        await api.posts.unsave(id)
      } else {
        await api.posts.save(id)
      }
    } catch {
      // Revert on error
      setAllPosts((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, saved: post.saved } : p
        )
      )
      toast.error("Не удалось обновить сохранение")
    }
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
          {/* Feed Column */}
          <div className="flex-1 min-w-0">
            {feedLoading ? (
              <div className="flex flex-col gap-5">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="rounded-2xl border border-border bg-card overflow-hidden"
                  >
                    <div className="flex items-center gap-3 px-4 pt-4 pb-3">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div>
                        <Skeleton className="h-4 w-28 mb-1" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                    </div>
                    <Skeleton className="aspect-video w-full" />
                    <div className="px-4 py-3">
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : feedError ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <p className="text-lg font-semibold text-foreground mb-2">
                  Ошибка загрузки ленты
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  Не удалось подключиться к серверу. Попробуйте позже.
                </p>
                <Button
                  variant="outline"
                  onClick={() => window.location.reload()}
                >
                  Обновить страницу
                </Button>
              </div>
            ) : allPosts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <p className="text-lg font-semibold text-foreground mb-2">
                  Лента пуста
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  {user
                    ? "Подпишитесь на путешественников, чтобы видеть их посты."
                    : "Войдите, чтобы увидеть посты от путешественников."}
                </p>
                {!user && (
                  <Button onClick={() => setLoginOpen(true)}>
                    <LogIn className="mr-1.5 h-4 w-4" />
                    Войти
                  </Button>
                )}
              </div>
            ) : (
              <>
                <div className="flex flex-col gap-5">
                  {allPosts.map((post) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      onToggleLike={toggleLike}
                      onToggleSave={toggleSave}
                    />
                  ))}
                </div>

                {/* Load More */}
                {hasMore && (
                  <div className="flex justify-center py-8 pb-24 lg:pb-8">
                    <button
                      onClick={handleLoadMore}
                      disabled={loadingMore}
                      className="flex items-center gap-2 rounded-xl border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground transition-all hover:bg-secondary hover:border-primary/30 disabled:opacity-60 active:scale-95"
                    >
                      {loadingMore ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Загрузка...
                        </>
                      ) : (
                        <>
                          <ChevronDown className="h-4 w-4" />
                          Загрузить ещё
                        </>
                      )}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Right Panel */}
          <RecommendationsPanel
            destinations={destinations}
            trending={trending}
            isLoading={destLoading || trendLoading}
          />
        </main>
      </div>

      <BottomNav />

      {/* Auth dialogs triggered from like/save without login */}
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
