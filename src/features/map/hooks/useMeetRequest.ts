"use client"

import { useMutation } from "@tanstack/react-query"
import { useTranslations } from "next-intl"
import { geoApi } from "@/shared/api"
import { toast } from "sonner"

export function useMeetRequest() {
  const t = useTranslations("map")
  return useMutation({
    mutationFn: (userId: string) => geoApi.meetRequest(userId),
    onSuccess: () => {
      toast.success(t("meetRequestSent"))
    },
    onError: () => {
      toast.error(t("meetRequestError"))
    },
  })
}
