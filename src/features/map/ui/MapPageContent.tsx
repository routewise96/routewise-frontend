"use client"

import { useState, useCallback } from "react"
import { useTranslations } from "next-intl"
import {
  useGeoWebSocket,
  usePlaces,
  useRoute,
  useSavePlace,
  useUnsavePlace,
  useMeetRequest,
  MapView,
  MapControls,
  PlaceSearch,
} from "@/features/map"
import type { Place } from "@/shared/types/models"
import type { BBox } from "@/shared/api/endpoints/geo"

const DEFAULT_CENTER: [number, number] = [55.7558, 37.6173]
const DEFAULT_ZOOM = 5
const MAP_ZOOM = 13

export function MapPageContent() {
  const t = useTranslations("map")
  const [center, setCenter] = useState<[number, number]>(DEFAULT_CENTER)
  const [zoom, setZoom] = useState(DEFAULT_ZOOM)
  const [bbox, setBbox] = useState<BBox | null>(null)
  const [mapType, setMapType] = useState<"map" | "satellite">("map")

  const { friends, myPosition, error } = useGeoWebSocket()
  const { data: places = [] } = usePlaces(bbox)
  const routeMutation = useRoute()
  const savePlace = useSavePlace()
  const unsavePlace = useUnsavePlace()
  const meetRequest = useMeetRequest()

  const route = routeMutation.data ?? null

  const handleMoveEnd = useCallback((newBbox: BBox) => {
    setBbox(newBbox)
  }, [])

  const handleMyLocation = useCallback(() => {
    if (myPosition) {
      setCenter([myPosition.lat, myPosition.lng])
      setZoom(MAP_ZOOM)
    }
  }, [myPosition])

  const handleSelectPlace = useCallback((place: Place) => {
    setCenter([place.lat, place.lng])
    setZoom(MAP_ZOOM)
  }, [])

  const handleBuildRoute = useCallback(
    (place: Place) => {
      if (myPosition) {
        routeMutation.mutate({
          start: myPosition,
          end: { lat: place.lat, lng: place.lng },
        })
      }
    },
    [myPosition, routeMutation]
  )

  return (
    <div className="fixed inset-0 top-[57px] z-0 lg:top-0">
      <div className="absolute left-4 top-4 z-[1000]">
        <PlaceSearch onSelectPlace={handleSelectPlace} />
      </div>
      <MapControls
        onMyLocation={handleMyLocation}
        onMapTypeChange={setMapType}
        mapType={mapType}
      />
      <div className="h-full w-full">
        <MapView
          center={center}
          zoom={zoom}
          myPosition={myPosition}
          friends={friends}
          places={places}
          route={route}
          mapType={mapType}
          onMoveEnd={handleMoveEnd}
          onMyLocation={handleMyLocation}
          onMeetRequest={(id) => meetRequest.mutate(id)}
          onSavePlace={(id) => savePlace.mutate(id)}
          onUnsavePlace={(id) => unsavePlace.mutate(id)}
          onBuildRoute={handleBuildRoute}
        />
      </div>
      {error && (
        <div className="absolute bottom-20 left-4 right-4 z-[1000] rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground shadow-lg lg:bottom-4 lg:left-auto lg:right-4 lg:max-w-sm">
          {t("geoUnavailable")}
        </div>
      )}
    </div>
  )
}
