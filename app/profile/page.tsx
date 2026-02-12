"use client"

import { useState, useCallback } from "react"
import useSWR from "swr"
import Image from "next/image"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRouter } from "next/navigation"
import {
  Settings,
  Grid3X3,
  Bookmark,
  Users,
  UserCheck,
  LogOut,
  Camera,
  Loader2,
  MapPin,
} from "lucide-react"
import { toast } from "sonner"

import { AppShell } from "@/components/AppShell"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { useAuth } from "@/components/auth/AuthProvider"
import { PostCard, type Post } from "@/components/PostCard"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { api } from "@/lib/api"
import { EditProfileDialog } from "@/components/EditProfileDialog"

export default function ProfilePage() {
  const { user, isLoading: authLoading, logout } = useAuth()
  const router = useRouter()
  const [editOpen, setEditOpen] = useState(false)

  // Fetch fresh profile
  const { data: profile, mutate: mutateProfile } = useSWR(
    user ? "/users/me" : null,
    () => api.users.me(),
  )

  // Fetch user posts
  const { data: postsData, isLoading: postsLoading } = useSWR(
    user ? `/posts?authorId=${user.id}` : null,
    () => api.posts.byAuthor(user!.id),
  )

  // Fetch saved posts
  const { data: savedData, isLoading: savedLoading } = useSWR(
    user ? "/users/me/saved" : null,
    () => api.users.saved(),
  )

  // Fetch followers & following
  const { data: followersData } = useSWR(
    user ? `/users/${user.id}/followers` : null,
    () => api.users.followers(user!.id),
  )
  const { data: followingData } = useSWR(
    user ? `/users/${user.id}/following` : null,
    () => api.users.following(user!.id),
  )

  const displayUser = profile || user

  const posts: Post[] = (
    Array.isArray(postsData) ? postsData : postsData?.data || postsData?.posts || []
  ).map((p: Record<string, unknown>) => ({
    id: p.id as number,
    username: (p.username as string) || (p.author as Record<string, unknown>)?.username as string || displayUser?.username || "",
    avatarUrl: (p.avatarUrl as string) || (p.author as Record<string, unknown>)?.avatarUrl as string || displayUser?.avatarUrl || "",
    location: (p.location as string) || "",
    timestamp: p.createdAt ? new Date(p.createdAt as string).toLocaleDateString("ru-RU") : "",
    imageUrl: (p.imageUrl as string) || (p.image_url as string) || "",
    caption: (p.caption as string) || (p.content as string) || "",
    hashtags: (p.hashtags as string[]) || [],
    likes: (p.likesCount as number) ?? (p.likes as number) ?? 0,
    comments: (p.commentsCount as number) ?? (p.comments as number) ?? 0,
    liked: (p.liked as boolean) ?? (p.isLiked as boolean) ?? false,
    saved: (p.saved as boolean) ?? (p.isSaved as boolean) ?? true,
  }))

  const savedPosts: Post[] = (
    Array.isArray(savedData) ? savedData : savedData?.data || savedData?.posts || []
  ).map((p: Record<string, unknown>) => ({
    id: p.id as number,
    username: (p.username as string) || (p.author as Record<string, unknown>)?.username as string || "",
    avatarUrl: (p.avatarUrl as string) || (p.author as Record<string, unknown>)?.avatarUrl as string || "",
    location: (p.location as string) || "",
    timestamp: p.createdAt ? new Date(p.createdAt as string).toLocaleDateString("ru-RU") : "",
    imageUrl: (p.imageUrl as string) || (p.image_url as string) || "",
    caption: (p.caption as string) || (p.content as string) || "",
    hashtags: (p.hashtags as string[]) || [],
    likes: (p.likesCount as number) ?? (p.likes as number) ?? 0,
    comments: (p.commentsCount as number) ?? (p.comments as number) ?? 0,
    liked: (p.liked as boolean) ?? (p.isLiked as boolean) ?? false,
    saved: true,
  }))

  const followers = Array.isArray(followersData) ? followersData : followersData?.data || []
  const following = Array.isArray(followingData) ? followingData : followingData?.data || []
  const postCount = posts.length
  const followerCount = followers.length
  const followingCount = following.length

  const handleToggleLike = useCallback(async (id: number) => {
    const post = [...posts, ...savedPosts].find((p) => p.id === id)
    if (!post) return
    try {
      if (post.liked) await api.posts.unlike(id)
      else await api.posts.like(id)
    } catch {
      toast.error("Ошибка при обновлении лайка")
    }
  }, [posts, savedPosts])

  const handleToggleSave = useCallback(async (id: number) => {
    const post = [...posts, ...savedPosts].find((p) => p.id === id)
    if (!post) return
    try {
      if (post.saved) await api.posts.unsave(id)
      else await api.posts.save(id)
    } catch {
      toast.error("Ошибка при обновлении закладки")
    }
  }, [posts, savedPosts])

  function handleLogout() {
    logout()
    router.push("/")
  }

  if (authLoading) {
    return (
      <AppShell>
        <div className="mx-auto max-w-2xl px-4 py-8">
          <div className="flex flex-col items-center gap-4">
            <Skeleton className="h-24 w-24 rounded-full" />
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-60" />
          </div>
        </div>
      </AppShell>
    )
  }

  return (
    <ProtectedRoute>
    {user ? (
    <AppShell>
      <div className="mx-auto max-w-2xl px-4 py-6">
        {/* Profile Header */}
        <div className="flex flex-col items-center gap-4 pb-6">
          <div className="relative">
            <Avatar className="h-24 w-24 ring-4 ring-border">
              <AvatarImage src={displayUser?.avatarUrl} alt="Аватар" />
              <AvatarFallback className="text-2xl font-medium bg-muted text-foreground">
                {(displayUser?.username || "?").slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <button
              onClick={() => setEditOpen(true)}
              className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground ring-2 ring-background"
              aria-label="Изменить фото"
            >
              <Camera className="h-4 w-4" />
            </button>
          </div>
          <div className="text-center">
            <h1 className="text-xl font-bold text-foreground">{displayUser?.username}</h1>
            <p className="text-sm text-muted-foreground">@{displayUser?.username}</p>
            {displayUser?.bio && (
              <p className="mt-2 text-sm text-foreground max-w-sm">{displayUser.bio}</p>
            )}
          </div>

          {/* Stats */}
          <div className="flex items-center gap-8">
            <div className="text-center">
              <p className="text-lg font-bold text-foreground">{postCount}</p>
              <p className="text-xs text-muted-foreground">Постов</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-foreground">{followerCount}</p>
              <p className="text-xs text-muted-foreground">Подписчиков</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-foreground">{followingCount}</p>
              <p className="text-xs text-muted-foreground">Подписок</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => setEditOpen(true)}>
              Редактировать
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href="/settings">
                <Settings className="mr-1.5 h-4 w-4" />
                Настройки
              </Link>
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-destructive hover:text-destructive">
              <LogOut className="mr-1.5 h-4 w-4" />
              Выйти
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="posts" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="posts" className="flex-1 gap-1.5">
              <Grid3X3 className="h-4 w-4" />
              Посты
            </TabsTrigger>
            <TabsTrigger value="saved" className="flex-1 gap-1.5">
              <Bookmark className="h-4 w-4" />
              Сохранённые
            </TabsTrigger>
            <TabsTrigger value="followers" className="flex-1 gap-1.5">
              <Users className="h-4 w-4" />
              Подписчики
            </TabsTrigger>
            <TabsTrigger value="following" className="flex-1 gap-1.5">
              <UserCheck className="h-4 w-4" />
              Подписки
            </TabsTrigger>
          </TabsList>

          <TabsContent value="posts">
            <div className="flex flex-col gap-4 pt-4">
              {postsLoading ? (
                Array.from({ length: 2 }).map((_, i) => (
                  <Skeleton key={i} className="h-64 w-full rounded-2xl" />
                ))
              ) : posts.length > 0 ? (
                posts.map((post) => (
                  <PostCard key={post.id} post={post} onToggleLike={handleToggleLike} onToggleSave={handleToggleSave} />
                ))
              ) : (
                <p className="py-12 text-center text-muted-foreground">Нет постов</p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="saved">
            <div className="flex flex-col gap-4 pt-4">
              {savedLoading ? (
                Array.from({ length: 2 }).map((_, i) => (
                  <Skeleton key={i} className="h-64 w-full rounded-2xl" />
                ))
              ) : savedPosts.length > 0 ? (
                savedPosts.map((post) => (
                  <PostCard key={post.id} post={post} onToggleLike={handleToggleLike} onToggleSave={handleToggleSave} />
                ))
              ) : (
                <p className="py-12 text-center text-muted-foreground">Нет сохранённых постов</p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="followers">
            <div className="flex flex-col gap-2 pt-4">
              {followers.length > 0 ? (
                followers.map((u: Record<string, unknown>) => (
                  <Link
                    key={u.id as number}
                    href={`/profile/${u.id}`}
                    className="flex items-center gap-3 rounded-xl p-3 transition-colors hover:bg-secondary"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={u.avatarUrl as string} alt={(u.username as string) || "Пользователь"} />
                      <AvatarFallback className="text-xs font-medium bg-muted text-foreground">
                        {((u.username as string) || "?").slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{u.username as string}</p>
                      {u.bio && <p className="text-xs text-muted-foreground truncate max-w-xs">{u.bio as string}</p>}
                    </div>
                  </Link>
                ))
              ) : (
                <p className="py-12 text-center text-muted-foreground">Нет подписчиков</p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="following">
            <div className="flex flex-col gap-2 pt-4">
              {following.length > 0 ? (
                following.map((u: Record<string, unknown>) => (
                  <Link
                    key={u.id as number}
                    href={`/profile/${u.id}`}
                    className="flex items-center gap-3 rounded-xl p-3 transition-colors hover:bg-secondary"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={u.avatarUrl as string} alt={(u.username as string) || "Пользователь"} />
                      <AvatarFallback className="text-xs font-medium bg-muted text-foreground">
                        {((u.username as string) || "?").slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{u.username as string}</p>
                      {u.bio && <p className="text-xs text-muted-foreground truncate max-w-xs">{u.bio as string}</p>}
                    </div>
                  </Link>
                ))
              ) : (
                <p className="py-12 text-center text-muted-foreground">Нет подписок</p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <EditProfileDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        onProfileUpdated={() => mutateProfile()}
      />
    </AppShell>
    ) : null}
    </ProtectedRoute>
  )
}
