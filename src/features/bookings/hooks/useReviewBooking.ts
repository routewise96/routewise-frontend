"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { bookingsApi } from "@/shared/api"
import type { BookingReviewInput } from "@/shared/types/models"

export function useReviewBooking(bookingId: string | null) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: BookingReviewInput) =>
      bookingsApi.review(bookingId!, data),
    onSuccess: (_, __, context) => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] })
      if (bookingId) {
        queryClient.invalidateQueries({ queryKey: ["booking", bookingId] })
      }
    },
  })
}
