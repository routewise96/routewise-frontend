/**
 * Типы ответов API (shared/types)
 */

import type { User, Post, Comment, Notification, Destination, Booking } from "./models"

export interface PaginatedResponse<T> {
  data: T[]
  posts?: T[]
  items?: T[]
  meta?: {
    page: number
    limit: number
    total: number
    hasMore?: boolean
  }
}

export interface ErrorResponse {
  message?: string
  error?: string
  detail?: string | string[]
  statusCode?: number
}

export interface AuthResponse {
  token: string
  access_token?: string
  user: User
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  username: string
  email: string
  password: string
}

export type ApiPaginated<T> = T[] | PaginatedResponse<T>

export type { User, Post, Comment, Notification, Destination, Booking, Place } from "./models"
