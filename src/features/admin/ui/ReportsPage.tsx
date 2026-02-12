"use client"

import dynamic from "next/dynamic"
import { useState } from "react"
import { useTranslations } from "next-intl"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { useAdminReports, useResolveReport } from "../hooks"
import { AdminLayout } from "./AdminLayout"
import type { Report } from "@/shared/types/models"
import { toast } from "sonner"

const ReportDetailDialog = dynamic(() => import("./ReportDetailDialog").then((m) => ({ default: m.ReportDetailDialog })), { ssr: false })

export function ReportsPage() {
  const t = useTranslations("admin")
  const [statusFilter, setStatusFilter] = useState<Report["status"] | "all">("all")
  const [detailReport, setDetailReport] = useState<Report | null>(null)
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, error } = useAdminReports(
    statusFilter === "all" ? undefined : { status: statusFilter }
  )
  const reports = data?.pages?.flatMap((p) => p.data ?? []) ?? []
  const resolveMutation = useResolveReport()

  const handleResolve = (action: "delete" | "warn" | "dismiss") => {
    if (!detailReport) return
    resolveMutation.mutate(
      { id: detailReport.id, action },
      { onSuccess: () => { toast.success(t("resolved")); setDetailReport(null); }, onError: () => toast.error(t("error")) }
    )
  }

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
      </AdminLayout>
    )
  }
  if (error) return <AdminLayout><p className="text-muted-foreground">{t("error")}</p></AdminLayout>

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">{t("reportsTitle")}</h1>
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as Report["status"] | "all")}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("filterAll")}</SelectItem>
            <SelectItem value="pending">{t("statusPending")}</SelectItem>
            <SelectItem value="resolved">{t("statusResolved")}</SelectItem>
            <SelectItem value="dismissed">{t("statusDismissed")}</SelectItem>
          </SelectContent>
        </Select>
        <Card>
          <CardContent className="p-0">
            <ul className="divide-y">
              {reports.map((r) => (
                <li key={r.id} className="flex items-center justify-between px-4 py-3">
                  <div>
                    <p className="font-medium">{r.type} · {r.reason}</p>
                    <p className="text-sm text-muted-foreground">{r.targetId} · {r.status}</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setDetailReport(r)}>{t("view")}</Button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        {hasNextPage && (
          <Button variant="outline" onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
            {isFetchingNextPage ? "..." : t("loadMore")}
          </Button>
        )}
      </div>
      <ReportDetailDialog open={!!detailReport} onOpenChange={(o) => !o && setDetailReport(null)} report={detailReport} onResolve={handleResolve} isPending={resolveMutation.isPending} />
    </AdminLayout>
  )
}
