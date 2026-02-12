"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Star } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import type { BookingReviewInput } from "@/shared/types/models"

interface ReviewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  bookingId: string | null
  onSubmit: (data: BookingReviewInput) => void
  isPending?: boolean
}

export function ReviewDialog(props: ReviewDialogProps) {
  const { open, onOpenChange, onSubmit, isPending } = props
  const t = useTranslations("bookings")
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")

  const handleSubmit = () => {
    if (rating < 1 || rating > 5) return
    onSubmit({ rating, comment: comment.trim() || undefined })
    onOpenChange(false)
    setRating(0)
    setComment("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("review")}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <p className="mb-2 text-sm font-medium">{t("rating")}</p>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setRating(v)}
                  className="rounded p-1 hover:bg-muted"
                >
                  <Star className={v <= rating ? "h-8 w-8 fill-amber-400 text-amber-400" : "h-8 w-8 text-muted-foreground"} />
                </button>
              ))}
            </div>
          </div>
          <div>
            <label htmlFor="review-comment" className="text-sm font-medium">{t("comment")}</label>
            <Textarea id="review-comment" value={comment} onChange={(e) => setComment(e.target.value)} className="mt-1" rows={3} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>{t("dialogNo")}</Button>
          <Button onClick={handleSubmit} disabled={rating < 1 || isPending}>{isPending ? "..." : t("submitReview")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
