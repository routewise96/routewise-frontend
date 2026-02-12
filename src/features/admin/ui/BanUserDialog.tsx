"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface BanUserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  username?: string
  onSubmit: (reason: string) => void
  isPending?: boolean
}

export function BanUserDialog(props: BanUserDialogProps) {
  const t = useTranslations("admin")
  const [reason, setReason] = useState("")
  const handleSubmit = () => {
    if (!reason.trim()) return
    props.onSubmit(reason.trim())
    setReason("")
    props.onOpenChange(false)
  }
  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("banUser")}</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Label>{t("reason")}</Label>
          <Textarea value={reason} onChange={(e) => setReason(e.target.value)} className="mt-1" rows={3} />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => props.onOpenChange(false)}>{t("cancel")}</Button>
          <Button onClick={handleSubmit} disabled={props.isPending || !reason.trim()}>{props.isPending ? "..." : t("ban")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
