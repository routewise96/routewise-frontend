"use client"

import Link from "next/link"
import { useTranslations } from "next-intl"
import { Star, MapPin, MessageCircle } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import type { GeoUser } from "@/shared/lib/geo-websocket"
import type { Place } from "@/shared/types/models"

interface FriendPopupProps {
  friend: GeoUser
  onMeetRequest: (userId: string) => void
}

export function FriendPopup({ friend, onMeetRequest }: FriendPopupProps) {
  const t = useTranslations("map")
  return (
    <div className="min-w-[180px] p-2">
      <div className="flex items-center gap-2">
        <Avatar className="h-10 w-10">
          <AvatarImage src={friend.avatar} />
          <AvatarFallback className="text-xs">
            {(friend.username || "?").slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-foreground truncate">
            {friend.name || friend.username}
          </p>
        </div>
      </div>
      <div className="mt-2 flex gap-2">
        <Button size="sm" variant="outline" className="flex-1" asChild>
          <Link href={`/profile/${friend.id}`}>{t("message")}</Link>
        </Button>
        <Button
          size="sm"
          className="flex-1"
          onClick={() => onMeetRequest(friend.id)}
        >
          {t("meetRequest")}
        </Button>
      </div>
    </div>
  )
}

interface PlacePopupProps {
  place: Place
  onSave?: (placeId: string) => void
  onUnsave?: (placeId: string) => void
  onRoute?: (place: Place) => void
}

export function PlacePopup({
  place,
  onSave,
  onUnsave,
  onRoute,
}: PlacePopupProps) {
  const t = useTranslations("map")
  const saved = place.isSaved ?? false
  return (
    <div className="min-w-[200px] p-2">
      <p className="font-semibold text-foreground">{place.name}</p>
      {place.address && (
        <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="h-3 w-3 shrink-0" />
          {place.address}
        </p>
      )}
      {place.rating != null && (
        <p className="mt-1 text-sm text-foreground">★ {place.rating.toFixed(1)}</p>
      )}
      <div className="mt-2 flex flex-wrap gap-2">
        {onRoute && (
          <Button size="sm" variant="outline" onClick={() => onRoute(place)}>
            {t("route")}
          </Button>
        )}
        {saved && onUnsave && (
          <Button size="sm" variant="ghost" onClick={() => onUnsave(place.id)}>
            <Star className="h-4 w-4 fill-current" />
            {t("unsave")}
          </Button>
        )}
        {!saved && onSave && (
          <Button size="sm" variant="ghost" onClick={() => onSave(place.id)}>
            <Star className="h-4 w-4" />
            {t("save")}
          </Button>
        )}
      </div>
    </div>
  )
}
