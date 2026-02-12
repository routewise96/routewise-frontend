"use client"

import { useTranslations } from "next-intl"
import { Users } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function UserNotFound() {
  const t = useTranslations("profile")
  const tNav = useTranslations("nav")

  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center">
      <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
      <h2 className="text-xl font-bold text-foreground mb-2">{t("userNotFound")}</h2>
      <p className="text-muted-foreground mb-6">
        Не удалось найти этого пользователя.
      </p>
      <Button asChild>
        <Link href="/">{tNav("home")}</Link>
      </Button>
    </div>
  )
}
