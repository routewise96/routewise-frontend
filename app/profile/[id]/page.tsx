"use client"

import { use, useState, useMemo } from "react"
import { useAuth } from "@/features/auth"
import {
  useUserProfile,
  useUserPosts,
  useFollowers,
  useFollowing,
  ProfileHeader,
  ProfileTabs,
  UserNotFound,
  normalizePost,
} from "@/features/profile"
import { AppShell } from "@/components/AppShell"

export default function UserProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { user: currentUser } = useAuth()
  const [activeTab, setActiveTab] = useState("posts")

  const { data: profile, isLoading: profileLoading, isError, error } = useUserProfile(id)
  const userId = profile?.id ?? (id ? Number(id) : undefined)

  const {
    data: postsData,
    isLoading: postsLoading,
    hasNextPage: postsHasNextPage,
    fetchNextPage: postsFetchNextPage,
    isFetchingNextPage: postsIsFetchingNextPage,
  } = useUserPosts(userId)
  const {
    data: followersData,
    isLoading: followersLoading,
    hasNextPage: followersHasNextPage,
    fetchNextPage: followersFetchNextPage,
    isFetchingNextPage: followersIsFetchingNextPage,
  } = useFollowers(userId)
  const {
    data: followingData,
    isLoading: followingLoading,
    hasNextPage: followingHasNextPage,
    fetchNextPage: followingFetchNextPage,
    isFetchingNextPage: followingIsFetchingNextPage,
  } = useFollowing(userId)

  const posts = useMemo(() => {
    if (!postsData?.pages) return []
    return postsData.pages.flat().map((p) => normalizePost(p, profile?.username ?? ""))
  }, [postsData, profile?.username])

  const followers = useMemo(() => {
    if (!followersData?.pages) return []
    return followersData.pages.flat()
  }, [followersData])

  const following = useMemo(() => {
    if (!followingData?.pages) return []
    return followingData.pages.flat()
  }, [followingData])

  const isFollowing = useMemo(() => {
    if (profile?.isFollowing !== undefined) return profile.isFollowing
    if (!currentUser) return false
    return followers.some((f) => f.id === currentUser.id)
  }, [profile?.isFollowing, currentUser, followers])

  if (isError && ((error as { statusCode?: number })?.statusCode === 404 || (error as { response?: { status?: number } })?.response?.status === 404)) {
    return (
      <AppShell>
        <UserNotFound />
      </AppShell>
    )
  }

  if (profileLoading || !profile) {
    return (
      <AppShell>
        <div className="mx-auto max-w-2xl px-4 py-12">
          <div className="flex flex-col items-center gap-4">
            <div className="h-24 w-24 rounded-full bg-muted animate-pulse" />
            <div className="h-6 w-40 bg-muted rounded animate-pulse" />
          </div>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-2xl px-4 py-6">
        <ProfileHeader
          user={profile}
          isOwnProfile={false}
          postsCount={profile.postsCount ?? posts.length}
          followersCount={profile.followersCount ?? followers.length}
          followingCount={profile.followingCount ?? following.length}
          isFollowing={isFollowing}
          onEditOpen={() => {}}
          onLogout={() => {}}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        <ProfileTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          showSaved={false}
          posts={posts}
          postsLoading={postsLoading}
          postsHasNextPage={postsHasNextPage}
          postsFetchNextPage={postsFetchNextPage}
          postsIsFetchingNextPage={postsIsFetchingNextPage}
          savedPosts={[]}
          savedLoading={false}
          followers={followers}
          followersLoading={followersLoading}
          followersHasNextPage={followersHasNextPage}
          followersFetchNextPage={followersFetchNextPage}
          followersIsFetchingNextPage={followersIsFetchingNextPage}
          following={following}
          followingLoading={followingLoading}
          followingHasNextPage={followingHasNextPage}
          followingFetchNextPage={followingFetchNextPage}
          followingIsFetchingNextPage={followingIsFetchingNextPage}
          currentUserId={currentUser?.id}
        />
      </div>
    </AppShell>
  )
}
