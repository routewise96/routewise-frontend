import apiClient from "../base"
import type { User, Post } from "../../types/api"
import type { Destination } from "../../types/models"

export interface SearchResult {
  users?: User[]
  posts?: Post[]
  destinations?: Destination[]
}

export const searchApi = {
  query: (q: string): Promise<SearchResult> =>
    apiClient.get("/search", { params: { q } }).then((r) => r.data),
}
