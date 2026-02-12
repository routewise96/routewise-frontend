"use client"

import { BusinessRoute } from "@/features/auth"
import { BookingsPage } from "@/features/business/ui"

export default function BusinessBookingsPage() {
  return (
    <BusinessRoute>
      <BookingsPage />
    </BusinessRoute>
  )
}
