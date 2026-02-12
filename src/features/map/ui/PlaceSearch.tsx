"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { useTranslations } from "next-intl"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useSearchPlaces } from "../hooks"
import type { Place } from "@/shared/types/models"

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return debouncedValue
}

interface PlaceSearchProps {
  onSelectPlace: (place: Place) => void
  placeholder?: string
}

export function PlaceSearch({ onSelectPlace, placeholder }: PlaceSearchProps) {
  const t = useTranslations("map")
  const [query, setQuery] = useState("")
  const debouncedQuery = useDebounce(query, 300)
  const searchPlaces = useSearchPlaces()
  const [open, setOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      searchPlaces.reset()
      return
    }
    searchPlaces.mutate(debouncedQuery)
  }, [debouncedQuery])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const results = searchPlaces.data ?? []

  return (
    <div ref={wrapperRef} className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          placeholder={placeholder ?? t("searchPlace")}
          className="pl-9 bg-background/95 backdrop-blur border-border shadow-md"
        />
      </div>
      {open && (results.length > 0 || searchPlaces.isPending) && (
        <ul className="absolute z-[1000] mt-1 max-h-60 w-full overflow-auto rounded-xl border border-border bg-card py-1 shadow-lg">
          {searchPlaces.isPending ? (
            <li className="px-3 py-2 text-sm text-muted-foreground">
              {t("searchPlace")}...
            </li>
          ) : (
            results.map((place) => (
              <li key={place.id}>
                <button
                  type="button"
                  className="w-full px-3 py-2 text-left text-sm hover:bg-secondary"
                  onClick={() => {
                    onSelectPlace(place)
                    setOpen(false)
                    setQuery("")
                    searchPlaces.reset()
                  }}
                >
                  {place.name}
                  {place.address && (
                    <span className="ml-1 text-muted-foreground">
                      — {place.address}
                    </span>
                  )}
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  )
}
