import apiClient from "../base"
import type { Short, Comment, PaginatedResponse } from "../../types/api"

const isDev =
  typeof process !== "undefined" && process.env.NODE_ENV === "development"

function devWarn(method: string) {
  if (isDev) {
    console.warn(`[shortsApi] ${method}: backend unavailable, using dev stub.`)
  }
}

function stubShort(seed: number): Short {
  return {
    id: 1000 + seed,
    authorId: 1,
    username: "traveler",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    caption: "Короткое видео о путешествии (заглушка)",
    likes: 10 + seed,
    comments: 2,
    liked: false,
    saved: false,
    createdAt: new Date().toISOString(),
  }
}

export const shortsApi = {
  feed: (page = 1, limit = 10): Promise<PaginatedResponse<Short>> =>
    apiClient
      .get("/shorts", { params: { page, limit } })
      .then((r) => {
        const data = r.data
        const items =
          Array.isArray(data) ? data : data?.data ?? data?.items ?? data?.shorts ?? []
        const meta = data?.meta
        return { data: items, meta } as PaginatedResponse<Short>
      })
      .catch((err) => {
        if (isDev) {
          devWarn("feed")
          return {
            data: [stubShort(0), stubShort(1), stubShort(2)],
            meta: { page: 1, limit, total: 3, hasMore: false },
          }
        }
        return Promise.reject(err)
      }),

  like: (shortId: string | number): Promise<{ likes: number }> =>
    apiClient
      .post(`/shorts/${shortId}/like`)
      .then((r) => r.data)
      .catch((err) => {
        if (isDev) {
          devWarn("like")
          return { likes: 1 }
        }
        return Promise.reject(err)
      }),

  unlike: (shortId: string | number): Promise<{ likes: number }> =>
    apiClient
      .delete(`/shorts/${shortId}/like`)
      .then((r) => r.data)
      .catch((err) => {
        if (isDev) {
          devWarn("unlike")
          return { likes: 0 }
        }
        return Promise.reject(err)
      }),

  save: (shortId: string | number): Promise<{ success: boolean }> =>
    apiClient
      .post(`/shorts/${shortId}/save`)
      .then((r) => r.data)
      .catch((err) => {
        if (isDev) {
          devWarn("save")
          return { success: true }
        }
        return Promise.reject(err)
      }),

  unsave: (shortId: string | number): Promise<{ success: boolean }> =>
    apiClient
      .delete(`/shorts/${shortId}/save`)
      .then((r) => r.data)
      .catch((err) => {
        if (isDev) {
          devWarn("unsave")
          return { success: true }
        }
        return Promise.reject(err)
      }),

  repost: (shortId: string | number): Promise<{ success: boolean }> =>
    apiClient
      .post(`/shorts/${shortId}/repost`)
      .then((r) => r.data)
      .catch((err) => {
        if (isDev) {
          devWarn("repost")
          return { success: true }
        }
        return Promise.reject(err)
      }),

  getComments: (
    shortId: string | number,
    page = 1,
    limit = 20
  ): Promise<PaginatedResponse<Comment>> =>
    apiClient
      .get(`/shorts/${shortId}/comments`, { params: { page, limit } })
      .then((r) => r.data)
      .catch((err) => {
        if (isDev) {
          devWarn("getComments")
          return {
            data: [],
            meta: { page: 1, limit, total: 0, hasMore: false },
          }
        }
        return Promise.reject(err)
      }),

  createComment: (shortId: string | number, content: string): Promise<Comment> =>
    apiClient
      .post(`/shorts/${shortId}/comments`, { content })
      .then((r) => r.data)
      .catch((err) => {
        if (isDev) {
          devWarn("createComment")
          return {
            id: 1,
            postId: Number(shortId),
            authorId: 0,
            content,
            likesCount: 0,
            isLiked: false,
            createdAt: new Date().toISOString(),
          } as Comment
        }
        return Promise.reject(err)
      }),
}
