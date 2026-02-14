import { usersApi } from "./users"
import type { User } from "../../types/models"

export const subscriptionsApi = {
  follow: (userId: number | string) => usersApi.follow(userId),
  unfollow: (userId: number | string) => usersApi.unfollow(userId),
  getFollowers: (userId: number | string, params?: { limit?: number; offset?: number }): Promise<User[]> =>
    usersApi.getFollowers(userId, Math.floor((params?.offset ?? 0) / (params?.limit ?? 20)) + 1).then((res) => {
      const list = Array.isArray(res) ? res : res.data ?? res.items ?? res.posts ?? []
      return list as User[]
    }),
  getFollowing: (userId: number | string, params?: { limit?: number; offset?: number }): Promise<User[]> =>
    usersApi.getFollowing(userId, Math.floor((params?.offset ?? 0) / (params?.limit ?? 20)) + 1).then((res) => {
      const list = Array.isArray(res) ? res : res.data ?? res.items ?? res.posts ?? []
      return list as User[]
    }),
}
