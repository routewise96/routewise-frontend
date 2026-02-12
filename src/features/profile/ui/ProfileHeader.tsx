"use client"

import { useTranslations } from "next-intl"
import Link from "next/link"
import { Camera, Settings, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import type { User } from "@/shared/types/models"
import { FollowButton } from "./FollowButton"

interface ProfileHeaderProps {
  user: User
  isOwnProfile: boolean
  postsCount: number
  followersCount: number
  followingCount: number
  isFollowing?: boolean
  onEditOpen: () => void
  onLogout: () => void
  activeTab: string
  onTabChange: (tab: string) => void
}

export function ProfileHeader({
  user,
  isOwnProfile,
  postsCount,
  followersCount,
  followingCount,
  isFollowing = false,
  onEditOpen,
  onLogout,
  activeTab,
  onTabChange,
}: ProfileHeaderProps) {
  const t = useTranslations("profile")
  const tNav = useTranslations("nav")
  const tAuth = useTranslations("auth")
  const router = useRouter()
  const handleLogout = () => {
    onLogout()
    router.push("/")
  }

  return (
    <div className="flex flex-col items-center gap-4 pb-6">
      <div className="relative">
        <Avatar className="h-24 w-24 ring-4 ring-border">
          <AvatarImage src={user.avatarUrl ?? (user as { avatar_url?: string }).avatar_url} alt={user.username} />
          <AvatarFallback className="text-2xl font-medium bg-muted text-foreground">
            {(user.username || "?").slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        {isOwnProfile && (
          <button
            type="button"
            onClick={onEditOpen}
            className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground ring-2 ring-background"
            aria-label={t("editProfile")}
          >
            <Camera className="h-4 w-4" />
          </button>
        )}
      </div>
      <div className="text-center">
        <h1 className="text-xl font-bold text-foreground">{user.username}</h1>
        <p className="text-sm text-muted-foreground">@{user.username}</p>
        {user.bio && (
          <p className="mt-2 text-sm text-foreground max-w-sm">{user.bio}</p>
        )}
      </div>
      <div className="flex items-center gap-8">
        <button
          type="button"
          onClick={() => onTabChange("posts")}
          className="text-center"
        >
          <p className="text-lg font-bold text-foreground">{postsCount}</p>
          <p className="text-xs text-muted-foreground">{t("posts")}</p>
        </button>
        <button
          type="button"
          onClick={() => onTabChange("followers")}
          className="text-center"
        >
          <p className="text-lg font-bold text-foreground">{followersCount}</p>
          <p className="text-xs text-muted-foreground">{t("followers")}</p>
        </button>
        <button
          type="button"
          onClick={() => onTabChange("following")}
          className="text-center"
        >
          <p className="text-lg font-bold text-foreground">{followingCount}</p>
          <p className="text-xs text-muted-foreground">{t("following")}</p>
        </button>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        {isOwnProfile ? (
          <>
            <Button variant="outline" size="sm" onClick={onEditOpen}>
              {t("edit")}
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href="/settings">
                <Settings className="mr-1.5 h-4 w-4" />
                {tNav("settings")}
              </Link>
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-destructive hover:text-destructive">
              <LogOut className="mr-1.5 h-4 w-4" />
              {tAuth("logout")}
            </Button>
          </>
        ) : (
          <FollowButton
            userId={user.id}
            initialIsFollowing={isFollowing}
            variant="default"
            size="sm"
          />
        )}
      </div>
    </div>
  )
}
