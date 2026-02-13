"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import { toast } from "sonner"
import { AppShell } from "@/components/AppShell"
import { ProtectedRoute } from "@/features/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { storiesApi } from "@/shared/api"
import { fixLeafletDefaultIcon } from "@/features/map/lib/leaflet-icons"

fixLeafletDefaultIcon()

const DEFAULT_CENTER: [number, number] = [55.7558, 37.6173]

function LocationPicker({
  value,
  onChange,
}: {
  value: [number, number] | null
  onChange: (value: [number, number]) => void
}) {
  function MapClickHandler() {
    useMapEvents({
      click: (e) => {
        onChange([e.latlng.lat, e.latlng.lng])
      },
    })
    return null
  }

  return (
    <MapContainer center={value ?? DEFAULT_CENTER} zoom={value ? 14 : 5} className="h-64 w-full rounded-xl">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapClickHandler />
      {value && <Marker position={value} />}
    </MapContainer>
  )
}

export default function StoriesCreatePage() {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [placeName, setPlaceName] = useState("")
  const [placeDescription, setPlaceDescription] = useState("")
  const [location, setLocation] = useState<[number, number] | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation([pos.coords.latitude, pos.coords.longitude])
      },
      () => {}
    )
  }, [])

  const canSubmit = useMemo(() => {
    return !!file && !!location
  }, [file, location])

  const handleSubmit = async () => {
    if (!file || !location) return
    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append("media", file)
      formData.append("lat", String(location[0]))
      formData.append("lng", String(location[1]))
      if (placeName.trim()) formData.append("place_name", placeName.trim())
      if (placeDescription.trim()) formData.append("place_description", placeDescription.trim())

      const data = await storiesApi.create(formData)
      toast.success("История создана")
      router.push(`/stories/${data.id}`)
    } catch (error) {
      const message =
        typeof error === "object" && error && "message" in error
          ? String((error as { message?: string }).message)
          : "Не удалось создать историю"
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ProtectedRoute>
      <AppShell>
        <div className="mx-auto max-w-3xl px-4 py-6 space-y-6">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Новая история</h1>
            <p className="text-sm text-muted-foreground">
              Загрузите фото или видео и отметьте место
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground">Медиафайл</label>
              <Input
                type="file"
                accept="image/*,video/*"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                className="mt-2"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Название места</label>
              <Input
                value={placeName}
                onChange={(e) => setPlaceName(e.target.value)}
                placeholder="Например: Водопад Тегенунган"
                className="mt-2"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Описание места</label>
              <Textarea
                value={placeDescription}
                onChange={(e) => setPlaceDescription(e.target.value)}
                placeholder="Что интересного здесь?"
                className="mt-2"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Выберите точку на карте
              </label>
              <LocationPicker value={location} onChange={setLocation} />
              {!location && (
                <p className="text-xs text-muted-foreground">
                  Кликните по карте, чтобы выбрать место
                </p>
              )}
            </div>
            <Button onClick={handleSubmit} disabled={!canSubmit || isLoading}>
              {isLoading ? "Публикация..." : "Опубликовать историю"}
            </Button>
          </div>
        </div>
      </AppShell>
    </ProtectedRoute>
  )
}
