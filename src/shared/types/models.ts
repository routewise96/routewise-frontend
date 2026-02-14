/**
 * Бизнес-модели RouteWise (shared/types)
 */

/** User notification preferences */
export interface NotificationSettings {
  like: boolean
  comment: boolean
  follow: boolean
  repost: boolean
  mention: boolean
  geo: boolean
  ai: boolean
  system: boolean
}

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
  mediaUrls?: string[]
  media_urls?: string[]
  images?: string[]
  image_urls?: string[]
  location?: string
  hashtags?: string[]
  tags?: string[]
  likes?: number
  likes_count?: number
  comments?: number
  comments_count?: number
  commentsCount?: number
  repostsCount?: number
  liked?: boolean
  is_liked?: boolean
  saved?: boolean
  is_saved?: boolean
  timestamp?: string
  created_at?: string
  createdAt?: string
  privacy?: "public" | "followers"
}

/** Short (vertical video, TikTok-like) */
export interface Short {
  id: number
  authorId?: number
  author?: User
  username?: string
  avatarUrl?: string
  avatar_url?: string
  videoUrl?: string
  video_url?: string
  caption?: string
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

export interface NotificationTarget {
  type: "post" | "user" | "booking" | "place"
  id: string
  title?: string
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
  target?: NotificationTarget
}

export interface Destination {
  id: number
  name: string
  country: string
  imageUrl?: string
  image_url?: string
  rating?: number
}

export type BookingType =
  | "hotel"
  | "restaurant"
  | "flight"
  | "train"
  | "attraction"
  | "event"

export type BookingStatus =
  | "confirmed"
  | "pending"
  | "cancelled"
  | "completed"

export interface BookingLocation {
  name: string
  address?: string
  coordinates?: GeoPoint
}

export interface BookingReview {
  rating: number
  comment?: string
  createdAt: string
}

export interface Booking {
  id: string
  type: BookingType
  title: string
  description?: string
  image?: string
  date: string
  time?: string
  location: BookingLocation
  status: BookingStatus
  price?: number
  currency?: string
  bookingReference?: string
  createdAt: string
  review?: BookingReview
}

export interface BookingReviewInput {
  rating: number
  comment?: string
}

/** Business / Company profile */
export interface Company {
  id: string
  name: string
  description?: string
  logo?: string
  address?: string
  coordinates?: GeoPoint
  phone?: string
  email?: string
  website?: string
  categories: string[]
  verified: boolean
  createdAt: string
}

/** Business dashboard stats */
export interface BusinessDashboard {
  stats: {
    totalBookings: number
    totalRevenue: number
    averageRating: number
    bookingsByStatus: Record<BookingStatus, number>
    revenueByPeriod: { date: string; revenue: number }[]
    popularServices: { name: string; bookings: number }[]
  }
  recentBookings: Booking[]
  upcomingEvents?: unknown[]
}

/** Promotion / offer */
export type PromotionStatus = "active" | "scheduled" | "expired" | "disabled"

export interface Promotion {
  id: string
  title: string
  description: string
  discountType: "percentage" | "fixed"
  discountValue: number
  code?: string
  startDate: string
  endDate: string
  status: PromotionStatus
  usageLimit?: number
  usedCount: number
}

/** Analytics for charts */
export interface AnalyticsData {
  period: string
  revenue: { date: string; value: number }[]
  bookings: { date: string; count: number }[]
  topServices: { name: string; count: number }[]
}

/** Moderation report */
export type ReportStatus = "pending" | "resolved" | "dismissed"

export interface Report {
  id: string
  type: string
  targetId: string
  reporterId: number
  reason: string
  description?: string
  status: ReportStatus
  createdAt: string
  resolvedAt?: string
  resolvedBy?: number
}

/** Admin dashboard stats */
export interface AdminStats {
  totalUsers: number
  totalPosts: number
  totalBookings: number
  pendingReports: number
  newUsersToday: number
  newPostsToday?: number
  activeUsersToday?: number
  usersChart?: { date: string; count: number }[]
  activityChart?: { date: string; count: number }[]
}

export interface GeoLocation {
  userId: number
  lat: number
  lng: number
  name?: string
  avatarUrl?: string
}

export interface GeoPoint {
  lat: number
  lng: number
}

export interface GeoUser {
  id: string
  name?: string
  username: string
  avatar?: string
  location: GeoPoint
  lastUpdate: string
}

export type PlaceCategory =
  | "cafe"
  | "restaurant"
  | "hotel"
  | "attraction"
  | "other"

export interface Place {
  id: string
  name: string
  address?: string
  lat: number
  lng: number
  country?: string
  category?: PlaceCategory
  rating?: number
  priceLevel?: number
  image?: string
  isSaved?: boolean
}

export interface Route {
  distance: number
  duration: number
  geometry: [number, number][]
  instructions: string[]
}

export interface PaginatedMeta {
  page: number
  limit: number
  total: number
  hasMore: boolean
}

/** AI Assistant */
export interface AIMessage {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  timestamp: string
  isStreaming?: boolean
}

export interface AISuggestionAction {
  type: "search" | "route" | "book" | "navigate"
  payload?: Record<string, unknown>
}

export interface AISuggestion {
  id: string
  title: string
  description?: string
  action?: AISuggestionAction
}

export interface RouteStep {
  instruction: string
  distance?: number
  duration?: number
  coordinates?: GeoPoint
}

export interface RoutePlan {
  start: GeoPoint
  end?: GeoPoint
  waypoints?: GeoPoint[]
  distance: number
  duration: number
  steps: RouteStep[]
}
