"use client"

import { useTranslations } from "next-intl"
import { Hash } from "lucide-react"
import { Input } from "@/components/ui/input"

interface HashtagInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function HashtagInput({
  value,
  onChange,
  placeholder,
}: HashtagInputProps) {
  const t = useTranslations("createPost")
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-1.5 text-sm font-medium text-foreground">
        <Hash className="h-3.5 w-3.5" />
        {t("hashtags")}
      </label>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? t("hashtagsPlaceholder")}
        className="bg-secondary border-border"
      />
      <p className="text-xs text-muted-foreground">{t("hashtagsHint")}</p>
    </div>
  )
}
