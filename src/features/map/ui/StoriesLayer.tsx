"use client"

import { Marker, Popup } from "react-leaflet"
import type { Story } from "@/shared/api"
import { storyIcon } from "../lib/leaflet-icons"

interface StoriesLayerProps {
  stories: Story[]
  onStoryClick?: (story: Story) => void
}

export function StoriesLayer({ stories, onStoryClick }: StoriesLayerProps) {
  return (
    <>
      {stories.map((story) => (
        <Marker
          key={story.id}
          position={[story.lat, story.lng]}
          icon={storyIcon}
          eventHandlers={{
            click: () => onStoryClick?.(story),
          }}
        >
          <Popup>
            <div className="text-sm font-medium text-foreground">
              {story.place_name ?? "История"}
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  )
}
