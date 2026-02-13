"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { toast } from "sonner"
import { MapView, MapControls, PlaceSearch, useGeoWebSocket } from "@/features/map"
import { storiesApi, type Story } from "@/shared/api"
import { StoryViewerDialog } from "./StoryViewerDialog"
import type { BBox } from "@/shared/api/endpoints/geo"

const DEFAULT_CENTER: [number, number] = [55.7558, 37.6173]
const DEFAULT_ZOOM = 5
const MAP_ZOOM = 13

function toRad(deg: number) {
  return (deg * Math.PI) / 180
}

function distanceMeters(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const R = 6371000
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const lat1 = toRad(a.lat)
  const lat2 = toRad(b.lat)
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(h))
}

export function StoriesMapContent() {
  const { friends, myPosition, error } = useGeoWebSocket()
  const [center, setCenter] = useState<[number, number]>(DEFAULT_CENTER)
  const [zoom, setZoom] = useState(DEFAULT_ZOOM)
  const [mapType, setMapType] = useState<"map" | "satellite">("map")
  const [stories, setStories] = useState<Story[]>([])
  const [selectedStory, setSelectedStory] = useState<Story | null>(null)
  const [viewerOpen, setViewerOpen] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [isLoadingStories, setIsLoadingStories] = useState(false)
  const [hasCentered, setHasCentered] = useState(false)

  const handleMyLocation = useCallback(() => {
    if (myPosition) {
      setCenter([myPosition.lat, myPosition.lng])
      setZoom(MAP_ZOOM)
    }
  }, [myPosition])

  useEffect(() => {
    if (myPosition && !hasCentered) {
      setCenter([myPosition.lat, myPosition.lng])
      setZoom(MAP_ZOOM)
      setHasCentered(true)
    }
  }, [myPosition, hasCentered])

  const loadStories = useCallback(async (lat: number, lng: number, radius: number) => {
    setIsLoadingStories(true)
    try {
      const data = await storiesApi.getNearby(lat, lng, radius)
      setStories(data)
    } catch (err) {
      const message =
        typeof err === "object" && err && "message" in err
          ? String((err as { message?: string }).message)
          : "Не удалось загрузить истории"
      toast.error(message)
    } finally {
      setIsLoadingStories(false)
    }
  }, [])

  const handleMoveEnd = useCallback(
    (newBbox: BBox) => {
      const centerPoint = {
        lat: (newBbox.minLat + newBbox.maxLat) / 2,
        lng: (newBbox.minLng + newBbox.maxLng) / 2,
      }
      const radius = Math.max(
        1000,
        Math.round(distanceMeters(centerPoint, { lat: newBbox.maxLat, lng: newBbox.maxLng }))
      )
      loadStories(centerPoint.lat, centerPoint.lng, radius)
    },
    [loadStories]
  )

  useEffect(() => {
    loadStories(center[0], center[1], 5000)
  }, [center, loadStories])

  const handleSelectPlace = useCallback((place: { lat: number; lng: number }) => {
    setCenter([place.lat, place.lng])
    setZoom(MAP_ZOOM)
  }, [])

  const handleStoryClick = useCallback(async (story: Story) => {
    try {
      const full = await storiesApi.getById(story.id)
      setSelectedStory(full)
      setIsLiked(!!(full.liked ?? full.is_liked))
      setViewerOpen(true)
    } catch {
      toast.error("Не удалось загрузить историю")
    }
  }, [])

  const handleToggleLike = useCallback(async () => {
    if (!selectedStory) return
    try {
      if (isLiked) {
        await storiesApi.unlike(selectedStory.id)
        setIsLiked(false)
        setSelectedStory({
          ...selectedStory,
          like_count: Math.max(selectedStory.like_count - 1, 0),
        })
      } else {
        await storiesApi.like(selectedStory.id)
        setIsLiked(true)
        setSelectedStory({
          ...selectedStory,
          like_count: selectedStory.like_count + 1,
        })
      }
    } catch {
      toast.error("Не удалось обновить лайк")
    }
  }, [selectedStory, isLiked])

  const mapStories = useMemo(() => stories, [stories])

  return (
    <div className="fixed inset-0 top-[57px] z-0 lg:top-0">
      <div className="absolute left-4 top-4 z-[1000]">
        <PlaceSearch onSelectPlace={handleSelectPlace} placeholder="Поиск места..." />
      </div>
      <MapControls onMyLocation={handleMyLocation} onMapTypeChange={setMapType} mapType={mapType} />
      <div className="h-full w-full">
        <MapView
          center={center}
          zoom={zoom}
          myPosition={myPosition}
          friends={friends}
          places={[]}
          route={null}
          mapType={mapType}
          onMoveEnd={handleMoveEnd}
          onMyLocation={handleMyLocation}
          onMeetRequest={() => {}}
          stories={mapStories}
          onStoryClick={handleStoryClick}
        />
      </div>
      {isLoadingStories && (
        <div className="absolute bottom-24 left-4 right-4 z-[1000] rounded-xl border border-border bg-card px-4 py-2 text-xs text-muted-foreground shadow-lg lg:bottom-4 lg:left-auto lg:right-4 lg:max-w-sm">
          Загрузка историй...
        </div>
      )}
      {error && (
        <div className="absolute bottom-20 left-4 right-4 z-[1000] rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground shadow-lg lg:bottom-4 lg:left-auto lg:right-4 lg:max-w-sm">
          Сервис геолокации временно недоступен
        </div>
      )}

      <StoryViewerDialog
        open={viewerOpen}
        story={selectedStory}
        isLiked={isLiked}
        onOpenChange={setViewerOpen}
        onToggleLike={handleToggleLike}
      />
    </div>
  )
}
