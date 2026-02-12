"use client"

import Link from "next/link"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"

export function PostNotFound() {
  const t = useTranslations("postDetail")
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <p className="text-lg font-semibold text-foreground mb-2">
        {t("postNotFound")}
      </p>
      <p className="text-sm text-muted-foreground mb-4">
        {t("postNotFoundHint")}
      </p>
      <Button asChild>
        <Link href="/">{t("backToFeed")}</Link>
      </Button>
    </div>
  )
}
