import apiClient from "../base"
import type { Booking, BookingStatus, BookingReviewInput } from "../../types/models"
import type { PaginatedResponse } from "../../types/api"

const isDev =
  typeof process !== "undefined" && process.env.NODE_ENV === "development"

function devWarn(method: string) {
  if (isDev) {
    console.warn(`[MOCK] bookingsApi.${method} called`)
  }
}

const mockBookings: Booking[] = [
  {
    id: "1",
    type: "hotel",
    title: 'Отель "Москва"',
    description: "Стандартный номер с завтраком",
    image: "https://picsum.photos/400/300?random=1",
    date: "2026-03-15",
    time: "14:00",
    location: { name: "Москва, ул. Тверская, 1" },
    status: "confirmed",
    price: 5500,
    currency: "RUB",
    bookingReference: "H123456",
    createdAt: "2026-02-01T10:00:00Z",
  },
  {
    id: "2",
    type: "flight",
    title: "Авиабилет SU 1234",
    description: "Москва → Санкт-Петербург, эконом",
    date: "2026-03-20",
    time: "08:30",
    location: { name: "Шереметьево, терминал B" },
    status: "confirmed",
    price: 4200,
    currency: "RUB",
    bookingReference: "F987654",
    createdAt: "2026-02-05T12:00:00Z",
  },
]

export interface BookingsParams {
  page?: number
  status?: BookingStatus
  limit?: number
}

/**
 * Bookings API. In dev uses mocks when backend is unavailable.
 */
export const bookingsApi = {
  getAll: (
    params?: BookingsParams
  ): Promise<PaginatedResponse<Booking>> =>
    apiClient
      .get<PaginatedResponse<Booking>>("/bookings", { params })
      .then((r) => r.data)
      .catch((err) => {
        if (isDev) {
          devWarn("getAll")
          const page = params?.page ?? 1
          const limit = params?.limit ?? 10
          return {
            data: mockBookings,
            meta: {
              page,
              limit,
              total: mockBookings.length,
              totalPages: 1,
              hasMore: false,
            },
          }
        }
        return Promise.reject(err)
      }),

  getById: (id: string): Promise<Booking> =>
    apiClient
      .get<Booking>(`/bookings/${id}`)
      .then((r) => r.data)
      .catch((err) => {
        if (isDev) {
          devWarn(`getById(${id})`)
          const booking = mockBookings.find((b) => b.id === id)
          if (!booking) return Promise.reject(new Error("Booking not found"))
          return booking
        }
        return Promise.reject(err)
      }),

  cancel: (id: string): Promise<{ success: boolean }> =>
    apiClient
      .post<{ success: boolean }>(`/bookings/${id}/cancel`)
      .then((r) => r.data)
      .catch((err) => {
        if (isDev) {
          devWarn(`cancel(${id})`)
          return { success: true }
        }
        return Promise.reject(err)
      }),

  review: (
    id: string,
    data: BookingReviewInput
  ): Promise<{ success: boolean }> =>
    apiClient
      .post<{ success: boolean }>(`/bookings/${id}/review`, data)
      .then((r) => r.data)
      .catch((err) => {
        if (isDev) {
          devWarn(`review(${id})`)
          return { success: true }
        }
        return Promise.reject(err)
      }),
}
