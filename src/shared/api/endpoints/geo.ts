import apiClient from "../base"
import type { Place } from "../../types/models"

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
      .catch(() => [])
  },
}
