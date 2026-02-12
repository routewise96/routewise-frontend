"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useBusinessBookings } from "../hooks"
import { BusinessLayout } from "./BusinessLayout"
import type { BookingStatus } from "@/shared/types/models"

export function BookingsPage() {
  const t = useTranslations("business")
  const [statusFilter, setStatusFilter] = useState<BookingStatus | "all">("all")
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, error } = useBusinessBookings(
    statusFilter === "all" ? undefined : { status: statusFilter }
  )

  const bookings = data?.pages?.flatMap((p) => p.data ?? []) ?? []

  if (isLoading) {
    return (
      <BusinessLayout>
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </BusinessLayout>
    )
  }

  if (error) {
    return (
      <BusinessLayout>
        <p className="text-muted-foreground">{t("error")}</p>
      </BusinessLayout>
    )
  }

  return (
    <BusinessLayout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-2xl font-bold">{t("bookings")}</h1>
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as BookingStatus | "all")}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("filterAll")}</SelectItem>
              <SelectItem value="confirmed">{t("status.confirmed")}</SelectItem>
              <SelectItem value="pending">{t("status.pending")}</SelectItem>
              <SelectItem value="cancelled">{t("status.cancelled")}</SelectItem>
              <SelectItem value="completed">{t("status.completed")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Card>
          <CardContent className="p-0">
            <ul className="divide-y divide-border">
              {bookings.length === 0 ? (
                <li className="px-4 py-8 text-center text-muted-foreground">{t("noBookings")}</li>
              ) : (
                bookings.map((b) => (
                  <li key={b.id} className="flex flex-wrap items-center justify-between gap-4 px-4 py-3">
                    <div>
                      <p className="font-medium">{b.title}</p>
                      <p className="text-sm text-muted-foreground">{b.date} · {b.status}</p>
                    </div>
                    <span className="font-medium">{b.price != null ? `${b.price} ${b.currency ?? "RUB"}` : ""}</span>
                  </li>
                ))
              )}
            </ul>
          </CardContent>
        </Card>
        {hasNextPage && (
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="text-sm font-medium text-primary hover:underline disabled:opacity-50"
            >
              {isFetchingNextPage ? <Loader2 className="inline h-4 w-4 animate-spin" /> : t("loadMore")}
            </button>
          </div>
        )}
      </div>
    </BusinessLayout>
  )
}
