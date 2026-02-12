"use client"

import { useTranslations } from "next-intl"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface VerifyBusinessDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  username?: string
  onConfirm: () => void
  isPending?: boolean
}

export function VerifyBusinessDialog(props: VerifyBusinessDialogProps) {
  const t = useTranslations("admin")
  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("verifyBusiness")}</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">{t("verifyConfirm")}</p>
        <DialogFooter>
          <Button variant="outline" onClick={() => props.onOpenChange(false)}>{t("cancel")}</Button>
          <Button onClick={props.onConfirm} disabled={props.isPending}>{props.isPending ? "..." : t("verify")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
