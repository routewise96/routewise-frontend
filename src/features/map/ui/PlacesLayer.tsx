"use client"

import { Marker, Popup } from "react-leaflet"
import MarkerClusterGroup from "react-leaflet-markercluster"
import type { Place } from "@/shared/types/models"
import { PlacePopup } from "./MarkerPopup"

interface PlacesLayerProps {
  places: Place[]
  onSave?: (placeId: string) => void
  onUnsave?: (placeId: string) => void
  onBuildRoute?: (place: Place) => void
}

export function PlacesLayer({
  places,
  onSave,
  onUnsave,
  onBuildRoute,
}: PlacesLayerProps) {
  if (places.length === 0) return null
  return (
    <MarkerClusterGroup
      zoomToBoundsOnClick
      spiderfyOnMaxZoom
      removeOutsideVisibleBounds
      maxClusterRadius={80}
    >
      {places.map((p) => (
        <Marker key={p.id} position={[p.lat, p.lng]}>
          <Popup>
            <PlacePopup
              place={p}
              onSave={onSave}
              onUnsave={onUnsave}
              onRoute={onBuildRoute}
            />
          </Popup>
        </Marker>
      ))}
    </MarkerClusterGroup>
  )
}
