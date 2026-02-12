"use client"

import Image from "next/image"
import Link from "next/link"
import { useTranslations } from "next-intl"
import { Calendar, MapPin } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Booking } from "@/shared/types/models"

interface BookingCardProps {
  booking: Booking
  onCancel?: (id: string) => void
  onReview?: (id: string) => void
}

export function BookingCard({ booking, onCancel, onReview }: BookingCardProps) {
  const t = useTranslations("bookings")
  const statusKey = booking.status as keyof typeof statusMap
  const statusMap = {
    confirmed: t("status.confirmed"),
    pending: t("status.pending"),
    cancelled: t("status.cancelled"),
    completed: t("status.completed"),
  }
  const typeLabelMap: Record<string, string> = {
    hotel: t("types.hotel"),
    restaurant: t("types.restaurant"),
    flight: t("types.flight"),
    train: t("types.train"),
    attraction: t("types.attraction"),
    event: t("types.event"),
  }
  const typeLabel = typeLabelMap[booking.type] ?? booking.type
  const statusLabel = statusMap[statusKey] ?? booking.status
  const canCancel =
    (booking.status === "confirmed" || booking.status === "pending") && onCancel
  const canReview =
    booking.status === "completed" && !booking.review && onReview

  return (
    <Card className="overflow-hidden">
      {booking.image && (
        <div className="relative h-40 w-full bg-muted">
          <Image
            src={booking.image}
            alt={booking.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 400px"
          />
        </div>
      )}
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <Badge variant="secondary" className="mb-1">
              {typeLabel}
            </Badge>
            <h3 className="font-semibold text-foreground">
              <Link
                href={`/bookings/${booking.id}`}
                className="hover:underline"
              >
                {booking.title}
              </Link>
            </h3>
          </div>
          <Badge
            variant={
              booking.status === "cancelled"
                ? "destructive"
                : booking.status === "completed"
                  ? "outline"
                  : "default"
            }
          >
            {statusLabel}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="h-4 w-4 shrink-0" />
          <span>
            {booking.date}
            {booking.time && `, ${booking.time}`}
          </span>
        </div>
        {booking.location?.name && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4 shrink-0" />
            <span>{booking.location.name}</span>
          </div>
        )}
        {booking.price != null && (
          <p className="font-medium text-foreground">
            {booking.price.toLocaleString()} {booking.currency ?? "RUB"}
          </p>
        )}
        <div className="flex flex-wrap gap-2 pt-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/bookings/${booking.id}`}>{t("detailTitle")}</Link>
          </Button>
          {canCancel && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onCancel?.(booking.id)}
            >
              {t("cancel")}
            </Button>
          )}
          {canReview && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onReview?.(booking.id)}
            >
              {t("review")}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
