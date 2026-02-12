"use client"

import { useEffect, useRef } from "react"
import { useTranslations } from "next-intl"
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet"
import L from "leaflet"
import type { GeoUser } from "@/shared/lib/geo-websocket"
import type { Place } from "@/shared/types/models"
import type { Route } from "@/shared/types/models"
import { fixLeafletDefaultIcon, myPositionIcon } from "../lib/leaflet-icons"
import { FriendsLayer } from "./FriendsLayer"
import { PlacesLayer } from "./PlacesLayer"
import { RouteLayer } from "./RouteLayer"
import "leaflet/dist/leaflet.css"
import "leaflet.markercluster/dist/MarkerCluster.css"
import "leaflet.markercluster/dist/MarkerCluster.Default.css"

fixLeafletDefaultIcon()

function MapEventHandler({
  onMoveEnd,
}: {
  onMoveEnd: (bbox: { minLat: number; minLng: number; maxLat: number; maxLng: number }) => void
}) {
  const map = useMapEvents({
    moveend: () => {
      const bounds = map.getBounds()
      onMoveEnd({
        minLat: bounds.getSouthWest().lat,
        minLng: bounds.getSouthWest().lng,
        maxLat: bounds.getNorthEast().lat,
        maxLng: bounds.getNorthEast().lng,
      })
    },
  })
  return null
}

function FlyTo({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap()
  const prev = useRef(center)
  useEffect(() => {
    if (prev.current[0] !== center[0] || prev.current[1] !== center[1]) {
      prev.current = center
      map.flyTo(center, zoom, { duration: 1.5 })
    }
  }, [center, zoom, map])
  return null
}

interface MapViewProps {
  center: [number, number]
  zoom: number
  myPosition: { lat: number; lng: number } | null
  friends: GeoUser[]
  places: Place[]
  route: Route | null
  mapType: "map" | "satellite"
  onMoveEnd: (bbox: { minLat: number; minLng: number; maxLat: number; maxLng: number }) => void
  onMyLocation: () => void
  onMeetRequest: (userId: string) => void
  onSavePlace?: (placeId: string) => void
  onUnsavePlace?: (placeId: string) => void
  onBuildRoute?: (place: Place) => void
}

const OSM_URL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
const SAT_URL = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"

export function MapView({
  center,
  zoom,
  myPosition,
  friends,
  places,
  route,
  mapType,
  onMoveEnd,
  onMeetRequest,
  onSavePlace,
  onUnsavePlace,
  onBuildRoute,
}: MapViewProps) {
  const t = useTranslations("map")
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      className="h-full w-full z-0"
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url={mapType === "satellite" ? SAT_URL : OSM_URL}
      />
      <MapEventHandler onMoveEnd={onMoveEnd} />
      <FlyTo center={center} zoom={zoom} />

      {myPosition && (
        <Marker position={[myPosition.lat, myPosition.lng]} icon={myPositionIcon}>
          <Popup>
            <span className="font-semibold">{t("myLocation")}</span>
          </Popup>
        </Marker>
      )}

      <FriendsLayer friends={friends} onMeetRequest={onMeetRequest} />
      <PlacesLayer
        places={places}
        onSave={onSavePlace}
        onUnsave={onUnsavePlace}
        onBuildRoute={onBuildRoute}
      />
      <RouteLayer route={route} />
    </MapContainer>
  )
}
