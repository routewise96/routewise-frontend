import apiClient from "../base"

export interface Story {
  id: string
  user_id: number
  media_url: string
  thumbnail_url?: string
  lat: number
  lng: number
  place_name?: string
  place_description?: string
  expiry: string
  view_count: number
  like_count: number
  created_at: string
  liked?: boolean
  is_liked?: boolean
  user?: {
    username: string
    avatar: string
    avatar_url?: string
    avatarUrl?: string
  }
}

export const storiesApi = {
  create: (formData: FormData): Promise<{ id: string }> =>
    apiClient
      .post("/stories", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => res.data),

  getNearby: (lat: number, lng: number, radius = 5000): Promise<Story[]> =>
    apiClient.get(`/stories?lat=${lat}&lng=${lng}&radius=${radius}`).then((res) => res.data),

  getById: (id: string): Promise<Story> => apiClient.get(`/stories/${id}`).then((res) => res.data),

  like: (id: string) => apiClient.post(`/stories/${id}/like`).then((res) => res.data),

  unlike: (id: string) => apiClient.delete(`/stories/${id}/like`).then((res) => res.data),
}
