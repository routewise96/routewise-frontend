"use client"

import { BusinessRoute } from "@/features/auth"
import { CompanySettingsPage } from "@/features/business/ui"

export default function BusinessSettingsPage() {
  return (
    <BusinessRoute>
      <CompanySettingsPage />
    </BusinessRoute>
  )
}
