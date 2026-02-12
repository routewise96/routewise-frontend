"use client"

import { useMutation } from "@tanstack/react-query"
import { authApi } from "@/shared/api"

export function useChangePassword() {
  return useMutation({
    mutationFn: ({ oldPassword, newPassword }: { oldPassword: string; newPassword: string }) =>
      authApi.changePassword(oldPassword, newPassword),
  })
}
