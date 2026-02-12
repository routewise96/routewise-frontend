"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { adminApi } from "@/shared/api"

export function useBanUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      adminApi.banUser(id, reason),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "users"] })
    },
  })
}

export function useUnbanUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => adminApi.unbanUser(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "users"] })
    },
  })
}

export function useVerifyBusiness() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => adminApi.verifyBusiness(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "users"] })
    },
  })
}

export function useDeletePost() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => adminApi.deletePost(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "posts"] })
    },
  })
}

export function useHidePost() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => adminApi.hidePost(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "posts"] })
    },
  })
}

export function useResolveReport() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, action }: { id: string; action: "delete" | "warn" | "dismiss" }) =>
      adminApi.resolveReport(id, action),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "reports"] })
      qc.invalidateQueries({ queryKey: ["admin", "stats"] })
    },
  })
}
