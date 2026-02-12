"use client"

import { useTranslations } from "next-intl"
import { AppShell } from "@/components/AppShell"
import { ProtectedRoute } from "@/features/auth"
import { BookingList } from "@/features/bookings"

export default function BookingsPage() {
  const t = useTranslations("bookings")
  return (
    <ProtectedRoute>
      <AppShell>
        <div className="container mx-auto px-4 py-6">
          <h1 className="mb-6 text-2xl font-bold text-foreground">{t("title")}</h1>
          <BookingList />
        </div>
      </AppShell>
    </ProtectedRoute>
  )
}
