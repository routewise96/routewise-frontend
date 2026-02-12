import apiClient from "../base"
import type { User, Post, Report, AdminStats } from "../../types/models"
import type { PaginatedResponse } from "../../types/api"

const isDev =
  typeof process !== "undefined" && process.env.NODE_ENV === "development"

function devWarn(method: string) {
  if (isDev) console.warn("[MOCK] adminApi." + method + " called")
}

const mockUsers: User[] = [
  { id: 1, username: "admin_user", email: "admin@test.ru", role: "admin" },
  { id: 2, username: "business_user", email: "biz@test.ru", role: "business", isVerified: true },
  { id: 3, username: "regular_user", email: "user@test.ru", role: "user" },
]

const mockPosts: Post[] = [
  { id: 1, authorId: 2, username: "business_user", caption: "Test post", likes: 5, comments: 2, createdAt: new Date().toISOString() },
]

const mockReports: Report[] = [
  { id: "r1", type: "post", targetId: "1", reporterId: 3, reason: "spam", description: "Unwanted", status: "pending", createdAt: new Date().toISOString() },
]

const mockStats: AdminStats = {
  totalUsers: 150,
  totalPosts: 420,
  totalBookings: 89,
  pendingReports: 5,
  newUsersToday: 3,
  newPostsToday: 12,
  activeUsersToday: 28,
  usersChart: [{ date: "2026-02-10", count: 2 }, { date: "2026-02-11", count: 5 }, { date: "2026-02-12", count: 3 }],
  activityChart: [{ date: "2026-02-10", count: 45 }, { date: "2026-02-11", count: 62 }, { date: "2026-02-12", count: 38 }],
}

export interface AdminUsersParams {
  page?: number
  search?: string
  role?: string
}

export interface AdminPostsParams {
  page?: number
  search?: string
  reported?: boolean
}

export interface AdminReportsParams {
  page?: number
  status?: Report["status"]
}

function paginate<T>(arr: T[], page = 1, limit = 20): PaginatedResponse<T> {
  const start = (page - 1) * limit
  const data = arr.slice(start, start + limit)
  return { data, meta: { page, limit, total: arr.length, hasMore: start + data.length < arr.length } }
}

export const adminApi = {
  getUsers: (params?: AdminUsersParams) =>
    apiClient.get<PaginatedResponse<User>>("/admin/users", { params }).then((r) => r.data).catch((err) => {
      if (isDev) { devWarn("getUsers"); return paginate(mockUsers, params?.page) }
      return Promise.reject(err)
    }),
  updateUser: (id: string, data: Partial<User>) =>
    apiClient.put<User>("/admin/users/" + id, data).then((r) => r.data).catch((err) => {
      if (isDev) { devWarn("updateUser"); const u = mockUsers[0]; return { ...u, ...data } }
      return Promise.reject(err)
    }),
  banUser: (id: string, reason: string) =>
    apiClient.post("/admin/users/" + id + "/ban", { reason }).then((r) => r.data).catch((err) => {
      if (isDev) { devWarn("banUser"); return { success: true } }
      return Promise.reject(err)
    }),
  unbanUser: (id: string) =>
    apiClient.post("/admin/users/" + id + "/unban").then((r) => r.data).catch((err) => {
      if (isDev) { devWarn("unbanUser"); return { success: true } }
      return Promise.reject(err)
    }),
  verifyBusiness: (id: string) =>
    apiClient.post("/admin/users/" + id + "/verify-business").then((r) => r.data).catch((err) => {
      if (isDev) { devWarn("verifyBusiness"); return { success: true } }
      return Promise.reject(err)
    }),
  getPosts: (params?: AdminPostsParams) =>
    apiClient.get<PaginatedResponse<Post>>("/admin/posts", { params }).then((r) => r.data).catch((err) => {
      if (isDev) { devWarn("getPosts"); return paginate(mockPosts, params?.page) }
      return Promise.reject(err)
    }),
  deletePost: (id: string) =>
    apiClient.delete("/admin/posts/" + id).then((r) => r.data).catch((err) => {
      if (isDev) { devWarn("deletePost"); return { success: true } }
      return Promise.reject(err)
    }),
  hidePost: (id: string) =>
    apiClient.post("/admin/posts/" + id + "/hide").then((r) => r.data).catch((err) => {
      if (isDev) { devWarn("hidePost"); return { success: true } }
      return Promise.reject(err)
    }),
  getReports: (params?: AdminReportsParams) =>
    apiClient.get<PaginatedResponse<Report>>("/admin/reports", { params }).then((r) => r.data).catch((err) => {
      if (isDev) { devWarn("getReports"); const list = params?.status ? mockReports.filter((r) => r.status === params.status) : mockReports; return paginate(list, params?.page) }
      return Promise.reject(err)
    }),
  resolveReport: (id: string, action: "delete" | "warn" | "dismiss") =>
    apiClient.post("/admin/reports/" + id + "/resolve", { action }).then((r) => r.data).catch((err) => {
      if (isDev) { devWarn("resolveReport"); return { success: true } }
      return Promise.reject(err)
    }),
  getStats: () =>
    apiClient.get<AdminStats>("/admin/stats").then((r) => r.data).catch((err) => {
      if (isDev) { devWarn("getStats"); return mockStats }
      return Promise.reject(err)
    }),
}
