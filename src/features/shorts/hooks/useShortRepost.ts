"use client"

import { useMutation } from "@tanstack/react-query"
import { useTranslations } from "next-intl"
import { shortsApi } from "@/shared/api"
import { toast } from "sonner"

export function useShortRepost() {
  const t = useTranslations("shorts")
  return useMutation({
    mutationFn: (shortId: number) => shortsApi.repost(shortId),
    onSuccess: () => {
      toast.success(t("repostSuccess"))
    },
    onError: () => {
      toast.error(t("repostError"))
    },
  })
}
