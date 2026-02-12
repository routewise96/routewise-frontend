"use client"

import { useTranslations } from "next-intl"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import type { Report } from "@/shared/types/models"

interface ReportDetailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  report: Report | null
  onResolve: (action: "delete" | "warn" | "dismiss") => void
  isPending?: boolean
}

export function ReportDetailDialog(props: ReportDetailDialogProps) {
  const t = useTranslations("admin")
  const r = props.report
  if (!r) return null
  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>{t("reportDetails")}</DialogTitle></DialogHeader>
        <div className="space-y-2 text-sm">
          <p><span className="font-medium">{t("reportType")}:</span> {r.type}</p>
          <p><span className="font-medium">{t("reason")}:</span> {r.reason}</p>
          {r.description && <p><span className="font-medium">{t("description")}:</span> {r.description}</p>}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => props.onOpenChange(false)}>{t("cancel")}</Button>
          <Button variant="destructive" onClick={() => props.onResolve("delete")} disabled={props.isPending}>{t("resolveDelete")}</Button>
          <Button variant="secondary" onClick={() => props.onResolve("warn")} disabled={props.isPending}>{t("resolveWarn")}</Button>
          <Button onClick={() => props.onResolve("dismiss")} disabled={props.isPending}>{t("dismiss")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
