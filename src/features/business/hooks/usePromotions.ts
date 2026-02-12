"use client"

import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query"
import { businessApi } from "@/shared/api"
import type { Promotion } from "@/shared/types/models"

export function usePromotions() {
  return useQuery({
    queryKey: ["business", "promotions"],
    queryFn: () => businessApi.getPromotions(),
    staleTime: 60_000,
  })
}

export function useCreatePromotion() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Omit<Promotion, "id" | "usedCount">) =>
      businessApi.createPromotion(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["business", "promotions"] })
    },
  })
}

export function useUpdatePromotion() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Promotion> }) =>
      businessApi.updatePromotion(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["business", "promotions"] })
    },
  })
}

export function useDeletePromotion() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => businessApi.deletePromotion(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["business", "promotions"] })
    },
  })
}
