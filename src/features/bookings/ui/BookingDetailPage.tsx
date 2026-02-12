"use client"

import Image from "next/image"
import Link from "next/link"
import { useTranslations } from "next-intl"
import { Calendar, MapPin, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useBooking, useCancelBooking, useReviewBooking } from "../hooks"
import { CancelBookingDialog } from "./CancelBookingDialog"
import { ReviewDialog } from "./ReviewDialog"
import { useState } from "react"
import { toast } from "sonner"
import type { Booking } from "@/shared/types/models"

interface BookingDetailPageProps {
  id: string
}

const statusMap = {
  confirmed: "status.confirmed",
  pending: "status.pending",
  cancelled: "status.cancelled",
  completed: "status.completed",
} as const

const typeMap: Record<string, string> = {
  hotel: "types.hotel",
  restaurant: "types.restaurant",
  flight: "types.flight",
  train: "types.train",
  attraction: "types.attraction",
  event: "types.event",
}

export function BookingDetailPage({ id }: BookingDetailPageProps) {
  const t = useTranslations("bookings")
  const [showCancel, setShowCancel] = useState(false)
  const [showReview, setShowReview] = useState(false)

  const { data: booking, isLoading, error } = useBooking(id)
  const cancelBooking = useCancelBooking()
  const reviewBooking = useReviewBooking(id)

  if (isLoading || !booking) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <p className="text-muted-foreground">
          {isLoading ? "..." : error ? t("cancelError") : t("noBookings")}
        </p>
      </div>
    )
  }

  const typeKey = typeMap[booking.type] ?? booking.type
  const statusKey = statusMap[booking.status as keyof typeof statusMap]
  const canCancel =
    (booking.status === "confirmed" || booking.status === "pending") &&
    !cancelBooking.isPending
  const canReview =
    booking.status === "completed" && !booking.review && !reviewBooking.isPending

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-6">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/bookings" className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          {t("title")}
        </Link>
      </Button>

      {booking.image && (
        <div className="relative h-56 w-full overflow-hidden rounded-lg bg-muted">
          <Image
            src={booking.image}
            alt={booking.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 672px"
          />
        </div>
      )}

      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">{t(typeKey)}</Badge>
          <Badge
            variant={
              booking.status === "cancelled"
                ? "destructive"
                : booking.status === "completed"
                  ? "outline"
                  : "default"
            }
          >
            {t(statusKey)}
          </Badge>
        </div>
        <h1 className="text-2xl font-bold">{booking.title}</h1>
        {booking.description && (
          <p className="text-muted-foreground">{booking.description}</p>
        )}

        <dl className="grid gap-2 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 shrink-0 text-muted-foreground" />
            <span>{booking.date}</span>
            {booking.time && <span>{booking.time}</span>}
          </div>
          {booking.location?.name && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" />
              <span>{booking.location.name}</span>
            </div>
          )}
          {booking.bookingReference && (
            <div>
              <span className="text-muted-foreground">{t("bookingReference")}: </span>
              <span>{booking.bookingReference}</span>
            </div>
          )}
          {booking.price != null && (
            <div>
              <span className="text-muted-foreground">{t("price")}: </span>
              <span className="font-medium">
                {booking.price.toLocaleString()} {booking.currency ?? "RUB"}
              </span>
            </div>
          )}
        </dl>

        {booking.review && (
          <div className="rounded-lg border bg-muted/50 p-4">
            <p className="text-sm font-medium">{t("rating")}: {booking.review.rating} ★</p>
            {booking.review.comment && (
              <p className="mt-1 text-sm text-muted-foreground">{booking.review.comment}</p>
            )}
          </div>
        )}

        <div className="flex flex-wrap gap-2 pt-4">
          {canCancel && (
            <Button variant="destructive" onClick={() => setShowCancel(true)}>
              {t("cancel")}
            </Button>
          )}
          {canReview && (
            <Button variant="secondary" onClick={() => setShowReview(true)}>
              {t("review")}
            </Button>
          )}
        </div>
      </div>

      <CancelBookingDialog
        open={showCancel}
        onOpenChange={setShowCancel}
        bookingId={id}
        onConfirm={(bookingId) => {
          cancelBooking.mutate(bookingId, {
            onSuccess: () => {
              toast.success(t("cancelSuccess"))
              setShowCancel(false)
            },
            onError: () => toast.error(t("cancelError")),
          })
        }}
        isPending={cancelBooking.isPending}
      />
      <ReviewDialog
        open={showReview}
        onOpenChange={setShowReview}
        bookingId={id}
        onSubmit={(data) => {
          reviewBooking.mutate(data, {
            onSuccess: () => {
              toast.success(t("reviewSuccess"))
              setShowReview(false)
            },
            onError: () => toast.error(t("reviewError")),
          })
        }}
        isPending={reviewBooking.isPending}
      />
    </div>
  )
}
