"use client"

import { BusinessRoute } from "@/features/auth"
import { AnalyticsPage } from "@/features/business/ui"

export default function BusinessAnalyticsPage() {
  return (
    <BusinessRoute>
      <AnalyticsPage />
    </BusinessRoute>
  )
}
