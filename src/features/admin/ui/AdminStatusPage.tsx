"use client"

import { useMemo } from "react"
import { useTranslations } from "next-intl"
import { useQuery } from "@tanstack/react-query"
import { RefreshCcw } from "lucide-react"
import { AdminLayout } from "./AdminLayout"
import { statusApi, type ServiceStatus as ServiceStatusItem } from "@/shared/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"

const REFRESH_INTERVAL_MS = 15_000

function StatusPill({ status }: { status: "online" | "offline" | "degraded" }) {
  const label =
    status === "online" ? "Online" : status === "degraded" ? "Degraded" : "Offline"
  const color =
    status === "online"
      ? "bg-emerald-500/15 text-emerald-400"
      : status === "degraded"
        ? "bg-amber-500/15 text-amber-400"
        : "bg-rose-500/15 text-rose-400"
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${color}`}>
      {label}
    </span>
  )
}

export function AdminStatusPage() {
  const t = useTranslations("admin")
  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["system-status"],
    queryFn: statusApi.getStatus,
    refetchInterval: REFRESH_INTERVAL_MS,
  })

  const services = data?.services ?? []
  const kafka = data?.kafka ?? []
  const metrics = data?.metrics

  const summary = useMemo(() => {
    const total = services.length
    const online = services.filter((s) => s.status === "online").length
    const degraded = services.filter((s) => s.status === "degraded").length
    const offline = services.filter((s) => s.status === "offline").length
    return { total, online, degraded, offline }
  }, [services])

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">{t("statusTitle")}</h1>
            <p className="text-sm text-muted-foreground">{t("statusSubtitle")}</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching}>
            <RefreshCcw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
            {t("refresh")}
          </Button>
        </div>

        {data?.source === "mock" && (
          <div className="rounded-xl border border-border bg-card px-4 py-3 text-sm text-muted-foreground">
            {t("statusMock")}
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{t("servicesTotal")}</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-bold">{summary.total}</span>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{t("servicesOnline")}</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-bold text-emerald-400">{summary.online}</span>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{t("servicesDegraded")}</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-bold text-amber-400">{summary.degraded}</span>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{t("servicesOffline")}</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-bold text-rose-400">{summary.offline}</span>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t("servicesList")}</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-sm text-muted-foreground">{t("loading")}</div>
            ) : services.length === 0 ? (
              <div className="text-sm text-muted-foreground">{t("noServices")}</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("service")}</TableHead>
                    <TableHead>{t("status")}</TableHead>
                    <TableHead>{t("latency")}</TableHead>
                    <TableHead>{t("details")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {services.map((service: ServiceStatusItem) => (
                    <TableRow key={service.name}>
                      <TableCell className="font-medium">{service.name}</TableCell>
                      <TableCell>
                        <StatusPill status={service.status} />
                      </TableCell>
                      <TableCell>
                        {service.latency_ms != null ? `${service.latency_ms} ms` : "—"}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {service.details ?? "—"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>{t("kafkaLag")}</CardTitle>
            </CardHeader>
            <CardContent>
              {kafka.length === 0 ? (
                <div className="text-sm text-muted-foreground">{t("noKafka")}</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("consumerGroup")}</TableHead>
                      <TableHead>{t("topic")}</TableHead>
                      <TableHead>{t("partition")}</TableHead>
                      <TableHead>{t("lag")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {kafka.map((item, index) => (
                      <TableRow key={`${item.consumer_group}-${item.topic}-${index}`}>
                        <TableCell className="font-medium">{item.consumer_group}</TableCell>
                        <TableCell>{item.topic}</TableCell>
                        <TableCell>{item.partition ?? "—"}</TableCell>
                        <TableCell>{item.lag}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("metrics")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">{t("rps")}</span>
                <span className="font-medium">{metrics?.rps ?? "—"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">{t("errorRate")}</span>
                <span className="font-medium">
                  {metrics?.error_rate != null ? `${metrics.error_rate}%` : "—"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">{t("errors")}</span>
                <span className="font-medium">{metrics?.errors ?? "—"}</span>
              </div>
              <div className="pt-2 text-xs text-muted-foreground">
                {t("updatedAt")}:{" "}
                {data?.updated_at ? new Date(data.updated_at).toLocaleString("ru-RU") : "—"}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}
