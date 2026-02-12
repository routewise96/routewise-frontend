"use client"

import { useTranslations } from "next-intl"
import { Loader2 } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAdminStats } from "../hooks"
import { AdminLayout } from "./AdminLayout"

export function AdminDashboardPage() {
  const t = useTranslations("admin")
  const { data, isLoading, error } = useAdminStats()

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </AdminLayout>
    )
  }

  if (error || !data) {
    return (
      <AdminLayout>
        <p className="text-muted-foreground">{t("error")}</p>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">{t("dashboardTitle")}</h1>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{t("statsUsers")}</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-bold">{data.totalUsers}</span>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{t("statsPosts")}</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-bold">{data.totalPosts}</span>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{t("statsBookings")}</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-bold">{data.totalBookings}</span>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{t("statsReports")}</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-bold">{data.pendingReports}</span>
            </CardContent>
          </Card>
        </div>
        {data.usersChart && data.usersChart.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>{t("chartUsers")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.usersChart}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="count" stroke="hsl(var(--primary))" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  )
}
