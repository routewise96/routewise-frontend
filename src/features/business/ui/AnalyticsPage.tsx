"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Loader2 } from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useBusinessAnalytics } from "../hooks"
import type { AnalyticsPeriod } from "../hooks"
import { BusinessLayout } from "./BusinessLayout"

export function AnalyticsPage() {
  const t = useTranslations("business")
  const [period, setPeriod] = useState<AnalyticsPeriod>("week")
  const { data, isLoading, error } = useBusinessAnalytics(period)

  if (isLoading) {
    return (
      <BusinessLayout>
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </BusinessLayout>
    )
  }

  if (error || !data) {
    return (
      <BusinessLayout>
        <p className="text-muted-foreground">{t("error")}</p>
      </BusinessLayout>
    )
  }

  return (
    <BusinessLayout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-2xl font-bold">{t("analytics")}</h1>
          <Select
            value={period}
            onValueChange={(v) => setPeriod(v as AnalyticsPeriod)}
          >
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">{t("period.day")}</SelectItem>
              <SelectItem value="week">{t("period.week")}</SelectItem>
              <SelectItem value="month">{t("period.month")}</SelectItem>
              <SelectItem value="year">{t("period.year")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {data.revenue?.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>{t("charts.revenue")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.revenue}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}

        {data.bookings?.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>{t("charts.bookings")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.bookings}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}

        {data.topServices?.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>{t("topServices")}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {data.topServices.map((s, i) => (
                  <li
                    key={i}
                    className="flex justify-between border-b border-border py-2 last:border-0"
                  >
                    <span>{s.name}</span>
                    <span className="text-muted-foreground">{s.count}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </BusinessLayout>
  )
}
