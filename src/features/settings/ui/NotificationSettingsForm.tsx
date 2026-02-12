"use client"

import { useCallback, useRef } from "react"
import { useTranslations } from "next-intl"
import { Loader2 } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { useNotificationSettings, useUpdateNotificationSettings } from "../hooks"
import type { NotificationSettings } from "@/shared/types/models"

const KEYS: (keyof NotificationSettings)[] = ["like", "comment", "follow", "repost", "mention", "geo", "ai", "system"]

export function NotificationSettingsForm() {
  const t = useTranslations("settings")
  const { data, isLoading, error } = useNotificationSettings()
  const update = useUpdateNotificationSettings()
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleChange = useCallback(
    (key: keyof NotificationSettings, value: boolean) => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(() => {
        update.mutate({ [key]: value })
      }, 300)
    },
    [update]
  )

  if (isLoading) {
    return <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
  }
  if (error || !data) {
    return <p className="text-sm text-muted-foreground">{t("title")}</p>
  }

  return (
    <div className="space-y-4">
      {KEYS.map((key) => (
        <div key={key} className="flex items-center space-x-2">
          <Checkbox
            id={key}
            checked={data[key]}
            onCheckedChange={(checked) => handleChange(key, !!checked)}
          />
          <label htmlFor={key} className="text-sm font-medium leading-none cursor-pointer">
            {t("notificationsTab." + key)}
          </label>
        </div>
      ))}
    </div>
  )
}
