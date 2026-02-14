import apiClient from "../base"

export interface PlaceResponse {
  id: number | string
  name: string
  description?: string
  lat: number
  lon?: number
  lng?: number
  address?: string
  category?: string
}

export const placesApi = {
  getPlacesByBBox: (bbox: string, limit?: number): Promise<PlaceResponse[]> =>
    apiClient.get("/places", { params: { bbox, limit } }).then((res) => res.data),

  searchPlaces: (q: string, limit?: number): Promise<PlaceResponse[]> =>
    apiClient.get("/places/search", { params: { q, limit } }).then((res) => res.data),
}
