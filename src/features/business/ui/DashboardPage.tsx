"use client"

import { useTranslations } from "next-intl"
import { Loader2 } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useBusinessDashboard } from "../hooks"
import { BusinessLayout } from "./BusinessLayout"

export function DashboardPage() {
  const t = useTranslations("business")
  const { data, isLoading, error } = useBusinessDashboard()

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

  const stats = data.stats
  const recentBookings = data.recentBookings ?? []

  return (
    <BusinessLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">{t("dashboard")}</h1>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{t("stats.bookings")}</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-bold">{stats.totalBookings}</span>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{t("stats.revenue")}</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-bold">{stats.totalRevenue.toLocaleString()} ₽</span>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{t("stats.rating")}</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-bold">{stats.averageRating}</span>
            </CardContent>
          </Card>
        </div>
        {stats.revenueByPeriod?.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>{t("charts.revenue")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={stats.revenueByPeriod}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}
        {recentBookings.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>{t("recentBookings")}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {recentBookings.slice(0, 5).map((b) => (
                  <li key={b.id} className="flex justify-between border-b border-border py-2 last:border-0">
                    <span className="font-medium">{b.title}</span>
                    <span className="text-muted-foreground">{b.date}</span>
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
