"use client"

import { useParams } from "next/navigation"
import { AppShell } from "@/components/AppShell"
import { ProtectedRoute } from "@/features/auth"
import { BookingDetailPage } from "@/features/bookings"

export default function BookingDetailRoute() {
  const params = useParams()
  const id = params.id as string

  return (
    <ProtectedRoute>
      <AppShell>
        <BookingDetailPage id={id} />
      </AppShell>
    </ProtectedRoute>
  )
}
