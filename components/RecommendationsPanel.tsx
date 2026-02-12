"use client"

import { Plane, TrendingUp } from "lucide-react"
import Image from "next/image"
import { Skeleton } from "@/components/ui/skeleton"

export interface Destination {
  id: number
  name: string
  country: string
  imageUrl: string
  rating: number
}

interface RecommendationsPanelProps {
  destinations: Destination[]
  trending: string[]
  isLoading?: boolean
}

function DestinationCard({ destination }: { destination: Destination }) {
  return (
    <div className="group flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-secondary cursor-pointer">
      <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl">
        <Image
          src={
            destination.imageUrl ||
            `https://picsum.photos/112/112?random=${destination.id}`
          }
          alt={destination.name}
          fill
          className="object-cover transition-transform group-hover:scale-110"
          sizes="56px"
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground">
          {destination.name}
        </p>
        <p className="text-xs text-muted-foreground">{destination.country}</p>
      </div>
      <div className="flex items-center gap-1 rounded-lg bg-primary/10 px-2 py-1">
        <TrendingUp className="h-3 w-3 text-primary" />
        <span className="text-xs font-semibold text-primary">
          {destination.rating}
        </span>
      </div>
    </div>
  )
}

export function RecommendationsPanel({
  destinations,
  trending,
  isLoading,
}: RecommendationsPanelProps) {
  return (
    <aside className="hidden xl:block w-80 flex-shrink-0">
      <div className="sticky top-[73px] flex flex-col gap-6">
        {/* Destinations */}
        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center justify-between pb-3">
            <div className="flex items-center gap-2">
              <Plane className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-bold text-foreground">
                Куда поехать?
              </h3>
            </div>
            <button className="text-xs font-medium text-primary hover:text-primary/80 transition-colors">
              Все
            </button>
          </div>
          <div className="flex flex-col gap-1">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-2">
                  <Skeleton className="h-14 w-14 rounded-xl" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-24 mb-1" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
              ))
            ) : destinations.length > 0 ? (
              destinations.map((dest) => (
                <DestinationCard key={dest.id} destination={dest} />
              ))
            ) : (
              <p className="text-sm text-muted-foreground py-2">
                Нет рекомендаций
              </p>
            )}
          </div>
        </div>

        {/* Trending Tags */}
        <div className="rounded-2xl border border-border bg-card p-4">
          <h3 className="pb-3 text-sm font-bold text-foreground">В тренде</h3>
          <div className="flex flex-wrap gap-2">
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-7 w-20 rounded-lg" />
                ))
              : trending.length > 0
                ? trending.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-lg bg-secondary px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary cursor-pointer"
                    >
                      {tag.startsWith("#") ? tag : `#${tag}`}
                    </span>
                  ))
                : (
                    <p className="text-sm text-muted-foreground">
                      Нет трендов
                    </p>
                  )}
          </div>
        </div>

        {/* Footer Links */}
        <div className="px-2 text-xs text-muted-foreground">
          <div className="flex flex-wrap gap-x-3 gap-y-1">
            <span className="hover:text-foreground cursor-pointer transition-colors">
              О нас
            </span>
            <span className="hover:text-foreground cursor-pointer transition-colors">
              Помощь
            </span>
            <span className="hover:text-foreground cursor-pointer transition-colors">
              Конфиденциальность
            </span>
            <span className="hover:text-foreground cursor-pointer transition-colors">
              Условия
            </span>
          </div>
          <p className="mt-2 text-muted-foreground/60">
            {"RouteWise 2026"}
          </p>
        </div>
      </div>
    </aside>
  )
}
