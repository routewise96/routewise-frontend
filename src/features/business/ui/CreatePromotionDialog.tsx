"use client"

import { useState } from "react"
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

type CreateData = Omit<Promotion, "id" | "usedCount">

interface CreatePromotionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: CreateData) => void
  isPending?: boolean
}

export function CreatePromotionDialog({
  open,
  onOpenChange,
  onSubmit,
  isPending,
}: CreatePromotionDialogProps) {
  const t = useTranslations("business")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [discountType, setDiscountType] = useState<"percentage" | "fixed">("percentage")
  const [discountValue, setDiscountValue] = useState("")
  const [code, setCode] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  const handleSubmit = () => {
    const value = Number(discountValue)
    if (!title.trim() || Number.isNaN(value) || value <= 0) return
    const defaultStart = new Date().toISOString().slice(0, 10)
    const defaultEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
    onSubmit({
      title: title.trim(),
      description: description.trim(),
      discountType,
      discountValue: value,
      code: code.trim() || undefined,
      startDate: startDate || defaultStart,
      endDate: endDate || defaultEnd,
      status: "active",
    })
    setTitle("")
    setDescription("")
    setDiscountValue("")
    setCode("")
    setStartDate("")
    setEndDate("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("createPromo")}</DialogTitle>
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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>{t("discountType")}</Label>
              <Select value={discountType} onValueChange={(v) => setDiscountType(v as "percentage" | "fixed")}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">%</SelectItem>
                  <SelectItem value="fixed">₽</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>{t("discountValue")}</Label>
              <Input
                type="number"
                min={1}
                value={discountValue}
                onChange={(e) => setDiscountValue(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
          <div>
            <Label>{t("promoCode")}</Label>
            <Input value={code} onChange={(e) => setCode(e.target.value)} className="mt-1" placeholder="" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>{t("startDate")}</Label>
              <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label>{t("endDate")}</Label>
              <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="mt-1" />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("cancel")}
          </Button>
          <Button onClick={handleSubmit} disabled={isPending || !title.trim()}>
            {isPending ? "..." : t("save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
