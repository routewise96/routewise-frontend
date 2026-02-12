import apiClient from "../base"
import type {
  Booking,
  BookingStatus,
  Company,
  BusinessDashboard,
  Promotion,
  AnalyticsData,
} from "../../types/models"
import type { PaginatedResponse } from "../../types/api"

const isDev =
  typeof process !== "undefined" && process.env.NODE_ENV === "development"

function devWarn(method: string) {
  if (isDev) {
    console.warn(`[MOCK] businessApi.${method} called`)
  }
}

const mockBookings: Booking[] = [
  {
    id: "b1",
    type: "hotel",
    title: "Отель Москва",
    date: "2026-03-15",
    time: "14:00",
    location: { name: "Москва, Тверская 1" },
    status: "confirmed",
    price: 5500,
    currency: "RUB",
    createdAt: "2026-02-01T10:00:00Z",
  },
]

const mockDashboard: BusinessDashboard = {
  stats: {
    totalBookings: 42,
    totalRevenue: 185000,
    averageRating: 4.6,
    bookingsByStatus: { confirmed: 10, pending: 2, cancelled: 1, completed: 29 },
    revenueByPeriod: [
      { date: "2026-02-01", revenue: 12000 },
      { date: "2026-02-02", revenue: 15000 },
      { date: "2026-02-03", revenue: 8000 },
    ],
    popularServices: [
      { name: "Стандартный номер", bookings: 25 },
      { name: "Завтрак", bookings: 18 },
    ],
  },
  recentBookings: mockBookings,
}

const mockCompany: Company = {
  id: "c1",
  name: "Отель Москва",
  description: "Уютный отель в центре",
  categories: ["hotel"],
  verified: true,
  createdAt: new Date().toISOString(),
}

const mockPromotions: Promotion[] = [
  {
    id: "p1",
    title: "Скидка 10%",
    description: "На бронирование от 2 ночей",
    discountType: "percentage",
    discountValue: 10,
    startDate: "2026-02-01",
    endDate: "2026-03-31",
    status: "active",
    usedCount: 15,
  },
]

export interface BusinessBookingsParams {
  page?: number
  status?: BookingStatus
}

/**
 * Business API. In dev uses mocks when backend is unavailable.
 */
export const businessApi = {
  getDashboard: (): Promise<BusinessDashboard> =>
    apiClient
      .get<BusinessDashboard>("/business/dashboard")
      .then((r) => r.data)
      .catch((err) => {
        if (isDev) {
          devWarn("getDashboard")
          return mockDashboard
        }
        return Promise.reject(err)
      }),

  getAnalytics: (
    period: "day" | "week" | "month" | "year"
  ): Promise<AnalyticsData> =>
    apiClient
      .get<AnalyticsData>("/business/analytics", { params: { period } })
      .then((r) => r.data)
      .catch((err) => {
        if (isDev) {
          devWarn("getAnalytics")
          return {
            period,
            revenue: [
              { date: "2026-02-01", value: 12000 },
              { date: "2026-02-02", value: 15000 },
            ],
            bookings: [
              { date: "2026-02-01", count: 5 },
              { date: "2026-02-02", count: 7 },
            ],
            topServices: [
              { name: "Номер стандарт", count: 20 },
              { name: "Завтрак", count: 15 },
            ],
          }
        }
        return Promise.reject(err)
      }),

  getBookings: (
    params?: BusinessBookingsParams
  ): Promise<PaginatedResponse<Booking>> =>
    apiClient
      .get<PaginatedResponse<Booking>>("/business/bookings", { params })
      .then((r) => r.data)
      .catch((err) => {
        if (isDev) {
          devWarn("getBookings")
          return {
            data: mockBookings,
            meta: {
              page: 1,
              limit: 10,
              total: mockBookings.length,
              hasMore: false,
            },
          }
        }
        return Promise.reject(err)
      }),

  updateCompanyProfile: (data: FormData): Promise<Company> =>
    apiClient
      .put<Company>("/business/profile", data, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((r) => r.data)
      .catch((err) => {
        if (isDev) {
          devWarn("updateCompanyProfile")
          return { ...mockCompany, name: (data.get("name") as string) || mockCompany.name }
        }
        return Promise.reject(err)
      }),

  getCompanyProfile: (): Promise<Company> =>
    apiClient
      .get<Company>("/business/profile")
      .then((r) => r.data)
      .catch((err) => {
        if (isDev) {
          devWarn("getCompanyProfile")
          return mockCompany
        }
        return Promise.reject(err)
      }),

  getPromotions: (): Promise<Promotion[]> =>
    apiClient
      .get<Promotion[]>("/business/promotions")
      .then((r) => r.data)
      .catch((err) => {
        if (isDev) {
          devWarn("getPromotions")
          return mockPromotions
        }
        return Promise.reject(err)
      }),

  createPromotion: (
    data: Omit<Promotion, "id" | "usedCount">
  ): Promise<{ id: string }> =>
    apiClient
      .post<{ id: string }>("/business/promotions", data)
      .then((r) => r.data)
      .catch((err) => {
        if (isDev) {
          devWarn("createPromotion")
          return { id: "p-new" }
        }
        return Promise.reject(err)
      }),

  updatePromotion: (
    id: string,
    data: Partial<Promotion>
  ): Promise<Promotion> =>
    apiClient
      .patch<Promotion>(`/business/promotions/${id}`, data)
      .then((r) => r.data)
      .catch((err) => {
        if (isDev) {
          devWarn("updatePromotion")
          const p = mockPromotions[0]
          return { ...p, ...data, id }
        }
        return Promise.reject(err)
      }),

  deletePromotion: (id: string): Promise<{ success: boolean }> =>
    apiClient
      .delete<{ success: boolean }>(`/business/promotions/${id}`)
      .then((r) => r.data)
      .catch((err) => {
        if (isDev) {
          devWarn("deletePromotion")
          return { success: true }
        }
        return Promise.reject(err)
      }),
}
