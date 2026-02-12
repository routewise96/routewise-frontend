"use client"

import Link from "next/link"
import { useTranslations } from "next-intl"
import { LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"

const OPEN_CREATE_POST_EVENT = "routewise:open-create-post"

interface EmptyFeedProps {
  isAuthenticated: boolean
  onOpenLogin?: () => void
  onOpenRegister?: () => void
}

export function EmptyFeed({
  isAuthenticated,
  onOpenLogin,
  onOpenRegister,
}: EmptyFeedProps) {
  const t = useTranslations("feed")

  if (isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-lg font-semibold text-foreground mb-2">
          {t("noPostsAuth")}
        </p>
        <p className="text-sm text-muted-foreground mb-4">
          {t("createPostHint")}
        </p>
        <Button
          type="button"
          onClick={() => window.dispatchEvent(new CustomEvent(OPEN_CREATE_POST_EVENT))}
        >
          {t("createPost")}
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <p className="text-xl font-semibold text-foreground mb-2">
        {t("noPostsGuest")}
      </p>
      <p className="text-sm text-muted-foreground mb-6 max-w-sm">
        {t("noPostsGuestHint")}
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        <Button asChild>
          <Link href="/login">
            <LogIn className="mr-1.5 h-4 w-4" />
            {t("login")}
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/register">{t("register")}</Link>
        </Button>
      </div>
    </div>
  )
}
