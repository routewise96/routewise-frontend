"use client"

import { useTranslations } from "next-intl"
import { Grid3X3, Bookmark, Users, UserCheck, ImageIcon } from "lucide-react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { PostsGrid } from "./PostsGrid"
import { FollowersList } from "./FollowersList"
import { FollowingList } from "./FollowingList"
import type { PostCardPost } from "@/features/profile/lib/normalizePost"
import type { User } from "@/shared/types/models"

interface ProfileTabsProps {
  activeTab: string
  onTabChange: (tab: string) => void
  showSaved: boolean
  posts: PostCardPost[]
  postsLoading: boolean
  postsHasNextPage?: boolean
  postsFetchNextPage?: () => void
  postsIsFetchingNextPage?: boolean
  savedPosts: PostCardPost[]
  savedLoading: boolean
  savedHasNextPage?: boolean
  savedFetchNextPage?: () => void
  savedIsFetchingNextPage?: boolean
  followers: User[]
  followersLoading: boolean
  followersHasNextPage?: boolean
  followersFetchNextPage?: () => void
  followersIsFetchingNextPage?: boolean
  following: User[]
  followingLoading: boolean
  followingHasNextPage?: boolean
  followingFetchNextPage?: () => void
  followingIsFetchingNextPage?: boolean
  currentUserId?: number
}

export function ProfileTabs({
  activeTab,
  onTabChange,
  showSaved,
  posts,
  postsLoading,
  postsHasNextPage,
  postsFetchNextPage,
  postsIsFetchingNextPage,
  savedPosts,
  savedLoading,
  savedHasNextPage,
  savedFetchNextPage,
  savedIsFetchingNextPage,
  followers,
  followersLoading,
  followersHasNextPage,
  followersFetchNextPage,
  followersIsFetchingNextPage,
  following,
  followingLoading,
  followingHasNextPage,
  followingFetchNextPage,
  followingIsFetchingNextPage,
  currentUserId,
}: ProfileTabsProps) {
  const t = useTranslations("profile")

  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="w-full grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5">
        <TabsTrigger value="posts" className="gap-1.5">
          <Grid3X3 className="h-4 w-4" />
          {t("posts")}
        </TabsTrigger>
        {showSaved && (
          <TabsTrigger value="saved" className="gap-1.5">
            <Bookmark className="h-4 w-4" />
            {t("saved")}
          </TabsTrigger>
        )}
        <TabsTrigger value="followers" className="gap-1.5">
          <Users className="h-4 w-4" />
          {t("followers")}
        </TabsTrigger>
        <TabsTrigger value="following" className="gap-1.5">
          <UserCheck className="h-4 w-4" />
          {t("following")}
        </TabsTrigger>
        <TabsTrigger value="media" className="gap-1.5 hidden lg:flex">
          <ImageIcon className="h-4 w-4" />
          {t("media")}
        </TabsTrigger>
      </TabsList>
      <TabsContent value="posts" className="pt-4">
        <PostsGrid
          posts={posts}
          isLoading={postsLoading}
          hasNextPage={postsHasNextPage}
          onLoadMore={postsFetchNextPage}
          isFetchingNextPage={postsIsFetchingNextPage}
        />
      </TabsContent>
      {showSaved && (
        <TabsContent value="saved" className="pt-4">
          <PostsGrid
            posts={savedPosts}
            isLoading={savedLoading}
            hasNextPage={savedHasNextPage}
            onLoadMore={savedFetchNextPage}
            isFetchingNextPage={savedIsFetchingNextPage}
          />
        </TabsContent>
      )}
      <TabsContent value="followers" className="pt-4">
        <FollowersList
          users={followers}
          isLoading={followersLoading}
          currentUserId={currentUserId}
          hasNextPage={followersHasNextPage}
          onLoadMore={followersFetchNextPage}
          isFetchingNextPage={followersIsFetchingNextPage}
        />
      </TabsContent>
      <TabsContent value="following" className="pt-4">
        <FollowingList
          users={following}
          isLoading={followingLoading}
          currentUserId={currentUserId}
          hasNextPage={followingHasNextPage}
          onLoadMore={followingFetchNextPage}
          isFetchingNextPage={followingIsFetchingNextPage}
        />
      </TabsContent>
      <TabsContent value="media" className="pt-4">
        <p className="py-12 text-center text-muted-foreground">{t("media")} — скоро</p>
      </TabsContent>
    </Tabs>
  )
}
