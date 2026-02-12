"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { businessApi } from "@/shared/api"

export function useCompanyProfile() {
  return useQuery({
    queryKey: ["business", "profile"],
    queryFn: () => businessApi.getCompanyProfile(),
    staleTime: 60_000,
  })
}

export function useUpdateCompanyProfile() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: FormData) => businessApi.updateCompanyProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["business", "profile"] })
    },
  })
}
