"use client"

import { useEffect, useMemo, useState } from "react"
import { MapContainer, Marker, Popup, Polyline, TileLayer, useMapEvents } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import { GripVertical, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { fixLeafletDefaultIcon } from "@/features/map/lib/leaflet-icons"
import type { Waypoint } from "@/shared/api"

fixLeafletDefaultIcon()

const DEFAULT_CENTER: [number, number] = [55.7558, 37.6173]

type WaypointDraft = Omit<Waypoint, "order"> & { id: string }

interface RouteBuilderProps {
  onSave: (data: { title: string; description: string; waypoints: Waypoint[] }) => Promise<void> | void
  isSaving?: boolean
}

function MapClickHandler({ onAdd }: { onAdd: (lat: number, lng: number) => void }) {
  useMapEvents({
    click: (e) => {
      onAdd(e.latlng.lat, e.latlng.lng)
    },
  })
  return null
}

export function RouteBuilder({ onSave, isSaving }: RouteBuilderProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [waypoints, setWaypoints] = useState<WaypointDraft[]>([])
  const [center, setCenter] = useState<[number, number]>(DEFAULT_CENTER)
  const [dragIndex, setDragIndex] = useState<number | null>(null)

  useEffect(() => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCenter([pos.coords.latitude, pos.coords.longitude])
      },
      () => {}
    )
  }, [])

  const polyline = useMemo(() => waypoints.map((p) => [p.lat, p.lng] as [number, number]), [waypoints])

  const handleAddPoint = (lat: number, lng: number) => {
    setWaypoints((prev) => [
      ...prev,
      {
        id: `${Date.now()}-${prev.length}`,
        lat,
        lng,
        name: `Точка ${prev.length + 1}`,
        description: "",
      },
    ])
  }

  const handleUpdate = (index: number, data: Partial<WaypointDraft>) => {
    setWaypoints((prev) => prev.map((p, i) => (i === index ? { ...p, ...data } : p)))
  }

  const handleRemove = (index: number) => {
    setWaypoints((prev) => prev.filter((_, i) => i !== index))
  }

  const handleDragStart = (index: number) => {
    setDragIndex(index)
  }

  const handleDrop = (index: number) => {
    if (dragIndex === null || dragIndex === index) return
    setWaypoints((prev) => {
      const updated = [...prev]
      const [moved] = updated.splice(dragIndex, 1)
      updated.splice(index, 0, moved)
      return updated
    })
    setDragIndex(null)
  }

  const handleSave = () => {
    const normalized: Waypoint[] = waypoints.map((p, idx) => ({
      order: idx + 1,
      lat: p.lat,
      lng: p.lng,
      name: p.name?.trim(),
      description: p.description?.trim(),
    }))
    onSave({ title: title.trim(), description: description.trim(), waypoints: normalized })
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
      <Card className="overflow-hidden">
        <div className="h-[420px]">
          <MapContainer center={center} zoom={12} className="h-full w-full">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapClickHandler onAdd={handleAddPoint} />
            {waypoints.map((point, idx) => (
              <Marker
                key={point.id}
                position={[point.lat, point.lng]}
                draggable
                eventHandlers={{
                  dragend: (e) => {
                    const latlng = e.target.getLatLng()
                    handleUpdate(idx, { lat: latlng.lat, lng: latlng.lng })
                  },
                }}
              >
                <Popup>
                  <div className="text-sm font-medium">Точка {idx + 1}</div>
                  <div className="text-xs text-muted-foreground">
                    {point.name || "Без названия"}
                  </div>
                </Popup>
              </Marker>
            ))}
            {polyline.length > 1 && <Polyline positions={polyline} />}
          </MapContainer>
        </div>
      </Card>

      <div className="space-y-4">
        <Card className="p-4 space-y-3">
          <div>
            <label className="text-sm font-medium text-foreground">Название маршрута</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-2"
              placeholder="Например: Утро в Лиссабоне"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">Описание</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-2"
              rows={3}
              placeholder="Коротко о маршруте"
            />
          </div>
        </Card>

        <Card className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">Точки маршрута</h3>
            <span className="text-xs text-muted-foreground">{waypoints.length} точек</span>
          </div>
          {waypoints.length === 0 ? (
            <p className="text-xs text-muted-foreground">Кликните на карту, чтобы добавить точки</p>
          ) : (
            <div className="space-y-3">
              {waypoints.map((point, idx) => (
                <div
                  key={point.id}
                  className="rounded-xl border border-border bg-background p-3 space-y-2"
                  draggable
                  onDragStart={() => handleDragStart(idx)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => handleDrop(idx)}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <GripVertical className="h-4 w-4 text-muted-foreground" />
                      Точка {idx + 1}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemove(idx)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <Input
                    value={point.name ?? ""}
                    onChange={(e) => handleUpdate(idx, { name: e.target.value })}
                    placeholder="Название"
                  />
                  <Textarea
                    value={point.description ?? ""}
                    onChange={(e) => handleUpdate(idx, { description: e.target.value })}
                    placeholder="Описание"
                    rows={2}
                  />
                  <p className="text-xs text-muted-foreground">
                    {point.lat.toFixed(5)}, {point.lng.toFixed(5)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Button
          onClick={handleSave}
          disabled={isSaving || !title.trim() || waypoints.length < 2}
        >
          {isSaving ? "Сохранение..." : "Сохранить маршрут"}
        </Button>
      </div>
    </div>
  )
}
