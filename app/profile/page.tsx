"use client"

import { useState, useMemo } from "react"
import { ProtectedRoute, useAuth } from "@/features/auth"
import {
  useUserProfile,
  useUserPosts,
  useSavedPosts,
  useFollowers,
  useFollowing,
  ProfileHeader,
  ProfileTabs,
  EditProfileDialog,
  normalizePost,
} from "@/features/profile"
import { AppShell } from "@/components/AppShell"

export default function ProfilePage() {
  const { user: authUser, logout } = useAuth()
  const [activeTab, setActiveTab] = useState("posts")
  const [editOpen, setEditOpen] = useState(false)

  const { data: profile, isLoading: profileLoading } = useUserProfile()
  const profileId = profile?.id ?? authUser?.id
  const isOwnProfile = true

  const {
    data: postsData,
    isLoading: postsLoading,
    hasNextPage: postsHasNextPage,
    fetchNextPage: postsFetchNextPage,
    isFetchingNextPage: postsIsFetchingNextPage,
  } = useUserPosts(profileId!)
  const {
    data: savedData,
    isLoading: savedLoading,
    hasNextPage: savedHasNextPage,
    fetchNextPage: savedFetchNextPage,
    isFetchingNextPage: savedIsFetchingNextPage,
  } = useSavedPosts()
  const {
    data: followersData,
    isLoading: followersLoading,
    hasNextPage: followersHasNextPage,
    fetchNextPage: followersFetchNextPage,
    isFetchingNextPage: followersIsFetchingNextPage,
  } = useFollowers(profileId!)
  const {
    data: followingData,
    isLoading: followingLoading,
    hasNextPage: followingHasNextPage,
    fetchNextPage: followingFetchNextPage,
    isFetchingNextPage: followingIsFetchingNextPage,
  } = useFollowing(profileId!)

  const posts = useMemo(() => {
    if (!postsData?.pages) return []
    return postsData.pages.flat().map((p) => normalizePost(p, profile?.username ?? ""))
  }, [postsData, profile?.username])

  const savedPosts = useMemo(() => {
    if (!savedData?.pages) return []
    return savedData.pages.flat().map((p) => normalizePost(p, profile?.username ?? ""))
  }, [savedData, profile?.username])

  const followers = useMemo(() => {
    if (!followersData?.pages) return []
    return followersData.pages.flat()
  }, [followersData])

  const following = useMemo(() => {
    if (!followingData?.pages) return []
    return followingData.pages.flat()
  }, [followingData])

  const displayUser = profile ?? authUser
  if (!displayUser && !profileLoading) {
    return null
  }

  return (
    <ProtectedRoute>
      <AppShell>
        <div className="mx-auto max-w-2xl px-4 py-6">
          {profileLoading || !displayUser ? (
            <div className="flex flex-col items-center gap-4 py-12">
              <div className="h-24 w-24 rounded-full bg-muted animate-pulse" />
              <div className="h-6 w-40 bg-muted rounded animate-pulse" />
            </div>
          ) : (
            <>
              <ProfileHeader
                user={displayUser}
                isOwnProfile={isOwnProfile}
                postsCount={profile?.postsCount ?? posts.length}
                followersCount={profile?.followersCount ?? followers.length}
                followingCount={profile?.followingCount ?? following.length}
                onEditOpen={() => setEditOpen(true)}
                onLogout={logout}
                activeTab={activeTab}
                onTabChange={setActiveTab}
              />
              <ProfileTabs
                activeTab={activeTab}
                onTabChange={setActiveTab}
                showSaved={true}
                posts={posts}
                postsLoading={postsLoading}
                postsHasNextPage={postsHasNextPage}
                postsFetchNextPage={postsFetchNextPage}
                postsIsFetchingNextPage={postsIsFetchingNextPage}
                savedPosts={savedPosts}
                savedLoading={savedLoading}
                savedHasNextPage={savedHasNextPage}
                savedFetchNextPage={savedFetchNextPage}
                savedIsFetchingNextPage={savedIsFetchingNextPage}
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
                currentUserId={displayUser.id}
              />
            </>
          )}
          <EditProfileDialog
            open={editOpen}
            onOpenChange={setEditOpen}
            onProfileUpdated={() => {}}
          />
        </div>
      </AppShell>
    </ProtectedRoute>
  )
}
