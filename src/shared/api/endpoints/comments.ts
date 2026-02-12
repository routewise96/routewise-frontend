import apiClient from "../base"
import type { Comment, PaginatedResponse } from "../../types/api"

export const commentsApi = {
  getByPost: (
    postId: string | number,
    page = 1,
    limit = 20
  ): Promise<PaginatedResponse<Comment>> =>
    apiClient
      .get(`/posts/${postId}/comments`, { params: { page, limit } })
      .then((r) => r.data),

  create: (
    postId: string | number,
    content: string,
    parentId?: string | number
  ): Promise<Comment> => {
    const payload = parentId
      ? { content, parentId }
      : { content }
    return apiClient
      .post(`/posts/${postId}/comments`, payload)
      .then((r) => r.data)
  },

  like: (commentId: string | number): Promise<{ likesCount: number }> =>
    apiClient.post(`/comments/${commentId}/like`).then((r) => r.data),

  unlike: (commentId: string | number): Promise<{ likesCount: number }> =>
    apiClient.delete(`/comments/${commentId}/like`).then((r) => r.data),

  delete: (commentId: string | number): Promise<{ success: boolean }> =>
    apiClient.delete(`/comments/${commentId}`).then((r) => r.data),
}
