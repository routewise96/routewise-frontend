"use client"

import { useState, useEffect } from "react"
import { useTranslations } from "next-intl"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Promotion } from "@/shared/types/models"

interface EditPromotionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  promotion: Promotion
  onSubmit: (data: Partial<Promotion>) => void
  isPending?: boolean
}

export function EditPromotionDialog({
  open,
  onOpenChange,
  promotion,
  onSubmit,
  isPending,
}: EditPromotionDialogProps) {
  const t = useTranslations("business")
  const [title, setTitle] = useState(promotion.title)
  const [description, setDescription] = useState(promotion.description)
  const [status, setStatus] = useState(promotion.status)

  useEffect(() => {
    setTitle(promotion.title)
    setDescription(promotion.description)
    setStatus(promotion.status)
  }, [promotion])

  const handleSubmit = () => {
    onSubmit({ title, description, status })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("editPromo")}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <Label>{t("promoTitle")}</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label>{t("promoDescription")}</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1" rows={2} />
          </div>
          <div>
            <Label>{t("status")}</Label>
            <Select value={status} onValueChange={(v) => setStatus(v as Promotion["status"])}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">{t("statusActive")}</SelectItem>
                <SelectItem value="scheduled">{t("statusScheduled")}</SelectItem>
                <SelectItem value="expired">{t("statusExpired")}</SelectItem>
                <SelectItem value="disabled">{t("statusDisabled")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("cancel")}
          </Button>
          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending ? "..." : t("save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
