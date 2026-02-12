"use client"

import { useEffect } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import L from "leaflet"
import type { GeoUser } from "@/hooks/useGeoWebSocket"

import "leaflet/dist/leaflet.css"

// Fix default marker icons for Leaflet in Next.js
delete (L.Icon.Default.prototype as Record<string, unknown>)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
})

const myIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
  className: "hue-rotate-[200deg] brightness-150",
})

interface MapViewProps {
  users: GeoUser[]
  myPosition: { lat: number; lng: number } | null
}

function FlyToPosition({ position }: { position: { lat: number; lng: number } | null }) {
  const map = useMap()
  useEffect(() => {
    if (position) {
      map.flyTo([position.lat, position.lng], 13, { duration: 1.5 })
    }
  }, [position, map])
  return null
}

export default function MapView({ users, myPosition }: MapViewProps) {
  const center: [number, number] = myPosition
    ? [myPosition.lat, myPosition.lng]
    : [55.7558, 37.6173] // Moscow default

  return (
    <MapContainer
      center={center}
      zoom={myPosition ? 13 : 5}
      className="h-full w-full z-0"
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Only fly on first load */}
      {myPosition && <FlyToPosition position={myPosition} />}

      {/* My position */}
      {myPosition && (
        <Marker position={[myPosition.lat, myPosition.lng]} icon={myIcon}>
          <Popup>
            <span className="font-semibold">Вы здесь</span>
          </Popup>
        </Marker>
      )}

      {/* Other users */}
      {users.map((u) => (
        <Marker key={u.userId} position={[u.lat, u.lng]}>
          <Popup>
            <div className="flex flex-col gap-1">
              <span className="font-semibold">{u.username}</span>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
