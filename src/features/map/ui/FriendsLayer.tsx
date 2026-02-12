"use client"

import { Marker, Popup } from "react-leaflet"
import MarkerClusterGroup from "react-leaflet-markercluster"
import type { GeoUser } from "@/shared/lib/geo-websocket"
import { FriendPopup } from "./MarkerPopup"

interface FriendsLayerProps {
  friends: GeoUser[]
  onMeetRequest: (userId: string) => void
}

export function FriendsLayer({ friends, onMeetRequest }: FriendsLayerProps) {
  if (friends.length === 0) return null
  return (
    <MarkerClusterGroup
      zoomToBoundsOnClick
      spiderfyOnMaxZoom
      removeOutsideVisibleBounds
      maxClusterRadius={60}
    >
      {friends.map((f) => (
        <Marker key={f.id} position={[f.location.lat, f.location.lng]}>
          <Popup>
            <FriendPopup friend={f} onMeetRequest={onMeetRequest} />
          </Popup>
        </Marker>
      ))}
    </MarkerClusterGroup>
  )
}
