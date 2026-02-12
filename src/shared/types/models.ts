/**
 * Бизнес-модели RouteWise (shared/types)
 */

export interface User {
  id: number
  username: string
  email: string
  avatarUrl?: string
  avatar_url?: string
  bio?: string
  role?: "user" | "business" | "admin"
  followersCount?: number
  followingCount?: number
  postsCount?: number
  isFollowing?: boolean
  isVerified?: boolean
}

export interface Post {
  id: number
  authorId?: number
  author?: User
  username?: string
  avatarUrl?: string
  avatar_url?: string
  caption?: string
  text?: string
  content?: string
  imageUrl?: string
  image_url?: string
  location?: string
  hashtags?: string[]
  tags?: string[]
  likes?: number
  likes_count?: number
  comments?: number
  comments_count?: number
  liked?: boolean
  is_liked?: boolean
  saved?: boolean
  is_saved?: boolean
  timestamp?: string
  created_at?: string
  createdAt?: string
  privacy?: "public" | "followers"
}

export interface Comment {
  id: number
  postId: number
  authorId: number
  author?: User
  content: string
  parentId?: number
  likesCount: number
  isLiked: boolean
  createdAt: string
  replies?: Comment[]
}

export interface Notification {
  id: number
  type: string
  title: string
  body?: string
  read: boolean
  createdAt: string
  data?: Record<string, unknown>
  actor?: User
}

export interface Destination {
  id: number
  name: string
  country: string
  imageUrl?: string
  image_url?: string
  rating?: number
}

export interface Booking {
  id: number
  type: string
  title: string
  status: string
  date?: string
  details?: Record<string, unknown>
}

export interface GeoLocation {
  userId: number
  lat: number
  lng: number
  name?: string
  avatarUrl?: string
}

export interface Place {
  id: string
  name: string
  address?: string
  lat: number
  lng: number
  country?: string
}

export interface PaginatedMeta {
  page: number
  limit: number
  total: number
  hasMore: boolean
}
