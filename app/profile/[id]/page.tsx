"use client"

import { useState, useCallback, use } from "react"
import useSWR from "swr"
import Image from "next/image"
import Link from "next/link"
import { Users, UserCheck, UserPlus, Grid3X3, Loader2 } from "lucide-react"
import { toast } from "sonner"

import { AppShell } from "@/components/AppShell"
import { useAuth } from "@/components/auth/AuthProvider"
import { PostCard, type Post } from "@/components/PostCard"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { api } from "@/lib/api"

export default function UserProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const userId = parseInt(id, 10)
  const { user: currentUser } = useAuth()
  const [followLoading, setFollowLoading] = useState(false)

  // Fetch user profile
  const { data: profile, isLoading: profileLoading } = useSWR(
    `/users/${userId}`,
    () => api.users.byId(userId),
  )

  // Fetch user posts
  const { data: postsData, isLoading: postsLoading } = useSWR(
    `/posts?authorId=${userId}`,
    () => api.posts.byAuthor(userId),
  )

  // Fetch followers & following
  const { data: followersData, mutate: mutateFollowers } = useSWR(
    `/users/${userId}/followers`,
    () => api.users.followers(userId),
  )
  const { data: followingData } = useSWR(
    `/users/${userId}/following`,
    () => api.users.following(userId),
  )

  const posts: Post[] = (
    Array.isArray(postsData) ? postsData : postsData?.data || postsData?.posts || []
  ).map((p: Record<string, unknown>) => ({
    id: p.id as number,
    username: (p.username as string) || (p.author as Record<string, unknown>)?.username as string || profile?.username || "",
    avatarUrl: (p.avatarUrl as string) || (p.author as Record<string, unknown>)?.avatarUrl as string || profile?.avatarUrl || "",
    location: (p.location as string) || "",
    timestamp: p.createdAt ? new Date(p.createdAt as string).toLocaleDateString("ru-RU") : "",
    imageUrl: (p.imageUrl as string) || (p.image_url as string) || "",
    caption: (p.caption as string) || (p.content as string) || "",
    hashtags: (p.hashtags as string[]) || [],
    likes: (p.likesCount as number) ?? (p.likes as number) ?? 0,
    comments: (p.commentsCount as number) ?? (p.comments as number) ?? 0,
    liked: (p.liked as boolean) ?? (p.isLiked as boolean) ?? false,
    saved: (p.saved as boolean) ?? (p.isSaved as boolean) ?? false,
  }))

  const followers = Array.isArray(followersData) ? followersData : followersData?.data || []
  const following = Array.isArray(followingData) ? followingData : followingData?.data || []

  const isFollowing = currentUser
    ? followers.some((f: Record<string, unknown>) => f.id === currentUser.id)
    : false

  const handleToggleLike = useCallback(async (postId: number) => {
    const post = posts.find((p) => p.id === postId)
    if (!post || !currentUser) return
    try {
      if (post.liked) await api.posts.unlike(postId)
      else await api.posts.like(postId)
    } catch {
      toast.error("Ошибка")
    }
  }, [posts, currentUser])

  const handleToggleSave = useCallback(async (postId: number) => {
    const post = posts.find((p) => p.id === postId)
    if (!post || !currentUser) return
    try {
      if (post.saved) await api.posts.unsave(postId)
      else await api.posts.save(postId)
    } catch {
      toast.error("Ошибка")
    }
  }, [posts, currentUser])

  async function handleFollowToggle() {
    if (!currentUser) return
    setFollowLoading(true)
    try {
      if (isFollowing) {
        await api.users.unfollow(userId)
        toast.success("Вы отписались")
      } else {
        await api.users.follow(userId)
        toast.success("Вы подписались!")
      }
      mutateFollowers()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Ошибка")
    } finally {
      setFollowLoading(false)
    }
  }

  if (profileLoading) {
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

  if (!profile) {
    return (
      <AppShell>
        <div className="mx-auto max-w-2xl px-4 py-20 text-center">
          <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h2 className="text-xl font-bold text-foreground mb-2">Пользователь не найден</h2>
          <p className="text-muted-foreground">Не удалось найти этого пользователя.</p>
        </div>
      </AppShell>
    )
  }

  // If this is our own profile, redirect concept
  const isOwnProfile = currentUser?.id === userId

  return (
    <AppShell>
      <div className="mx-auto max-w-2xl px-4 py-6">
        {/* Profile Header */}
        <div className="flex flex-col items-center gap-4 pb-6">
          <Image
            src={profile.avatarUrl || "https://i.pravatar.cc/150?img=2"}
            alt={profile.username || "Пользователь"}
            width={96}
            height={96}
            className="h-24 w-24 rounded-full object-cover ring-4 ring-border"
          />
          <div className="text-center">
            <h1 className="text-xl font-bold text-foreground">{profile.username}</h1>
            <p className="text-sm text-muted-foreground">@{profile.username}</p>
            {profile.bio && (
              <p className="mt-2 text-sm text-foreground max-w-sm">{profile.bio}</p>
            )}
          </div>

          {/* Stats */}
          <div className="flex items-center gap-8">
            <div className="text-center">
              <p className="text-lg font-bold text-foreground">{posts.length}</p>
              <p className="text-xs text-muted-foreground">Постов</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-foreground">{followers.length}</p>
              <p className="text-xs text-muted-foreground">Подписчиков</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-foreground">{following.length}</p>
              <p className="text-xs text-muted-foreground">Подписок</p>
            </div>
          </div>

          {/* Follow Button */}
          {!isOwnProfile && currentUser && (
            <Button
              variant={isFollowing ? "outline" : "default"}
              onClick={handleFollowToggle}
              disabled={followLoading}
            >
              {followLoading ? (
                <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
              ) : isFollowing ? (
                <UserCheck className="mr-1.5 h-4 w-4" />
              ) : (
                <UserPlus className="mr-1.5 h-4 w-4" />
              )}
              {isFollowing ? "Отписаться" : "Подписаться"}
            </Button>
          )}

          {isOwnProfile && (
            <Button variant="outline" size="sm" asChild>
              <Link href="/profile">Перейти в свой профиль</Link>
            </Button>
          )}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="posts" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="posts" className="flex-1 gap-1.5">
              <Grid3X3 className="h-4 w-4" />
              Посты
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

          <TabsContent value="followers">
            <div className="flex flex-col gap-2 pt-4">
              {followers.length > 0 ? (
                followers.map((u: Record<string, unknown>) => (
                  <Link
                    key={u.id as number}
                    href={`/profile/${u.id}`}
                    className="flex items-center gap-3 rounded-xl p-3 transition-colors hover:bg-secondary"
                  >
                    <Image
                      src={(u.avatarUrl as string) || "https://i.pravatar.cc/150?img=3"}
                      alt={(u.username as string) || "Пользователь"}
                      width={40}
                      height={40}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    <p className="text-sm font-semibold text-foreground">{u.username as string}</p>
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
                    <Image
                      src={(u.avatarUrl as string) || "https://i.pravatar.cc/150?img=5"}
                      alt={(u.username as string) || "Пользователь"}
                      width={40}
                      height={40}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    <p className="text-sm font-semibold text-foreground">{u.username as string}</p>
                  </Link>
                ))
              ) : (
                <p className="py-12 text-center text-muted-foreground">Нет подписок</p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  )
}
