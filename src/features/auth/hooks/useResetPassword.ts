"use client"

import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { authApi } from "@/shared/api"

export function useResetPassword(token: string) {
  const router = useRouter()
  return useMutation({
    mutationFn: (newPassword: string) => authApi.resetPassword(token, newPassword),
    onSuccess: () => router.replace("/login"),
  })
}
