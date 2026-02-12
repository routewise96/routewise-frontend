"use client"

import { useTranslations } from "next-intl"
import { Locate, Map as MapIcon, Satellite } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface MapControlsProps {
  onMyLocation: () => void
  onMapTypeChange: (type: "map" | "satellite") => void
  mapType: "map" | "satellite"
}

export function MapControls({
  onMyLocation,
  onMapTypeChange,
  mapType,
}: MapControlsProps) {
  const t = useTranslations("map")
  return (
    <div className="absolute right-4 top-4 z-[1000] flex flex-col gap-2">
      <Button
        size="icon"
        variant="secondary"
        className="h-10 w-10 rounded-xl shadow-md"
        onClick={onMyLocation}
        aria-label={t("myLocation")}
      >
        <Locate className="h-5 w-5" />
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="icon"
            variant="secondary"
            className="h-10 w-10 rounded-xl shadow-md"
            aria-label={t("filters")}
          >
            <MapIcon className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onMapTypeChange("map")}>
            {t("map")}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onMapTypeChange("satellite")}>
            {t("satellite")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
