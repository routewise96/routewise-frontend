"use client"

import { BusinessRoute } from "@/features/auth"
import { DashboardPage } from "@/features/business/ui"

export default function BusinessDashboardPage() {
  return (
    <BusinessRoute>
      <DashboardPage />
    </BusinessRoute>
  )
}
