import apiClient from "../base"
import type { Post, PaginatedResponse } from "../../types/api"

export const postsApi = {
  feed: (page = 1): Promise<PaginatedResponse<Post>> =>
    apiClient.get("/posts", { params: { page } }).then((r) => r.data),

  getById: (id: string | number): Promise<Post> =>
    apiClient.get(`/posts/${id}`).then((r) => r.data),

  create: (formData: FormData): Promise<Post> =>
    apiClient.post("/posts", formData).then((r) => r.data),

  like: (postId: string | number): Promise<{ likes: number }> =>
    apiClient.post(`/posts/${postId}/like`).then((r) => r.data),

  unlike: (postId: string | number): Promise<{ likes: number }> =>
    apiClient.delete(`/posts/${postId}/like`).then((r) => r.data),

  save: (postId: string | number): Promise<{ success: boolean }> =>
    apiClient.post(`/posts/${postId}/save`).then((r) => r.data),

  unsave: (postId: string | number): Promise<{ success: boolean }> =>
    apiClient.delete(`/posts/${postId}/save`).then((r) => r.data),

  getByAuthor: (authorId: string | number, page = 1): Promise<PaginatedResponse<Post>> =>
    apiClient.get("/posts", { params: { authorId, page } }).then((r) => r.data),
}
