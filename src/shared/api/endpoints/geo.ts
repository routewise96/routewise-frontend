import apiClient from "../base"
import type { Place, Route } from "../../types/models"

const isDev = typeof process !== "undefined" && process.env.NODE_ENV === "development"

function devWarn(method: string) {
  if (isDev) {
    console.warn(`[geoApi] ${method}: backend unavailable, using dev stub. Implement API on backend for production.`)
  }
}

export interface BBox {
  minLat: number
  minLng: number
  maxLat: number
  maxLng: number
}

export interface PlaceFilters {
  category?: string
}

function stubPlaces(bbox: BBox): Place[] {
  const midLat = (bbox.minLat + bbox.maxLat) / 2
  const midLng = (bbox.minLng + bbox.maxLng) / 2
  return [
    { id: "stub-1", name: "Кафе «У карты»", address: "ул. Примерная, 1", lat: midLat + 0.002, lng: midLng - 0.001, category: "cafe", rating: 4.5 },
    { id: "stub-2", name: "Ресторан «Маршрут»", address: "пр. Тестовый, 2", lat: midLat - 0.001, lng: midLng + 0.002, category: "restaurant", rating: 4.8 },
  ]
}

function stubRoute(start: { lat: number; lng: number }, end: { lat: number; lng: number }): Route {
  return {
    distance: 2500,
    duration: 600,
    geometry: [[start.lat, start.lng], [end.lat, end.lng]],
    instructions: ["Двигайтесь к точке назначения"],
  }
}

export const geoApi = {
  searchPlaces: (q: string): Promise<Place[]> => {
    if (!q.trim()) return Promise.resolve([])
    return apiClient
      .get("/geo/places", { params: { q: q.trim() } })
      .then((r) => {
        const data = r.data
        if (Array.isArray(data)) return data as Place[]
        if (data?.results) return data.results as Place[]
        if (data?.data) return data.data as Place[]
        return []
      })
      .catch((err) => {
        if (isDev) {
          devWarn("searchPlaces")
          return [{ id: "stub-search", name: q.trim(), lat: 55.7558, lng: 37.6173, address: "Москва (заглушка)" }] as Place[]
        }
        return Promise.reject(err)
      })
  },

  getPlaces: (bbox: BBox, filters?: PlaceFilters): Promise<Place[]> => {
    return apiClient
      .get("/geo/places/bbox", {
        params: {
          minLat: bbox.minLat,
          minLng: bbox.minLng,
          maxLat: bbox.maxLat,
          maxLng: bbox.maxLng,
          ...(filters?.category && { category: filters.category }),
        },
      })
      .then((r) => {
        const data = r.data
        if (Array.isArray(data)) return data as Place[]
        if (data?.results) return data.results as Place[]
        if (data?.data) return data.data as Place[]
        return []
      })
      .catch((err) => {
        if (isDev) {
          devWarn("getPlaces")
          return stubPlaces(bbox)
        }
        return Promise.reject(err)
      })
  },

  getRoute: (start: { lat: number; lng: number }, end: { lat: number; lng: number }): Promise<Route> => {
    return apiClient
      .get("/geo/route", {
        params: {
          fromLat: start.lat,
          fromLng: start.lng,
          toLat: end.lat,
          toLng: end.lng,
        },
      })
      .then((r) => r.data)
      .catch((err) => {
        if (isDev) {
          devWarn("getRoute")
          return stubRoute(start, end)
        }
        return Promise.reject(err)
      })
  },

  savePlace: (placeId: string): Promise<{ success: boolean }> =>
    apiClient
      .post(`/geo/places/${placeId}/save`)
      .then((r) => r.data)
      .catch((err) => {
        if (isDev) {
          devWarn("savePlace")
          return { success: true }
        }
        return Promise.reject(err)
      }),

  unsavePlace: (placeId: string): Promise<{ success: boolean }> =>
    apiClient
      .delete(`/geo/places/${placeId}/save`)
      .then((r) => r.data)
      .catch((err) => {
        if (isDev) {
          devWarn("unsavePlace")
          return { success: true }
        }
        return Promise.reject(err)
      }),

  meetRequest: (userId: string): Promise<{ success: boolean }> =>
    apiClient.post(`/geo/meet/${userId}`).then((r) => r.data).catch((err) => {
      if (isDev) {
        devWarn("meetRequest")
        return { success: true }
      }
      return Promise.reject(err)
    }),
}
