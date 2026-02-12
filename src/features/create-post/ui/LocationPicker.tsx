"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { MapPin } from "lucide-react"
import { useTranslations } from "next-intl"
import { geoApi } from "@/shared/api"
import type { Place } from "@/shared/types/models"
import { Input } from "@/components/ui/input"

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return debouncedValue
}

interface LocationPickerProps {
  value: Place | null
  displayName: string
  onSelect: (place: Place | null, displayName: string) => void
  onQueryChange?: (query: string) => void
}

export function LocationPicker({
  value,
  displayName,
  onSelect,
  onQueryChange,
}: LocationPickerProps) {
  const t = useTranslations("createPost")
  const [query, setQuery] = useState(displayName || "")
  const [results, setResults] = useState<Place[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const debouncedQuery = useDebounce(query, 300)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([])
      return
    }
    let cancelled = false
    setLoading(true)
    geoApi
      .searchPlaces(debouncedQuery)
      .then((data) => {
        if (!cancelled) setResults(data)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
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

  const handleSelect = useCallback(
    (place: Place) => {
      const name = place.address || place.name
      setQuery(name)
      setOpen(false)
      setResults([])
      onSelect(place, name)
    },
    [onSelect]
  )

  const clear = useCallback(() => {
    setQuery("")
    onSelect(null, "")
  }, [onSelect])

  return (
    <div ref={wrapperRef} className="relative">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => {
              const v = e.target.value
              setQuery(v)
              setOpen(true)
              onQueryChange?.(v)
            }}
            onFocus={() => setOpen(true)}
            placeholder={t("locationPlaceholder")}
            className="pl-9 bg-secondary border-border"
          />
        </div>
        {value && (
          <button
            type="button"
            onClick={clear}
            className="text-xs text-muted-foreground hover:text-foreground shrink-0"
          >
            {t("clear")}
          </button>
        )}
      </div>
      {open && (query.trim() || results.length > 0) && (
        <ul className="absolute z-50 mt-1 max-h-48 w-full overflow-auto rounded-xl border border-border bg-card py-1 shadow-lg">
          {loading ? (
            <li className="px-3 py-2 text-sm text-muted-foreground">
              {t("searching")}
            </li>
          ) : results.length === 0 ? (
            <li className="px-3 py-2 text-sm text-muted-foreground">
              {t("noResults")}
            </li>
          ) : (
            results.map((place) => (
              <li key={place.id}>
                <button
                  type="button"
                  className="w-full px-3 py-2 text-left text-sm hover:bg-secondary"
                  onClick={() => handleSelect(place)}
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
