"use client"

import { useTranslations } from "next-intl"
import { Loader2 } from "lucide-react"
import { useBookings, useCancelBooking } from "../hooks"
import { BookingCard } from "./BookingCard"
import { CancelBookingDialog } from "./CancelBookingDialog"
import { ReviewDialog } from "./ReviewDialog"
import { useReviewBooking } from "../hooks"
import { useState } from "react"
import { toast } from "sonner"

export function BookingList() {
  const t = useTranslations("bookings")
  const [cancelId, setCancelId] = useState<string | null>(null)
  const [reviewId, setReviewId] = useState<string | null>(null)

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useBookings()

  const cancelBooking = useCancelBooking()
  const reviewBooking = useReviewBooking(reviewId)

  const bookings = data?.pages?.flatMap((p) => p.data ?? []) ?? []

  const handleCancelConfirm = (id: string) => {
    cancelBooking.mutate(id, {
      onSuccess: () => toast.success(t("cancelSuccess")),
      onError: () => toast.error(t("cancelError")),
    })
  }

  const handleReviewSubmit = (data: { rating: number; comment?: string }) => {
    if (!reviewId) return
    reviewBooking.mutate(data, {
      onSuccess: () => {
        toast.success(t("reviewSuccess"))
        setReviewId(null)
      },
      onError: () => toast.error(t("reviewError")),
    })
  }

  if (error) {
    return (
      <p className="py-8 text-center text-muted-foreground">{t("cancelError")}</p>
    )
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (bookings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-muted-foreground">{t("noBookings")}</p>
      </div>
    )
  }

  return (
    <>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {bookings.map((booking) => (
          <li key={booking.id}>
            <BookingCard
              booking={booking}
              onCancel={setCancelId}
              onReview={setReviewId}
            />
          </li>
        ))}
      </ul>
      {hasNextPage && (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="text-sm font-medium text-primary hover:underline disabled:opacity-50"
          >
            {isFetchingNextPage ? (
              <Loader2 className="inline h-4 w-4 animate-spin" />
            ) : (
              t("loadMore")
            )}
          </button>
        </div>
      )}
      <CancelBookingDialog
        open={cancelId != null}
        onOpenChange={(open) => !open && setCancelId(null)}
        bookingId={cancelId}
        onConfirm={handleCancelConfirm}
        isPending={cancelBooking.isPending}
      />
      <ReviewDialog
        open={reviewId != null}
        onOpenChange={(open) => !open && setReviewId(null)}
        bookingId={reviewId}
        onSubmit={handleReviewSubmit}
        isPending={reviewBooking.isPending}
      />
    </>
  )
}
