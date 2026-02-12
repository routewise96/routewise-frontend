"use client"

import { useTranslations } from "next-intl"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useFollow } from "@/features/profile/hooks/useFollow"
import { useUnfollow } from "@/features/profile/hooks/useUnfollow"

interface FollowButtonProps {
  userId: number | string
  initialIsFollowing: boolean
  onFollowToggle?: (isFollowing: boolean) => void
  variant?: "default" | "outline"
  size?: "default" | "sm" | "lg"
  className?: string
}

export function FollowButton({
  userId,
  initialIsFollowing,
  onFollowToggle,
  variant = "default",
  size = "default",
  className,
}: FollowButtonProps) {
  const t = useTranslations("profile")
  const followMutation = useFollow(userId)
  const unfollowMutation = useUnfollow(userId)
  const isFollowing = initialIsFollowing
  const isLoading = followMutation.isPending || unfollowMutation.isPending

  async function handleClick() {
    if (isFollowing) {
      await unfollowMutation.mutateAsync()
      onFollowToggle?.(false)
    } else {
      await followMutation.mutateAsync()
      onFollowToggle?.(true)
    }
  }

  return (
    <Button
      variant={isFollowing ? "outline" : variant}
      size={size}
      className={className}
      onClick={handleClick}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : isFollowing ? (
        t("unfollow")
      ) : (
        t("follow")
      )}
    </Button>
  )
}
