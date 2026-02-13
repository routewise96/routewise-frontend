"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { AppShell } from "@/components/AppShell"
import { ProtectedRoute } from "@/features/auth"
import { RouteBuilder } from "@/features/routes"
import { routesApi } from "@/shared/api"

export default function RouteCreatePage() {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async (data: { title: string; description: string; waypoints: { order: number; lat: number; lng: number; name?: string; description?: string }[] }) => {
    if (!data.title.trim() || data.waypoints.length < 2) {
      toast.error("Добавьте название и минимум две точки")
      return
    }
    setIsSaving(true)
    try {
      const res = await routesApi.create({
        title: data.title.trim(),
        description: data.description.trim(),
        waypoints: data.waypoints,
      })
      toast.success("Маршрут создан")
      router.push(`/routes/${res.id}`)
    } catch (error) {
      const message =
        typeof error === "object" && error && "message" in error
          ? String((error as { message?: string }).message)
          : "Не удалось создать маршрут"
      toast.error(message)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <ProtectedRoute>
      <AppShell>
        <div className="mx-auto max-w-6xl px-4 py-6 space-y-6">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Конструктор маршрута</h1>
            <p className="text-sm text-muted-foreground">
              Добавьте точки на карте, задайте порядок и опубликуйте маршрут
            </p>
          </div>
          <RouteBuilder onSave={handleSave} isSaving={isSaving} />
        </div>
      </AppShell>
    </ProtectedRoute>
  )
}
