"use client"

import { BusinessRoute } from "@/features/auth"
import { PromotionsPage } from "@/features/business/ui"

export default function BusinessPromotionsPage() {
  return (
    <BusinessRoute>
      <PromotionsPage />
    </BusinessRoute>
  )
}
